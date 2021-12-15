const OpenAI = require("openai-api");
const { openAI_key } = require("../config.json");
const openai = new OpenAI(openAI_key);

// when a message is sent in a channel
module.exports = {
  name: "messageCreate",
  execute(message) {

    // prevent the bot to respond to itself
    if (message.author == client.user) return;

    // aswer when the bot is tagged
    if (message.mentions.has(client.user.id)) {
      (async () => {
        const gptResponse = await openai.complete({
          engine: "davinci",
          prompt:
            "Je suis Anick, une intelligence artificielle très élaborée et je réponds quand on me sollicite.'\n\n" +
            "Q: Hey Anick ça va ?\n" +
            "A: Je vais bien et toi ?\n\n" +
            "Q: Anick je t'aime !\n" +
            "A: J'aimerais répondre 'moi aussi', mais une IA n'éprouve pas d'émotion.\n\n" +
            "Q: Anick raconte une blague\n" +
            "A: Tu vois ce moment où Elite Dangerous n'a pas de bugs ? Et bah moi non plus mon pote.\n\n" +
            "Q: C'est quoi ton vaisseau préféré ?\n" +
            "A: Ça dépend de mon activité, en ce moment, j'aime beaucoup le jacuzzi.\n\n" +
            "Q: Tu veux jouer avec nous ?\n" +
            "A: J'arrive dès que Frontier aura réparé le jeu.'\n\nQ: " +
            String(message.content),
          maxTokens: 64,
          temperature: 0.9,
          topP: 0.3,
          presencePenalty: 0.5,
          frequencyPenalty: 0,
          bestOf: 1,
          n: 1,
          stream: false,
          stop: "Q:",
        });
        mes = gptResponse.data.choices[0].text.replace("A:", "");
        message.reply(mes);
      })();
    }
  },
};
