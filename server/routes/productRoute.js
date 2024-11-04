const express = require("express");
const router = express.Router();

const {
  uploadImages,
  addProduct,
  getProducts,
  updateVisibilityProduct,
  deleteProduct,
} = require("../controllers/productController");

// Upload images route
router.post("/images", uploadImages);

// Add product route
router.post("/", addProduct);

// Get all products route
router.get("/", getProducts);

// Update product visibility
router.put("/:id", updateVisibilityProduct);

// Delete product
router.delete("/:id", deleteProduct);

module.exports = router;
