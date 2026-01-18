const express = require("express");
const userRouter = express();
const { userAuth } = require("../middlewares/admin.js");
const ConnectionRequestModel = require("../models/connectionRequest.js");

userRouter.get("/user/requests/interested", userAuth, async (req, res) => {
  try {
    const userId = req.user._id;

    const interestedRequests = await ConnectionRequestModel.find({
      toUserId: userId,
      connectionType: "interested",
    }).populate("fromUserId", "firstName lastName");

    res.send(interestedRequests);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error getting interested profiles : " + error });
  }
});

module.exports = { userRouter };
