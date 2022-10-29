import { getUser, postUser } from "controllers/user";
import connectDB from "middleware/mongodb";

const handler = async (req, res) => {
  switch (req.method) {
    case "GET":
      return getUser(req, res);
    case "POST":
      return postUser(req, res);
    default:
      res.status(422).send("req_method_not_supported");
  }
};

export default connectDB(handler);
