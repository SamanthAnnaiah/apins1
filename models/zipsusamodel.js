const mongoose = require("mongoose");
const zipsusaschema = mongoose.Schema(
  {
    city: {
      type: String,
      unique: false,
      required: true,
      trim: true,
      minlength: [2, "city must be at least 3 characters"],
      maxlength: [60, "city must not exceed 20 characters"],
    },
    loc: {
      type: [],
      unique: false,
    },
    pop: {
      type: Number,
      unique: false,
    },
    state: {
      type: String,
      unique: false,
      maxlength: [2, "state code must not exceed 2 characters"],
    },
    cpin: {
      type: Number,
      unique: false,
    },
  },
  {
    strict: false,
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const zipsusa = mongoose.model("zipsusa", zipsusaschema, "zipsusa");
module.exports = zipsusa;
