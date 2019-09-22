const Discord = require('discord.js')
const fs = require('fs')
var https = require('https');
var request = require('request');
const Welcome = require("discord-welcome");
const bot_token = require('./auth.json').token;
const client = new Discord.Client()


function processCommand(receivedMessage) {
  let fullCommand = receivedMessage.content.substr(1) // Remove the $
  let splitCommand = fullCommand.split(" ") // Split the message up in to pieces for each space
  let primaryCommand = splitCommand[0] // The first word directly after the exclamation is the command
  let arguments = splitCommand.slice(1) // All other words are arguments/parameters/options for the command

  console.log("Command received: " + primaryCommand)
  console.log("Arguments: " + arguments) // There may not be any arguments


  /** Give information about a faction in the Game */
  if (primaryCommand == "faction") {
    if (arguments.length > 0) {
      faction_name = ""
      for (var arg in arguments) {
        faction_name += arguments[arg] + " "
      }
      var url_datas_faction = "https://elitebgs.app/api/ebgs/v4/factions?name=" + faction_name;

      https.get(url_datas_faction, function (res) {
        var body = '';

        res.on('data', function (chunk) {
          body += chunk;
        });

        res.on('end', function () {
          var results = JSON.parse(body);
          if (results.total == 0) {
            receivedMessage.channel.send("Je ne trouve pas cette sous faction.")
            return;
          }
          results = results.docs[0];

          list_sys = results.faction_presence.slice(0, 24);

          const faction_datas = new Discord.RichEmbed()
            //header
            .setColor('#800000')
            .setTitle(results.name)
            .setThumbnail('https://www.edsm.net/img/galaxyBackgroundV2.jpg')

            //content
            .setDescription("**Allegiance :** " + results.allegiance + "\n**Government :** " + results.government)
            .addBlankField(true)

            //footer
            .setFooter("Updated at : " + results.updated_at);
          for (var system in list_sys) {
            faction_datas.addField(list_sys[system].system_name, "**Influence :** " + results.faction_presence[system].influence * 100 + "%\n**State :** " + results.faction_presence[system].state)
          }

          receivedMessage.channel.send(faction_datas)
        });
      }).on('error', function (e) {
        console.log("Got an error: ", e);
      });

    } else {
      receivedMessage.channel.send("Entre un nom de sous faction en argument !\nExemple : `§faction Veritas Kingdom`")
    }

  }

  /** Give information about a system in the game */
  if (primaryCommand == "system") {
    if (arguments.length > 0) {
      system_name = ""
      for (var arg in arguments) {
        if (arg == arguments.length - 1) {
          system_name += arguments[arg]
        }
        else {
          system_name += arguments[arg] + " "
        }
      }
      var url_datas_system = 'https://www.edsm.net/api-v1/system?systemName=' + system_name + '&showInformation=1&showPrimaryStar=1';
      https.get(url_datas_system, function (res) {
        var body = '';

        res.on('data', function (chunk) {
          body += chunk;
        });

        res.on('end', function () {
          var results = JSON.parse(body);
          try {
            const system_datas = new Discord.RichEmbed()
              //header
              .setColor('#0099ff')
              .setTitle(results.name)
              .setThumbnail('https://www.edsm.net/img/galaxyBackgroundV2.jpg')

              //content
              .addField('Controlling faction', results.information.faction, true)
              .addField('Allegiance', results.information.allegiance, true)
              .addField('Government', results.information.government, true)
              .addField('Population', results.information.population, true)
              .addField('Security', results.information.security, true)
              .addField('Economy', results.information.economy, true)
              .addField('Primary star', "**Name :** " + results.primaryStar.name + "\n**Type :** " + results.primaryStar.type, true)

              //footer
              .setTimestamp()
              .setFooter('datas pulled from EDSM', 'https://www.edsm.net/img/guilds/1.png?v=1545042798');
            receivedMessage.channel.send(system_datas)

          } catch (error) {
            receivedMessage.channel.send("Je ne trouve pas ce système.")
            return;
          }
        });
      }).on('error', function (e) {
        console.log("Got an error: ", e);
      });

    } else {
      receivedMessage.channel.send("Entre un nom de système en argument !\nExemple : `§system Seelet`")
    }
  }

  /** Help command */
  if (primaryCommand == "aled") {
    if (arguments.length > 0) {
      receivedMessage.channel.send("TODO -> faire des commandes d'aide personnalisées :thinking:")
    } else {
      const cmd_list = new Discord.RichEmbed()
        //header
        .setColor('#800000')
        .setTitle("Liste des commandes")
        .setThumbnail('https://images.emojiterra.com/google/android-pie/512px/2699.png')

        //content
        .addField("system", "Donne les informations relatives à un système.\n*Exemple :* `§system Seelet`", false)
        .addField("faction", "Donne les informations relatives à une sous faction.\n*Exemple :* `§faction Veritas Kingdom`", false)
        .addField("rage", "Tu veux rager sur Elite et t'as plus d'argument ? laisse moi t'en trouver de nouveaux.\n*Exemple :* `§rage`", false)
      receivedMessage.channel.send(cmd_list)
    }
  }

  if (primaryCommand == "rage") {
    rnd = Math.floor(Math.random() * Math.floor(11));
    switch (rnd) {
      case 0:
        receivedMessage.channel.send("Toutes façons, Frontier ils codent vraiment avec le cul c'est un délire... :unamused:")
        break;
      case 1:
        receivedMessage.channel.send("Ptin mais c'est pas possible ! Ils sortent des bugs fix mais le multicrew est encore plus buggé qu'à sa sortie... ")
        break;
      case 2:
        receivedMessage.channel.send("*Frontier quand on lui expose tous les bugs du jeu :* \nC'est pas des bugs, c'est des **features non documentées :smirk:** ")
        break;
      case 3:
        receivedMessage.channel.send("Vraiment cassé ce jeu... ")
        break;
      case 4:
        receivedMessage.channel.send("Woooa les ingés cassé par leur maj de mort vide de contenu là... Ils se masturbent sur du Evanescence les devs c'est pas possible ! ")
        break;
      case 5:
        receivedMessage.channel.send("Pas de grosse MaJ avant 2020 et même là ils corrigent pas les bugs.. Jvous le dis, mieux vaut que ce soit **INCROYABLE** en 2020 sinon ils vont prendre cher Frontier ! ")
        break;
      case 6:
        receivedMessage.channel.send("Vous attendez les Fleet Carrier ? Attendez de voir l'armée de bugs qui va arriver avec.. Ils devraient appeler ça des \"Bugs Carrier\" :sweat_smile: ")
        break;
      case 7:
        receivedMessage.channel.send("Encore une MaJ codée avec le cul d'un stagiaire sous payé ça... BRAVO FRONTIER ! ")
        break;
      case 8:
        receivedMessage.channel.send("Jvais changer de taf et aller jouer les informatrices sur Star Citizen si ça continue.. J'suis sûre que c'est moins buggé ")
        break;
      case 9:
        receivedMessage.channel.send("Non mais le KEELBACK.. C'est quoi cette BLAGUE ?? Vraiment un déchet ambulant ce vaisseau... ")
        break;
      case 9:
        receivedMessage.channel.send("Ils peuvent pas mettre à jour plus souvent leurs API là EDSM ? J'en ai marre de récupérer des données obsolètes :'( FRONTIER OSCOUR !! ")
        break;
      default:
        console.log('oups ! out of range :)');
    }
  }
}


//when someone slide into the server
Welcome(client, {
  "539794635283890186": {
    //privatemsg : "Default message, welcome anyway",
    publicmsg: "Bienvenue sur mon serveur de test :kissing_heart:",
    publicchannel: "589465460680949787"
  },
  "526207992182472704": {
    //privatemsg : "Second Server default message",
    publicmsg: "Bonjour @MEMBER et bienvenue chez Veritas Kingdom !!\nN'hésite pas à rejoindre l'escadron sur Elite (ID=3301), en suivant les informations fournies par Nauva ou bien à demander de plus amples informations aux membres de l'escadron ici même.\n**VERITAS VINCIT !**",
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
  //client.channels.get(`526808996330602506`).send(`oui`)
})

client.on('message', (receivedMessage) => {
  // Prevent bot from responding to its own messages
  if (receivedMessage.author == client.user) {
    return
  }

  // Check if the bot's user was tagged in the message
  if (receivedMessage.content.includes(client.user.toString())) {
    receivedMessage.channel.send("Plaît-il ?")
    receivedMessage.channel.send("Je ne réponds qu'aux commandes que je connais. Tape `§aled` si besoin ;)")
  }


  // if the message starts with $, exectute the 'processCommand' function
  if (receivedMessage.content.startsWith("§")) {
    processCommand(receivedMessage)
  }
})

client.login(bot_token)