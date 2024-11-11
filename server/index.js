const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
const authRoute = require("./routes/authRoute");
const productRoute = require("./routes/productRoute");
const expenseRoute = require("./routes/expenseRoute");
const tailorRoute = require("./routes/tailorRoute");
const orderRoute = require("./routes/orderRoute");
const countryAPIRoute = require("./routes/countryAPIRoute");

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

// To access images that are in the public folder
app.use("/public", express.static(path.join(__dirname, "public")));

// Auth route
app.use("/api/auth", authRoute);

// Product route
app.use("/api/product", productRoute);

// Expense route
app.use("/api/expense", expenseRoute);

// Tailor route
app.use("/api/tailor", tailorRoute);

// Country API route
app.use("/api/country", countryAPIRoute);

// Order route
app.use("/api/order", orderRoute);

// Running the server on
app.listen(PORT, () => {
  console.log(`Server up and running on http://localhost:${PORT}`);
});
