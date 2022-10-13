const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("test")
    .setDescription("Command for testing purposes")
    .addStringOption((option) => {
      return option.setName("mode").setDescription("Dice to roll (in format YdX)");
    }),
  async execute(interaction) {
    return interaction.reply(`Testing stuff! 🤖`);
  },
};
