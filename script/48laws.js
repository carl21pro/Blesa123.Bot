const axios = require("axios");

/* ================= CONFIG ================= */
module.exports.config = {
  name: "48laws",
  version: "1.0.0",
  role: 0,
  hasPrefix: true,
  aliases: ["law", "powerlaw"],
  description: "Get a random law from the 48 Laws of Power",
  usage: "48laws",
  credits: "Jerobie",
  cooldown: 5
};

/* ================= MAIN ================= */
module.exports.run = async function ({ api, event }) {
  const threadID = event.threadID;

  api.sendMessage(
    "📜 Fetching wisdom from the 48 Laws of Power...",
    threadID,
    async (_, info) => {
      try {
        const { data } = await axios.get(
          "https://betadash-api-swordslush-production.up.railway.app/api/48laws",
          { timeout: 20000 }
        );

        /**
         * Expected possible formats:
         * data.law
         * data.title
         * data.description
         * data.number
         */

        const lawNumber =
          data?.number || data?.lawNumber || "—";

        const lawTitle =
          data?.law || data?.title || "Unknown Law";

        const lawDesc =
          data?.description || data?.text || "No description available.";

        api.editMessage(
`⚜️ 48 Laws of Power
━━━━━━━━━━━━━━━━━━━
📖 Law ${lawNumber}
🧠 ${lawTitle}

${lawDesc}

━━━━━━━━━━━━━━━━━━━
By Jerobie • Laug Laug`,
          info.messageID
        );
      } catch (err) {
        api.editMessage(
`❌ Failed to fetch 48 Laws data.
Please try again later.`,
          info.messageID
        );
      }
    }
  );
};