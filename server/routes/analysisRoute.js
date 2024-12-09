const express = require("express");
const { getIncome, getExpense } = require("../controllers/analysisController");
const router = express.Router();

router.get("/income", getIncome);
router.get("/expense", getExpense);

module.exports = router;
