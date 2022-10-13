const redisClient = require("../redis");

module.exports.setDmKey = async (interaction, id) => {
  const key = `${interaction.user.id}-${interaction.channelId}`;
  const value = id;

  await redisClient.set(key, value);
};

module.exports.getDmKey = async (userId, channelId) => {
  const key = `${userId}-${channelId}`;
  const value = await redisClient.get(key);

  return value;
};
