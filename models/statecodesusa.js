const { default: mongoose } = require("mongoose");

const statecodeusaschema = mongoose.Schema(
  {
    state_name: {
      type: String,
      required: true,
      unique: true,
    },
    state_code: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    strict: false,
  }
);

const statecodesusa = mongoose.model(
  "statecodesusa",
  statecodeusaschema,
  "statecodesusa"
);
module.exports = statecodesusa;
