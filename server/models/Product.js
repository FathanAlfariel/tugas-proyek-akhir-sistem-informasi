const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    images: [
      {
        type: String,
        required: true,
      },
    ],
    colors: [
      {
        color: String,
        sizes: [
          {
            length: Number,
            width: Number,
            height: Number,
            stock: Number,
            price: Number,
            _id: false,
          },
        ],
        _id: false,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
