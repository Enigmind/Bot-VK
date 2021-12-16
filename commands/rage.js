const { SlashCommandBuilder } = require("@discordjs/builders");
const OpenAI = require("openai-api");
const { openAI_key } = require("../config.json");
const openai = new OpenAI(openAI_key);

module.exports = {
  data: new SlashCommandBuilder()
    .setName("rage")
    .setDescription("tire à balles réelles sur Elite Dangerous et Frontier."),
  async execute(interaction) {
    rnd = Math.floor(Math.random() * Math.floor(16));
    switch (rnd) {
      case 0:
        await interaction.reply(
          "Frontier ils codent vraiment avec le cul c'est un délire... :unamused:"
        );
        break;
      case 1:
        await interaction.reply(
          "C'est pas possible ! Ils sortent des bugs fix mais le multicrew est encore plus buggé qu'à sa sortie... "
        );
        break;
      case 2:
        await interaction.reply(
          "*Frontier quand on lui expose tous les bugs du jeu :* \nC'est pas des bugs, c'est des **features non documentées :smirk:** "
        );
        break;
      case 3:
        await interaction.reply("Vraiment cassé ce jeu... ");
        break;
      case 4:
        await interaction.reply(
          "Il va vraiment falloir qu'un jour, Frontier se décide à recruter un 2e développeur... "
        );
        break;
      case 5:
        await interaction.reply(
          "2 ans d'attente pour Odyssey ! Et finalement qu'est-ce qu'on a ? de la rando et de la cueillette ! AH ON EST HEUREUX ! "
        );
        break;
      case 6:
        await interaction.deferReply();
        const gptResponse = await openai.complete({
          engine: "davinci",
          prompt: "Quelle est la pire chose dans le jeu Elite Dangerous ?'\nSans hésiter, c'est ",
          maxTokens: 64,
          temperature: 0.9,
          topP: 0.3,
          presencePenalty: 0.5,
          frequencyPenalty: 0,
          bestOf: 1,
          n: 1,
          stream: false,
          stop: ".",
        });
        mes = "Ce qui m'énerve dans ce jeu, c'est " + gptResponse.data.choices[0].text;
        interaction.editReply(mes);
        break;
      case 7:
        await interaction.reply(
          "Frontier, ils ont fait un bon jeu quand meme, faut arrêter de rager à la fin.."
        );
        break;
      case 8:
        await interaction.reply(
          "Jvais changer de taf et aller jouer les informatrices sur Star Citizen si ça continue.. J'suis sûre que c'est moins buggé "
        );
        break;
      case 9:
        await interaction.reply(
          "Non mais le KEELBACK.. C'est quoi cette BLAGUE ?? Vraiment un déchet ambulant ce vaisseau... "
        );
        break;
      case 10:
        await interaction.reply(
          "Les devs pensent qu'au pognon, ils préfèrent nerf plutôt que fix"
        );
        break;
      case 11:
        await interaction.reply("Ce jeu est encore plus buggé que Star Citizen");
        break;
      case 12:
        await interaction.reply(
          "Chez Frontier, le stagiaire est le seul a avoir touché un clavier parmi toute l'équipe de dev depuis 2 ans"
        );
        break;
      case 13:
        await interaction.reply(
          "Je suis sûr que l'équipe qui règle les bugs touche le chômage tellement ils branlent rien"
        );
        break;
      case 14:
        await interaction.reply(
          "Le jeu aurait du s'appeler Elite Grinderous pour correspondre à sa commu :smirk:"
        );
        break;
      case 15:
        await interaction.reply(
          "Pour fournir un jeu aussi mal foutu, les devs doivent être payés en graines... Remarque, c'est de circonstance\nVU COMME LE JEU PLANTE !"
        );
        break;
      case 16:
        await interaction.reply(
          "Je connais un taf où y'a besoin de moins travailler que le chômage :\nDéveloppeur chez Frontier !"
        );
        break;
      default:
        console.log("oups ! out of range :)");
    }
  },
};
