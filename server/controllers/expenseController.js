const Expense = require("../models/Expense");

// Add expense controller
const addExpense = async (req, res) => {
  const { name, price } = req.body;

  try {
    const query = new Expense({
      name,
      price,
    });

    await query.save();

    return res
      .status(200)
      .json({ message: "Successfully added product", query });
  } catch (err) {
    console.log("Error :" + err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Get all expenses controller
const getAllExpenses = async (req, res) => {
  try {
    const query = await Expense.find();

    return res
      .status(200)
      .json({ message: "Successfully get all the expenses", query });
  } catch (err) {
    console.log("Error :" + err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Delete expense controller
const deleteExpense = async (req, res) => {
  const { id } = req.params;

  try {
    const query = await Expense.findByIdAndDelete(id);

    // If expense does'nt exist
    if (!query) {
      return res.status(404).json({ message: "Expense not found" });
    }

    return res
      .status(200)
      .json({ message: "Expense deleted successfully", query });
  } catch (err) {
    console.log("Error :" + err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Get expense data by id
const getExpenseById = async (req, res) => {
  const { id } = req.params;
  const { name, price } = req.body;

  try {
    const query = await Expense.findByIdAndUpdate(
      id,
      {
        name,
        price,
      },
      { new: true }
    );

    // If expense doesn't exist
    if (!query) return res.status(404).json({ message: "Expense not found" });

    return res
      .status(200)
      .json({ message: "Successfully get product data", query });
  } catch (err) {
    console.log("Error :" + err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { addExpense, getAllExpenses, deleteExpense, getExpenseById };
