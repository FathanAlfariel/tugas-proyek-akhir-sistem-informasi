const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    images: [
      {
        type: String,
        required: true,
      },
    ],
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    variants: [
      {
        _id: false,
        color: String,
        size: {
          length: Number,
          width: Number,
          height: Number,
          stock: Number,
          price: Number,
        },
      },
    ],
    visibility: {
      type: String,
      enum: ["public", "private"],
      default: "public",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
