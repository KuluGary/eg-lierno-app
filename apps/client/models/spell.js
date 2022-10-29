import mongoose, { Schema } from "mongoose";

const spellSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
    },
    stats: {
      type: Object,
      required: true,
      unique: false,
    },
    createdBy: {
      type: String,
      required: true,
      unique: false,
      trim: false,
      minlength: 3,
    },
    public: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Spell = mongoose.models.Spell || mongoose.model("Spell", spellSchema);

export default Spell;
