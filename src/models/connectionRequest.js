const mongoose = require("mongoose");
const { Schema } = mongoose;

const connectionRequestSchema = new Schema(
  {
    fromUserId: {
      type: mongoose.ObjectId,
      required: true,
    },
    toUserId: {
      type: mongoose.ObjectId,
      required: true,
    },
    connectionType: {
      type: String,
      enum: ["interested", "pass", "accepted", "rejected"],
      required: true,
    },
  },
  { timestamps: true }
);

connectionRequestSchema.pre("save", function (next) {
  const connectionRequest = this;
  if (connectionRequest.fromUserId.equals(connectionRequest.toUserId))
    throw new Error("Cannot send request to yourself");
  next();
});

const ConnectionRequestModel = mongoose.model(
  "ConnectionRequestModel",
  connectionRequestSchema
);

module.exports = ConnectionRequestModel;
