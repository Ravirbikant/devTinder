const express = require("express");
const userRouter = express();
const { userAuth } = require("../middlewares/admin.js");
const ConnectionRequestModel = require("../models/connectionRequest.js");
const User = require("../models/user.js");

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

userRouter.get("/user/feed", userAuth, async (req, res) => {
  try {
    const userId = req.user._id;

    const connectionRequests = await ConnectionRequestModel.find({
      $or: [{ fromUserId: userId }, { toUserId: userId }],
    }).select("fromUserId toUserId");

    const hiddenUsersFromFeed = new Set();

    connectionRequests.forEach((req) => {
      hiddenUsersFromFeed.add(req.fromUserId);
      hiddenUsersFromFeed.add(req.toUserId);
    });

    const feedUsers = await User.find({
      _id: { $nin: Array.from(hiddenUsersFromFeed) },
    }).select(USER_SAFE_DATA);

    console.log(feedUsers);
    res.json({ message: "Feed fetched sucessfully : ", feedUsers });
  } catch (err) {
    res.status(400).json({ message: "Error getting feed : " + error });
  }
});

module.exports = { userRouter };
