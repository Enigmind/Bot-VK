const Discord = require('discord.js')
const fs = require('fs')
var https = require('https');
var request = require('request');
var dateFormat = require('dateformat');
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
            faction_datas.addField(list_sys[system].system_name, "**Influence :** " + Math.round(results.faction_presence[system].influence * 10000) / 100 + "%\n**State :** " + results.faction_presence[system].state)
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

  /** Give informations about the factions represented in that system */
  if (primaryCommand == "factions") {
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
      var url_datas_system = 'https://www.edsm.net/api-system-v1/factions?systemName=' + system_name;
      https.get(url_datas_system, function (res) {
        var body = '';

        res.on('data', function (chunk) {
          body += chunk;
        });

        res.on('end', function () {
          var results = JSON.parse(body);
          try {
            var list_factions = results.factions;
            var lastUpdated = new Date(list_factions[0].lastUpdate * 1000);
            let pendingState;

            const system_data = new Discord.RichEmbed()
              //header
              .setColor('#0db405')
              .setTitle(results.name)
              .setThumbnail('https://www.edsm.net/img/galaxyBackgroundV2.jpg')

              //description
              .setDescription("**Faction dirigeante :** " + results.controllingFaction.name + "\n**Gouvernement :** " + results.controllingFaction.government)
              .addBlankField(true)

              //footer
              .setFooter("Dernière MàJ : " + dateFormat(lastUpdated, "dd/mm/yy à HH:MM"));

            for (var faction in list_factions) {
              if (list_factions[faction].influence != 0) {
                if (list_factions[faction].pendingStates.length > 0) {
                  pendingState = list_factions[faction].pendingStates[0].state;
                } else {
                  pendingState = "None";
                }
                system_data.addField(list_factions[faction].name, "**Influence :** " + Math.round(list_factions[faction].influence * 10000) / 100 + "%\n**État :** " + list_factions[faction].state + "\n**État en attente :** " + pendingState)
              }
            }

            receivedMessage.channel.send(system_data)

          } catch (error) {
            receivedMessage.channel.send("Je ne trouve pas ce système.")
            return;
          }
        });
      }).on('error', function (e) {
        console.log("Got an error: ", e);
      });

    } else {
      receivedMessage.channel.send("Entre un nom de système en argument !\nExemple : `§factions Seelet`")
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
  if (primaryCommand == "help") {
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
        .addField("factions", "Donne les informations relatives aux factions présentes sur ce système.\n*Exemple :* `§factions Seelet`", false)
        .addField("rage", "Tu veux rager sur Elite et t'as plus d'argument ? laisse moi t'en trouver de nouveaux.\n*Exemple :* `§rage`", false)
        .addField("congrats", "Laisse moi féliciter les membres de l'escadron comme ils le méritent.\n*Exemple :* `§congrats`", false)
      receivedMessage.channel.send(cmd_list)
    }
  }

  if (primaryCommand == "rage") {
    receivedMessage.delete()
    rnd = Math.floor(Math.random() * Math.floor(16));
    switch (rnd) {
      case 0:
        receivedMessage.channel.send("Toutes façons, Frontier ils codent vraiment avec le cul c'est un délire... :unamused:")
        break;
      case 1:
        receivedMessage.channel.send("C'est pas possible ! Ils sortent des bugs fix mais le multicrew est encore plus buggé qu'à sa sortie... ")
        break;
      case 2:
        receivedMessage.channel.send("*Frontier quand on lui expose tous les bugs du jeu :* \nC'est pas des bugs, c'est des **features non documentées :smirk:** ")
        break;
      case 3:
        receivedMessage.channel.send("Vraiment cassé ce jeu... ")
        break;
      case 4:
        receivedMessage.channel.send("Il va vraiment falloir qu'un jour, Frontier se décide à recruter un 2e développeur... ")
        break;
      case 5:
        receivedMessage.channel.send("2 ans d'attente pour Odyssey ! Et finalement qu'est-ce qu'on a ? de la rando et de la cueillette ! AH ON EST HEUREUX ! ")
        break;
      case 6:
        receivedMessage.channel.send("Avez vous un Fleet Carrier ? Ou devrais-je dire... un **Bug Carrier** ? Une aberration ce truc... ")
        break;
      case 7:
        receivedMessage.channel.send("Frontier, ils ont fait un bon jeu quand meme, faut arrêter de rager à la fin..")
        break;
      case 8:
        receivedMessage.channel.send("Jvais changer de taf et aller jouer les informatrices sur Star Citizen si ça continue.. J'suis sûre que c'est moins buggé ")
        break;
      case 9:
        receivedMessage.channel.send("Non mais le KEELBACK.. C'est quoi cette BLAGUE ?? Vraiment un déchet ambulant ce vaisseau... ")
        break;
      case 10:
        receivedMessage.channel.send("Toutes façons, les devs pensent qu'au pognon, ils préfèrent nerf plutôt que fix")
        break;
      case 11:
        receivedMessage.channel.send("Ce jeu est encore plus buggé que Star Citizen")
        break;
      case 12:
        receivedMessage.channel.send("Chez Frontier, le stagiaire est le seul a avoir touché un clavier parmi toute l'équipe de dev depuis 2 ans")
        break;
      case 13:
        receivedMessage.channel.send("Je suis sûr que l'équipe qui règle les bugs touche le chômage tellement ils branlent rien")
        break;
      case 14:
        receivedMessage.channel.send("Le jeu aurait du s'appeler Elite Grinderous pour correspondre à sa commu :smirk:")
        break;
      case 15:
        receivedMessage.channel.send("Pour fournir un jeu aussi mal foutu, les devs doivent être payés en graines... Remarque, c'est de circonstance\nVU COMME LE JEU PLANTE !")
        break;
      case 16:
        receivedMessage.channel.send("Frontier, ils ont fait un bon jeu quand meme, faut arrêter de rager à la fin..")
        break;
      default:
        console.log('oups ! out of range :)');
    }
  }

  if (primaryCommand == "congrats") {
    receivedMessage.delete()
    rnd = Math.floor(Math.random() * Math.floor(4));
    switch (rnd) {
      case 0:
        receivedMessage.channel.send("Bravo les gars ! Belle bataille ! Pour fêter ça, jvous fais un strip tease. Mettez vos casques VR")
        break;
      case 1:
        receivedMessage.channel.send("C'était incroyable ! Un peu comme si Frontier avait corrigé les bugs d'escadrilles :smirk:")
        break;
      case 2:
        receivedMessage.channel.send("Félicitations ! Je suis fière de bosser avec une équipe de BG pareille :heart_eyes:")
        break;
      case 3:
        receivedMessage.channel.send("Je pense qu'on a mérité une bonne ribouldingue ! Ce soir, c'est **ma tournée !!!** ")
        break;
      default:
        console.log('oups ! out of range :)');
    }
  }

  if (primaryCommand == "permission") {
    if (arguments.length == 0) {
      receivedMessage.channel.send("`permission`a besoin d'un argument.")
    } else {
      let hasPermission = receivedMessage.guild.me.hasPermission(arguments[0])
      receivedMessage.channel.send(hasPermission)
      // console.log(hasPermission)
    }
  }
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

client.on('message', (receivedMessage) => {
  // Prevent bot from responding to its own messages
  if (receivedMessage.author == client.user) {
    return
  }

  // Check if the bot's user was tagged in the message
  if (receivedMessage.content.includes(client.user.toString())) {
    receivedMessage.channel.send("Plaît-il ?")
    receivedMessage.channel.send("Je ne réponds qu'aux commandes que je connais. Tape `§help` si besoin ;)")
  }


  // if the message starts with $, exectute the 'processCommand' function
  if (receivedMessage.content.startsWith("§")) {
    processCommand(receivedMessage)
  }
})

client.login(bot_token)