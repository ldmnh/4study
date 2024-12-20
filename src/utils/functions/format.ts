// format functions are used for format value. Ex: 1000 -> 1.000 vnd
export const normalizeVietnameseStr = (str: string) => {
  return str
    .normalize("NFD") // Chuyển về dạng chuẩn NFD (Normalization Form Decomposition)
    .replace(/[\u0300-\u036f]/g, "") // Loại bỏ các dấu thanh
    .replace(/đ/g, "d") // Chuyển đ -> d
    .replace(/Đ/g, "D") // Chuyển Đ -> D
    .replace(/[^a-zA-Z0-9\s]/g, "") // Loại bỏ các ký tự đặc biệt còn lại
    .toLowerCase(); // Chuyển thành chữ thường
};

// ex: 2001-08-19T17:00:00+07:00 -> 19/08/2001 - 17:00
export const formatDateTimeStr = (dateTimeString: string) => {
  // Tạo một đối tượng Date từ chuỗi đầu vào
  const date = new Date(dateTimeString);

  // Lấy các thành phần ngày, tháng, năm, giờ, phút
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Tháng bắt đầu từ 0
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  // Định dạng chuỗi theo yêu cầu
  return `${day}/${month}/${year} - ${hours}:${minutes}`;
};

// Hàm rút gọn số lượng từ
export const truncateWords = (text: string, maxWords: number): string => {
  if (!text) return "";

  // Tách chuỗi thành mảng các từ
  const wordsArray = text.trim();

  // Nếu số từ ít hơn hoặc bằng `maxWords`, trả về chuỗi gốc
  if (wordsArray.length <= maxWords) return text;

  // Cắt mảng từ và nối lại thành chuỗi với dấu `...`
  const truncated = wordsArray.slice(0, maxWords) + "...";
  return truncated;
};

// Viết hoa chữ cái đầu tiên của chuỗi
export const capitalizeFirstSentence = (text: string): string => {
  if (!text) return "";

  const trimmedText = text.trimStart();
  return trimmedText.charAt(0).toUpperCase() + trimmedText.slice(1);
};
// Viết hoa mỗi từ của chuỗi
export const capitalizeEachWord = (text: string): string => {
  if (!text) return "";

  const trimmedText = text.trimStart();
  return trimmedText
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};
