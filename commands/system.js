const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const fetch = require("node-fetch");
const humanize = require("humanize");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("system")
    .setDescription("Display informations of the selected system.")
    .addBooleanOption((option) =>
      option
        .setName("show_factions")
        .setDescription(
          "show informations about factions in this system"
        )
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("system_name")
        .setDescription("Enter the name of the system you're searching")
        .setRequired(true)
    ),
  async execute(interaction) {
    await interaction.deferReply();
    const systemName = interaction.options.getString("system_name");
    const query = new URLSearchParams({ systemName });
    const system = new MessageEmbed();

    if (!interaction.options.getBoolean("show_factions")) {
      const { name, information, primaryStar } = await fetch(
        `https://www.edsm.net/api-v1/system?${query}&showInformation=1&showPrimaryStar=1`
      ).then((response) => response.json());

      if (!name) {
        return interaction.editReply(
          `Je ne parviens pas à trouver le système **${systemName}**.`
        );
      }

      system
        //header
        .setColor("#0099ff")
        .setTitle(name)
        .setThumbnail("https://www.edsm.net/img/galaxyBackgroundV2.jpg")

        //content
        .addFields(
          {
            name: "Controlling Faction",
            value: information.faction,
            inline: true,
          },
          {
            name: "Allegiance",
            value: information.allegiance,
            inline: true,
          },
          {
            name: "Government",
            value: information.government,
            inline: true,
          },
          {
            name: "Population",
            value: humanize.numberFormat(information.population, 0),
            inline: true,
          },
          {
            name: "Security",
            value: information.security,
            inline: true,
          },
          {
            name: "Economy",
            value: information.economy,
            inline: true,
          },
          {
            name: "Primary Star",
            value: `**Name :** ${primaryStar.name}\n**Type :** ${primaryStar.type}\n**Scoopable :** ${primaryStar.isScoopable}`,
            inline: false,
          }
        )

        //footer
        .setTimestamp()
        .setFooter(
          "datas pulled from EDSM",
          "https://www.edsm.net/img/guilds/1.png?v=1545042798"
        );
    } else {
      const { name, controllingFaction, factions } = await fetch(
        `https://www.edsm.net/api-system-v1/factions?${query}`
      ).then((response) => response.json());

      if (!name) {
        return interaction.editReply(
          `Je ne parviens pas à trouver le système **${systemName}**.`
        );
      }

      // var lastUpdate = humanize.date(factions[0].lastUpdate)

      system
        //header
        .setColor("#0099ff")
        .setTitle(name)
        .setThumbnail("https://www.edsm.net/img/galaxyBackgroundV2.jpg")
        .setDescription(`**Controlling Faction :** ${controllingFaction.name}\n **Government :** ${controllingFaction.government}`)
        .setFooter(
          `datas pulled from EDSM`,
          "https://www.edsm.net/img/guilds/1.png?v=1545042798"
        )

        //content
        factions.map(faction =>{
          var pendingState = "None"
          if(faction.pendingStates[0]){
            pendingState = faction.pendingStates[0].state
          }
          // console.log()
          system.addFields(
            {
              name: faction.name,
              value: `**Influence :** ${Math.round(faction.influence*1000)/10}%\n`
              + `**State :** ${faction.state}\n`
              + `**Pending State :** ${pendingState}`,
              inline: true,
            }
          )
        })

        //footer
        system.setTimestamp()
    }
    interaction.editReply({ embeds: [system] });
  },
};
