module.exports = {
    name: 'congrats',
    description: "Congratulations to the best persons of the milky way",
    aliases: ['bravo', 'gg'],
    execute(message) {
        message.delete()
        rnd = Math.floor(Math.random() * Math.floor(3));
        switch (rnd) {
          case 0:
            message.channel.send("Bravo les gars ! Belle bataille ! Pour fêter ça, jvous fais un strip tease. Mettez vos casques VR")
            break;
          case 1:
            message.channel.send("C'était incroyable ! Un peu comme si Frontier avait corrigé les bugs d'escadrilles :smirk:")
            break;
          case 2:
            message.channel.send("Félicitations ! Je suis fière de bosser avec une équipe de BG pareille :heart_eyes:")
            break;
          case 3:
            message.channel.send("Je pense qu'on a mérité une bonne ribouldingue ! Ce soir, c'est **ma tournée !!!** ")
            break;
          default:
            console.log('oups ! out of range :)');
        }
    },
  };