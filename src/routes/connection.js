const express = require("express");
const connectionRouter = express();
const ConnectionRequestModel = require("../models/connectionRequest.js");
const User = require("../models/user.js");
const { userAuth } = require("../middlewares/admin.js");

connectionRouter.post(
  "/request/send/:status/:userId",
  userAuth,
  async (req, res) => {
    try {
      const { status, userId } = req.params;
      const user = await User.findById(userId);
      const currentUserId = req.user._id;

      if (!user) throw new Error("User not found");

      const connectionRequest = new ConnectionRequestModel({
        fromUserId: currentUserId,
        toUserId: userId,
        connectionType: status,
      });

      await connectionRequest.save();

      res.json({ message: "Connection request sent successfully" });
    } catch (err) {
      res
        .status(400)
        .json({ message: "Error sending connection request : " + err });
    }
  }
);

module.exports = { connectionRouter };
