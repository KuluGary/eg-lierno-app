import { getSpell, postSpell } from "controllers/spell";
import connectDB from "middleware/mongodb";

const handler = async (req, res) => {
  switch (req.method) {
    case "GET":
      return getSpell(req, res);
    case "POST":
      return postSpell(req, res);
    case "PUT":
    case "DELETE":
    default:
      res.status(422).send("req_method_not_supported");
  }
};

export default connectDB(handler);
