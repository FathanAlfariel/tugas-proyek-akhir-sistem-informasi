const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Add expense controller
const addExpense = async (req, res) => {
  const { name, price } = req.body;

  try {
    const query = await prisma.expense.create({
      data: {
        name: name,
        price: parseInt(price),
      },
    });

    return res
      .status(200)
      .json({ message: "Successfully added product", results: query });
  } catch (err) {
    console.log("Error :" + err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Get all expenses controller
const getAllExpenses = async (req, res) => {
  const { name, minPrice, maxPrice } = req.query;

  try {
    const query = await prisma.expense.findMany({
      where: {
        AND: [
          name ? { name: { contains: name } } : undefined,
          minPrice && maxPrice
            ? { price: { gte: parseInt(minPrice), lte: parseInt(maxPrice) } }
            : undefined,
        ].filter(Boolean),
      },
    });

    return res
      .status(200)
      .json({ message: "Successfully get all the expenses", results: query });
  } catch (err) {
    console.log("Error :" + err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Delete expense controller
const deleteExpense = async (req, res) => {
  const { id } = req.params;

  try {
    const query = await prisma.expense.delete({
      where: {
        id: id,
      },
    });

    // If expense does'nt exist
    if (!query) {
      return res.status(404).json({ message: "Expense not found" });
    }

    return res
      .status(200)
      .json({ message: "Expense deleted successfully", results: query });
  } catch (err) {
    console.log("Error :" + err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Get expense data by id
const getExpenseById = async (req, res) => {
  const { id } = req.params;

  try {
    const query = await prisma.expense.findUnique({
      where: {
        id: id,
      },
    });

    // If expense doesn't exist
    if (!query) return res.status(404).json({ message: "Expense not found" });

    return res
      .status(200)
      .json({ message: "Successfully get product data", results: query });
  } catch (err) {
    console.log("Error :" + err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const updateExpense = async (req, res) => {
  const { id } = req.params;
  const { name, price } = req.body;

  try {
    const query = await prisma.expense.update({
      where: {
        id: id,
      },
      data: {
        name: name,
        price: parseInt(price),
      },
    });

    // If expense doen't exist
    if (!query) return res.status(404).json({ message: "Expense not found" });

    return res
      .status(200)
      .json({ message: "Successfully updated expense", results: query });
  } catch (err) {
    console.log("Error :" + err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  addExpense,
  getAllExpenses,
  deleteExpense,
  getExpenseById,
  updateExpense,
};
