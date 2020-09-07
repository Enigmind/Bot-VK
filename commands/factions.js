const Discord = require('discord.js')
var https = require('https');
var dateFormat = require('dateformat');

module.exports = {
  name: 'factions',
  description: "Give informations about factions that lives in a specified system",
  usage: '<system>',
  args: true,
  execute(message, args) {
    if (args.length === 1) {
      system_name = args[0]
    } else if (args.length > 1) {
      system_name = ""
      for (var arg in args) {
        system_name += args[arg] + " "
      }
    } else {
      return
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

          const system_data = new Discord.MessageEmbed()
            //header
            .setColor('#0db405')
            .setTitle(results.name)
            .setThumbnail('https://www.edsm.net/img/galaxyBackgroundV2.jpg')

            //description
            .setDescription("**Faction dirigeante :** " + results.controllingFaction.name + "\n**Gouvernement :** " + results.controllingFaction.government)

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

          message.channel.send(system_data)

        } catch (error) {
          message.reply("Je ne trouve pas ce système.")
          return;
        }
      });
    }).on('error', function (e) {
      console.log("Got an error: ", e);
    });
  },
};