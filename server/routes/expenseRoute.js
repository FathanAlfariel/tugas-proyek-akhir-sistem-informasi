const express = require("express");
const router = express.Router();

const {
  addExpense,
  getAllExpenses,
} = require("../controllers/expenseController");

// Add expense route
router.post("/", addExpense);

// Get all Expenses route
router.get("/", getAllExpenses);

module.exports = router;
