const { SlashCommandBuilder } = require("@discordjs/builders");
const { DiceRoller } = require('@dice-roller/rpg-dice-roller');

module.exports = {
  data: new SlashCommandBuilder()
    .setName("roll")
    .setDescription("Rolls a dice in format YdX!")
    .addStringOption((option) => option.setName("dice").setDescription("Dice to roll (in format YdX)")),
  async execute(interaction) {
    const dice = interaction.options.getString("dice");
    const roller = new DiceRoller();
    
    roller.roll(dice);

    return interaction.reply(roller.output);
  },
};
