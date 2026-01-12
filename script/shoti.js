const axios = require("axios");

/* ================= CONFIG ================= */
module.exports.config = {
  name: "shoti",
  version: "1.0",
  role: 0,
  hasPrefix: true, // kailangan prefix
  aliases: ["shorti", "shotvid", "svideo"],
  description: "Fetch random short video (Shoti)",
  usage: "shoti",
  credits: "Jerobie",
  cooldown: 5
};

/* ================= MAIN ================= */
module.exports.run = async function ({ api, event }) {
  const threadID = event.threadID;

  // show loading message
  api.sendMessage(
    "🎥 Fetching random Shoti video…",
    threadID,
    async (err, info) => {
      if (err) return;

      try {
        // call the new API
        const { data } = await axios.get(
          "https://golden-bony-solidstatedrive.vercel.app/video/shoti",
          { timeout: 30000 }
        );

        // check if video link exists
        if (!data || !data.result) {
          return api.editMessage(
            "❌ Failed to fetch a valid Shoti video. Try again later.",
            info.messageID
          );
        }

        // send video
        await api.sendMessage(
          {
            body:
`🤖 ❲ Jero • Video Fetch ❳
━━━━━━━━━━━━━━━
🎬 Here's your random short video!

━━━━━━━━━━━━━━━
By Jerobie • Laug Laug`,
            attachment: await global.utils.getStreamFromURL(data.result)
          },
          threadID
        );

        // remove loading message
        api.unsendMessage(info.messageID);
      } catch (error) {
        console.error("SHOTI ERROR:", error.message);

        // show error if fails
        api.editMessage(
          "❌ Something went wrong while fetching the Shoti video.",
          info.messageID
        );
      }
    }
  );
};