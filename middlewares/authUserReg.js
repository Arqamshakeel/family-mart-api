var { validateUser } = require("../mongooseModels/model.users");

function validateUserRegMW(req, res, next) {
  console.log("In validate");
  let user = validateUser(req.body);
  console.log(user);
  if (user.error) {
    let test = "";
    for (let i = 0; i < user.error.details.length; i++) {
      test = test + user.error.details[i].message;
      test = test + " ";
    }
    return res.status(400).send(test);
  }
  next();
}
module.exports = validateUserRegMW;
