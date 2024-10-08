const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    address: {
      city: { type: String, required: true },
      province: { type: String, required: true },
      district: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
    },
    resi: { type: String, required: true },
    shippingServices: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
