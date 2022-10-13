const { SlashCommandBuilder } = require("@discordjs/builders");
const { isUserDm } = require("../db/controllers/user");
const { getNpc } = require("../db/controllers/npc");
const { setDmKey } = require("../db/controllers/redis");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("switch")
    .setDescription("Switch to the desired NPC.")
    .addStringOption((option) => option.setName("name").setDescription("Name of the NPC").setRequired(true)),
  async execute(interaction) {
    const isDm = await isUserDm(interaction.user.id, interaction.channelId);
    const name = interaction.options.getString("name");

    if (!isDm) return interaction.reply("Solo el DM puede cambiar a un NPC.");

    const selectedNpc = await getNpc(name, interaction.channelId);

    setDmKey(interaction, selectedNpc._id.toString());

    return interaction.reply(name);
  },
};
