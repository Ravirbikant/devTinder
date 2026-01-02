const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const SPECIAL_KEY = "DEV@Tinder$790";
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email address : " + value);
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Your password is not strong : " + value);
        }
      },
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
      validate: function (value) {
        if (!["male", "female", "others"].includes(value)) {
          throw new Error("Value can either be male, female or others only.");
        }
      },
    },
    skills: {
      type: [String],
      default: ["cricket"],
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.getJWT = async function () {
  const token = await jwt.sign({ _id: this._id }, SPECIAL_KEY, {
    expiresIn: "1h",
  });

  return token;
};

userSchema.methods.isPasswordCorrect = async function (passwordEnteredByUser) {
  const isPasswordValid = await bcrypt.compare(
    passwordEnteredByUser,
    this.password
  );

  return isPasswordValid;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
