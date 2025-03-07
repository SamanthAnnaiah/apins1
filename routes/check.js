let express = require("express");
let checkrouter = express.Router();

checkrouter.get("/", (req, res) => {
  res.send("API is working");
});

module.exports = checkrouter;
