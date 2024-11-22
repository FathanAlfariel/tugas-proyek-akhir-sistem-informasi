const express = require("express");
const router = express.Router();

const { estimate } = require("../controllers/estimateController");

router.post("/", estimate);

module.exports = router;
