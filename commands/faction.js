const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const fetch = require("node-fetch");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("faction")
    .setDescription("Display informations of the selected faction.")
    .addStringOption((option) =>
      option
        .setName("name")
        .setDescription("Enter the name of the faction you're searching")
        .setRequired(true)
    ),
  async execute(interaction) {
    await interaction.deferReply();
    const name = interaction.options.getString("name");
    const query = new URLSearchParams({ name });
    const faction = new MessageEmbed();

    const { docs } = await fetch(
      `https://elitebgs.app/api/ebgs/v5/factions?${query}`
    ).then((response) => response.json());

    
    if (!docs[0]) {
      return interaction.editReply(
        `Je ne parviens pas à trouver la sous faction **${name}**.`
      );
    }
    const faction_presence = docs[0].faction_presence.slice(0,24);

    faction
      //header
      .setColor("#0099ff")
      .setTitle(name)
      .setThumbnail("https://www.edsm.net/img/galaxyBackgroundV2.jpg");

    //content
    faction_presence.map((system) => {
      faction.addFields({
        name: system.system_name,
        value:
          `**Influence :** ${Math.round(system.influence * 1000) / 10}%\n` +
          `**State :** ${system.state}`,
        inline: true,
      });
    });

    //footer
    faction
      .setTimestamp()
      .setFooter(
        "datas pulled from EDSM",
        "https://www.edsm.net/img/guilds/1.png?v=1545042798"
      );
    interaction.editReply({ embeds: [faction] });
  },
};
