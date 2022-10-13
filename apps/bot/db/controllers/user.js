const Campaign = require("../models/campaign");
const User = require("../models/user");

/**
 * Checks if the user is a DM
 * @param {string} userId id of the user
 * @param {string} channelId id of the channel
 * @returns {boolean}
 */
module.exports.isUserDm = async (userId, channelId) => {
  const campaign = await Campaign.findOne({
    $or: [{ "discordData.main": channelId }, { "discordData.privadas": channelId }],
  });

  const user = await User.findOne({ "metadata.discordId": userId });
  if (!!user && !!campaign) {
    return user._id.toString() === campaign.dm;
  }

  return false;
};
