const express = require("express");
const zipscommentsrouter = express.Router();
const {
  getzipscomments,
  postzipscomments,
  deletezipscomments,
} = require("../controllers/zipscommentscontroller");
console.log("zipscommentsrouter");
zipscommentsrouter
  .get("/", getzipscomments)
  .post("/", postzipscomments)
  .delete("/", deletezipscomments);

module.exports = zipscommentsrouter;
