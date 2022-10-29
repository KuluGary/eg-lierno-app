import { postImage } from "controllers/image";
import connectDB from "middleware/mongodb";

export const config = {
  api: {
    bodyParser: false,
  },
};

const handler = async (req, res) => {
  if (req.method === "POST") return postImage(req, res);

  res.status(422).send("req_method_not_supported");
};

export default connectDB(handler);
