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
  let user = await User.find();

  res.send(user[0]._id);
});

router.post("/register", validateUserRegMW, async (req, res) => {
  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("Sorry, user already exists.");
  user = new User();
  user.name = req.body.name;
  user.email = req.body.email;
  user.password = req.body.password;
  let salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();
  return res.send(_.pick(user, ["email", "name"]));
});

router.post("/login", validateUserRegMW, async (req, res) => {
  let user = await User.findOne({
    email: req.body.email,
  });
  if (!user)
    return res.status(400).send("Sorry, user with this email not found.");

  let password = await bcrypt.compare(req.body.password, user.password);
  if (!password) return res.status(400).send("Wrong password");

  let token = jwt.sign(
    { _id: user._id, name: user.name, role: user.role },
    config.get("jwt")
  );

  let user2 = jwt.verify(token, config.get("jwt"));
  return res.send({ ok: "login successfull", token, user2 });
});

module.exports = router;
