const express = require("express");

const app = express();

app.use("/abc", (req, res) => {
  res.send("Abc route");
});

app.use("/xyz", (req, res) => {
  res.send("Xyz route");
});

app.use("/", (req, res) => {
  res.send("Default route");
});

app.listen(3000, () => {
  console.log("Server is listening using nodemon");
});
