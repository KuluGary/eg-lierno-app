const { SlashCommandBuilder } = require("@discordjs/builders");
const { DiceRoller } = require("@dice-roller/rpg-dice-roller");
const { getCurrentCharacter } = require("../db/controllers/character");
const { getModifier } = require("@lierno/dnd-helpers");

const choices = {
  melee: "Cuerpo a cuerpo",
  distance: "A distancia",
  versatile: "Con dos manos",
  extraDamage: "Daño adicional",
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName("damage")
    .setDescription("Rolls damage for your current character!")
    .addStringOption((option) => option.setName("name").setDescription("Name of the attack").setRequired(true))
    .addStringOption((option) =>
      option
        .setName("mode")
        .setDescription("The type of damage of the selected attack")
        .setRequired(true)
        .addChoices(Object.entries(choices).map(([key, name]) => [name, key]))
    ),
  async execute(interaction) {
    const attackName = interaction.options.getString("name");
    const attackMode = interaction.options.getString("mode");
    let character = await getCurrentCharacter(interaction.user.id, interaction.channelId);

    if (!!character) {
      const selectedAttack = character.stats.attacks.find((attack) => attack.name === attackName);

      if (!!selectedAttack) {
        const bonusStat = selectedAttack.data.modifier ?? "strength";
        const damageBonus = getModifier(character.stats.abilityScores[bonusStat]);
        const selectedDamageMode = selectedAttack.data.damage[attackMode];

        if (!!selectedDamageMode) {
          const roller = new DiceRoller();
          roller.roll(`${selectedDamageMode.numDie}d${selectedDamageMode.dieSize}+${damageBonus}`);

          return interaction.reply(`Daño con ${attackName}: ${roller.output}`);
        }
      }
    }

    return interaction.reply(`No se ha podido atacar con ${attackName} en el modo ${choices[attackMode]}`);
  },
};
