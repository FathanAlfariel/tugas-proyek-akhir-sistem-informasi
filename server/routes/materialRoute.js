const express = require("express");
const router = express.Router();

const {
  getAllMaterials,
  addMaterial,
} = require("../controllers/materialController");

// Get all materials
router.get("/", getAllMaterials);

// Add material
router.post("/", addMaterial);

module.exports = router;
