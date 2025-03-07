const zipsusa = require("../models/zipsusamodel");

exports.homeLoad = async function () {
  let hdata = "";
  hdata = await zipsusa.find().sort({ pop: -1 }).limit(10);
  return hdata;
};
