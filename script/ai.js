const axios = require("axios");
const fs = require("fs");
const moment = require("moment-timezone");

/* ================= ADMIN ================= */
const ADMIN_ID = "61560890733272"; // Main Account UID

/* ================= OWNER INFO ================= */
const OWNER_INFO = {
  name: "Jero",
  bot: "Jero • Advanced AI",
  facebook: "https://www.facebook.com/profile.php?id=61560890733272",
  phone: "09771256938",
  gmail: "jeroAilauglaug.help.org@gmail.com"
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
  version: "Jero.AI.2.1",
  role: 0,
  hasPrefix: false,
  aliases: ["gpt", "jero", "jeroai"],
  description: "Jero • Advanced AI (JRsupreme)",
  usage: "ai [question]",
  credits: "Jerobie",
  cooldown: 0
};

/* ================= SETTINGS ================= */
const AI_API_URL = "https://urangkapolka.vercel.app/api/chatgpt4";
const MAX_HISTORY = 5;

/* ================= HELPERS ================= */
function getSystemPrompt(mode) {
  return `
You are Jero • Advanced AI.

Mode: ${mode}

Your responses must be:
- emotionally intelligent
- psychologically aware
- calm but deep
- never robotic
- never shallow

If user speaks Filipino, respond in Filipino naturally.
If user is casual, match their tone.
If user is serious, respond thoughtfully.
  `.trim();
}

function getMode() {
  return "JRsupreme";
}

function formatTime() {
  return moment().tz("Asia/Manila").format("dddd, MMMM D • h:mm A");
}

/* ================= MAIN ================= */
module.exports.run = async function ({ api, event, args }) {
  const input = args.join(" ").trim();
  const uid = event.senderID;
  const threadID = event.threadID;

  /* ---------- NO INPUT ---------- */
  if (!input) {
    return api.sendMessage(
`🤖 ❲ Jero • Advanced AI ❳
━━━━━━━━━━━━━━━
🧠 Mode: JRsupreme

Type anything.
I analyze patterns, intent, and meaning — not just words.

━━━━━━━━━━━━━━━
By Jerobie • Laug Laug`,
      threadID
    );
  }

  /* ---------- OWNER INFO ---------- */
  if (/owner|developer|who made you|ai info/i.test(input)) {
    return api.sendMessage(
`🤖 ❲ Jero • Advanced AI ❳
━━━━━━━━━━━━━━━
👤 Owner: ${OWNER_INFO.name}

🔗 Facebook:
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

  /* ---------- MEMORY ---------- */
  memory[uid] = memory[uid] || { chats: 0, history: [] };
  memory[uid].chats++;
  memory[uid].history.push({ user: input });
  if (memory[uid].history.length > MAX_HISTORY) memory[uid].history.shift();
  saveMemory();

  const mode = getMode();
  const phTime = formatTime();

  const systemPrompt = getSystemPrompt(mode);

  /* ---------- RANDOM "THINKING" MESSAGE ---------- */
  const thinkingMessages = [
    "🤖 Thinking deeply...",
    "🧠 Processing your thoughts...",
    "✨ Analyzing patterns and meaning...",
    "⚡ Gathering logical insight..."
  ];
  const waitMsg = thinkingMessages[Math.floor(Math.random() * thinkingMessages.length)];

  api.sendMessage(waitMsg, threadID, async (_, info) => {
    try {
      const { data } = await axios.get(AI_API_URL, {
        params: {
          prompt: `${systemPrompt}\n\nCHAT HISTORY:\n${JSON.stringify(memory[uid].history)}\n\nUSER:\n${input}`
        },
        timeout: 30000
      });

      const answer =
        data?.response || data?.answer || "I couldn’t form a response right now.";

      api.editMessage(
`🤖 ❲ Jero • Advanced AI ❳
━━━━━━━━━━━━━━━
🧠 Mode: ${mode}

${answer}

━━━━━━━━━━━━━━━
📍 PH Time: ${phTime}
By Jerobie • Laug Laug`,
        info.messageID
      );

      console.log(`[JRsupreme] UID:${uid} | Chats:${memory[uid].chats} | ${phTime}`);
    } catch (err) {
      let errorMessage = "❌ Sorry, something went wrong.";
      if (err.code === "ECONNABORTED") errorMessage = "⚠️ The AI took too long to respond. Try again.";
      if (err.response) errorMessage = `🚫 API Error: ${err.response.status}`;

      api.editMessage(errorMessage, info.messageID);
      console.error("[AI ERROR]", err.message);
    }
  });
};