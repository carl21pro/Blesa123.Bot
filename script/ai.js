const axios = require("axios");
const fs = require("fs");
const moment = require("moment-timezone");

/* ================= ADMIN ================= */
const ADMIN_ID = "61560890733272"; // NEW MAIN ACCOUNT UID

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
  version: "Jero.Ai.2.0",
  role: 0,
  hasPrefix: false,
  aliases: ["gpt", "jero", "jeroai"],
  description: "Jero • Advanced AI (JRsupreme)",
  usage: "ai [question]",
  credits: "Jerobie",
  cooldown: 0
};

/* ================= HELPERS ================= */
const isFilipino = (t) =>
  /(ano|paano|bakit|sino|saan|tungkol|kamusta)/i.test(t);

function getMode() {
  return "JRsupreme";
}

/* ================= MAIN ================= */
module.exports.run = async function ({ api, event, args }) {
  const input = args.join(" ").trim();
  const uid = event.senderID;
  const threadID = event.threadID;

  /* ---------- EMPTY INPUT ---------- */
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
  memory[uid] = memory[uid] || { chats: 0 };
  memory[uid].chats++;
  saveMemory();

  const mode = getMode();
  const phTime = moment()
    .tz("Asia/Manila")
    .format("MMMM DD, YYYY • hh:mm A");

  /* ---------- SYSTEM PROMPT ---------- */
  const systemPrompt = `
You are Jero • Advanced AI.

You operate in JRsupreme mode.
Your responses are:
- psychologically aware
- emotionally intelligent
- calm but deep
- never robotic
- never shallow

You adapt to the user's tone.
If casual → casual.
If deep → philosophical.
If Filipino → respond in Filipino.
`;

  api.sendMessage(
    "🤖 Processing your request...",
    threadID,
    async (_, info) => {
      try {
        const { data } = await axios.get(
          "https://urangkapolka.vercel.app/api/chatgpt4",
          {
            params: {
              prompt: `${systemPrompt}\n\nUSER:\n${input}`
            },
            timeout: 30000
          }
        );

        const answer =
          data?.response ||
          data?.answer ||
          "I couldn’t form a response right now.";

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

        console.log(
          `[JRsupreme] UID:${uid} | Chats:${memory[uid].chats} | ${phTime}`
        );
      } catch (err) {
        api.editMessage(
          "❌ Something went wrong. Please try again later.",
          info.messageID
        );
        console.error("AI ERROR:", err.message);
      }
    }
  );
};