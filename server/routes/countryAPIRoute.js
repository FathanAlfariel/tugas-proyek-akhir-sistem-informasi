const express = require("express");
const router = express.Router();

const {
  getAllCountries,
  getStateBySelectedCountry,
} = require("../controllers/countryAPIController");

// Get all countries
router.get("/", getAllCountries);

// Get state by country
router.get("/state", getStateBySelectedCountry);

module.exports = router;
