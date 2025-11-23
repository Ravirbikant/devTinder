const express = require("express");

const app = express();

app.use((req, res) => {
  res.send("Hello from the server using nodemon.");
});

app.listen(3000, () => {
  console.log("Server is listening using nodemon");
});
