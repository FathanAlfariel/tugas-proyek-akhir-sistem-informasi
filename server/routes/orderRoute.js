const express = require("express");
const router = express.Router();

const { addOrder, getAllOrders, updateOrderStatus } = require("../controllers/orderController");

// Add order route
router.post("/", addOrder);

// Get all orders
router.get("/", getAllOrders);

// Update order status
router.put("/status/:id", updateOrderStatus)

module.exports = router;
