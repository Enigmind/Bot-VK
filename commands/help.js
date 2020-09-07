const Discord = require('discord.js')

module.exports = {
  name: 'help',
  description: "List all of my commands or info about a specific command.",
  aliases: ['aled', 'commands'],
  execute(message, args) {
    if (args.length > 0) {
      message.channel.send("TODO -> faire des commandes d'aide personnalisées :thinking:")
    } else {
      const cmd_list = new Discord.MessageEmbed()
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
      message.reply(cmd_list)
    }
  },
};