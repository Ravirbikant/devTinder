const express = require("express");
const connectionRouter = express();
const ConnectionRequestModel = require("../models/connectionRequest.js");
const User = require("../models/user.js");

connectionRouter.post("/request/send/:status/:userId", async (req, res) => {
  try {
    const { status, userId } = req.params;
    const user = await User.findById(userId);

    if (!user) throw new Error("User not found");

    res.json({ message: "Connection request sent successfully" });
  } catch (err) {
    res
      .status(400)
      .json({ message: "Error sending connection request : " + err });
  }
});

module.exports = { connectionRouter };
