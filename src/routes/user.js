const express = require("express");
const userRouter = express();
const { userAuth } = require("../middlewares/admin.js");
const ConnectionRequestModel = require("../models/connectionRequest.js");

const USER_SAFE_DATA = "firstName lastName";

userRouter.get("/user/requests/interested", userAuth, async (req, res) => {
  try {
    const userId = req.user._id;

    const interestedRequests = await ConnectionRequestModel.find({
      toUserId: userId,
      connectionType: "interested",
    }).populate("fromUserId", USER_SAFE_DATA);

    res.send(interestedRequests);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error getting interested profiles : " + error });
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const userId = req.user._id;

    const connections = await ConnectionRequestModel.find({
      $or: [
        { toUserId: userId, connectionType: "accepted" },
        { fromUserId: userId, connectionType: "rejected" },
      ],
    })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);

    const data = connections.map((connection) => {
      if (connection.fromUserId.equals(userId)) return data.toUserId;
      else return data.fromUserId;
    });

    res.json({ data });
  } catch (error) {
    res.status(400).json({ message: "Error getting connections: " + error });
  }
});
module.exports = { userRouter };
