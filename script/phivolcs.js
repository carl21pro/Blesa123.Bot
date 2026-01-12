const axios = require("axios");

/* ================= CONFIG ================= */
module.exports.config = {
  name: "phivolcs",
  version: "1.1",
  role: 0,
  hasPrefix: true,
  aliases: ["quake", "earthquake"],
  description: "Get latest earthquake info from PHIVOLCS with map preview",
  usage: "phivolcs <location>",
  credits: "Jerobie",
  cooldown: 0
};

/* ================= MAIN ================= */
module.exports.run = async function ({ api, event, args }) {
  const threadID = event.threadID;
  const location = args.join(" ").trim();

  if (!location) {
    return api.sendMessage(
      "❌ Please specify a location. Example:\nphivolcs Batangas",
      threadID
    );
  }

  const url = `https://betadash-api-swordslush-production.up.railway.app/phivolcs?info=${encodeURIComponent(location)}`;

  try {
    const { data } = await axios.get(url, { timeout: 15000 });

    if (!data || !data.info || data.info.length === 0) {
      return api.sendMessage(
        `⚠️ No recent earthquake info found for "${location}".`,
        threadID
      );
    }

    // Loop through each earthquake event
    for (let idx = 0; idx < data.info.length; idx++) {
      const eventData = data.info[idx];
      const details = eventData.details;

      let message = `🌏 PHIVOLCS – Earthquake Info for "${location}"\n━━━━━━━━━━━━━━━━━━━━\n`;
      message += `📌 Event #${idx + 1}\n`;
      message += `📅 Date & Time: ${details.dateTime}\n`;
      message += `📍 Location: ${details.location}\n`;
      message += `🌊 Depth: ${details.depth} km\n`;
      message += `💥 Magnitude: ${details.magnitude}\n`;
      message += `⚡ Origin: ${details.origin}\n`;
      message += `🔗 Source: ${details.sourceUrl}\n`;
      message += `━━━━━━━━━━━━━━━━━━━━\n`;

      // Send message with map image if available
      if (details.mapImageUrl) {
        await api.sendMessage(
          {
            body: message,
            attachment: { type: "image", url: details.mapImageUrl }
          },
          threadID
        );
      } else {
        await api.sendMessage(message, threadID);
      }
    }
  } catch (err) {
    console.error(err);
    api.sendMessage(
      "❌ Something went wrong while fetching PHIVOLCS data. Try again later.",
      threadID
    );
  }
};