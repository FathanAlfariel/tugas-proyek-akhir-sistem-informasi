const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Add tailor controller
const addTailor = async (req, res) => {
  const { name, available } = req.body;

  try {
    const query = await prisma.tailor.create({
      data: {
        name: name,
        available: Boolean(available),
      },
    });

    return res
      .status(200)
      .json({ message: "Successfully added tailor", results: query });
  } catch (err) {
    console.log("Error :" + err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Get all tailors controller
const getAllTailors = async (req, res) => {
  try {
    const query = await prisma.tailor.findMany();

    return res
      .status(200)
      .json({ message: "Successfully get all the tailors", results: query });
  } catch (err) {
    console.log("Error :" + err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Get tailor data by id
const getTailorById = async (req, res) => {
  const { id } = req.params;

  try {
    const query = await prisma.tailor.findUnique({
      where: {
        id: id,
      },
    });
    // If tailor doesn't exist
    if (!query) return res.status(404).json({ message: "Tailor not found" });

    return res
      .status(200)
      .json({ message: "Successfully get tailor data", results: query });
  } catch (err) {
    console.log("Error :" + err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Update tailor
const updateTailor = async (req, res) => {
  const { id } = req.params;
  const { name, available } = req.body;

  try {
    // Find tailor data whether it exists or not
    const findTailor = await prisma.tailor.findUnique({
      where: {
        id: id,
      },
    });
    if (!findTailor)
      return res.status(404).json({ message: "Tailor not found" });

    const query = await prisma.tailor.update({
      where: {
        id: id,
      },
      data: {
        name: name,
        available: Boolean(available),
      },
    });

    return res
      .status(200)
      .json({ message: "Successfully updated tailor", results: query });
  } catch (err) {
    console.log("Error :" + err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Delete tailor
const deleteTailor = async (req, res) => {
  const { id } = req.params;

  try {
    // Find tailor data whether it exists or not
    const findTailor = await prisma.tailor.findUnique({
      where: {
        id: id,
      },
    });
    if (!findTailor)
      return res.status(404).json({ message: "Tailor not found" });

    const query = await prisma.tailor.delete({
      where: {
        id: id,
      },
    });

    return res
      .status(200)
      .json({ message: "Tailor deleted successfully", results: query });
  } catch (err) {
    console.log("Error :" + err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  addTailor,
  getAllTailors,
  getTailorById,
  updateTailor,
  deleteTailor,
};
