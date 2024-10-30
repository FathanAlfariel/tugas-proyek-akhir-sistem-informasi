const express = require("express");
const router = express.Router();

const {
  uploadImages,
  addProduct,
} = require("../controllers/productController");

// Upload images route
router.post("/images", uploadImages);

// Add product route
router.post("/", addProduct);

module.exports = router;
