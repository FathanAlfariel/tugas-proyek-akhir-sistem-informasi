const express = require("express");
const router = express.Router();

const {
  getAllCountries,
  getStatesBySelectedCountry,
  getCitiesBySelectedState,
} = require("../controllers/countryAPIController");

// Get all countries
router.get("/", getAllCountries);

// Get states by country
router.get("/states", getStatesBySelectedCountry);

// Get cities by state
router.get("/cities", getCitiesBySelectedState);

module.exports = router;
