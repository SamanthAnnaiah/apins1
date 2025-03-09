const cors = require("cors");
const helmet = require("helmet");
const xss = require("xss-clean");
const hpp = require("hpp");
const mongoSanitize = require("express-mongo-sanitize");
const { body, validationResult } = require("express-validator");
const express = require("express");
const mongoose = require("mongoose");
const { mongodb, MongoClient, ServerApiVersion } = require("mongodb");
const dotenv = require("dotenv");
const zipsusa = require("./models/zipsusamodel");
const homerouter = require("./routes/home");
const searchrouter = require("./routes/search");
const qchatrouter = require("./routes/qchat");
const checkrouter = require("./routes/check");
const zipscommentsrouter = require("./routes/zipscomments");
const compression = require("compression");
/****************************************************************************************************/
dotenv.config({ path: "./config.env" });
const port = process.env.PORT || 3000;
let app = express();

let DB = process.env.DATABASE.replace(
  "<db_password>",
  process.env.DATABASE_PASSWORD
);
DB = DB.replace("<db_username>", process.env.DATABASE_USERNAME);

app.use(express.json()); //middleware to parse json bodies in the request
app.use(cors()); //middleware to allow cross-origin requests
app.use(helmet()); //middleware to secure HTTP headers
app.use(xss()); //middleware to prevent XSS attacks, Cross-Site Scripting (XSS) attacks are a type of injection attack that allows an attacker to execute malicious JavaScript code in the user's browser.
app.use(hpp()); //middleware to prevent parameter pollution, Parameter Pollution attacks occur when an attacker manipulates the parameters of a request to alter the behavior of the application.
app.use(compression()); //middleware to compress responses
app.use(mongoSanitize()); //middleware to prevent MongoDB injection attacks, MongoDB injection attacks occur when an attacker manipulates the parameters of a request to alter the behavior of the application.

mongoose.connect(DB).then(() => {
  app.listen(port, async () => {
    console.log(`MongoDB connection succssful and listening to port: ${port} `);
    let dcount = await zipsusa.countDocuments();
    console.log("dcount", dcount);
  });
});

app.use("/api/v2/check", checkrouter);
app.use("/api/v2/home", homerouter);
app.use("/api/v2/search", searchrouter);
app.use("/api/v2/qchat", qchatrouter);
app.use("/api/v2/zipscomments", zipscommentsrouter);
app.use((req, res, next) => {
  res.send("SERVER STARTED!!");
});
