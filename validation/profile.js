const Validator = require("validator");
const isEmpty = require("./is-empty");
module.exports = data => {
  let errors = {};
  data.handle = !isEmpty(data.handle) ? data.handle : "";
  data.bio = !isEmpty(data.bio) ? data.bio : "";
  data.skills = !isEmpty(data.skills) ? data.skills : "";
  data.handle = !isEmpty(data.handle) ? data.handle : "";
  if (!Validator.isLength(data.handle, { min: 2, max: 40 })) {
    errors.handle = "Handle must be better 2 and 40 characters";
  }
  if (Validator.isEmpty(data.handle)) {
    errors.handle = "Profile handle is required";
  }
  if (!Validator.isLength(data.bio, { min: 30 })) {
    errors.bio = "Bio must be at least 30 characters in length";
  }
  if (Validator.isEmpty(data.bio)) {
    errors.bio = "Bio is required";
  }
  if (!isEmpty(data.website)) {
    if (!Validator.isURL(data.website)) {
      errors.website = "Not a valid URL";
    }
  }
  if (Validator.isEmpty(data.skills)) {
    errors.skills = "Skills field is required";
  }
  return { errors, isValid: isEmpty(errors) };
};
