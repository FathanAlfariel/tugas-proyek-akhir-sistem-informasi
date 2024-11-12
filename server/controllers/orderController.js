const Order = require("../models/Order");

// Add order controller
const addOrder = async (req, res) => {
  const { variantId, name, phone, shippingFee, discount, address, status } =
    req.body;

  try {
    const query = new Order({
      trackingReceipt: `TRK-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
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
        // Unwind variantId array in orders to process each variant separately
        $unwind: "$variantId",
      },
      {
        // Lookup products by matching variant ID
        $lookup: {
          from: "products", // Name of the products collection
          let: { variantId: "$variantId" },
          pipeline: [
            { $unwind: "$variants" }, // Unwind variants array in products
            { $match: { $expr: { $eq: ["$variants._id", "$$variantId.id"] } } },
            {
              $project: {
                name: 1,
                description: 1,
                images: 1,
                variant: "$variants",
                total: "$$variantId.total",
              },
            },
          ],
          as: "productDetails",
        },
      },
      {
        // Group product details back by order ID
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
          product: { $push: { $arrayElemAt: ["$productDetails", 0] } }, // Push matching product details for each variant
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

module.exports = { addOrder, getAllOrders };
