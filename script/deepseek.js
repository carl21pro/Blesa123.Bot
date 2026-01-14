const axios = require("axios");
const moment = require("moment-timezone");

/* ================= OWNER INFO ================= */
const OWNER_INFO = {
  name: "Jerobie",
  bot: "Ultra DeepSeek",
};

/* ================= CONFIG ================= */
module.exports.config = {
  name: "deepseek",
  version: "3.1.0",
  role: 0,
  hasPrefix: false,
  aliases: ["ds", "udseek", "deepseekv3"],
  description: "Ultra DeepSeek — analytical intelligence engine",
  usage: "deepseek <message>",
  credits: "Jerobie",
  cooldown: 0
};

/* ================= MAIN ================= */
module.exports.run = async function ({ api, event, args }) {
  const input = args.join(" ").trim();
  const threadID = event.threadID;

  const phTime = moment()
    .tz("Asia/Manila")
    .format("MMMM DD, YYYY • hh:mm A");

  /* ---------- EMPTY INPUT ---------- */
  if (!input) {
    return api.sendMessage(
`◆ ◇ ULTRA DEEPSEEK ◇ ◆
━━━━━━━━━━━━━━━━━━
Mode: Ultra Jerobie

Input required.
This system analyzes structure, logic, and depth — not surface words.

━━━━━━━━━━━━━━━━━━
PH Time: ${phTime}
© ${OWNER_INFO.name}`,
      threadID
    );
  }

  /* ---------- PROCESSING ---------- */
  api.sendMessage(
    "◆ Processing logic layers...",
    threadID,
    async (_, info) => {
      try {
        const { data } = await axios.get(
          "https://betadash-api-swordslush-production.up.railway.app/Deepseek-V3",
          {
            params: { ask: input },
            timeout: 30000
          }
        );

        const answer =
          data?.response ||
          data?.answer ||
          data?.result ||
          "No logical output generated.";

        api.editMessage(
`◆ ◇ ULTRA DEEPSEEK ◇ ◆
━━━━━━━━━━━━━━━━━━
Mode: Ultra Jerobie

${answer}

━━━━━━━━━━━━━━━━━━
PH Time: ${phTime}
© ${OWNER_INFO.name}`,
          info.messageID
        );

      } catch (err) {
        api.editMessage(
`◆ ◇ ULTRA DEEPSEEK ◇ ◆
━━━━━━━━━━━━━━━━━━
System unavailable.
Logic stream temporarily halted.

━━━━━━━━━━━━━━━━━━
PH Time: ${phTime}
© ${OWNER_INFO.name}`,
          info.messageID
        );
        console.error("ULTRA DEEPSEEK ERROR:", err.message);
      }
    }
  );
};