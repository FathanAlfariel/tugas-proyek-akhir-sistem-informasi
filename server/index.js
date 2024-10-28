const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authRoute = require("./routes/authRoute");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Connection to MongoDB Database
mongoose
  .connect(process.env.MONGODB_URI)
  .then((result) => {
    console.log("Database Connected...");
  })
  .catch((err) => {
    console.log(err);
  });

app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
  })
);
app.use(express.json());

// Auth route
app.use("/api/auth", authRoute);

// Running the server on
app.listen(PORT, () => {
  console.log(`Server up and running on http://localhost:${PORT}`);
});
