const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports.config = {
  name: "shoti",
  version: "1.1.0",
  role: 0,
  hasPrefix: false,
  aliases: ["tikshoti"],
  description: "Send a random Shoti video",
  usage: "shoti",
  credits: "Jerobie"
};

module.exports.run = async function ({ api, event }) {
  const threadID = event.threadID;
  const videoPath = path.join(__dirname, "shoti.mp4");

  api.sendMessage("🎥 Fetching Shoti video...", threadID, async () => {
    try {
      // GET API DATA
      const { data } = await axios.get(
        "https://golden-bony-solidstatedrive.vercel.app/video/shoti",
        { timeout: 20000 }
      );

      if (!data || !data.link) {
        return api.sendMessage(
          "❌ Failed to fetch a valid Shoti video. Try again later.",
          threadID
        );
      }

      // DOWNLOAD VIDEO
      const videoStream = await axios({
        method: "GET",
        url: data.link,
        responseType: "stream",
        timeout: 30000
      });

      const writer = fs.createWriteStream(videoPath);
      videoStream.data.pipe(writer);

      writer.on("finish", () => {
        api.sendMessage(
          {
            body:
`🎬 SHOTI RANDOM VIDEO
━━━━━━━━━━━━━━━━━━━
👤 Creator: ${data.creator || "Unknown"}
📛 Username: ${data.username || "Unknown"}
📝 Title: ${data.title || "No title"}

━━━━━━━━━━━━━━━━━━━
By Jerobie • Laug Laug`,
            attachment: fs.createReadStream(videoPath)
          },
          threadID,
          () => {
            // DELETE FILE AFTER SEND
            fs.unlinkSync(videoPath);
          }
        );
      });

      writer.on("error", () => {
        api.sendMessage(
          "❌ Failed to process the video.",
          threadID
        );
      });

    } catch (err) {
      api.sendMessage(
        "❌ Failed to fetch a valid Shoti video. Try again later.",
        threadID
      );
    }
  });
};