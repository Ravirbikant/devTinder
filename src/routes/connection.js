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

      const isConnectionAlreadyPresent = await ConnectionRequestModel.findOne({
        $or: [
          { fromUserId: currentUserId, toUserId: userId },
          { fromUserId: userId, toUserId: currentUserId },
        ],
      });

      if (isConnectionAlreadyPresent)
        throw new Error("Connection request already exists");

      const connectionRequest = new ConnectionRequestModel({
        fromUserId: currentUserId,
        toUserId: userId,
        connectionType: status,
      });

      await connectionRequest.save();

      res.json({ message: "Connection request sent successfully" });
    } catch (err) {
      console.log(err);
      res
        .status(400)
        .json({ message: "Error sending connection request : " + err });
    }
  }
);

connectionRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const { status, requestId } = req.params;
      const ALLOWED_STATUS = ["accepted", "rejected"];

      if (!ALLOWED_STATUS.includes(status)) throw new Error("Invalid status");

      const connectionRequest = await ConnectionRequestModel.findOne({
        _id: requestId,
      });
      if (!connectionRequest) throw new Error("No connection request found");
      if (connectionRequest.connectionType !== "interested")
        throw new Error("No request found");
      if (!connectionRequest.toUserId.equals(req.user._id))
        throw new Error("Incorrect User");

      connectionRequest.connectionType = status;
      const data = await connectionRequest.save();

      res.json({ message: "Connection request " + status, data });
    } catch (err) {
      console.log(err);
      res
        .status(400)
        .json({ message: "Error reviewing connection request : " + err });
    }
  }
);

module.exports = { connectionRouter };
