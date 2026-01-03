const validator = require("validator");

const validateSignUpData = (req) => {
  //Can keep validation function here too
  const { password } = req.body;

  if (!validator.isStrongPassword(password))
    throw new Error("Your password is not strong enough");
};

const validateEditProfileData = (req) => {
  const ALLOWED_UPDATE_FIELDS = ["lastName", "age", "about", "skills"];

  const isUpdateAllowed = Object.keys(req.body).every((field) =>
    ALLOWED_UPDATE_FIELDS.includes(field)
  );

  if (!isUpdateAllowed) throw new Error("Request contains uneditable fields");
  if (req.body.skills.length > 5)
    throw new Error("Skills cannot be more than 5");
};

module.exports = { validateSignUpData, validateEditProfileData };
