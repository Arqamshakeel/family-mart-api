var createError = require("http-errors");
var express = require("express");
var app = express();
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var config = require("config");
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var products = require("./routes/products");
var bodyParser = require("body-parser");
app.use(bodyParser.json({ limit: "900mb" }));
var cors = require("cors");
const corsOptions = {
  //these are the headres allowed
  allowedHeaders: [
    "Origin",
    "X-Requested-With",
    "Content-Type",
    "Accept",
    "X-Access-Token",
    "Authorization",
    "x-auth-token", //this header is sent by react if user is logged in
  ],
  credentials: true,
  methods: "GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE",
  //origin: "http://ec2-18-224-94-239.us-east-2.compute.amazonaws.com",
  origin: "http://localhost:3000",
  preflightContinue: false,
};
app.use(cors(corsOptions));
//var session = require("express-session");
//app.set("trust proxy", 1); // trust first proxy

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/api/users", usersRouter);
app.use("/api/products", products);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});
app.use(function (req, res, next) {
  res.header(
    "Access-Control-Allow-Origin",
    "http://ec2-18-224-94-239.us-east-2.compute.amazonaws.com"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
// app.use(function (req, res, next) {
//   res.header("Access-Control-Allow-Credentials: false");
//   // res.header(
//   //   "Access-Control-Allow-Headers",
//   //   "Origin, X-Requested-With, Content-Type, Accept"
//   // );
//   // res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE, PUT");
//   next();
// });

// app.use(function (req, res, next) {
//   //res.header("Access-Control-Allow-Credentials: http://localhost:3000");
//   // res.header("Content-Type", "application/json;charset=UTF-8");
//   // res.header("Access-Control-Allow-Credentials", true);
//   // res.header(
//   //   "Access-Control-Allow-Headers",
//   //   "Origin, X-Requested-With, Content-Type, Accept"
//   // );
//   next();
// });
// app.use((req, res, next) => {
//   res.header(
//     "Access-Control-Allow-Origin:https://www.google.com/webhp?hl=en&sa=X&ved=0ahUKEwi2jqapkYzrAhXVA2MBHVV_CFQQPAgH"
//   );
//   next();
// });
// error handler
// app.use(function (req, res, next) {
//   res.header("Content-Type", "application/json;charset=UTF-8");
//   res.header("Access-Control-Allow-Credentials", true);
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept"
//   );
//   next();
// });
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});
//mongodb+srv://arqam:arqam@mern1-siiuo.mongodb.net/FamilyMart?retryWrites=true&w=majority
mongoose
  .connect("mongodb://localhost/FamilyMart", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to mongoDB");
  })
  .catch((err) => {
    console.log(err);
    console.log("ERROR. In catch block of mongoose connection.");
  });

module.exports = app;
