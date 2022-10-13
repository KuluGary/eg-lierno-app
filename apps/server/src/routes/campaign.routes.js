const router = require("express").Router();
const {
  getCampaigns,
  postCampaigns,
  putCampaigns,
  sendActivationToPlayers,
  activatePlayer,
  getCampaignCharacters,
} = require("../controllers/campaign");

router.get("/campaigns/:id?", getCampaigns);

router.post("/campaigns", postCampaigns);

router.put("/campaigns/:id", putCampaigns);

router.post("/campaigns/:id/send-activation/:email", sendActivationToPlayers);

router.get("/campaigns/activate-player/:token", activatePlayer);

module.exports = router;
