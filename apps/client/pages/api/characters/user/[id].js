import connectDB from "middleware/mongodb";
import Character from "models/character";
import { getToken } from "next-auth/jwt";

const handler = async (req, res) => {
  try {
    if (req.method === "GET") {
      const token = getToken({ req });

      if (token) {
        const userId = req.params.id;

        const characters = await Character.find({ createdBy: userId }, { name: 1, createdBy: 1 });

        res.status(200).json({ payload: characters });
      } else {
        res.status(401).json({ message: "Usuario sin autenticar." });
      }
    } else {
      res.status(422).send("req_method_not_supported");
    }
  } catch (error) {
    res.status(400).json({ message: error });
  }
};

export default connectDB(handler);
