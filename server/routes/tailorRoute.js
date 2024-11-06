const express = require("express");
const router = express.Router();

const { addTailor, getAllTailors } = require("../controllers/tailorController");

// Add tailor route
router.post("/", addTailor);

// Get all tailors route
router.get("/", getAllTailors);

module.exports = router;
