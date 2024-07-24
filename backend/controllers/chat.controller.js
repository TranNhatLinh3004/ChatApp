const Chat = require("../models/chatModel");
const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");

const accessChat = asyncHandler(async (req, res) => {
  // Lấy userId từ body của request
  const { userId } = req.body;

  // Kiểm tra xem userId có tồn tại và là kiểu string hợp lệ không
  if (!userId || typeof userId !== "string") {
    console.log("Invalid userId provided in request");
    return res.sendStatus(400); // Trả về lỗi 400 nếu userId không hợp lệ
  }

  try {
    // Tìm kiếm cuộc trò chuyện đã tồn tại giữa req.user._id và userId
    let isChat = await Chat.find({
      isGroupChat: false,
      $and: [
        { users: { $elemMatch: { $eq: req.user._id } } }, // Tìm người dùng hiện tại trong cuộc trò chuyện
        { users: { $elemMatch: { $eq: userId } } }, // Tìm userId trong cuộc trò chuyện
      ],
    })
      .populate("users", "-password") // Populate thông tin của các người dùng trong cuộc trò chuyện
      .populate("latestMessage"); // Populate thông tin của tin nhắn mới nhất

    // Populate thông tin của người gửi tin nhắn mới nhất
    isChat = await User.populate(isChat, {
      path: "latestMessage.sender",
      select: "name avatar email",
    });

    // Nếu tìm thấy cuộc trò chuyện, trả về dữ liệu của cuộc trò chuyện đầu tiên
    if (isChat.length > 0) {
      return res.send(isChat[0]);
    }

    // Tạo mới cuộc trò chuyện nếu chưa tồn tại
    const chatData = {
      chatName: "sender", // Tên cuộc trò chuyện
      isGroupChat: false, // Đánh dấu không phải là nhóm
      users: [req.user._id, userId], // Thêm hai người dùng vào cuộc trò chuyện mới
    };

    // Tạo cuộc trò chuyện mới và lấy dữ liệu đầy đủ của cuộc trò chuyện
    const createdChat = await Chat.create(chatData);
    const fullChat = await Chat.findOne({ _id: createdChat._id }).populate(
      "users",
      "-password"
    );

    // Trả về dữ liệu đầy đủ của cuộc trò chuyện mới
    return res.status(200).json(fullChat);
  } catch (error) {
    console.error("Error in accessChat:", error);
    return res.status(500).json({ error: "Failed to access chat" }); // Trả về lỗi 500 nếu có lỗi xảy ra
  }
});
const fetchChats = asyncHandler(async (req, res) => {
  try {
    Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 })
      .then(async (results) => {
        results = await User.populate(results, {
          path: "latestMessage.sender",
          select: "name avatar email",
        });
        res.status(200).send(results);
      });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});
const createGroupChat = asyncHandler(async (req, res) => {
  // Kiểm tra xem req.body có chứa đủ users và name không
  if (!req.body.users || !req.body.name) {
    return res.status(400).send({ message: "Please Fill all the fields" });
  }

  // Parse danh sách người dùng từ chuỗi JSON trong req.body.users
  var users = JSON.parse(req.body.users);

  // Kiểm tra số lượng người dùng phải lớn hơn 1 để tạo nhóm chat
  if (users.length < 2) {
    return res
      .status(400)
      .send("More than 2 users are required to form a group chat");
  }

  // Thêm người dùng hiện tại (req.user) vào danh sách người dùng
  users.push(req.user);

  try {
    // Tạo mới nhóm chat trong cơ sở dữ liệu
    const groupChat = await Chat.create({
      chatName: req.body.name, // Tên của nhóm chat
      users: users, // Danh sách các người dùng trong nhóm
      isGroupChat: true, // Đánh dấu là nhóm chat
      groupAdmin: req.user, // Người quản trị nhóm là người dùng hiện tại
    });

    // Lấy dữ liệu đầy đủ của nhóm chat vừa tạo
    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password") // Populate thông tin của các người dùng trong nhóm, loại bỏ trường password
      .populate("groupAdmin", "-password"); // Populate thông tin của người quản trị nhóm, loại bỏ trường password

    // Trả về dữ liệu đầy đủ của nhóm chat dưới dạng JSON
    res.status(200).json(fullGroupChat);
  } catch (error) {
    // Xử lý lỗi nếu có
    res.status(400); // Trả về mã lỗi 400
    throw new Error(error.message); // Ném ra một lỗi với thông báo lỗi cụ thể
  }
});
const renameGroup = asyncHandler(async (req, res) => {
  // Lấy chatId và chatName từ body của request
  const { chatId, chatName } = req.body;

  // Tìm kiếm và cập nhật tên của nhóm chat theo chatId
  const updatedChat = await Chat.findByIdAndUpdate(
    chatId, // ID của nhóm chat cần đổi tên
    { chatName: chatName }, // Tên mới của nhóm chat
    { new: true } // Tùy chọn này đảm bảo rằng hàm trả về dữ liệu của nhóm chat sau khi đã cập nhật
  )
    .populate("users", "-password") // Populate thông tin của các người dùng trong nhóm, loại bỏ trường password
    .populate("groupAdmin", "-password"); // Populate thông tin của người quản trị nhóm, loại bỏ trường password

  // Kiểm tra nếu không tìm thấy nhóm chat, trả về lỗi 404
  if (!updatedChat) {
    res.status(404); // Trả về mã lỗi 404
    throw new Error("Chat Not Found"); // Ném ra một lỗi với thông báo "Chat Not Found"
  } else {
    // Nếu tìm thấy và cập nhật thành công, trả về dữ liệu của nhóm chat đã cập nhật
    res.json(updatedChat);
  }
});

const removeFromGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  // check if the requester is admin

  const removed = await Chat.findByIdAndUpdate(
    chatId,
    {
      $pull: { users: userId },
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!removed) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(removed);
  }
});

// @desc    Add user to Group / Leave
// @route   PUT /api/chat/groupadd
// @access  Protected
const addToGroup = asyncHandler(async (req, res) => {
  // Lấy chatId và userId từ body của request
  const { chatId, userId } = req.body;

  console.log("req.body", req.body);

  // Kiểm tra nếu người yêu cầu là quản trị viên của nhóm (admin)
  // Điều này có thể được thực hiện bằng cách kiểm tra req.user có phải là groupAdmin của chatId không
  // Tuy nhiên, phần này hiện tại chưa được thực hiện trong mã này
  // Một ví dụ kiểm tra có thể như sau:
  // const chat = await Chat.findById(chatId);
  // if (chat.groupAdmin.toString() !== req.user._id.toString()) {
  //     return res.status(403).send({ message: "Only admins can add users to the group" });
  // }

  // Thêm userId vào mảng users của nhóm chat
  const added = await Chat.findByIdAndUpdate(
    chatId, // ID của nhóm chat cần thêm người dùng
    { $push: { users: userId } }, // Thêm userId vào mảng users
    { new: true } // Tùy chọn này đảm bảo rằng hàm trả về dữ liệu của nhóm chat sau khi đã cập nhật
  )
    .populate("users", "-password") // Populate thông tin của các người dùng trong nhóm, loại bỏ trường password
    .populate("groupAdmin", "-password"); // Populate thông tin của người quản trị nhóm, loại bỏ trường password
  // Kiểm tra nếu không tìm thấy nhóm chat, trả về lỗi 404
  if (!added) {
    res.status(404); // Trả về mã lỗi 404
    throw new Error("Chat Not Found"); // Ném ra một lỗi với thông báo "Chat Not Found"
  } else {
    // Nếu tìm thấy và cập nhật thành công, trả về dữ liệu của nhóm chat đã cập nhật
    res.json(added);
  }
});

module.exports = {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  removeFromGroup,
  addToGroup,
};
