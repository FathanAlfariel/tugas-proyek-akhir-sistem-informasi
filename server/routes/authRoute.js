const express = require("express");
const router = express.Router();

const {
  login,
  getUser,
  getToken,
  logout,
} = require("../controllers/authController");

// Login Route
router.post("/login", login);

// Get User Data Route
router.get("/getUser", getUser);

// Get token from cookies
router.get("/getToken", getToken);

// Logout route
router.post("/logout", logout);

module.exports = router;
