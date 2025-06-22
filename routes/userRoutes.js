const express = require("express");
const {
  registerUser,
  loginUser,
  checkUserSession,
} = require("../controllers/userController");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/check-session", checkUserSession);

module.exports = router;
