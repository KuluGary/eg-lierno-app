import { activateUser } from "controllers/user";
import connectDB from "middleware/mongodb";

const handler = async (req, res) => {
  console.log("got here");
  return activateUser(req, res);
};

export default connectDB(handler);
