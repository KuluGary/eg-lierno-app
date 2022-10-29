import { signUp } from "controllers/user";
import connectDB from "middleware/mongodb";

const handler = async (req, res) => {
  if (req.method === "POST") return signUp(req, res);

  res.status(422).send("req_method_not_supported");
};

export default connectDB(handler);
