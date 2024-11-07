const express = require("express");
const router = express.Router();

const {
  addTailor,
  getAllTailors,
  getTailorById,
  updateTailor,
  deleteTailor,
} = require("../controllers/tailorController");

// Add tailor route
router.post("/", addTailor);

// Get all tailors route
router.get("/", getAllTailors);

// Get tailor data by id
router.get("/:id", getTailorById);

// Update tailor data
router.put("/:id", updateTailor);

// Delete tailor
router.delete("/:id", deleteTailor);

module.exports = router;
