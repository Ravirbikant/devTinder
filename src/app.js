const express = require("express");

const app = express();

app.get("/user", (req, res) => {
  res.send({ firstName: "Oreo", lastName: "Sunfeast" });
});

app.post("/user", (req, res) => {
  res.send("User added successfully");
});

app.delete("/user", (req, res) => {
  res.send("User deleted successfully");
});

app.use("/", (req, res) => {
  res.send("Default route");
});

app.listen(3000, () => {
  console.log("Server is listening using nodemon");
});
