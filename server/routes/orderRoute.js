const express = require("express");
const router = express.Router();

const { addOrder } = require("../controllers/orderController");

// Add order route
router.post("/", addOrder);

module.exports = router;
