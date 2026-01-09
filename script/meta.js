const axios = require("axios");

module.exports.config = {
  name: "meta",
  version: "1.0.0",
  role: 0,
  hasPrefix: false,
  aliases: ["metaai"],
  description: "Meta AI powered assistant",
  usage: "meta <question>",
  credits: "Jerobie",
  cooldown: 2
};

module.exports.run = async function ({ api, event, args }) {
  const input = args.join(" ").trim();
  const threadID = event.threadID;
  const messageID = event.messageID;

  if (!input) {
    return api.sendMessage(
`🤖 META AI
━━━━━━━━━━━━━━━━━━
Hi! Ako ang Meta AI 🤍  
Owner: Jerobie

Sabihin mo lang:
meta hi
meta <tanong mo>

Handa akong sumagot 💬`,
      threadID,
      messageID
    );
  }

  api.sendMessage("🤖 Meta AI is thinking...", threadID, async (err, info) => {
    if (err) return;

    try {
      const { data } = await axios.get(
        "https://urangkapolka.vercel.app/api/metaai",
        {
          params: { prompt: input },
          timeout: 30000
        }
      );

      const answer =
        data?.response ||
        data?.answer ||
        "Walang response mula sa Meta AI.";

      const reply = `🤖 META AI
━━━━━━━━━━━━━━━━━━
${answer}
━━━━━━━━━━━━━━━━━━
👑 Owner: Jerobie`;

      api.editMessage(reply, info.messageID);

    } catch (e) {
      api.editMessage(
        "❌ Meta AI is temporarily unavailable.",
        info.messageID
      );
    }
  });
};