const { SlashCommandBuilder } = require("@discordjs/builders");
const { DiceRoller } = require("@dice-roller/rpg-dice-roller");
const { stats } = require("../assets/json/customizable_stats.json");
const { getCurrentCharacter } = require("../db/controllers/character");
const { getModifier, getProficiencyBonus } = require("@lierno/dnd-helpers");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("saving")
    .setDescription("Rolls a saving throw for your current character!")
    .addStringOption((option) =>
      option
        .setName("saving")
        .setDescription("Skill to roll a check for")
        .addChoices(Object.entries(stats).map(([key, { name }]) => [name, key]))
        .setRequired(true)
    ),
  async execute(interaction) {
    const savingThrowName = interaction.options.getString("saving");
    const character = await getCurrentCharacter(interaction.user.id, interaction.channelId);

    if (!!character) {
      const selectedSavingThrow = character.stats.savingThrows[savingThrowName];
      const abilityScore = character.stats.abilityScores[savingThrowName];

      if (!!selectedSavingThrow && !!abilityScore) {
        const proficiencyBonus = getProficiencyBonus(character);
        const abilityScoreModifier = getModifier(abilityScore);
        let skillBonus = 0;

        if (selectedSavingThrow.proficient) {
          skillBonus = abilityScoreModifier + proficiencyBonus;
        } else {
          skillBonus = abilityScoreModifier;
        }

        const roller = new DiceRoller();
        roller.roll(`1d20 + ${skillBonus}`);

        return interaction.reply(roller.output);
      }
    }

    return interaction.reply("No se ha podido lanzar una tirada de salvación de `" + savingThrowName + "`");
  },
};
