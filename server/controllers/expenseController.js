const Expense = require("../models/Expense");

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

module.exports = { addExpense };
