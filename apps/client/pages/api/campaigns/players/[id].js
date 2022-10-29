import connectDB from "middleware/mongodb";

const { getCampaignPlayers } = require("controllers/campaign");

const handler = async (req, res) => {
  if (req.method === "GET") return getCampaignPlayers(req, res);

  res.status(422).send("req_method_not_supported");
};

export default connectDB(handler);
