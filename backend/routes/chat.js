var express = require("express");
const chats = require("../data/data");
var router = express.Router();
const {
    accessChat,
    fetchChats,
    createGroupChat,
    renameGroup,
    removeFromGroup,
    addToGroup,
} = require("../controllers/chat.controller");
const { protect } = require("../middleware/authMiddleware");

router.route("/").post(protect, accessChat);
router.route("/").get(protect, fetchChats);
router.route("/group").post(protect, createGroupChat);

router.put("/rename", protect, renameGroup);

router.put("/groupremove", protect, removeFromGroup);

router.put("/groupadd", protect, addToGroup);

module.exports = router;