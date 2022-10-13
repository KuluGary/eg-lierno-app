const mongoose = require("mongoose");
const { Schema } = mongoose;

const MonsterSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: false,
      trim: false,
      minlength: 3,
    },
    flavor: {
      type: Object,
      required: true,
    },
    stats: {
      type: Object,
      required: true,
    },
    createdBy: {
      type: String,
      required: true,
      unique: false,
      trim: false,
      minlength: 3,
    },
  },
  {
    timestamps: true,
  }
);

const Monster = mongoose.model("Monster", MonsterSchema);

module.exports = Monster;
