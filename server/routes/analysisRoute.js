const express = require("express");
const {
  getIncomes,
  getExpenses,
  getOrders,
} = require("../controllers/analysisController");
const router = express.Router();

router.get("/income", getIncomes);
router.get("/expense", getExpenses);
router.get("/order", getOrders);

module.exports = router;
