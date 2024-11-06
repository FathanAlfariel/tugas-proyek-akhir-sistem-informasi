const Tailor = require("../models/Tailor");

// Add tailor controller
const addTailor = async (req, res) => {
  const { name, available } = req.body;

  try {
    const query = new Tailor({
      name,
      available,
    });

    await query.save();

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
    const query = await Tailor.find();

    return res
      .status(200)
      .json({ message: "Successfully get all the tailors", results: query });
  } catch (err) {
    console.log("Error :" + err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { addTailor, getAllTailors };
