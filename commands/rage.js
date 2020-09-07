module.exports = {
  name: 'rage',
  description: "Rage against Elite because that's what players do the best.",
  execute(message) {
    message.delete()
    rnd = Math.floor(Math.random() * Math.floor(16));
    switch (rnd) {
      case 0:
        message.channel.send("Frontier ils codent vraiment avec le cul c'est un délire... :unamused:")
        break;
      case 1:
        message.channel.send("C'est pas possible ! Ils sortent des bugs fix mais le multicrew est encore plus buggé qu'à sa sortie... ")
        break;
      case 2:
        message.channel.send("*Frontier quand on lui expose tous les bugs du jeu :* \nC'est pas des bugs, c'est des **features non documentées :smirk:** ")
        break;
      case 3:
        message.channel.send("Vraiment cassé ce jeu... ")
        break;
      case 4:
        message.channel.send("Il va vraiment falloir qu'un jour, Frontier se décide à recruter un 2e développeur... ")
        break;
      case 5:
        message.channel.send("2 ans d'attente pour Odyssey ! Et finalement qu'est-ce qu'on a ? de la rando et de la cueillette ! AH ON EST HEUREUX ! ")
        break;
      case 6:
        message.channel.send("Avez vous un Fleet Carrier ? Ou devrais-je dire... un **Bug Carrier** ? Une aberration ce truc... ")
        break;
      case 7:
        message.channel.send("Frontier, ils ont fait un bon jeu quand meme, faut arrêter de rager à la fin..")
        break;
      case 8:
        message.channel.send("Jvais changer de taf et aller jouer les informatrices sur Star Citizen si ça continue.. J'suis sûre que c'est moins buggé ")
        break;
      case 9:
        message.channel.send("Non mais le KEELBACK.. C'est quoi cette BLAGUE ?? Vraiment un déchet ambulant ce vaisseau... ")
        break;
      case 10:
        message.channel.send("Les devs pensent qu'au pognon, ils préfèrent nerf plutôt que fix")
        break;
      case 11:
        message.channel.send("Ce jeu est encore plus buggé que Star Citizen")
        break;
      case 12:
        message.channel.send("Chez Frontier, le stagiaire est le seul a avoir touché un clavier parmi toute l'équipe de dev depuis 2 ans")
        break;
      case 13:
        message.channel.send("Je suis sûr que l'équipe qui règle les bugs touche le chômage tellement ils branlent rien")
        break;
      case 14:
        message.channel.send("Le jeu aurait du s'appeler Elite Grinderous pour correspondre à sa commu :smirk:")
        break;
      case 15:
        message.channel.send("Pour fournir un jeu aussi mal foutu, les devs doivent être payés en graines... Remarque, c'est de circonstance\nVU COMME LE JEU PLANTE !")
        break;
      case 16:
        message.channel.send("Frontier, ils ont fait un bon jeu quand meme, faut arrêter de rager à la fin..")
        break;
      default:
        console.log('oups ! out of range :)');
    }
  },
};