const axios = require("axios");

module.exports = {
  name: "phivolcs",
  aliases: ["earthquake", "lindol"],
  description: "Get latest PHIVOLCS earthquake info in the Philippines",
  usage: "(prefix)phivolcs <location>",
  cooldown: 5,

  async execute(message, args) {
    const location = args.join(" ");

    if (!location) {
      return message.reply(
`❌ Please provide a location.
Example:
!phivolcs Batangas`
      );
    }

    try {
      const res = await axios.get(
        `https://betadash-api-swordslush-production.up.railway.app/phivolcs?info=${encodeURIComponent(location)}`
      );

      const data = res.data;

      if (!data || !data.info || data.info.length === 0) {
        return message.reply(
`❌ No earthquake data found for "${location}".`
        );
      }

      const eq = data.info[0].details;

      message.reply(
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
By Jerobie • Laug Laug`
      );

    } catch (err) {
      console.error(err);
      message.reply(
`❌ Something went wrong while fetching PHIVOLCS data.
Try again later.`
      );
    }
  }
};