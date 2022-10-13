const { SlashCommandBuilder } = require("@discordjs/builders");
const { DiceRoller } = require("@dice-roller/rpg-dice-roller");
const { skills } = require("../assets/json/customizable_stats.json");
const { getModifier, getProficiencyBonus } = require("@lierno/dnd-helpers");
const { getCurrentCharacter } = require("../db/controllers/character");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("skill")
    .setDescription("Rolls an skill check for your current character!")
    .addStringOption((option) =>
      option
        .setName("skill")
        .setDescription("Skill to roll a check for")
        .addChoices(Object.entries(skills).map(([key, { name }]) => [name, key]))
        .setRequired(true)
    ),
  async execute(interaction) {
    const skillName = interaction.options.getString("skill");
    let character = await getCurrentCharacter(interaction.user.id, interaction.channelId);

    if (!!character) {
      const selectedSkill = character.stats.skills[skillName];

      if (!!selectedSkill) {
        const abilityScore = character.stats.abilityScores[selectedSkill.modifier];

        if (!!abilityScore) {
          const proficiencyBonus = getProficiencyBonus(character);
          const abilityScoreModifier = getModifier(abilityScore);
          let skillBonus = 0;

          if (selectedSkill.expertise) {
            skillBonus = abilityScoreModifier + proficiencyBonus * 2;
          } else if (selectedSkill.proficient) {
            skillBonus = abilityScoreModifier + proficiencyBonus;
          } else {
            skillBonus = abilityScoreModifier;
          }

          const roller = new DiceRoller();
          roller.roll(`1d20 + ${skillBonus}`);

          return interaction.reply(roller.output);
        }
      }
    }

    return interaction.reply("No se ha podido lanzar una tirada de habilidad de `" + skillName + "`");
  },
};
