const express = require("express");
const router = express.Router();

const { addOrder, getAllOrders } = require("../controllers/orderController");

// Add order route
router.post("/", addOrder);

// Get all orders
router.get("/", getAllOrders);

module.exports = router;
