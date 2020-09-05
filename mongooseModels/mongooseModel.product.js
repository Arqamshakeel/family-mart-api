var mongoose = require("mongoose");
const Joi = require("@hapi/joi"); //for validating data in mongoose

var productSchema = mongoose.Schema({
  name: String,
  type: String,
  stock: Number,
  image: { data: String, contentType: String },
  price: Number,
  company: String,
  weight: String,
  description: String,
  onSale: Boolean,
  expiry: Date,
  category: [String],
});
var Product = mongoose.model("products", productSchema);

function validateProduct(data) {
  const schema = Joi.object({
    name: Joi.string().required(),
    stock: Joi.number().required(),
    price: Joi.number().required(),
    company: Joi.string().required(),
    weight: Joi.string().required(),
    category: Joi.string().required(),
  });
  return schema.validate(data, { abortEarly: false });
}

module.exports.Product = Product;
module.exports.validateProduct = validateProduct;
