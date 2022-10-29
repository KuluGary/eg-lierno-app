import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
    },
    password: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 6,
    },
    isActive: {
      type: Boolean,
      required: true,
      default: false,
    },
    metadata: {
      type: Object,
      required: false,
      unique: false,
    },
    role: {
      type: String,
      required: true,
      unique: false,
    },
    favorites: {
      type: Object,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;