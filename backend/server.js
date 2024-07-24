const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const connectDB = require("./config/database.config");
const chatRouter = require("./routes/chat");
const userRouter = require("./routes/users");
const messageRouter = require("./routes/message");

const bodyParser = require("body-parser");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

const colors = require("colors");
const { log } = require("console");
const app = express();

// Configure CORS
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true, // Add this line to allow credentials
  })
);

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

require("dotenv").config();
connectDB();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/chat", chatRouter);
app.use("/api/user", userRouter);
app.use("/api/message", messageRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// Error Handling middlewares
app.use(notFound);
app.use(errorHandler);
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`.green.bold);
});

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("Connected to socket.io");

  socket.on("setup", (userData) => {
    socket.join(userData._id);
    console.log(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User joined room: " + room);
  });
  socket.on("typing", ({ chatId, userId }) => {
    console.log("typing", { chatId, userId });
    socket.to(chatId).emit("typing", { userId });
  });

  socket.on("stop typing", ({ chatId, userId }) => {
    socket.to(chatId).emit("stop typing", { userId });
  });

  socket.on("new message", (newMessageReceived) => {
    var chat = newMessageReceived.chat;
    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageReceived.sender._id) return;
      socket.in(user._id).emit("message received", newMessageReceived);
    });
  });

  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });
});

module.exports = app;
