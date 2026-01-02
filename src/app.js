const express = require("express");
const bcrypt = require("bcrypt");
const { validateSignUpData } = require("./utils/validation.js");
const connectDB = require("./config/database.js");
const User = require("./models/user.js");
const app = express();
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const SPECIAL_KEY = "DEV@Tinder$790";
const { userAuth } = require("./middlewares/admin.js");

app.use(express.json());
app.use(cookieParser());

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
  try {
    const users = await User.find({});

    if (users.length === 0) res.status(404).send("No user found");
    else res.send(users);
  } catch (err) {
    res.status(400).send("Something went wrong " + err);
  }
});

app.post("/signup", async (req, res) => {
  try {
    validateSignUpData(req);
    const { firstName, lastName, password, emailId, age } = req.body;
    const hashPassword = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      password: hashPassword,
      emailId,
      age,
    });
    await user.save();
    res.send("New user added successfully");
  } catch (err) {
    res.status(400).send("User could not be added " + err);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId });

    if (!user) throw new Error("Invalid credentials");

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) throw new Error("Invalid credentials");

    const token = await jwt.sign({ _id: user._id }, SPECIAL_KEY, {
      expiresIn: "1h",
    });

    res.cookie("token", token, {
      expires: new Date(Date.now() + 8 * 3600000),
    });

    res.send("Login successful");
  } catch (error) {
    res.status(400).send("Error : " + error);
  }
});

app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send("Error getting profile : " + err);
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

app.patch("/user/:userId", async (req, res) => {
  const userId = req.params?.userId;
  const userData = req.body;

  const ALLOWED_UPDATES = ["age", "skills"];
  try {
    const isUpdateAllowed = Object.keys(userData).every((key) =>
      ALLOWED_UPDATES.includes(key)
    );

    if (!isUpdateAllowed)
      throw new Error("Keys that cannot be updated are present in the request");

    if (userData.skills.length > 10)
      throw new Error("Skills cannot be more than 10");

    const user = await User.findByIdAndUpdate(userId, userData, {
      runValidators: true,
    });
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
