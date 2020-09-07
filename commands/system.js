const Discord = require('discord.js')
var https = require('https');

module.exports = {
  name: 'system',
  description: "Congratulations to the best persons of the milky way",
  args: true,
  usage: '<system_name>',
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
    var url_datas_system = 'https://www.edsm.net/api-v1/system?systemName=' + system_name + '&showInformation=1&showPrimaryStar=1';
    https.get(url_datas_system, function (res) {
      var body = '';

      res.on('data', function (chunk) {
        body += chunk;
      });

      res.on('end', function () {
        var results = JSON.parse(body);
        try {
          const system_datas = new Discord.MessageEmbed()
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
          message.channel.send(system_datas)

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