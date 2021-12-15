const { SlashCommandBuilder } = require('@discordjs/builders');

const { MessageEmbed } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('List all of my commands or info about a specific command.'),
	async execute(interaction) {
        const cmd_list = new MessageEmbed()
        //header
        .setColor('#800000')
        .setTitle("Liste des commandes")
        .setThumbnail('https://images.emojiterra.com/google/android-pie/512px/2699.png')

        //content
        .addFields(
            { name: 'help', value: "Affiche l'aide." },
            { name: 'system', value: "Donne les informations relatives à un système." },
            { name: 'faction', value: "Donne les informations relatives à une sous faction." },
            { name: 'rage', value: "Tu veux rager sur Elite et t'as plus d'argument ? laisse moi t'en trouver de nouveaux." },
        )

        //footer
        .setFooter('beep boop', 'https://www.edsm.net/img/guilds/1.png?v=1545042798')
		await interaction.reply({ embeds: [cmd_list] });
	},
};