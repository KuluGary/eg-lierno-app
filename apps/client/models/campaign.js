import mongoose, { Schema } from "mongoose";
// const mongoose = require('mongoose');
// const { Schema } = mongoose;

const CampaignSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: false,
      trim: false,
      minlength: 3,
    },
    players: {
      type: Array,
      required: false,
      unique: false,
    },
    characters: {
      type: Array,
      required: false,
      unique: false,
    },
    dm: {
      type: String,
      required: true,
      unique: false,
    },
    completed: {
      type: Boolean,
      required: true,
      unique: false,
    },
    flavor: {
      type: Object,
      required: false,
      unique: false,
    },
    discordData: {
      type: Object,
    },
  },
  {
    timestamps: true,
  }
);

const Campaign = mongoose.models.Campaign || mongoose.model("Campaign", CampaignSchema);

export default Campaign;
