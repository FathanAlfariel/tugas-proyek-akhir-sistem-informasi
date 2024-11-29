const express = require("express");
const router = express.Router();

const {
  addProductCreation,
  getAllProductCreation,
} = require("../controllers/productCreationController");

// Create
router.post("/", addProductCreation);

// Get all
router.get("/", getAllProductCreation);

module.exports = router;
