const { SlashCommandBuilder } = require("@discordjs/builders");
const { DiceRoller } = require("@dice-roller/rpg-dice-roller");
const { getModifier, getProficiencyBonus } = require("@lierno/dnd-helpers");
const { getCurrentCharacter } = require("../db/controllers/character");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("attack")
    .setDescription("Rolls an attack for your current character!")
    .addStringOption((option) => option.setName("name").setDescription("Name of the attack").setRequired(true)),
  async execute(interaction) {
    const attackName = interaction.options.getString("name");
    const character = await getCurrentCharacter(interaction.user.id, interaction.channelId);

    if (!!character) {
      const proficiencyBonus = getProficiencyBonus(character);
      const selectedAttack = character.stats.attacks.find((attack) => attack.name === attackName);
      const bonusStat = selectedAttack.data.modifier ?? "strength";
      const toHitBonus =
        getModifier(character.stats.abilityScores[bonusStat]) + (selectedAttack.proficient ? proficiencyBonus : 0);

      const roller = new DiceRoller();
      roller.roll(`1d20+${toHitBonus}`);

      return interaction.reply(`Ataque con ${attackName}: ${roller.output}`);
    }

    return interaction.reply("No se ha podido atacar con este ataque.");
  },
};
