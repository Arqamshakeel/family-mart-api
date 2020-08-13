var mongoose = require("mongoose");
const Joi = require("@hapi/joi"); //for validating data in mongoose

var orderSchema = mongoose.Schema({
  cart: [],
  customerData: {},
});
var Order = mongoose.model("orders", orderSchema);

// function validateProduct(data) {
//   const schema = Joi.object({
//     name: Joi.string().min(3).max(100).required(),
//     price: Joi.number().min(0).required(),
//   });
//   return schema.validate(data, { abortEarly: false });
// }

module.exports.Order = Order;
// module.exports.validate = validateProduct;
