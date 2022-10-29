import { deleteCampaign, getCampaign, postCampaign, putCampaign } from "controllers/campaign";
import connectDB from "middleware/mongodb";

const handler = async (req, res) => {
  switch (req.method) {
    case "GET":
      return getCampaign(req, res);
    case "POST":
      return postCampaign(req, res);
    case "PUT":
      return putCampaign(req, res);
    case "DELETE":
      return deleteCampaign(req, res);
    default:
      res.status(422).send("req_method_not_supported");
  }
};

export default connectDB(handler);
