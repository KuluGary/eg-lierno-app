import { getCampaignMonsters } from "controllers/monster";
import connectDB from "middleware/mongodb";

const handler = async (req, res) => {
  if (req.method === "GET") return getCampaignMonsters(req, res);

  res.status(422).send("req_method_not_supported");
};

export default connectDB(handler);
