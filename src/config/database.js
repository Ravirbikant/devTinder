const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://oreoravi:oreoravilearnsnodejs@cluster0.h6otusy.mongodb.net/devTinder"
  );
};

module.exports = connectDB;
