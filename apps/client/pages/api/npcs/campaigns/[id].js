import { getCampaignNpcs } from "controllers/npc";
import connectDB from "middleware/mongodb";

const handler = async (req, res) => {
  if (req.method === "GET") return getCampaignNpcs(req, res);

  res.status(422).send("req_method_not_supported");
};

export default connectDB(handler);
