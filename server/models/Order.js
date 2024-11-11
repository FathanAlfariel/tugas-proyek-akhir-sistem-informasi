const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    shippingReceipt: { type: String, required: true },
    variantId: [
      {
        id: mongoose.Schema.Types.ObjectId,
        total: Number,
      },
    ],
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    shippingFee: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
    },
    address: {
      country: { type: String, required: true },
      address: { type: String, required: true },
      otherDetails: { type: String, required: true },
      province: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
