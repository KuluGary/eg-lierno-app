const Npc = require("../models/npc");
const Campaign = require("../models/campaign");

/**
 * Returns the wanted NPC from the database
 * @param {string} npcName name of the npc
 * @param {string} channelId id of the current channel
 * @returns {object} selected npc
 */
module.exports.getNpc = async (npcName, channelId) => {
  const campaign = await Campaign.findOne(
    { $or: [{ "discordData.main": channelId }, { "discordData.privadas": channelId }] },
    { _id: 1 }
  );

  if (!!campaign) {
    const npcs = await Npc.find({
      "flavor.campaign": { $elemMatch: { campaignId: campaign._id.toString() } },
    });

    const selectedNpc = npcs.find((npc) => npc.name === npcName);

    if (!!selectedNpc) return selectedNpc;
  }
};

/**
 * Gets the wanted NPC from the database
 * @param {string} npcId id of the wanted NPC
 * @returns {object} the npc object
 */
module.exports.getNpcById = async (npcId) => {
  const npc = await Npc.findById(npcId);

  return npc;
};
