const Admin = require("../models/Admin");

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
    jwt.sign({ id: findUser._id }, process.env.JSON_TOKEN, (error, token) => {
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

module.exports = { login };
