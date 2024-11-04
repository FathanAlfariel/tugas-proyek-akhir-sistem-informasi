const express = require("express");
const router = express.Router();

const {
  uploadImages,
  addProduct,
  getProducts,
} = require("../controllers/productController");

// Upload images route
router.post("/images", uploadImages);

// Add product route
router.post("/", addProduct);

// Get all products route
router.get("/", getProducts);

module.exports = router;
