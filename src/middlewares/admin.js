const jwt = require("jsonwebtoken");
const SPECIAL_KEY = "DEV@Tinder$790";
const User = require("../models/user.js");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) throw new Error("No token found");

    const { _id } = jwt.verify(token, SPECIAL_KEY);
    const user = await User.findById(_id);

    if (!user) throw new Error("No user found");

    req.user = user;
    next();
  } catch (err) {
    res.status(401).send("Error : " + err);
  }
};

module.exports = { userAuth };
