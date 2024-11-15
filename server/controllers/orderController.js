const Order = require("../models/Order");
const mongoose = require("mongoose");
const Product = require("../models/Product");

// Add order controller
const addOrder = async (req, res) => {
  const {
    variantId,
    name,
    phone,
    shippingFee,
    discount,
    address,
    shippingMethod,
    paymentMethod,
    additionalNotes,
    status,
  } = req.body;

  try {
    // Create a new order instance
    const order = new Order({
      trackingReceipt: `TRK${Date.now()}${Math.floor(Math.random() * 1000)}`,
      variantId,
      name,
      phone,
      shippingFee,
      discount,
      address,
      shippingMethod,
      paymentMethod,
      additionalNotes,
      status,
    });

    // Check and update product variant stock
    for (const variant of order.variantId) {
      const product = await Product.findOne({
        "variants._id": variant.id,
      });

      if (!product) {
        throw new Error("Product variant not found.");
      }

      const productVariant = product.variants.find((v) =>
        v._id.equals(variant.id)
      );

      if (!productVariant) {
        throw new Error("Variant not found in product.");
      }

      // Check if enough stock is available
      if (productVariant.size.stock < variant.total) {
        throw new Error(`Insufficient stock for variant ${variant.id}.`);
      }

      // Reduce stock
      productVariant.size.stock -= variant.total;
      await product.save();
    }

    // Save the order
    await order.save();

    return res
      .status(200)
      .json({ message: "Successfully added order", results: order });
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
          totalVariantPrice: {
            $sum: {
              $multiply: [
                "$productDetails.variantPrice",
                "$productDetails.total",
              ],
            },
          }, // Hitung total harga semua variant
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

// Get order detail by id
const getOrderDetailById = async (req, res) => {
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
          shippingMethod: { $first: "$shippingMethod" },
          paymentMethod: { $first: "$paymentMethod" },
          additionalNotes: { $first: "$additionalNotes" },
          status: { $first: "$status" },
          createdAt: { $first: "$createdAt" },
          updatedAt: { $first: "$updatedAt" },
          product: { $push: "$productDetails" },
          totalVariantPrice: {
            $sum: {
              $multiply: [
                "$productDetails.variantPrice",
                "$productDetails.total",
              ],
            },
          }, // Hitung total harga semua variant
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
      message: "Successfully get order detail",
      results: query[0],
    });
  } catch (err) {
    console.log("Error :" + err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Get order by id
const getOrderById = async (req, res) => {
  const { id } = req.params;

  try {
    const query = await Order.findById(id);

    // If order doesn't exist
    if (!query) {
      return res.status(404).json({ message: "Order not found" });
    }

    return res
      .status(200)
      .json({ message: "Successfully get order data", results: query });
  } catch (err) {
    console.log("Error :" + err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Cancel order
const cancelOrder = async (req, res) => {
  const { id } = req.params;

  try {
    // Find the order to be canceled
    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Check if the order is in a cancelable state
    if (order.status !== "belum bayar") {
      return res.status(400).json({ error: "Order cannot be canceled" });
    }

    // Update the product variants' stock
    for (const variant of order.variantId) {
      const product = await Product.findOne({ "variants._id": variant.id });
      const variantIndex = product.variants.findIndex(
        (v) => v._id.toString() === variant.id.toString()
      );
      product.variants[variantIndex].size.stock += variant.total;
      await product.save();
    }

    // Update the order status to 'dibatalkan'
    order.status = "dibatalkan";
    await order.save();

    res.json({ message: "Order canceled successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  addOrder,
  getAllOrders,
  updateOrderStatus,
  getOrderDetailById,
  getOrderById,
  cancelOrder,
};
