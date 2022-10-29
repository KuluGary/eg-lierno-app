import { getItems, postItem } from "controllers/item";
import connectDB from "middleware/mongodb";

const handler = async (req, res) => {
  switch (req.method) {
    case "GET":
      return getItems(req, res);
    case "POST":
      return postItem(req, res);
    default:
      res.status(422).send("req_method_not_supported");
  }
};

export default connectDB(handler);
