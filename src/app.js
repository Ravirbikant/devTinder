const express = require("express");

const app = express();

const port = 3000;

app.get("/user", (req, res) => {
  try {
    throw new Error("Abcd error");
    res.send("User data");
  } catch (err) {
    res.status(500).send("Something went wrong");
  }
});

app.listen(port, () => {
  console.log("Server is running on port : ", port);
});
