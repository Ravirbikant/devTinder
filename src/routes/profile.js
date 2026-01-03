const express = require("express");
const profileRouter = express();
const { userAuth } = require("../middlewares/admin.js");
const { validateEditProfileData } = require("../utils/validation.js");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send("Error getting profile : " + err);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    validateEditProfileData(req);
    const editUserData = req.user;

    Object.keys(req.body).map((key) => {
      console.log(key, req.body[key]);
      editUserData[key] = req.body[key];
    });

    await editUserData.save();

    res.send({ message: "User updated successfully", editUserData });
  } catch (err) {
    res.status(400).send("Invalid edit operation : " + err);
  }
});

module.exports = { profileRouter };
