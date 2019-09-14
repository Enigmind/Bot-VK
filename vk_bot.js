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
          const faction_datas = new Discord.RichEmbed()
            //header
            .setColor('#800000')
            .setTitle(results.name + "'s systems")
            .setThumbnail('https://www.edsm.net/img/galaxyBackgroundV2.jpg')

            //content
            .setDescription("**Allegiance :** " + results.allegiance + "\n**Government :** " + results.government)
            .addBlankField(true)

            //footer
            .setTimestamp()
            .setFooter("Updated at : " + results.updated_at);
          for (var system in results.faction_presence) {
            faction_datas.addField(results.faction_presence[system].system_name, "**Influence :** " + results.faction_presence[system].influence * 100 + "%\n**State :** " + results.faction_presence[system].state)
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
        if(arg == arguments.length-1){
          system_name += arguments[arg]
        }
        else{
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
      receivedMessage.channel.send(cmd_list)
    }
  }
}


//when someone slide into the server
Welcome(client, {
  "539794635283890186": {
      //privatemsg : "Default message, welcome anyway",
      publicmsg : "Bienvenue sur mon serveur de test :kissing_heart:",
      publicchannel : "589465460680949787"
  },
  "526207992182472704": {
      //privatemsg : "Second Server default message",
      publicmsg: "Bonjour @MEMBER et bienvenue chez Veritas Kingdom !!\nN'hésite pas à rejoindre l'escadron sur Elite (ID=3301), en suivant les informations fournies par Nauva ou bien à demander de plus amples informations aux membres de l'escadrion ici même.\n**VERITAS VINCIT !**",
      publicchannel : "526808996330602506"
  }
})

// when the bot is connected
client.on('ready', () => {
  console.log("Connected as " + client.user.tag)
  // activity types can be : PLAYING, STREAMING, LISTENING, WATCHING
  client.user.setActivity("PornHub", {
    type: "WATCHING"
  })
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