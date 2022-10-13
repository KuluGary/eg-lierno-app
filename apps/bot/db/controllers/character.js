const Character = require("../models/character");
const User = require("../models/user");
const Campaign = require("../models/campaign");
const { isUserDm } = require("./user");
const { getDmKey } = require("./redis");
const { getNpcById } = require("./npc");

/**
 * Returns the character for the current user on the
 * current character
 * @param {string} userId id of the user
 * @param {string} channelId id of the channel
 * @returns {object | null} the character object if exists
 */
module.exports.getCurrentCharacter = async (userId, channelId) => {
  const isDm = await isUserDm(userId, channelId);

  if (isDm) {
    const npcId = await getDmKey(userId, channelId);
    const npc = await getNpcById(npcId);

    if (!!npc) return npc;
  }

  const user = await User.findOne({ "metadata.discordId": userId, channelId }, { _id: 1 });

  if (!!user) {
    const campaign = await Campaign.findOne(
      { $or: [{ "discordData.main": channelId }, { "discordData.privadas": channelId }] },
      { characters: 1 }
    );

    if (!!campaign) {
      const character = await Character.findOne({
        $and: [{ _id: { $in: campaign.characters } }, { createdBy: user._id.toString() }],
      });

      if (!!character) return character;
    }
  }

  return null;
};
