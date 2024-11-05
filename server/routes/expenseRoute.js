const express = require("express");
const router = express.Router();

const {
  addExpense,
  getAllExpenses,
  deleteExpense,
} = require("../controllers/expenseController");

// Add expense route
router.post("/", addExpense);

// Get all expenses route
router.get("/", getAllExpenses);

// Delete expense route
router.delete("/:id", deleteExpense);

module.exports = router;
