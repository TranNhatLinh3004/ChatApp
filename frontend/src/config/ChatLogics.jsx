export const isSameSenderMargin = (messages, m, i, userId) => {
  // console.log(i === messages.length - 1);

  if (
    i < messages.length - 1 &&
    messages[i + 1].sender._id === m.sender._id &&
    messages[i].sender._id !== userId
  )
    return 33;
  else if (
    (i < messages.length - 1 &&
      messages[i + 1].sender._id !== m.sender._id &&
      messages[i].sender._id !== userId) ||
    (i === messages.length - 1 && messages[i].sender._id !== userId)
  )
    return 0;
  else return "auto";
};

export const isSameSender = (messages, m, i, userId) => {
  return (
    i < messages.length - 1 &&
    (messages[i + 1].sender._id !== m.sender._id ||
      messages[i + 1].sender._id === undefined) &&
    messages[i].sender._id !== userId
  );
};

// Kiểm tra xem tin nhắn có phải là tin nhắn cuối cùng và không phải của người dùng hiện tại
export const isLastMessage = (messages, i, userId) => {
  return (
    i === messages.length - 1 && // Kiểm tra xem đây có phải là tin nhắn cuối cùng trong mảng
    messages[messages.length - 1].sender._id !== userId && // Tin nhắn cuối không phải của người dùng hiện tại
    messages[messages.length - 1].sender._id // Đảm bảo rằng người gửi tin nhắn cuối có ID
  );
};

// Kiểm tra xem tin nhắn hiện tại có cùng người gửi với tin nhắn trước đó không
export const isSameUser = (messages, m, i) => {
  return i > 0 && messages[i - 1].sender._id === m.sender._id;
};

// Lấy tên người gửi trong cuộc trò chuyện 1-1
export const getSender = (loggedUser, users) => {
  // Nếu người dùng đầu tiên trong mảng users là người đang đăng nhập, trả về tên của người thứ hai
  // Ngược lại, trả về tên của người đầu tiên
  return users[0]?._id === loggedUser?._id ? users[1].name : users[0].name;
};

// Lấy thông tin đầy đủ của người gửi trong cuộc trò chuyện 1-1
export const getSenderFull = (loggedUser, users) => {
  // Nếu người dùng đầu tiên trong mảng users là người đang đăng nhập, trả về object của người thứ hai
  // Ngược lại, trả về object của người đầu tiên
  return users[0]._id === loggedUser._id ? users[1] : users[0];
};


/*

isLastMessage:
Mục đích: Xác định tin nhắn cuối cùng trong một cuộc hội thoại, đặc biệt là tin nhắn từ người khác.
Ứng dụng:
Hiển thị avatar hoặc tên người gửi cho tin nhắn cuối cùng.
Đánh dấu tin nhắn cuối cùng chưa đọc.
Áp dụng kiểu dáng đặc biệt cho tin nhắn cuối cùng (ví dụ: thêm khoảng cách dưới).
isSameUser:
Mục đích: Kiểm tra xem tin nhắn hiện tại có cùng người gửi với tin nhắn trước đó không.
Ứng dụng:
Nhóm các tin nhắn liên tiếp từ cùng một người gửi.
Quyết định có hiển thị avatar/tên người gửi cho mỗi tin nhắn hay không.
Áp dụng kiểu dáng khác nhau cho tin nhắn đầu tiên trong một chuỗi tin nhắn từ cùng một người.
getSender:
Mục đích: Lấy tên của người gửi trong cuộc trò chuyện 1-1.
Ứng dụng:
Hiển thị tên người gửi trong danh sách chat.
Hiển thị tên người gửi trong thông báo tin nhắn mới.
Sử dụng trong tiêu đề của cửa sổ chat 1-1.
getSenderFull:
Mục đích: Lấy toàn bộ thông tin của người gửi trong cuộc trò chuyện 1-1.
Ứng dụng:
Hiển thị thông tin chi tiết của người gửi (ví dụ: trong profile modal).
Truy cập các thuộc tính khác của người gửi như avatar, trạng thái online, etc.
Tổng quan, những hàm này giúp:
Tối ưu hóa giao diện người dùng của ứng dụng chat.
Cải thiện trải nghiệm người dùng bằng cách hiển thị thông tin một cách hợp lý và nhất quán.
Xử lý logic hiển thị phức tạp trong các cuộc trò chuyện, đặc biệt là cuộc trò chuyện 1-1.
Hỗ trợ các tính năng như nhóm tin nhắn, hiển thị thông tin người gửi, và quản lý thông báo.
*/