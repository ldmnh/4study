import { NextResponse } from "next/server";
import { Course, User } from "@/libs/models"; // Import các mô hình
import { ObjectId } from "mongodb";
import {
  successResponse,
  notFoundResponse,
  errorResponse,
} from "@/utils/functions/server"; // Các hàm phản hồi

export async function GET() {
  try {
    const userId = "672cbdb77def8193c3ab24fb"; // Giả sử bạn có ID người dùng, có thể lấy từ request hoặc params

    // Chuyển đổi userId thành ObjectId (nếu bạn đang sử dụng MongoDB)
    const objectIdUser = new ObjectId(userId);

    // Truy vấn thông tin người dùng và lấy trường `suggested_courses`
    const user = await User.aggregate([
      {
        $match: {
          _id: objectIdUser, // Lọc theo ID người dùng
        },
      },
      {
        $project: {
          suggested_courses: 1, // Chỉ lấy trường `suggested_courses`
        },
      },
    ]);

    // Kiểm tra nếu người dùng không có dữ liệu
    if (!user.length) {
      return notFoundResponse();
    }

    // Lấy mảng các khóa học mà người dùng được gợi ý
    const suggestedCourses = user[0].suggested_courses;

    // Truy vấn các khóa học có trong suggested_courses của người dùng
    const courses = await Course.aggregate([
      {
        $match: {
          _id: { $in: suggestedCourses }, // Lọc khóa học có trong mảng suggested_courses
        },
      },
      {
        $lookup: {
          from: "schools", // Lấy thông tin trường học từ bộ sưu tập "schools"
          localField: "school_id", // Trường khóa học chứa school_id
          foreignField: "_id", // Kết nối với trường _id của bộ sưu tập schools
          as: "school", // Kết quả lưu vào trường "school"
        },
      },
      {
        $lookup: {
          from: "teachers", // Lấy thông tin giáo viên từ bộ sưu tập "teachers"
          localField: "teachers", // Trường khóa học chứa mảng ID giáo viên
          foreignField: "_id", // Kết nối với trường _id của bộ sưu tập teachers
          as: "teachers", // Kết quả lưu vào trường "teachers"
        },
      },
      {
        $unwind: { path: "$school", preserveNullAndEmptyArrays: true }, // Giải nén trường "school"
      },
      {
        $project: {
          course_name: 1,
          course_img: 1,
          course_about: 1,
          course_videos: 1,
          enrolled_users: 1,
          "school.school_name": 1,
          "school.school_img": 1,
          "school.school_about": 1,
          teachers: 1,
        },
      },
    ]);

    // Kiểm tra nếu không có khóa học nào được tìm thấy
    if (!courses.length) {
      return notFoundResponse();
    }

    // Trả về kết quả thành công
    return successResponse({ data: courses });
  } catch (error) {
    console.error("Error: ", error);
    return errorResponse({ error: "Đã có lỗi xảy ra khi lấy khóa học" });
  }
}