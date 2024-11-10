const axios = require("axios");

const getAllCountries = async (req, res) => {
  try {
    const allCountries = await axios
      .get("https://restcountries.com/v3.1/all")
      .then(({ data }) => {
        return data
          .map((item) => ({
            label: item.name.common,
            value: item.name.common,
          }))
          .sort((a, b) => a.label.localeCompare(b.label)); // Urutkan A-Z berdasarkan label
      })
      .catch((err) => {
        console.log(err);
      });

    return res
      .status(200)
      .json({ message: "Successfully get all country", results: allCountries });
  } catch (err) {
    console.log("Error :" + err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { getAllCountries };
