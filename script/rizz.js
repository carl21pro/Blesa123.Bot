const axios = require("axios");

module.exports.config = {
  name: "rizz",
  version: "1.0.0",
  role: 0,
  hasPrefix: true,
  aliases: [],
  description: "Get a random rizz line 😎",
  usage: "prefix + rizz",
  credits: "Jerobie",
  cooldown: 3
};

module.exports.run = async ({ api, event }) => {
  const { threadID, messageID } = event;

  try {
    const res = await axios.get("https://golden-bony-solidstatedrive.vercel.app/random/rizz");
    const rizzLine = res.data?.rizz || "No rizz found 😅";

    const message = `
╭──────────────╮
 😎 𝗥𝗜𝗭𝗭 𝗟𝗜𝗡𝗘
╰──────────────╯

💬 ${rizzLine}

—
👑 Creator: Jerobie
    `.trim();

    api.sendMessage(message, threadID, messageID);
  } catch (err) {
    api.sendMessage("❌ | Unable to fetch a rizz line right now.", threadID, messageID);
  }
};