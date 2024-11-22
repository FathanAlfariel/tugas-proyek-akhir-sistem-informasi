const imageUpload = require("../middlewares/multerMiddleware");
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
    if (!getAllProducts) {
      return res.status(404).json({ message: "Product not found" });
    }

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
    const isProductExists = await prisma.product.findUnique({
      where: { id: id },
    });
    if (!isProductExists) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Dapatkan ID dari input variants
    const inputVariantIds = variants
      .map((variant) => variant.id)
      .filter(Boolean); // Pastikan ID valid

    // Hapus variants yang tidak ada di input
    await prisma.productVariant.deleteMany({
      where: {
        productId: id,
        id: { notIn: inputVariantIds },
      },
    });

    // Dapatkan ID dari input images
    const inputImageIds = images.map((image) => image.id).filter(Boolean); // Pastikan ID valid

    // Hapus variants yang tidak ada di input
    await prisma.productImage.deleteMany({
      where: {
        productId: id,
        id: { notIn: inputImageIds },
      },
    });

    await prisma.product.update({
      where: {
        id: id,
      },
      data: {
        name: name,
        images: {
          upsert: images.map((image) => ({
            where: { id: image.id || "" },
            update: {
              name: image.name,
            },
            create: {
              name: image.name,
            },
          })),
        },
        description: description,
        variants: {
          upsert: variants.map((variant) => ({
            where: { id: variant.id || "" },
            create: {
              color: variant.color,
              length: parseFloat(variant.size.length),
              width: parseFloat(variant.size.width),
              height: parseFloat(variant.size.height),
              stock: parseInt(variant.size.stock),
              price: parseFloat(variant.size.price),
            },
            update: {
              color: variant.color,
              length: parseFloat(variant.size.length),
              width: parseFloat(variant.size.width),
              height: parseFloat(variant.size.height),
              stock: parseInt(variant.size.stock),
              price: parseFloat(variant.size.price),
            },
          })),
        },
      },
    });

    return res.status(200).json({ message: "Successfully updated product" });
  } catch (err) {
    console.log("Error :" + err);
    return res.status(500).json();
  }
};

// Get product by variant id
const getProductByVariantId = async (req, res) => {
  const { data } = req.body;

  try {
    const productData = [];

    for (const item of data) {
      const getProductVariantById = await prisma.productVariant.findUnique({
        where: {
          id: item.id,
        },
        include: {
          product: {
            include: {
              images: true,
            },
          },
        },
      });

      productData.push({ ...getProductVariantById, total: item.total });
    }

    return res.status(200).json({ message: "Success", results: productData });
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
