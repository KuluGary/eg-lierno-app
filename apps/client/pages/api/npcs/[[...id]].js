import { deleteNpc, getNpcs, postNpc, putNpc } from "controllers/npc";
import connectDB from "middleware/mongodb";

const handler = async (req, res) => {
  switch (req.method) {
    case "GET":
      return getNpcs(req, res);
    case "POST":
      return postNpc(req, res);
    case "PUT":
      return putNpc(req, res);
    case "DELETE":
      return deleteNpc(req, res);
    default:
      res.status(422).send("req_method_not_supported");
  }
};

export default connectDB(handler);
