const axios = require("axios");

/* ================= CONFIG ================= */
module.exports.config = {
  name: "phivolcs",
  version: "1.0.0",
  role: 0,
  hasPrefix: true,
  aliases: ["earthquake", "lindol"],
  description: "Get latest PHIVOLCS earthquake info in the Philippines",
  usage: "phivolcs <location>",
  credits: "Jerobie",
  cooldown: 5
};

/* ================= MAIN ================= */
module.exports.run = async function ({ api, event, args }) {
  const threadID = event.threadID;
  const location = args.join(" ").trim();

  if (!location) {
    return api.sendMessage(
`❌ Please provide a location.

Example:
phivolcs Batangas`,
      threadID
    );
  }

  try {
    const { data } = await axios.get(
      "https://betadash-api-swordslush-production.up.railway.app/phivolcs",
      { params: { info: location } }
    );

    if (!data?.info?.length) {
      return api.sendMessage(
`❌ No earthquake data found for "${location}".`,
        threadID
      );
    }

    const eq = data.info[0].details;

    api.sendMessage(
`🌏 PHIVOLCS EARTHQUAKE UPDATE
━━━━━━━━━━━━━━━━━━━
📍 Location:
${eq.location}

📅 Date & Time:
${eq.dateTime}

📏 Magnitude:
${eq.magnitude}

🌋 Depth:
${eq.depth} km

🧭 Origin:
${eq.origin}
━━━━━━━━━━━━━━━━━━━
Source: PHIVOLCS
By Jerobie • Laug Laug`,
      threadID
    );

  } catch (err) {
    console.error("PHIVOLCS ERROR:", err.message);
    api.sendMessage(
`❌ Something went wrong while fetching PHIVOLCS data.
Try again later.`,
      threadID
    );
  }
};