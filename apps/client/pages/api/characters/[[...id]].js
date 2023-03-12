import { deleteCharacter, getCharacters, postCharacter, putCharacter } from "controllers/character";
import connectDB from "middleware/mongodb";

const handler = async (req, res) => {
  switch (req.method) {
    case "GET":
      return getCharacters(req, res);
    case "POST":
      return postCharacter(req, res);
    case "PUT":
      return putCharacter(req, res);
    case "DELETE":
      return deleteCharacter(req, res);
    default:
      return res.status(422).send("req_method_not_supported");
  }
};

export default connectDB(handler);
