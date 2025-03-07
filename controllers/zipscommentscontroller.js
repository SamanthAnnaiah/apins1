const zipscomments = require("../models/zipscomments");
const { qchatcheck } = require("./qchatcontroller");

exports.getzipscomments = async (req, res) => {
  const zipcode = req.query.zipcode;
  try {
    const zipscomments1 = await zipscomments
      .find({ zipcode: zipcode })
      .sort({ createdAt: -1 })
      .limit(20);
    if (!zipscomments1) {
      return res.status(200).json({
        success: "none",
        message: "No comments found",
      });
    }
    res.status(200).json({
      success: true,
      zipscomments1,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

exports.postzipscomments = async (req, res) => {
  try {
    const { zipcode } = req.body;
    let { comment } = req.body;

    if (!zipcode || !comment) {
      return res.status(400).json({
        success: false,
        error: "Zipcode and comment are required",
      });
    }

    comment = await qchatcheck(comment);
    console.log("MY comment", comment);

    if (!comment) {
      return res.status(400).json({
        success: false,
        error: "Invalid comment",
      });
    }

    const zipscomments1 = await zipscomments.create({ zipcode, comment });
    res.status(201).json({
      success: true,
      zipscomments1,
    });
  } catch (error) {
    console.error("Error in postzipscomments:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

exports.deletezipscomments = async (req, res) => {
  const id = req.query.id;
  try {
    const zipscomments1 = await zipscomments.findByIdAndDelete(id);
    console.log(typeof id);
    console.log("zipscomments1 at delete", zipscomments1);
    res.status(200).json({
      success: true,
      zipscomments1,
    });
  } catch (error) {
    console.log("zipscomments1 at delete error", zipscomments1);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
