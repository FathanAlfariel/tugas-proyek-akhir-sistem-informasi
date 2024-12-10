const express = require("express");
const {
  getIncomes,
  getExpenses,
  getOrders,
  getProfits,
} = require("../controllers/analysisController");
const router = express.Router();

router.get("/income", getIncomes);
router.get("/expense", getExpenses);
router.get("/order", getOrders);
router.get("/profit", getProfits);

module.exports = router;
