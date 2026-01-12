const axios = require("axios");

module.exports = {
  name: "phivolcs",
  description: "Get latest PHIVOLCS earthquake info",
  async execute(message, args) {
    const location = args.join(" ");

    if (!location) {
      return message.reply("❌ Please provide a location.\nExample: phivolcs batangas");
    }

    try {
      const res = await axios.get(
        `https://betadash-api-swordslush-production.up.railway.app/phivolcs?info=${encodeURIComponent(location)}`
      );

      const data = res.data;

      if (!data || !data.info || data.info.length === 0) {
        return message.reply("⚠️ No earthquake data found for that location.");
      }

      const quake = data.info[0].details;

      // PH Time
      const phTime = new Date().toLocaleString("en-PH", {
        timeZone: "Asia/Manila"
      });

      const response = `
🌏 **PHIVOLCS LATEST EARTHQUAKE INFO**
━━━━━━━━━━━━━━━━━━
📍 **Location**
${quake.location}

📅 **Date & Time**
${quake.dateTime}

📏 **Depth**
${quake.depth} km

📊 **Magnitude**
${quake.magnitude}

🌋 **Origin**
${quake.origin}

━━━━━━━━━━━━━━━━━━
🕒 PH Time: ${phTime}
© Jerobie
      `;

      message.reply(response);

    } catch (err) {
      console.error("PHIVOLCS ERROR:", err.message);

      message.reply(
        "❌ Something went wrong while fetching PHIVOLCS data. Try again later."
      );
    }
  }
};