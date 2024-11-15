const Order = require("../models/Order");
const mongoose = require("mongoose");

// Add order controller
const addOrder = async (req, res) => {
  const { variantId, name, phone, shippingFee, discount, address, status } =
    req.body;

  try {
    const query = new Order({
      trackingReceipt: `TRK${Date.now()}${Math.floor(Math.random() * 1000)}`,
      variantId,
      name,
      phone,
      shippingFee,
      discount,
      address,
      status,
    });

    await query.save();

    return res
      .status(200)
      .json({ message: "Successfully added order", results: query });
  } catch (err) {
    console.log("Error :" + err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Get all orders controller
const getAllOrders = async (req, res) => {
  try {
    const query = await Order.aggregate([
      {
        $unwind: "$variantId",
      },
      {
        $lookup: {
          from: "products",
          let: { variantId: "$variantId" },
          pipeline: [
            { $unwind: "$variants" },
            { $match: { $expr: { $eq: ["$variants._id", "$$variantId.id"] } } },
            {
              $project: {
                name: 1,
                description: 1,
                images: 1,
                variant: "$variants",
                variantPrice: "$variants.size.price", // Ambil harga dari setiap variant
                total: "$$variantId.total",
              },
            },
          ],
          as: "productDetails",
        },
      },
      {
        $unwind: "$productDetails", // Unwind lagi untuk memproses harga setiap variant
      },
      {
        $group: {
          _id: "$_id",
          trackingReceipt: { $first: "$trackingReceipt" },
          name: { $first: "$name" },
          phone: { $first: "$phone" },
          address: { $first: "$address" },
          shippingFee: { $first: "$shippingFee" },
          discount: { $first: "$discount" },
          status: { $first: "$status" },
          createdAt: { $first: "$createdAt" },
          updatedAt: { $first: "$updatedAt" },
          product: { $push: "$productDetails" },
          totalVariantPrice: { $sum: "$productDetails.variantPrice" }, // Hitung total harga semua variant
        },
      },
      {
        $addFields: {
          totalPrice: {
            $add: [
              "$totalVariantPrice",
              "$shippingFee",
              { $multiply: ["$discount", -1] },
            ],
          }, // Total harga akhir
        },
      },
    ]);

    return res.status(200).json({
      message: "Successfully get all the orders",
      results: query,
    });
  } catch (err) {
    console.log("Error :" + err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Update order status controller
const updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const query = await Order.findByIdAndUpdate(
      id,
      {
        status,
      },
      { new: true }
    );

    // If order doesn't exist
    if (!query) {
      return res.status(404).json({ message: "Order not found" });
    }

    return res
      .status(200)
      .json({ message: "Successfully update order status", results: query });
  } catch (err) {
    console.log("Error :" + err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Get order by id
const getOrderById = async (req, res) => {
  const { id } = req.params;

  try {
    const query = await Order.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(id) },
      },
      {
        $unwind: "$variantId",
      },
      {
        $lookup: {
          from: "products",
          let: { variantId: "$variantId" },
          pipeline: [
            { $unwind: "$variants" },
            { $match: { $expr: { $eq: ["$variants._id", "$$variantId.id"] } } },
            {
              $project: {
                name: 1,
                description: 1,
                images: 1,
                variant: "$variants",
                variantPrice: "$variants.size.price", // Ambil harga dari setiap variant
                total: "$$variantId.total",
              },
            },
          ],
          as: "productDetails",
        },
      },
      {
        $unwind: "$productDetails", // Unwind lagi untuk memproses harga setiap variant
      },
      {
        $group: {
          _id: "$_id",
          trackingReceipt: { $first: "$trackingReceipt" },
          name: { $first: "$name" },
          phone: { $first: "$phone" },
          address: { $first: "$address" },
          shippingFee: { $first: "$shippingFee" },
          discount: { $first: "$discount" },
          status: { $first: "$status" },
          createdAt: { $first: "$createdAt" },
          updatedAt: { $first: "$updatedAt" },
          product: { $push: "$productDetails" },
          totalVariantPrice: { $sum: "$productDetails.variantPrice" }, // Hitung total harga semua variant
        },
      },
      {
        $addFields: {
          totalPrice: {
            $add: [
              "$totalVariantPrice",
              "$shippingFee",
              { $multiply: ["$discount", -1] },
            ],
          }, // Total harga akhir
        },
      },
    ]);

    // If order doesn't exist
    if (!query) {
      return res.status(404).json({ message: "Order not found" });
    }

    return res.status(200).json({
      message: "Successfully get product data",
      results: query[0],
    });
  } catch (err) {
    console.log("Error :" + err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Delete order
const deleteOrder = async (req, res) => {
  const { id } = req.params;

  try {
    const query = await Order.findByIdAndDelete(id);

    // If order doesn't exist
    if (!query) {
      return res.status(404).json({ message: "Order not found" });
    }

    return res
      .status(200)
      .json({ message: "Order deleted successfully", results: query });
  } catch (err) {
    console.log("Error :" + err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  addOrder,
  getAllOrders,
  updateOrderStatus,
  getOrderById,
  deleteOrder,
};
