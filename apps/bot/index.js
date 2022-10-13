const fs = require("fs");
const { Client, Collection, Intents } = require("discord.js");

if (process.env.NODE_ENV === "development") require("dotenv").config();

require("./db");
require("./db/redis");

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.commands = new Collection();

const commandFiles = fs.readdirSync("./commands").filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);

  client.commands.set(command.data.name, command);
}

client.once("ready", (ev) => console.log(`${ev.user.username}#${ev.user.discriminator} is ready!`));

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) return;

  try {
    await command.execute(interaction, client);
  } catch (error) {
    console.error(error);
    await interaction.reply({ content: "There was an error while executing this command!", ephemeral: true });
  }
});

client.login(process.env.DISCORD_BOT_TOKEN);
