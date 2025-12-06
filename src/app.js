const express = require("express");
const connectDB = require("./config/database.js");
const User = require("./models/user.js");
const app = express();

app.get("/health", (req, res) => {
  res.send("App is running.");
});

app.post("/user", async (req, res) => {
  const user = new User({
    firstName: "Ravi",
    lastName: "Kant Jha",
    emailId: "ravirbikant@gmail.com",
    password: "Abcd",
    age: "28",
    gender: "Male",
  });

  try {
    await user.save();
    res.send("New user added successfully");
  } catch (err) {
    res.status(400).send("User could not be added " + err);
  }
});

connectDB()
  .then(() => {
    console.log("Database connection established...");
    app.listen(3000, () => {
      console.log("Server is listening on port 3000");
    });
  })
  .catch((err) => {
    console.error("Database cannot be established : ", err);
  });
