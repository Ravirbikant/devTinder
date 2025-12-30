const validator = require("validator");

const validateSignUpData = (req) => {
  //Can keep validation function here too
  const { password } = req.body;

  if (!validator.isStrongPassword(password))
    throw new Error("Your password is not strong enough");
};

module.exports = { validateSignUpData };
