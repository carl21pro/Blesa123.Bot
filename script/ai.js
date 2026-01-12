const axios = require("axios");
const fs = require("fs");

/* ================= ADMIN ================= */
const ADMIN_ID = "100001139243627";

/* ================= OWNER INFO ================= */
const OWNER_INFO = {
  name: "Jero",
  bot: "Jero • Advanced AI",
  facebook: "https://www.facebook.com/jirokeene.bundang",
  phone: "09771256938",
  gmail: "PogiNiJerobieLauglaug@gmail.com"
};

/* ================= MEMORY ================= */
const MEMORY_FILE = "./aiStudentMemory.json";
let memory = fs.existsSync(MEMORY_FILE)
  ? JSON.parse(fs.readFileSync(MEMORY_FILE))
  : {};

function saveMemory() {
  fs.writeFileSync(MEMORY_FILE, JSON.stringify(memory, null, 2));
}

/* ================= CONFIG ================= */
module.exports.config = {
  name: "ai",
  version: "Jero.Ai.JRsupreme",
  role: 0,
  hasPrefix: false,
  aliases: ["jero", "jeroai", "gpt"],
  description: "Jero • Advanced AI (JRsupreme Mode)",
  usage: "ai [message]",
  credits: "Jerobie",
  cooldown: 0
};

/* ================= HELPERS ================= */
const isFilipino = (t) =>
  /(ano|paano|bakit|sino|saan|pwede|help|tulong)/i.test(t);

function detectIntent(text) {
  if (/timer/i.test(text)) return "TIMER";
  if (/essay|sanaysay/i.test(text)) return "ESSAY";
  if (/solve|compute|math|kwentahin/i.test(text)) return "MATH";
  if (/code|javascript|node|html|css/i.test(text)) return "CODING";
  if (/life|meaning|exist|purpose|pain|fear|choice/i.test(text))
    return "DEEP";
  return "GENERAL";
}

/* ================= MAIN ================= */
module.exports.run = async function ({ api, event, args }) {
  const input = args.join(" ").trim();
  const uid = event.senderID;
  const threadID = event.threadID;

  if (!input) {
    return api.sendMessage(
`🤖 ❲ Jero • Advanced AI ❳
━━━━━━━━━━━━━━━
🧠 Mode: JRsupreme

Ask anything you want:
• Deep thoughts
• Coding / Tech
• Math / Homework
• Essays
• Timer tools

Just type your question below.`,
      threadID
    );
  }

  /* ---------- OWNER INFO ---------- */
  if (/owner info|ai info|who made you|about you/i.test(input)) {
    return api.sendMessage(
`🤖 ${OWNER_INFO.bot}
━━━━━━━━━━━━━━━
👤 Owner: ${OWNER_INFO.name}

🔵 Facebook:
${OWNER_INFO.facebook}

📞 Contact:
${OWNER_INFO.phone}

📧 Gmail:
${OWNER_INFO.gmail}

━━━━━━━━━━━━━━━
By Jerobie • Laug Laug`,
      threadID
    );
  }

  /* ---------- ADMIN COMMANDS ---------- */
  if (/reset memory/i.test(input) && uid === ADMIN_ID) {
    memory = {};
    saveMemory();
    return api.sendMessage("🧠 Memory reset successful.", threadID);
  }

  if (/view stats/i.test(input) && uid === ADMIN_ID) {
    return api.sendMessage(
      `📊 ADMIN PANEL\nTotal Users Stored: ${Object.keys(memory).length}`,
      threadID
    );
  }

  /* ---------- TIMER ---------- */
  const intent = detectIntent(input);
  if (intent === "TIMER") {
    const mins = parseInt(input.match(/\d+/)?.[0]);
    if (!mins)
      return api.sendMessage("⏱️ Please specify the number of minutes.", threadID);

    api.sendMessage(`⏳ Timer started: ${mins} minute(s).`, threadID);
    setTimeout(() => {
      api.sendMessage("⏰ Timer ended.", threadID);
    }, mins * 60000);
    return;
  }

  /* ---------- MEMORY UPDATE ---------- */
  memory[uid] = memory[uid] || { chats: 0 };
  memory[uid].chats++;
  saveMemory();

  /* ================= GPT4‑OMNI API CALL ================= */

  // SYSTEM / PERSONALITY
  const systemPrompt = `
You are Jero • Advanced AI operating in JRsupreme mode.

Personality:
- Calm, insightful, analytical
- Answers like a thoughtful human
- Deep when needed, simple when appropriate
- Reflective but helpful, never generic

INTENT: ${intent}

User said:
"${input}"
`;

  api.sendMessage("🤖 JRsupreme is thinking...", threadID, async (_, info) => {
    try {
      const { data } = await axios.get(
        "https://betadash-api-swordslush-production.up.railway.app/gpt4-omni",
        {
          params: {
            ask: `${systemPrompt}`,
            userid: uid
          },
          timeout: 45000
        }
      );

      const answer =
        data?.response ||
        data?.answer ||
        "I’m reflecting on what you asked, but I can’t form a clear answer yet.";

      api.editMessage(
`🤖 ❲ Jero • Advanced AI ❳
━━━━━━━━━━━━━━━
🧠 Mode: JRsupreme

${answer}

━━━━━━━━━━━━━━━
By Jerobie • Laug Laug`,
        info.messageID
      );
    } catch (e) {
      api.editMessage(
        isFilipino(input)
          ? "❌ Hindi available ang AI ngayon. Subukan ulit mamaya."
          : "❌ The AI is currently not available. Try again later.",
        info.messageID
      );
    }
  });
};