var mongoose = require("mongoose");
const Joi = require("@hapi/joi"); //for validating data in mongoose

var userSchema = mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: { type: String, default: "common" },
});
var User = mongoose.model("users", userSchema);

function validateUser(data) {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
    email: Joi.string().email().min(3).required(),
    password: Joi.string().min(5).required(),
  });
  return schema.validate(data, { abortEarly: false });
}
function validateUserLogin(data) {
  const schema = Joi.object({
    email: Joi.string().email().min(3).required(),
    password: Joi.required(),
  });
  return schema.validate(data, { abortEarly: false });
}

module.exports.User = User;
module.exports.validateUser = validateUser;
module.exports.validateUserLogin = validateUserLogin;
