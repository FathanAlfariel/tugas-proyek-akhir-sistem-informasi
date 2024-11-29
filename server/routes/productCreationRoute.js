const express = require("express");
const router = express.Router();

const {
  addProductCreation,
} = require("../controllers/productCreationController");

router.post("/", addProductCreation);

module.exports = router;
