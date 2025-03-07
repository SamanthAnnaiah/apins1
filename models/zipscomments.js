const { default: mongoose } = require("mongoose");

const zipscommentsschema = mongoose.Schema(
  {
    zipcode: { type: Number, required: true, trim: true },
    comment: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      minlength: 1,
    },
  },
  {
    strict: false,
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const zipscomments = mongoose.model(
  "zipscomments",
  zipscommentsschema,
  "zipscomments"
);
module.exports = zipscomments;
