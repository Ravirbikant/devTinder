const express = require("express");
const profileRouter = express();
const { userAuth } = require("../middlewares/admin.js");

profileRouter.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send("Error getting profile : " + err);
  }
});

profileRouter.patch("/user/:userId", async (req, res) => {
  const userId = req.params?.userId;
  const userData = req.body;

  const ALLOWED_UPDATES = ["age", "skills"];
  try {
    const isUpdateAllowed = Object.keys(userData).every((key) =>
      ALLOWED_UPDATES.includes(key)
    );

    if (!isUpdateAllowed)
      throw new Error("Keys that cannot be updated are present in the request");

    if (userData.skills.length > 10)
      throw new Error("Skills cannot be more than 10");

    const user = await User.findByIdAndUpdate(userId, userData, {
      runValidators: true,
    });
    console.log(user);
    res.send("User data updated successfully");
  } catch (err) {
    res.status(400).send("Something went wrong : " + err);
  }
});

module.exports = { profileRouter };
