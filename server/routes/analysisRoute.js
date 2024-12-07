const express = require("express");
const { getIncome } = require("../controllers/analysisController");
const router = express.Router();

router.get("/income", getIncome);

module.exports = router;
