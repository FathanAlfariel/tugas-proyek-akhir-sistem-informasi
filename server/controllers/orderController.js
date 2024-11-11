const Order = require("../models/Order");

const addOrder = async (req, res) => {
  const { variantId, name, phone, shippingFee, discount, address } = req.body;

  try {
    const query = new Order({
      trackingReceipt: `TRK-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      variantId,
      name,
      phone,
      shippingFee,
      discount,
      address,
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

module.exports = { addOrder };
