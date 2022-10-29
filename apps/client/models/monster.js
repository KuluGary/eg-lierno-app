import mongoose, { Schema } from "mongoose";

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

const Monster = mongoose.models.Monster || mongoose.model("Monster", MonsterSchema);

export default Monster;
