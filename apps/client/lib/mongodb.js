import mongoose from "mongoose";

export async function connectToDB() {
  if (mongoose.connections[0].readyState) {
    return mongoose.connections[0];
  }

  return await mongoose.connect(process.env.MONGODB_URI);
}
