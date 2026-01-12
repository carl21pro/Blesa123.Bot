const axios = require("axios");

/* ================= CONFIG ================= */
module.exports.config = {
  name: "spotify",
  version: "1.1",
  role: 0,
  hasPrefix: true,
  aliases: ["spt", "music"],
  description: "Search Spotify and get song info with link",
  usage: "spotify [song title]",
  credits: "Jerobie",
  cooldown: 0
};

/* ================= MAIN ================= */
module.exports.run = async function ({ api, event, args }) {
  const input = args.join(" ").trim();
  const threadID = event.threadID;

  if (!input) {
    return api.sendMessage("❌ Please provide a song title. Usage: spotify [title]", threadID);
  }

  api.sendMessage(`🔎 Searching Spotify for "${input}"...`, threadID, async (_, info) => {
    try {
      const { data } = await axios.get(
        `https://betadash-api-swordslush-production.up.railway.app/spt?title=${encodeURIComponent(input)}`,
        { timeout: 30000 }
      );

      if (!data || !data.title) {
        return api.editMessage("❌ Song not found.", info.messageID);
      }

      // Format duration mm:ss
      const minutes = Math.floor(data.duration / 60000);
      const seconds = Math.floor((data.duration % 60000) / 1000);
      const durationFormatted = `${minutes}:${seconds.toString().padStart(2, "0")}`;

      // Fallback thumbnail
      const thumbnail = data.thumbnail || "https://i.imgur.com/2yAfvC4.png";

      const msg = `
🎵 Title: ${data.title}
🎤 Artist(s): ${data.artists}
⏱ Duration: ${durationFormatted}
🖼 Thumbnail: ${thumbnail}
🔗 [Listen/Download Link](${data.download_url})
`;

      api.editMessage(msg, info.messageID);
    } catch (e) {
      api.editMessage("❌ Error searching Spotify. Try again later.", info.messageID);
    }
  });
};