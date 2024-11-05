const express = require("express");
const router = express.Router();

const {
  addExpense,
  getAllExpenses,
  deleteExpense,
  getExpenseById,
  updateExpense,
} = require("../controllers/expenseController");

// Add expense route
router.post("/", addExpense);

// Get all expenses route
router.get("/", getAllExpenses);

// Delete expense route
router.delete("/:id", deleteExpense);

// Get expense data by id route
router.get("/:id", getExpenseById);

// Update expense route
router.put("/:id", updateExpense);

module.exports = router;
