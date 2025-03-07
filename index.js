const cors = require("cors");
const helmet = require("helmet");
const xss = require("xss-clean");
const hpp = require("hpp");
const mongoSanitize = require("express-mongo-sanitize");
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
/****************************************************************************************************/
dotenv.config({ path: "./config.env" });
const port = process.env.PORT || 3000;
let app = express();

let DB = process.env.DATABASE.replace(
  "<db_password>",
  process.env.DATABASE_PASSWORD
);
DB = DB.replace("<db_username>", process.env.DATABASE_USERNAME);

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(xss());
app.use(hpp());

mongoose.connect(DB).then(() => {
  app.listen(port, async () => {
    console.log(`MongoDB connection succssful and listening to port: ${port} `);
    let dcount = await zipsusa.countDocuments();
    console.log("dcount", dcount);
  });
});
app.use(mongoSanitize());

app.use("/api/v2/check", checkrouter);
app.use("/api/v2/home", homerouter);
app.use("/api/v2/search", searchrouter);
app.use("/api/v2/qchat", qchatrouter);
app.use("/api/v2/zipscomments", zipscommentsrouter);
app.use((req, res, next) => {
  res.send("SERVER STARTED!!");
});
