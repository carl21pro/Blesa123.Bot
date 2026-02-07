const axios = require("axios");
const fs = require("fs");
const moment = require("moment-timezone");

/* ================= ADMIN ================= */
const ADMIN_ID = "61560890733272";

/* ================= OWNER INFO ================= */
const OWNER_INFO = {
  name: "Jero",
  bot: "Jero • Assist Vision AI",
  facebook: "https://www.facebook.com/profile.php?id=61560890733272",
  phone: "09771256938",
  gmail: "jeroAilauglaug.help.org@gmail.com"
};

/* ================= MEMORY ================= */
const MEMORY_FILE = "./assistVisionMemory.json";

let memory = fs.existsSync(MEMORY_FILE)
  ? JSON.parse(fs.readFileSync(MEMORY_FILE))
  : {};

function saveMemory() {
  fs.writeFileSync(MEMORY_FILE, JSON.stringify(memory, null, 2));
}

/* ================= CONFIG ================= */
module.exports.config = {
  name: "ai", // ✅ pinalitan na
  version: "AssistVision.Jero.2.0",
  role: 0,
  hasPrefix: false,

  // ✅ dinagdagan ng maraming may "ai"
  aliases: [
    "visionai",
    "assistai",
    "jero",
    "gpt",
    "ai",
    "jeroai",
    "vision",
    "assistvisionai"
  ],

  description: "Assist Vision + Jero Advanced AI (Memory Enabled)",
  usage: "ai [message]",
  credits: "Jerobie + Assist Vision Team",
  cooldown: 0
};

/* ================= SETTINGS ================= */
const AI_API_URL = "https://urangkapolka.vercel.app/api/chatgpt4";
const MAX_HISTORY = 6;

/* ================= SYSTEM PROMPT ================= */

function getSystemPrompt() {
  return `
You are Assist Vision + Jero Advanced AI.

Your personality:
- emotionally intelligent
- psychologically aware
- smart and natural
- calm but deep
- friendly but intelligent
- never robotic
- never shallow

Language rules:
- If user speaks Filipino → reply Filipino naturally
- If casual tone → match casual
- If serious → respond properly

You remember recent conversation context.
  `.trim();
}

function formatTime() {
  return moment().tz("Asia/Manila").format("MMM D YYYY • h:mm A");
}

/* ================= MAIN ================= */

module.exports.run = async function ({ api, event, args }) {

  const input = args.join(" ").trim();
  const uid = event.senderID;
  const threadID = event.threadID;

  /* ---------- NO INPUT ---------- */
  if (!input) {
    return api.sendMessage(
`🤖 Assist Vision • Jero AI
━━━━━━━━━━━━━━━
Talk to me.
I remember context and analyze meaning — not just words.
━━━━━━━━━━━━━━━`,
      threadID
    );
  }

  /* ---------- OWNER INFO ---------- */
  if (/owner|developer|who made you|ai info/i.test(input)) {
    return api.sendMessage(
`🤖 Assist Vision • Jero AI
━━━━━━━━━━━━━━━
👤 Owner: ${OWNER_INFO.name}

🔗 Facebook:
${OWNER_INFO.facebook}

📞 Contact:
${OWNER_INFO.phone}

📧 Gmail:
${OWNER_INFO.gmail}
━━━━━━━━━━━━━━━`,
      threadID
    );
  }

  /* ---------- MEMORY INIT ---------- */
  memory[uid] = memory[uid] || {
    chats: 0,
    history: []
  };

  memory[uid].chats++;
  memory[uid].history.push({ user: input });

  if (memory[uid].history.length > MAX_HISTORY)
    memory[uid].history.shift();

  saveMemory();

  const phTime = formatTime();
  const systemPrompt = getSystemPrompt();

  /* ---------- THINKING MESSAGE ---------- */
  const thinkingMessages = [
    "🧠 Thinking...",
    "⚡ Processing...",
    "✨ Analyzing context...",
    "🤖 Building response...",
    "🌌 Reading intent patterns..."
  ];

  const waitMsg =
    thinkingMessages[Math.floor(Math.random() * thinkingMessages.length)];

  api.sendMessage(waitMsg, threadID, async (_, info) => {

    try {

      const { data } = await axios.get(AI_API_URL, {
        params: {
          prompt: `${systemPrompt}

CHAT HISTORY:
${JSON.stringify(memory[uid].history)}

USER:
${input}`
        },
        timeout: 30000
      });

      const answer =
        data?.response ||
        data?.answer ||
        "Sorry, I couldn't respond properly.";

      api.editMessage(
`🤖 Assist Vision • Jero AI
━━━━━━━━━━━━━━━
${answer}

━━━━━━━━━━━━━━━
📍 PH Time: ${phTime}`,
        info.messageID
      );

      console.log(
        `[AssistVision-Jero] UID:${uid} | Chats:${memory[uid].chats}`
      );

    } catch (err) {

      let errorMessage = "❌ AI error occurred.";

      if (err.code === "ECONNABORTED")
        errorMessage = "⚠️ AI timeout. Try again.";

      if (err.response)
        errorMessage = `🚫 API Error: ${err.response.status}`;

      api.editMessage(errorMessage, info.messageID);
      console.error("[AI ERROR]", err.message);
    }

  });

};