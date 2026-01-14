const axios = require("axios");

module.exports.config = {
  name: "48laws",
  version: "1.0.0",
  role: 0,
  hasPrefix: true,
  aliases: ["48law", "law"],
  description: "Show a specific law from The 48 Laws of Power (1–48)",
  usage: "48laws <number>",
  credits: "Jerobie",
  cooldown: 3
};

module.exports.run = async function ({ api, event, args }) {
  const threadID = event.threadID;
  const num = parseInt(args[0]);

  if (!num || num < 1 || num > 48) {
    return api.sendMessage(
      "❌ Usage: 48laws <number>\nExample: 48laws 7",
      threadID
    );
  }

  try {
    const { data } = await axios.get(
      "https://betadash-api-swordslush-production.up.railway.app/api/48laws"
    );

    const law = data.laws.find(l => l.number === num);

    if (!law) {
      return api.sendMessage("❌ Law not found.", threadID);
    }

    api.sendMessage(
`⚜️ 48 Laws of Power
━━━━━━━━━━━━━━━━━━━
📖 Law ${law.number}: ${law.title}

🧠 ${law.description.split(".")[0]}.

━━━━━━━━━━━━━━━━━━━
By Jerobie • Laug Laug`,
      threadID
    );

  } catch (err) {
    console.error(err);
    api.sendMessage(
      "❌ Failed to fetch 48 Laws. Try again later.",
      threadID
    );
  }
};