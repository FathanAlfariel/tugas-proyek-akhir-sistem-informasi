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
    const query = new Product({
      images,
      name,
      description,
      variants,
    });

    await query.save();

    return res
      .status(200)
      .json({ message: "Successfully added product", results: query });
  } catch (err) {
    console.error("Error :", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Get all products
const getProducts = async (req, res) => {
  try {
    const query = await Product.find();

    return res
      .status(200)
      .json({ message: "Successfully get all the products", results: query });
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
    const query = await Product.findByIdAndUpdate(
      id,
      {
        visibility: visibility,
      },
      { new: true }
    );

    if (!query) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json({
      message: "Successfully update product visibility",
      results: query,
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
    const query = await Product.findByIdAndDelete(id, { new: true });

    // If product does'nt exist
    if (!query) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res
      .status(200)
      .json({ message: "Product deleted successfully", results: query });
  } catch (err) {
    console.log("Error :" + err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Get product data by id
const getProductById = async (req, res) => {
  const { id } = req.params;

  try {
    const query = await Product.findById(id);

    // If product doesn't exist
    if (!query) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res
      .status(200)
      .json({ message: "Successfully get product data", results: query });
  } catch (err) {
    console.log("Error :" + err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Update product
const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { images, name, description, variants } = req.body;

  try {
    // Check if product is exist
    const isProductExists = await Product.findById(id);
    if (!isProductExists) {
      return res.status(404).json({ message: "Product not found" });
    }

    const query = await Product.findByIdAndUpdate(
      id,
      {
        images,
        name,
        description,
        variants,
      },
      { new: true }
    );

    return res
      .status(200)
      .json({ message: "Successfully updated product", results: query });
  } catch (err) {
    console.log("Error :" + err);
    return res.status(500).json();
  }
};

module.exports = {
  uploadImages,
  addProduct,
  getProducts,
  updateVisibilityProduct,
  deleteProduct,
  getProductById,
  updateProduct,
};
