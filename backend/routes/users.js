var express = require("express");
var router = express.Router();
const {
  registerUser,
  loginUser,
  allUsers,
  handleUpdateUser,
  getUser,
} = require("../controllers/user.controller");
const { protect } = require("../middleware/authMiddleware");
/* GET users listing. */

/* GET users listing. */
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/", protect, allUsers);
router.get("/:id", protect, getUser);

router.put("/:id", handleUpdateUser);

module.exports = router;
