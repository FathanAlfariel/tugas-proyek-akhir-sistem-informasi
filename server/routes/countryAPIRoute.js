const express = require("express");
const router = express.Router();

const { getAllCountries } = require("../controllers/countryAPIController");

router.get("/", getAllCountries);

module.exports = router;
