const fs = require("fs");
const { Client, Collection, Intents, Options } = require("discord.js");
const { bot_token } = require("./config.json");
const Welcome = require("discord-welcome")

// creation of the client (bot). made it global for access in other files
const client = new Client({
  intents: [
	  'GUILDS',
	  'GUILD_MESSAGES',
	  'GUILD_EMOJIS_AND_STICKERS',
	  'GUILD_MEMBERS'
  ],
});
global.client = client


// Get the commands from /commands
client.commands = new Collection();
const commandFiles = fs
  .readdirSync("./commands")
  .filter((file) => file.endsWith(".js"));

// Get the events from /events
const eventFiles = fs
  .readdirSync("./events")
  .filter((file) => file.endsWith(".js"));

for (const file of eventFiles) {
  const event = require(`./events/${file}`);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
}

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.data.name, command);
}

// Run command (would be better to be in /event but I'm a lazy boï)
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({
      content: "There was an error while executing this command!",
      ephemeral: true,
    });
  }
});

//when someone slide into the server
Welcome(client, {
  "526207992182472704": {
    publicmsg: "Bonjour @MEMBER et bienvenue chez Veritas Kingdom !!"
      + "\nN'hésite pas à rejoindre l'escadron sur Elite (ID=3301), en suivant les informations fournies dans <#678587227156119573> ou bien à demander de plus amples informations aux membres de l'escadron ici même.",
    publicchannel: "526808996330602506"
  },
  "539794635283890186": {
    publicmsg: "Bienvenue sur mon serveur de test :kissing_heart:",
    publicchannel: "743393331677233172"
  }
})

client.login(bot_token)