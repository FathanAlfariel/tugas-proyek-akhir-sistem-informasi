const Country = require("country-state-city").Country;
const State = require("country-state-city").State;
const City = require("country-state-city").City;

const getAllCountries = async (req, res) => {
  try {
    const query = await Country.getAllCountries();

    const results = query
      .map((item) => ({
        label: item.name,
        value: item.isoCode,
      }))
      .sort((a, b) => a.label.localeCompare(b.label)); // Urutkan A-Z berdasarkan label

    return res.status(200).json({
      message: "Successfully get all country",
      results: results,
    });
  } catch (err) {
    console.log("Error :" + err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getStatesBySelectedCountry = async (req, res) => {
  const { country } = req.query;

  try {
    if (country) {
      const query = await State.getStatesOfCountry(country);

      const results = query.map((item) => ({
        label: item.name,
        value: item.isoCode,
      }));

      return res.status(200).json({
        message: "Successfully get all states",
        results: results,
      });
    }
  } catch (err) {
    console.log("Error :" + err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getCitiesBySelectedState = async (req, res) => {
  const { countryCode, stateCode } = req.query;

  try {
    if (countryCode && stateCode) {
      const query = await City.getCitiesOfState(countryCode, stateCode);

      const results = query.map((item) => ({
        label: item.name,
        value: item.name,
      }));

      return res
        .status(200)
        .json({ message: "Successfully get all cities", results: results });
    }
  } catch (err) {
    console.log("Error :" + err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getAllCountries,
  getStatesBySelectedCountry,
  getCitiesBySelectedState,
};
