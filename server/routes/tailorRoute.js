const express = require("express");
const router = express.Router();

const { addTailor } = require("../controllers/tailorController");

router.post("/", addTailor);

module.exports = router;
