var express = require("express");
var router = express.Router();
var { Product } = require("../mongooseModels/mongooseModel.product");
const { mongo } = require("mongoose");
var bcrypt = require("bcryptjs");
var config = require("config");
var _ = require("lodash");
var fs = require("fs");
var path = require("path");
var multer = require("multer");
//var upload = multer({ dest: "../uploads" });
var jwt = require("jsonwebtoken");
var validateUserRegMW = require("../middlewares/authUserReg");
router.get("/", async (req, res, next) => {
  let product = await Product.find();
  //let img = product.image.data;
  //let img = fs.readFileSync(product[0].image.data);
  //fs.writeFile("test.jpg", product[0].image.data, "uploads", function (err) {});
  //return res.send(img);

  var buf = Buffer.from(product[0].image.data, "base64");

  fs.writeFile("hello.jpg", buf, function (error) {
    if (error) {
      throw error;
    } else {
      console.log("File created from base64 string!");
      return true;
    }
  });
  return res.send("created");
});
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname + "-" + Date.now() + ".jpg");
  },
});

var upload = multer({ storage: storage }).single("avatar");

router.post("/", upload, async (req, res, next) => {
  let product = new Product();
  product.name = "LAYS MASALA";
  product.stock = 100;
  product.company = "LAYS";
  product.price = 30;
  product.weight = "30g";
  product.category = ["chips", "snacks", "potato"];
  console.log(__dirname);
  product.image.data = fs.readFileSync("file.jpg");
  product.image.contentType = "picture";
  await product.save();
  res.send(product);
});

// router.post("/new", validateUserRegMW, async (req, res) => {
//   return res.send("NEW");
// });

// var storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "uploads");
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.originalname + "-" + Date.now() + ".jpg");
//   },
// });

// var upload = multer({ storage: storage }).single("avatar");

// // router.post("/", upload.single("avatar"), function (req, res, next) {
// //   // req.file is the `avatar` file
// //   // req.body will hold the text fields, if there were any
// // });

// router.post("/", function (req, res) {
//   //console.log(req.file);
//   upload(req, res, function (err) {
//     if (err) {
//       res.json({
//         success: false,
//         message: "image not uploaded",
//       });
//       // A Multer error occurred when uploading.
//     } else if (err) {
//       res.json({
//         success: false,
//         message: "image not uploaded",
//       });
//       // An unknown error occurred when uploading.
//     }
//     return res.json({
//       success: true,
//       message: "image uploaded",
//     });
//     // Everything went fine.
//   });
// });
module.exports = router;
