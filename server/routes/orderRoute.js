const express = require("express");
const router = express.Router();

const {
  addOrder,
  getAllOrders,
  updateOrderStatus,
  getOrderDetailById,
  cancelOrder,
} = require("../controllers/orderController");

// Add order route
router.post("/", addOrder);

// Get all orders
router.get("/", getAllOrders);

// Update order status
router.put("/status/:id", updateOrderStatus);

// Get order detail by id
router.get("/:id", getOrderDetailById);

// Cancel order
router.put("/cancel/:id", cancelOrder);

module.exports = router;
