const mongoose = require("mongoose");
const { Schema } = mongoose;

const connectionRequestSchema = new Schema(
  {
    from: {
      type: mongoose.ObjectId,
      required: true,
    },
    to: {
      type: mongoose.ObjectId,
      required: true,
    },
    connectionType: {
      type: String,
      enum: ["interested, pass, accepted, rejected"],
      message: `{VALUE} is not accepted connection type`,
      required: true,
    },
  },
  { timestamps: true }
);

const ConnectionRequestModel = mongoose.model(
  "ConnectionRequestModel",
  connectionRequestSchema
);

module.exports = ConnectionRequestModel;
