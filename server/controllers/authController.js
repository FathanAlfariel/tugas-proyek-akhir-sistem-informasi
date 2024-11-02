const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Login Controller
const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const findUser = await Admin.findOne({ username: username });

    if (!findUser) return res.status(404).json({ message: "User not found" });

    // Compare password
    const isPasswordCorrect = await bcrypt.compare(password, findUser.password);
    if (!isPasswordCorrect)
      return res.status(401).json({ message: "Password incorrect" });

    // Create token with jsonwebtoken
    jwt.sign({ id: findUser._id }, process.env.JWT_TOKEN, (error, token) => {
      if (error)
        return res.status(500).json({ message: "Internal server error" });

      res
        .status(200)
        .cookie("token", token, { httpOnly: true })
        .json({ message: "Login successfully", data: findUser });
    });
  } catch (err) {
    console.error("Error :", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Get User Data Controller
const getUser = async (req, res) => {
  const { token } = req.cookies;

  try {
    if (token) {
      jwt.verify(token, process.env.JWT_TOKEN, {}, async (err, data) => {
        if (err)
          return res.status(500).json({ message: "Internal server error" });

        const getUser = await Admin.findById(data.id);
        res.status(200).json({
          message: "Successfully get user data that is currently logged in",
          data: getUser,
        });
      });
    }
  } catch (err) {
    console.error("Error :", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getToken = async (req, res) => {
  const { token } = req.cookies;

  try {
    jwt.verify(token, process.env.JWT_TOKEN, {}, (err, decoded) => {
      if (err)
        return res.status(500).json({ message: "Internal server error" });

      res
        .status(200)
        .json({ message: "Get token successfully", token, decoded });
    });
  } catch (err) {
    console.error("Error :", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { login, getUser, getToken };
