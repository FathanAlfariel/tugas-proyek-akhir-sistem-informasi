const Product = require("../models/Product");

// Add Product Controller
const addProduct = async (req, res) => {
  const { name, images, colors } = req.body;

  try {
    const addProduct = new Product({
      name,
      images,
      colors,
    });

    console.log(addProduct);
    // await addProduct.save();

    res.status(200).json({ message: "Successfully added product", addProduct });
  } catch (err) {
    console.error("Error :", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { addProduct };
