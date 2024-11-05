const express = require("express");
const router = express.Router();

const {
  uploadImages,
  addProduct,
  getProducts,
  updateVisibilityProduct,
  deleteProduct,
  getProductById,
  updateProduct,
} = require("../controllers/productController");

// Upload images route
router.post("/images", uploadImages);

// Add product route
router.post("/", addProduct);

// Get all products route
router.get("/", getProducts);

// Update product visibility
router.put("/visibility/:id", updateVisibilityProduct);

// Delete product
router.delete("/:id", deleteProduct);

// Get product data by id
router.get("/:id", getProductById);

// Update product
router.put("/:id", updateProduct);

module.exports = router;
