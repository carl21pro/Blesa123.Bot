const axios = require("axios");

/* ================= CONFIG ================= */
module.exports.config = {
  name: "mei",
  version: "1.0.3",
  role: 0,
  hasPrefix: true,
  aliases: ["chatmei", "meiai", "jenny"],
  description: "Mei AI — a sweet and friendly virtual companion 💕",
  usage: "prefix + mei <message>",
  credits: "Mea Your Baby",
  cooldown: 3
};

/* ================= MAIN ================= */
module.exports.run = async ({ api, event, args }) => {
  const { threadID, messageID } = event;
  const query = args.join(" ");

  if (!query) {
    return api.sendMessage("🌸 | What would you like to talk about, cutie?", threadID, messageID);
  }

  try {
    const response = await axios.get(
      `https://golden-bony-solidstatedrive.vercel.app/ai/mei?message=${encodeURIComponent(query)}`,
      { timeout: 15000 }
    );

    const reply = response.data?.result || "Aww, I didn’t catch that 😅 could you say it again?";

    const message = `
╭──────────────╮
 💕 𝗠𝗘𝗜 𝗔𝗜 — 𝗬𝗼𝘂𝗿 𝗦𝘄𝗲𝗲𝘁 𝗖𝗵𝗮𝘁 𝗕𝘂𝗱𝗱𝘆
╰──────────────╯

💬 ${reply}

—
👑 Owner: Mea Your Baby
    `.trim();

    api.sendMessage(message, threadID, messageID);
  } catch (err) {
    api.sendMessage("❌ | Mei’s taking a little nap right now. Try again soon 💫", threadID, messageID);
  }
};