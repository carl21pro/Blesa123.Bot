const axios = require("axios");

/* ================= ADMIN ================= */
const ADMIN_ID = "61560890733272"; // NEW MAIN ACCOUNT UID

/* ================= CONFIG ================= */
module.exports.config = {
  name: "gemini",
  version: "Gemini Ultra",
  role: 0,
  hasPrefix: false, // ❌ NO PREFIX
  aliases: ["geminiultra", "gemi"],
  description: "Gemini Ultra — Advanced AI Assistant",
  usage: "[just type your message]",
  credits: "Jerobie",
  cooldown: 0
};

/* ================= HELPERS ================= */
function getMode(text) {
  if (/psych|mind|behavior|emotion|mental/i.test(text)) return "PSYCHOLOGY";
  if (/code|program|js|node|python|api/i.test(text)) return "CODING";
  if (/essay|explain|why|how/i.test(text)) return "EXPLANATION";
  return "GENERAL";
}

function getPHTime() {
  return new Date().toLocaleString("en-PH", {
    timeZone: "Asia/Manila",
    dateStyle: "medium",
    timeStyle: "short"
  });
}

/* ================= MAIN ================= */
module.exports.run = async function ({ api, event, args }) {
  const input = args.join(" ").trim();
  const threadID = event.threadID;

  // kapag walang input
  if (!input) {
    return api.sendMessage(
`🤖 ❲ Gemini Ultra ❳
━━━━━━━━━━━━━━━
Hello. Just talk to me.
Ask anything — I respond intelligently.

━━━━━━━━━━━━━━━
© Jerobie`,
      threadID
    );
  }

  const mode = getMode(input);

  api.sendMessage(
    "🤖 Gemini Ultra is thinking…",
    threadID,
    async (_, info) => {
      try {
        const { data } = await axios.get(
          "https://betadash-api-swordslush-production.up.railway.app/gemini",
          {
            params: { ask: input },
            timeout: 30000
          }
        );

        const answer =
          data?.response ||
          data?.answer ||
          data?.result ||
          "I couldn’t generate a response right now.";

        api.editMessage(
`🤖 ❲ Gemini Ultra ❳
━━━━━━━━━━━━━━━
🧠 Mode: ${mode}

${answer}

━━━━━━━━━━━━━━━
🕒 ${getPHTime()}
© Jerobie`,
          info.messageID
        );
      } catch (err) {
        api.editMessage(
`❌ Gemini Ultra is currently unavailable.
Please try again later.`,
          info.messageID
        );
      }
    }
  );
};