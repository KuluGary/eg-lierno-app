import mongoose, { Schema } from "mongoose";

const ClassSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: false,
      trim: false,
      minlength: 3,
    },
    game: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    icon: {
      type: String,
    },
    data: {
      type: Object,
    },
    spellcasting: {
      type: Object,
    },
  },
  {
    timestamps: true,
  }
);

const Class = mongoose.models.Class || mongoose.model("Class", ClassSchema);

export default Class;
