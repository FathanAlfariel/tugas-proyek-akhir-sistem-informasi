const Product = require("../models/Product");
const imageUpload = require("../middlewares/multerMiddleware");

// Image Upload Controller
const uploadImages = async (req, res) => {
  const upload = imageUpload.array("photos", 20);

  upload(req, res, (err) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Failed to upload images", error: err.message });
    }

    const uploadedImages = req.files.map((file) => {
      return { filename: file.filename };
    });

    return res
      .status(200)
      .json({ message: "Images uploaded successfully", files: uploadedImages });
  });
};

// Add Product Controller
const addProduct = async (req, res) => {
  const { images, name, description, variants } = req.body;

  try {
    const addProduct = new Product({
      images,
      name,
      description,
      variants,
    });

    await addProduct.save();

    res.status(200).json({ message: "Successfully added product", addProduct });
  } catch (err) {
    console.error("Error :", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { uploadImages, addProduct };
