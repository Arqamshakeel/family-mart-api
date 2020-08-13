var express = require("express");
const app = require("express")();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
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

  //var buf2 = Buffer.from(product[0].image.data, "base64");

  //var buf = buf2;

  //var imageSrc = "data:image/jpeg;base64," + `${buf.toString("base64")}`;
  //console.log(product[0].image.data.length);
  // var imageSrc = "data:image/jpeg;base64," + `${product[0].image.data}`;

  // for (let i = 0; i < product.length; i++) {
  //   product[i].image.data =
  //     "data:image/jpeg;base64," + `${product[0].image.data}`;
  //   product[i].image.data = ab2str(product[i].image.data);
  //   function ab2str(buf) {
  //     return String.fromCharCode.apply(null, new Uint16Array(buf));
  //   }
  // }
  //res.cookie("cookieNam", "cookieValue");

  return res.send(product);

  // fs.writeFile("hello.jpg", buf, function (error) {
  //   if (error) {
  //     throw error;
  //   } else {
  //     console.log("File created from base64 string!");
  //     return true;
  //   }
  // });
  //return res.send("created");
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
  product.name = req.body.name;
  product.stock = req.body.stock;
  product.company = req.body.company;
  product.price = req.body.price;
  product.weight = "30g";
  product.category = req.body.tags;
  console.log(__dirname);
  product.image.data = req.body.img;
  await product.save();
  res.send(product);
});
router.get("/cart", async function (req, res, next) {
  if (req.cookies.cart) {
    return res.send(req.cookies.cart);
  } else {
    return res.send(null);
  }
});
router.get("/cart/:qty/:id", async function (req, res, next) {
  let id = req.params.id;
  console.log("Cart in id:" + id);
  let product = await Product.findById(id);
  if (req.params.qty > product.stock) {
    return res.status(400).send("qty>stock");
  }
  let cart = [];
  if (req.cookies.cart) {
    cart = req.cookies.cart;
  }
  console.log(cart.length);

  let check = 0;
  for (let i = 0; i < cart.length; i++) {
    if (cart[i].id == id) {
      console.log("matched");
      if (Number(cart[i].qty) + Number(req.params.qty) > product.stock) {
        console.log("greater");
        console.log(cart[i].qty);
        console.log(req.params.qty);
        console.log(product.stock);
        return res.status(400).send("qty>stock");
      }
    }
  }

  for (let i = 0; i < cart.length; i++) {
    if (cart[i].id == id) {
      check = 1;
      cart[i].qty = Number(cart[i].qty) + Number(req.params.qty);
    }
  }
  if (check != 1) {
    cart.push({
      id: product._id,
      name: product.name,
      company: product.company,
      price: product.price,
      qty: req.params.qty,
    });
  }
  res.cookie("cart", cart, { httpOnly: false });

  return res.send("Cookie created");
});

router.delete("/cart/:id", async function (req, res, next) {
  let id = req.params.id;
  console.log("Cart in id:" + id);

  if (!req.cookies.cart) res.status(400).send("Cart is empty.");
  let cart = [];
  cart = req.cookies.cart;

  for (let i = 0; i < cart.length; i++) {
    if (cart[i].id == id) {
      console.log("found");
      cart.splice(i, 1);
      break;
    }
  }
  //req.cookies.cart = cart;

  res.cookie("cart", cart);

  // let product = await Product.findById(id);
  // // if(product)
  // //add check for counter and stock
  // let cart = [];
  // if (req.cookies.cart) {
  //   cart = req.cookies.cart;
  // }
  // cart.push({
  //   id: product._id,
  //   name: product.name,
  //   company: product.company,
  //   price: product.price,
  //   qty: req.params.qty,
  // });

  // res.cookie("cart", cart, { httpOnly: false });

  return res.send(cart);
});
router.post("/neworder", async (req, res) => {
  console.log(req.body.fname);
  console.log(req.body.lname);
  console.log(req.body.area);
  console.log(req.body.address1);
  console.log(req.body.address2);
  if (req.cookies.cart.length < 1) {
    return res.status(400).send("cartisempty");
  }
  console.log(req.cookies.cart);
  let cart = [];
  cart = req.cookies.cart;
  var order = {
    fname: req.body.fname,
    lname: req.body.lname,
    address: req.body.address1,
    phone: req.body.address2,
    cart,
  };
  return res.send("order");
});

io.on("connection", (socket) => {
  socket.on("message", (data) => {
    console.log(data);
    socket.broadcast.emit("client", data);
  });
});
http.listen(4001, () => {
  console.log("Listening on port 4001");
});

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