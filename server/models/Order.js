const mongoose = require("mongoose");
const Product = require("./Product");

const orderSchema = new mongoose.Schema(
  {
    trackingReceipt: { type: String, required: true, unique: true },
    variantId: [
      {
        _id: false,
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
      otherDetails: { type: String },
      province: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
    },
    status: {
      type: String,
      enum: [
        "belum bayar",
        "sedang dikemas",
        "dikirim",
        "selesai",
        "dibatalkan",
      ],
      default: "belum bayar",
      required: true,
    },
  },
  { timestamps: true }
);

// Middleware untuk mengurangi stok saat order disimpan
orderSchema.pre("save", async function (next) {
  try {
    for (const variant of this.variantId) {
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

    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model("Order", orderSchema);
