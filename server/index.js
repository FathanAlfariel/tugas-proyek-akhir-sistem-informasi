const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

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
app.use(cors());
app.use(bodyParser.json());

// Running the server on
app.listen(PORT, () => {
  console.log(`Server up and running on http://localhost:${PORT}`);
});
