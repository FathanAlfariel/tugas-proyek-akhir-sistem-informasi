const express = require("express");
const router = express.Router();

const {
  getAllMaterials,
  getMaterialById,
  addMaterial,
  updateMaterial,
  deleteMaterial,
} = require("../controllers/materialController");

// Get all materials
router.get("/", getAllMaterials);

// Get material daya by id
router.get("/:id", getMaterialById);

// Add material
router.post("/", addMaterial);

// Get material daya by id
router.put("/:id", updateMaterial);

// Get material daya by id
router.delete("/:id", deleteMaterial);

module.exports = router;
