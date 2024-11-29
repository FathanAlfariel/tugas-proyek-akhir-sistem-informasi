const express = require("express");
const router = express.Router();

const {
  addProductCreation,
  getAllProductCreation,
  updateStatus,
} = require("../controllers/productCreationController");

// Create
router.post("/", addProductCreation);

// Get all
router.get("/", getAllProductCreation);

// Update status
router.put("/status/:id", updateStatus);

module.exports = router;
