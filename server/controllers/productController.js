const Product = require("../models/Product");
const imageUpload = require("../middlewares/multerMiddleware");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

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
    const createProduct = await prisma.product.create({
      data: {
        images: { create: images.map((image) => ({ name: image })) },
        name: name,
        description: description,
        variants: {
          create: variants.map((variant) => ({
            color: variant.color,
            length: parseFloat(variant.size.length),
            width: parseFloat(variant.size.width),
            height: parseFloat(variant.size.height),
            stock: parseFloat(variant.size.stock),
            price: parseFloat(variant.size.price),
          })),
        },
      },
    });

    return res
      .status(200)
      .json({ message: "Successfully added product", results: createProduct });
  } catch (err) {
    console.error("Error :", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Get all products
const getProducts = async (req, res) => {
  try {
    const getAllProducts = await prisma.product.findMany({
      include: {
        images: true,
        variants: true,
      },
    });

    return res.status(200).json({
      message: "Successfully get all the products",
      results: getAllProducts,
    });
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
    const query = await prisma.product.update({
      where: {
        id: id,
      },
      data: {
        visibility: visibility,
      },
    });

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
    const query = await prisma.product.delete({
      where: {
        id: id,
      },
    });

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
    const query = await prisma.product.findUnique({
      where: {
        id: id,
      },
      include: {
        images: true,
        variants: true,
      },
    });

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

    const imagesToDelete = isProductExists.images.filter(
      (img) => !images.includes(img)
    );

    for (let imgPath of imagesToDelete) {
      // Hapus gambar dari filesystem
      fs.unlink(path.join(__dirname, "../public/images/", imgPath), (err) => {
        if (err) {
          return res
            .status(500)
            .json({ message: "Failed to delete image file", error: err });
        }
      });
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

// Get product by variant id
const getProductByVariantId = async (req, res) => {
  const { data } = req.body;

  try {
    const values = [];

    for (let item of data) {
      const query = await Product.aggregate([
        {
          $match: {
            variants: {
              $elemMatch: { _id: new mongoose.Types.ObjectId(item.id) },
            },
          },
        },
        {
          $project: {
            images: 1,
            name: 1, // Menampilkan nama produk
            description: 1, // Menampilkan deskripsi produk
            variants: {
              $filter: {
                input: "$variants", // Array variants dari produk
                as: "variant",
                cond: {
                  $eq: ["$$variant._id", new mongoose.Types.ObjectId(item.id)],
                }, // Menyaring variant dengan _id yang sesuai
              },
            },
          },
        },
      ]);

      // Check if query return a data
      if (query.length > 0) {
        // Add total to data response
        const addTotalToResponse = query.map((v) => ({
          ...v,
          total: item.total,
        }));

        values.push(...addTotalToResponse);
      }
    }

    return res.status(200).json({ message: "Success", results: values });
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
  getProductById,
  updateProduct,
  getProductByVariantId,
};
