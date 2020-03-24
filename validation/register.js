const Validator = require("validator");
const isEmpty = require("./is-empty");
module.exports = (data) => {
  let errors = {};

  data.first_name = !isEmpty(data.first_name) ? data.first_name : "";
  data.last_name = !isEmpty(data.last_name) ? data.last_name : "";
  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";
  data.password_conf = !isEmpty(data.password_conf) ? data.password_conf : "";
  if (!Validator.isLength(data.first_name, { min: 2, max: 20 })) {
    errors.first_name = "First name must be between 2 and 20 characters";
  }
  if (!Validator.isLength(data.last_name, { min: 2, max: 20 })) {
    errors.first_name = "First name must be between 2 and 20 characters";
  }
  if (!Validator.isLength(data.password, { min: 6, max: 100 })) {
    errors.password = "Password must be at least 6 characters long";
  }
  if (!Validator.isEmail(data.email)){
      errors.email = 'Email is not valid';
  }
  if(!Validator.equals(data.password, data.password_conf)){
      errors.password_conf = "Passwords must match";
  }
  if (Validator.isEmpty(data.first_name)) {
    errors.first_name = "First name is required";
  }
  if (Validator.isEmpty(data.last_name)) {
    errors.last_name = "Last name is required";
  }
  if (Validator.isEmpty(data.email)) {
    errors.email = "Email address is required";
  }
  if (Validator.isEmpty(data.password)) {
    errors.password = "Password is required";
  }
  if (Validator.isEmpty(data.password_conf)) {
    errors.password_conf = "Password confirmation is required";
  }
  return { errors, isValid: isEmpty(errors) };
};
