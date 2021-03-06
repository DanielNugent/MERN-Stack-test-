const Validator = require("validator");
const isEmpty = require("./is-empty");
module.exports = (data) => {
  let errors = {};
  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";
  if (!Validator.isLength(data.password, { min: 6, max: 100 })) {
    errors.password = "Password must be at least 6 characters long";
  }
  if (!Validator.isEmail(data.email)){
      errors.email = 'Email is not valid';
  }
  if (Validator.isEmpty(data.email)) {
    errors.email = "Email address is required";
  }
  if (Validator.isEmpty(data.password)) {
    errors.password = "Password is required";
  }
  return { errors, isValid: isEmpty(errors) };
};
