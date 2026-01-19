const axios = require("axios");

/* ================= CONFIG ================= */
module.exports.config = {
  name: "mei",
  version: "1.1.0",
  role: 0,
  hasPrefix: true,
  aliases: ["chatmei", "meiai", "jenny"],
  description: "Mei AI — a gentle, kind-hearted virtual friend 💕",
  usage: "prefix + mei <message>",
  credits: "Jerobie mei baby ",
  cooldown: 3
};

/* ================= MAIN ================= */
module.exports.run = async ({ api, event, args }) => {
  const { threadID, messageID } = event;
  const query = args.join(" ").trim();

  if (!query) {
    return api.sendMessage(
      "🌷 Hm? You can tell me anything, okay? I’m listening. 💕",
      threadID,
      messageID
    );
  }

  try {
    const response = await axios.get(
      `https://golden-bony-solidstatedrive.vercel.app/ai/mei?message=${encodeURIComponent(query)}`,
      { timeout: 15000 }
    );

    const reply =
      response.data?.result ||
      "Aww, I didn’t quite get that… mind saying it again, please? 💫";

    const softReplies = [
      "💞",
      "🌸",
      "☁️",
      "💐",
      "✨",
      "🫶"
    ];
    const emoji = softReplies[Math.floor(Math.random() * softReplies.length)];

    const message = `${emoji} ${reply}`;

    api.sendMessage(message, threadID, messageID);
  } catch (err) {
    api.sendMessage(
      "💤 I think my mind drifted off for a second… could we try again soon? 🌙",
      threadID,
      messageID
    );
  }
};