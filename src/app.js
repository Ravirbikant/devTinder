const express = require("express");

const app = express();

app.use(
  "/user",
  (req, res, next) => {
    console.log("Inside first");
    // res.send("Handler 1");
    next();
  },
  (req, res) => {
    console.log("Inside second");
    res.send("Handler 2");
  }
);

app.listen("3000", () => {
  console.log("Server is listening on port 3000");
});
