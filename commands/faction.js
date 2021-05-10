const Discord = require('discord.js')
var https = require('https');
var dateFormat = require('dateformat');

module.exports = {
  name: 'faction',
  description: "Give informations about a single faction",
  args: true,
  usage: '<faction_name>',
  execute(message, args) {
    if (args.length === 1) {
      faction_name = args[0]
    } else if (args.length > 1) {
      faction_name = ""
      for (var arg in args) {
        faction_name += args[arg] + " "
      }
    } else {
      return
    }

    console.log(faction_name)
    var url_datas_faction = "https://elitebgs.app/api/ebgs/v5/factions?name=" + faction_name;

    https.get(url_datas_faction, function (res) {
      var body = '';

      res.on('data', function (chunk) {
        body += chunk;
      });

      res.on('end', function () {
        var results = JSON.parse(body);
        if (results.total == 0) {
          message.reply("Je ne trouve pas cette sous faction.")
          return;
        }
        results = results.docs[0];

        list_sys = results.faction_presence.slice(0, 24);

        const faction_datas = new Discord.MessageEmbed()
          //header
          .setColor('#800000')
          .setTitle(results.name)
          .setThumbnail('https://www.edsm.net/img/galaxyBackgroundV2.jpg')

          //content
          .setDescription("**Allegiance :** " + results.allegiance + "\n**Government :** " + results.government)

          //footer
          .setFooter("Updated at : " + results.updated_at);
        for (var system in list_sys) {
          faction_datas.addField(list_sys[system].system_name, "**Influence :** " + Math.round(results.faction_presence[system].influence * 10000) / 100 + "%\n**State :** " + results.faction_presence[system].state)
        }

        message.channel.send(faction_datas)
      });
    }).on('error', function (e) {
      console.log("Got an error: ", e);
    });

  }
};