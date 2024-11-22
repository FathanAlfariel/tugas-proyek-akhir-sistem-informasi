const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Get all materials
const getAllMaterials = async (req, res) => {
  try {
    const query = await prisma.material.findMany();
    if (!query) {
      return res.status(404).json({ message: "Product not found" });
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

module.exports = { getAllMaterials, addMaterial };
