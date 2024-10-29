const express = require("express");
const router = express.Router();

const { login, getUser, getToken } = require("../controllers/authController");

// Login Route
router.post("/login", login);

// Get User Data Route
router.get("/getUser", getUser);

// Get Token
router.get("/getToken", getToken);

module.exports = router;
