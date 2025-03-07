const express = require("express");
const { qchatcontroller } = require("../controllers/qchatcontroller");
const qchatrouter = express.Router();

qchatrouter.post("/", qchatcontroller);

module.exports = qchatrouter;
