const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Get all materials
const getAllMaterials = async (req, res) => {
  try {
    const query = await prisma.material.findMany();
    if (!query) {
      return res.status(404).json({ message: "Material not found" });
    }

    return res.status(200).json({
      message: "Successfully get all the materials",
      results: query,
    });
  } catch (err) {
    console.log("Error : " + err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Get material data by id
const getMaterialById = async (req, res) => {
  const { id } = req.params;

  try {
    const query = await prisma.material.findUnique({
      where: {
        id: id,
      },
    });
    if (!query) {
      return res.status(404).json({ message: "Material not found" });
    }

    return res.status(200).json({
      message: "Successfully get product data",
      results: query,
    });
  } catch (err) {
    console.log("Error : " + err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Add material controller
const addMaterial = async (req, res) => {
  const { name, complexity, cuttingTime, sewingTime } = req.body;

  try {
    const query = await prisma.material.create({
      data: {
        name,
        complexity,
        cuttingTime,
        sewingTime,
      },
    });

    return res
      .status(200)
      .json({ message: "Successfully added material", results: query });
  } catch (err) {
    console.log("Error : " + err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Update material controller
const updateMaterial = async (req, res) => {
  const { id } = req.params;
  const { name, complexity, cuttingTime, sewingTime } = req.body;

  try {
    const findMaterial = await prisma.material.findUnique({
      where: {
        id: id,
      },
    });
    if (!findMaterial) {
      return res.status(404).json({ message: "Material not found" });
    }

    const updateMaterial = await prisma.material.update({
      where: {
        id: id,
      },
      data: {
        name,
        complexity,
        cuttingTime,
        sewingTime,
      },
    });

    return res.status(200).json({
      message: "Successfully updated product",
      results: updateMaterial,
    });
  } catch (err) {
    console.log("Error : " + err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Delete material controller
const deleteMaterial = async (req, res) => {
  const { id } = req.params;

  try {
    const query = await prisma.material.delete({
      where: {
        id: id,
      },
    });

    // If product does'nt exist
    if (!query) {
      return res.status(404).json({ message: "Material not found" });
    }

    return res
      .status(200)
      .json({ message: "Material deleted successfully", results: query });
  } catch (err) {
    console.log("Error : " + err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getAllMaterials,
  getMaterialById,
  addMaterial,
  updateMaterial,
  deleteMaterial,
};
