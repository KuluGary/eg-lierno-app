const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const TurndownService = require("turndown");
const { getItem } = require("../db/controllers/item");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("item")
    .setDescription("Get info about an item")
    .addStringOption((option) => option.setName("item").setDescription("Item to show to an user.").setRequired(true))
    .addUserOption((option) => option.setName("user").setDescription("The user to send the info to").setRequired(true)),
  async execute(interaction, client) {
    const t = new TurndownService();
    const itemName = interaction.options.getString("item");
    const userInfo = interaction.options.getUser("user");
    const user = client?.users.cache.get(userInfo.id);

    const item = await getItem(itemName);

    if (!!item) {
      const embed = new MessageEmbed().setTitle(item.name).setDescription(t.turndown(item.description));

      if (!!item?.image?.small) embed.setThumbnail(item.image.small);

      user.send({ embeds: [embed] });

      return interaction.reply({
        content: `<@${user.id}>: tiene un mensaje con la información de ${item.name}`,
        ephemeral: true,
      });
    }

    return interaction.user.send("No se ha podido enviar el mensaje.");
  },
};
