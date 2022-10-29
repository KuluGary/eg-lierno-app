import mongoose, { Schema } from "mongoose";

const NpcSchema = new Schema(
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

const Npc = mongoose.models.Npc || mongoose.model("Npc", NpcSchema);

export default Npc;
