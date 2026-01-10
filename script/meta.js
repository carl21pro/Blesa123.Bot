const axios = require("axios");

module.exports.config = {
  name: "meta",
  version: "1.1.0",
  role: 0,
  hasPrefix: true,
  aliases: ["metaai", "jowang"],
  description: "Meta AI - Topak + Trash Talk",
  usage: "meta [question]",
};

module.exports.run = async function ({ api, event, args }) {
  const input = args.join(" ").trim();
  const threadID = event.threadID;

  if (!input) {
    return api.sendMessage("🤖 META AI\nType a question, baka topak mode ako 😏", threadID);
  }

  api.sendMessage("🤖 META AI 🤯 Thinking... baka mag-topak ako 😂", threadID, async (_, info) => {
    try {
      const { data } = await axios.get("https://urangkapolka.vercel.app/api/metaai", {
        params: { prompt: input },
        timeout: 20000,
      });

      let reply = data?.response || data?.answer || "Wala akong sagot eh 🤪";

      // Random topak lines
      const topakLines = [
        "Bro, seryoso ka dyan? 😂",
        "Ha? Eh di wow 😎",
        "Chill lang, may sagot na ako 🤓",
        "Ang hirap pala eh 🤯",
        "Meta mode activated 💥",
        "Nako baka nasobrahan ka sa tanong 😝"
      ];
      const randomTopak = topakLines[Math.floor(Math.random() * topakLines.length)];

      // Random trash talk lines
      const trashTalkLines = [
        "Wag ka na mag tanong next time, hype ka lang! 🤬",
        "Tapos ka na sa tanong na yan, chill ka! 😏",
        "Ayan sagot na, tapos ka na! 🙄",
        "Next tanong mo? Aba di kaya! 😎",
        "Bro, nagtanong ka na naman? Hyp ka! 😂"
      ];
      const randomTrash = trashTalkLines[Math.floor(Math.random() * trashTalkLines.length)];

      api.editMessage(
`🤖 META AI (Topak + Trash)
━━━━━━━━━━━━━━━━━━
${reply}

💬 Topak Comment: ${randomTopak}
💢 Trash Talk: ${randomTrash}
━━━━━━━━━━━━━━━━━━
👑 Owner: Jerobie`,
        info.messageID
      );
    } catch (e) {
      api.editMessage(
        "❌ Meta AI is acting weird right now 🤪 Try again later.",
        info.messageID
      );
    }
  });
};