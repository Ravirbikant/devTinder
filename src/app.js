const express = require("express");

const app = express();
const { adminAuth } = require("./middlewares/admin");

app.use("/admin", adminAuth);

app.get("/admin/details", (req, res, next) => {
  res.send("Admin details data");
});

app.listen("3000", () => {
  console.log("Server is listening on port 3000");
});
