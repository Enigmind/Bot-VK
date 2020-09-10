const Discord = require('discord.js')
const fs = require('fs')
const Welcome = require("discord-welcome");
const {prefix, token} = require('./config.json');

const client = new Discord.Client()
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}


//when someone slide into the server
Welcome(client, {
  "526207992182472704": {
    publicmsg: "Bonjour @MEMBER et bienvenue chez Veritas Kingdom !!"
      + "\nN'hésite pas à rejoindre l'escadron sur Elite (ID=3301), en suivant les informations fournies dans #accueil ou bien à demander de plus amples informations aux membres de l'escadron ici même."
      + "\n**VERITAS VINCIT !** ",
    publicchannel: "526808996330602506"
  }
})

// when the bot is connected
client.on('ready', () => {
  console.log("Connected as " + client.user.tag)
  // activity types can be : PLAYING, STREAMING, LISTENING, WATCHING
  client.user.setActivity("Le Cosmos", {
    type: "LISTENING"
  })
  //client.channels.get(`624339216209412097`).send("Grammar Nazi va !")
})

client.on('message', (message) => {
  // Prevent bot from responding to its own messages
  if (message.author == client.user || !message.content.startsWith(prefix)) {
    return
  }

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();
  const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
  
  if (!command) return;
  
  console.log("Command received: " + commandName)
  console.log("Arguments: " + args) // There may not be any arguments

  if (command.args && !args.length) {
    let reply = `Cette commande ne fonctionne pas sans arguments, ${message.author}!`;
    if (command.usage) {
      reply += `\nVoici comment l'utiliser : \`${prefix}${command.name} ${command.usage}\``;
    }
    return message.channel.send(reply);
  }


  try {
    command.execute(message, args);
  } catch (error) {
    console.error(error);
    message.reply('there was an error trying to execute that command!');
  }
})

client.login(token)