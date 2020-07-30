var express = require("express");
var router = express.Router();
var { User } = require("../mongooseModels/model.users");
const { mongo } = require("mongoose");
var bcrypt = require("bcryptjs");
var config = require("config");
var _ = require("lodash");
var jwt = require("jsonwebtoken");
var validateUserRegMW = require("../middlewares/authUserReg");
router.get("/", async (req, res, next) => {
  res.send("GET ALL PRODUCTS");
});

router.post("/new", validateUserRegMW, async (req, res) => {
  return res.send("NEW");
});

module.exports = router;
