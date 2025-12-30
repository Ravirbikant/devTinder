const express = require("express");
const connectDB = require("./config/database.js");
const User = require("./models/user.js");
const app = express();

app.use(express.json());

app.get("/health", (req, res) => {
  res.send("App is running.");
});

app.get("/user", async (req, res) => {
  const emailId = req.body.emailId;

  try {
    const user = await User.find({ emailId: emailId });

    if (user.length === 0) res.status(404).send("User not found");
    else res.send(user);
  } catch (err) {
    res.status(400).send("Something went wrong " + err);
  }
});

app.get("/feed", async (req, res) => {
  console.log("Request recieved");
  try {
    const users = await User.find({});

    if (users.length === 0) res.status(404).send("No user found");
    else res.send(users);
  } catch (err) {
    res.status(400).send("Something went wrong " + err);
  }
});

app.post("/signup", async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    res.send("New user added successfully");
  } catch (err) {
    res.status(400).send("User could not be added " + err);
  }
});

app.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  try {
    await User.findByIdAndDelete({ _id: userId });
    res.send("User deleted successfully");
  } catch (err) {
    res.status(400).send("Something went wrong : " + err);
  }
});

app.patch("/user", async (req, res) => {
  const userId = req.body.userId;
  const userData = req.body;

  try {
    const user = await User.findByIdAndUpdate(userId, userData);
    console.log(user);
    res.send("User data updated successfully");
  } catch (err) {
    res.status(400).send("Something went wrong : " + err);
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
