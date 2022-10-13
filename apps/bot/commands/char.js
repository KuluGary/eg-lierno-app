const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const TurndownService = require("turndown");
const { getCurrentCharacter } = require("../db/controllers/character");
const {
  getCharacterSubtitle,
  getSavingThrowString,
  getAbilitiesString,
  getSpeedString,
} = require("@lierno/dnd-helpers");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("char")
    .setDescription("Shows info about your character!")
    .addStringOption((option) =>
      option
        .setName("content")
        .setDescription("What information from your character to show")
        .setRequired(true)
        .addChoice("Flavor", "flavor")
        .addChoice("Stats", "stats")
    ),
  async execute(interaction) {
    const t = new TurndownService();
    const character = await getCurrentCharacter(interaction.user.id, interaction.channelId);
    const contentType = interaction.options.getString("content");

    const classString = character.stats.classes ? getCharacterSubtitle(character) : "";

    const embed = new MessageEmbed()
      .setTitle(character.name)
      .setDescription(classString ?? "")
      .setAuthor({ name: interaction.user.username })
      .setThumbnail(character.flavor.portrait.avatar);

    if (contentType === "flavor") {
      embed.addFields([
        { name: "Personalidad", value: t.turndown(character.flavor.personality) },
        { name: "Apariencia", value: t.turndown(character.flavor.appearance) },
      ]);
    } else if (contentType === "stats") {
      const statOptions = ["Fuerza", "Destreza", "Constitución", "Inteligencia", "Sabiduría", "Carisma"];
      const statString = Object.values(character.stats.abilityScores).map(
        (abilityScore, index) => "**" + statOptions[index] + "**: " + abilityScore
      );

      const abilityString = getAbilitiesString(character);
      const saveString = getSavingThrowString(character);
      const speedString = getSpeedString(character.stats.speed);

      embed.addFields([
        { name: "Estadísticas", value: statString.join(" | ") },
        { name: "Clase de Armadura", value: character.stats.armorClass.toString() },
        {
          name: "Puntos de vida",
          value: `${character.stats.hitPoints.current ?? character.stats.hitPoints.max} / ${
            character.stats.hitPoints.max
          }`,
        },
        { name: "Velocidad", value: speedString },
        { name: "Tiradas de salvación con competencia", value: saveString },
        { name: "Habilidades con competencia", value: abilityString },
      ]);
    }

    return interaction.reply({ embeds: [embed] });
  },
};
