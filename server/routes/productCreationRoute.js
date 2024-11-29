const express = require("express");
const router = express.Router();

const {
  addProductCreation,
  getAllProductCreation,
  updateStatuses,
  deleteProductCreation,
} = require("../controllers/productCreationController");

// Create
router.post("/", addProductCreation);

// Get all
router.get("/", getAllProductCreation);

// Update status
router.put("/statuses", updateStatuses);

// Delete
router.delete("/:id", deleteProductCreation);

module.exports = router;
