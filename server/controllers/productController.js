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

    return res
      .status(200)
      .json({ message: "Successfully added product", addProduct });
  } catch (err) {
    console.error("Error :", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Get all products
const getProducts = async (req, res) => {
  try {
    const getAllProducts = await Product.find();

    return res
      .status(200)
      .json({ message: "Successfully get all the products", getAllProducts });
  } catch (err) {
    console.error("Error :", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Update visibility product
const updateVisibilityProduct = async (req, res) => {
  const { id } = req.params;
  const { visibility } = req.body;

  try {
    const updateVisibility = await Product.findByIdAndUpdate(
      id,
      {
        visibility: visibility,
      },
      { new: true }
    );

    if (!updateVisibility) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json({
      message: "Successfully update product visibility",
      updateVisibility,
    });
  } catch (err) {
    console.log("Error :" + err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Delete product
const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const deleteProd = await Product.findByIdAndDelete(id, { new: true });

    if (!deleteProd) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res
      .status(200)
      .json({ message: "Product deleted successfully", data: deleteProd });
  } catch (err) {
    console.log("Error :" + err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  uploadImages,
  addProduct,
  getProducts,
  updateVisibilityProduct,
  deleteProduct,
};
