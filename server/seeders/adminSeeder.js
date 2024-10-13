const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Admin = require("../models/Admin");
const dotenv = require("dotenv");

dotenv.config();

const adminSeeder = async () => {
  // Connect to MongoDB Database
  await mongoose.connect(process.env.MONGODB_URI);

  // Check if admin is already exists
  const existingAdmin = await Admin.findOne({ name: "" });

  if (existingAdmin) {
    console.log("Admin already exists");
  }

  // Create admin credentials
  const adminCredentials = new Admin({
    name: "Admin1",
    username: "admin1",
    password: "admin1",
  });

  // Hash the admin password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(adminCredentials.password, salt);
  adminCredentials.password = hashedPassword;

  // Save adminCredentials to database
  await adminCredentials.save().then(() => {
    console.log("Admin created successfully");
  });

  // Close the database conenction
  await mongoose.disconnect();
};

adminSeeder()
  .then(() => {
    console.log("Admin seeding completed");
    process.exit(0);
  })
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });
