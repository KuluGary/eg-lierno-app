import mongoose, { Schema } from "mongoose";
const TierSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: false,
      trim: false,
      minlength: 3,
    },
    type: {
      type: String,
      required: true,
      unique: false,
      trim: false,
    },
    createdBy: {
      type: String,
      required: true,
    },
  },
  { timestamp: true }
);

const Tier = mongoose.models.Tier || mongoose.model("Tier", TierSchema);

export default Tier;