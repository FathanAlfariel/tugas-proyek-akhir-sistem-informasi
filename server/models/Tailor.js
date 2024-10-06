const mongoose = require("mongoose");

const tailorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    available: {
      type: Boolean,
      enum: [true, false],
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongooose.model("Tailor", tailorSchema);
