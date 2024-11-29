const express = require("express");
const router = express.Router();

const {
  addProductCreation,
  getAllProductCreation,
  updateStatuses,
  cancelProductCreation,
  deleteProductCreation,
} = require("../controllers/productCreationController");

// Create
router.post("/", addProductCreation);

// Get all
router.get("/", getAllProductCreation);

// Update status
router.put("/statuses", updateStatuses);

// Cancel status
router.put("/cancel/:id", cancelProductCreation);

// Delete
router.delete("/:id", deleteProductCreation);

module.exports = router;
