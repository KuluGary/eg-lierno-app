import { deleteTier, getTier, postTier, putTier } from "controllers/tier";
import connectDB from "middleware/mongodb";

const handler = async (req, res) => {
  switch (req.method) {
    case "GET":
      return getTier(req, res);
    case "POST":
      return postTier(req, res);
    case "PUT":
      return putTier(req, res);
    case "DELETE":
      return deleteTier(req, res);
    default:
      res.status(422).send("req_method_not_supported");
  }
};

export default connectDB(handler);
