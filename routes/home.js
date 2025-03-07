let express = require("express");
const { homeLoad } = require("../controllers/homecontroller");
let homerouter = express.Router();

homerouter.route("/").get(async (req, res) => {
  let hdata = await homeLoad();
  console.log("hdata", hdata);
  res.json(hdata);
});

module.exports = homerouter;
