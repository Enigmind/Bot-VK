const Discord = require('discord.js')
const fs = require('fs')
var https = require('https');
var request = require('request');
var dateFormat = require('dateformat');
const Welcome = require("discord-welcome");
const bot_token = require('./auth.json').token;
const {prefix} = require('./config.json');

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
    privatemsg: "Bonjour et bienvenue chez Veritas Kingdom !!\n"
      + "Je suis Anick, l'intelligence artificielle de l'escadron. Laisse moi t'expliquer quelques trucs avant de débuter chez nous.\n"
      + "Nous sommes un escadron chill et sans prise de tête. Nous jouons pour le RP et les interactions entre joueurs. Il n'y a aucune obligation de connexion ni de temps de jeu.\n"
      + "Si tu viens pour faire partie de l'Union, je t'invite à contacter Gharkan\n"
      + "Si tu es juste là en tant qu'invité, bienvenue sur notre discord, il te sera demandé de respecter les règles au sein de celui-ci afin que tout se passe pour le mieux\n"
      + "Si tu veux rejoindre notre escadron In Game, il te faudra faire une candidature dans le jeu (id : 3301) qu'un amiral validera. une fois ceci fait, tu obtiendra l'accès complet au discord au sein duquel il te sera demandé de respecter les règles (Rien de bien méchant, il s'agit principalement des règles de base de bienséance ;)\n"
      + "N'hésite pas à faire appel à un membre si tu as besoin d'aide ou d'informations complémentaires. Tu peux également me solliciter avec le préfix : `§` (tape `§help` pour savoir dans quelles mesures je peux me rendre utile)\n"
      + "Bon vol Commandant, et à bientôt dans l'escadron je l'espère :kissing_heart: !",
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

client.login(bot_token)