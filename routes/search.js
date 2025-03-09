let express = require("express");
const { searchLoad1 } = require("../controllers/searchcontroller");
let searchrouter = express.Router();

searchrouter.route("/").post(async (req, res) => {
  try {
    const result = await searchLoad1(req.body.searchpin);
    console.log("search result:", result);
    console.log("req.body.searchpin", req.body.searchpin);
    if (result.success) {
      res.json({ error: "none", result: result.data });
    } else {
      console.log(result.data);
      res.status(404).json({ error: result.error });
    }
  } catch (error) {
    console.error("Unexpected error in search route:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = searchrouter;
