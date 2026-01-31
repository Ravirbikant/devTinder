const express = require("express");
const connectDB = require("./config/database.js");
const cookieParser = require("cookie-parser");
const app = express();
const cors = require("cors");
const { authRouter } = require("./routes/auth.js");
const { profileRouter } = require("./routes/profile.js");
const { connectionRouter } = require("./routes/connection.js");
const { userRouter } = require("./routes/user.js");

const corsOption = {
  origin: "http://localhost:5173",
  credentials: true,
};

app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOption));

app.get("/health", (req, res) => {
  res.send("App is running.");
});

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", connectionRouter);
app.use("/", userRouter);

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
