const axios = require("axios");

module.exports = {
  name: "ss",
  aliases: ["screenshot"],
  description: "Take website screenshot",
  usage: "!ss <url>",
  cooldown: 5,

  async execute(message, args) {
    const url = args[0];

    if (!url) {
      return message.reply(
`❌ Please provide a URL.
Example:
!ss https://google.com`
      );
    }

    // send loading message
    const loadingMsg = await message.reply(
      "📸 Taking screenshot, please wait..."
    );

    try {
      const apiUrl =
        "https://betadash-api-swordslush-production.up.railway.app/screenshot?url=" +
        encodeURIComponent(url);

      // send screenshot image
      await message.client.sendMessage(
        message.threadID,
        {
          body: "📸 Screenshot Result",
          attachment: await global.utils.getStreamFromURL(apiUrl)
        },
        message.type
      );

      // 🧹 auto delete loading message
      setTimeout(() => {
        message.client.unsendMessage(loadingMsg.messageID);
      }, 500);

    } catch (err) {
      console.error(err);

      message.reply("❌ Failed to take screenshot.");

      // auto delete loading even on error
      setTimeout(() => {
        message.client.unsendMessage(loadingMsg.messageID);
      }, 500);
    }
  }
};