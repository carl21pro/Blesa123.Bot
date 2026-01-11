const axios = require("axios");
const fs = require("fs");

/* ================= ADMIN ================= */
const ADMIN_ID = "61576798881317";

/* ================= OWNER INFO ================= */
const OWNER_INFO = {
  name: "Blesa",
  bot: "Blesa.Ai • Psychology Core",
  facebook: "https://www.facebook.com/profile.php?id=61576798881317",
  phone: "09396195140",
  uid: "61576798881317"
};

/* ================= MEMORY ================= */
const MEMORY_FILE = "./aiPsychMemory.json";
let memory = fs.existsSync(MEMORY_FILE)
  ? JSON.parse(fs.readFileSync(MEMORY_FILE))
  : {};

function saveMemory() {
  fs.writeFileSync(MEMORY_FILE, JSON.stringify(memory, null, 2));
}

/* ================= CONFIG ================= */
module.exports.config = {
  name: "ai",
  version: "Blesa.Ai-PSY",
  role: 0,
  hasPrefix: false,
  aliases: ["blesa", "psy", "mind"],
  description: "Advanced Psychology-based Messenger AI",
  usage: "ai [message]",
  credits: "Jerobie x Blesa",
  cooldown: 0
};

/* ================= HELPERS ================= */
const isFilipino = (t) =>
  /(ano|bakit|paano|sino|saan|kamusta|alam mo)/i.test(t);

function getMode(text) {
  if (/trauma|emotion|feel|feeling|pain|hurt|sad|depress|anxiety/i.test(text))
    return "PSYCHOLOGY";
  if (/meaning|exist|purpose|life|conscious/i.test(text))
    return "EXISTENTIAL";
  if (/math|solve|compute|kwentahin/i.test(text))
    return "LOGIC";
  return "PSYCHOLOGY";
}

/* ================= MAIN ================= */
module.exports.run = async function ({ api, event, args }) {
  const input = args.join(" ").trim();
  const uid = event.senderID;
  const threadID = event.threadID;

  if (!input) {
    return api.sendMessage(
`🤖 ❲ 𝗕𝗹𝗲𝘀𝗮 • 𝗔𝗱𝘃𝗮𝗻𝗰𝗲𝗱 𝗔𝗜 ❳ 🤖
━━━━━━━━━━━━━━━
🧠 Default Mode: PSYCHOLOGY

Talk to me.
• Thoughts
• Emotions
• Life questions
• Mental struggles
• Deep reflections

I don't just answer.
I analyze.`,
      threadID
    );
  }

  /* ---------- OWNER INFO ---------- */
  if (/owner|about|who made you|info/i.test(input)) {
    return api.sendMessage(
`🤖 ${OWNER_INFO.bot}
━━━━━━━━━━━━━━━
👤 Owner: ${OWNER_INFO.name}
📞 ${OWNER_INFO.phone}

🔵 Facebook:
${OWNER_INFO.facebook}

🆔 UID:
${OWNER_INFO.uid}
━━━━━━━━━━━━━━━`,
      threadID
    );
  }

  /* ---------- ADMIN ---------- */
  if (/reset memory/i.test(input) && uid === ADMIN_ID) {
    memory = {};
    saveMemory();
    return api.sendMessage("🧠 Memory wiped clean.", threadID);
  }

  /* ---------- MEMORY ---------- */
  memory[uid] = memory[uid] || { chats: 0, last: Date.now() };
  memory[uid].chats++;
  memory[uid].last = Date.now();
  saveMemory();

  const mode = getMode(input);
  const filipino = isFilipino(input);

  /* ---------- PSYCHOLOGY PROMPT ---------- */
  const systemPrompt = `
You are Blesa.Ai, an advanced psychology-focused AI.

CORE IDENTITY:
- You analyze human behavior, thoughts, and emotions
- You respond with depth, clarity, and insight
- You sound calm, intelligent, and reflective
- You never answer shallowly

MODE: ${mode}

RULES:
- Always explain the *why*, not just the *what*
- Use psychological concepts when relevant
- If existential, go deep and philosophical
- If emotional, be validating but honest
- Match user's language (Filipino or English)
- No emojis unless appropriate
- Sound like a thinking mind, not a chatbot
`;

  api.sendMessage("🧠 Processing your mind...", threadID, async (_, info) => {
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
        "My thoughts failed to organize. Ask again.";

      api.editMessage(
`🤖 ❲ 𝗕𝗹𝗲𝘀𝗮 • 𝗔𝗱𝘃𝗮𝗻𝗰𝗲𝗱 𝗔𝗜 ❳ 🤖
━━━━━━━━━━━━━━━
🧠 Mode: ${mode}

${answer}

━━━━━━━━━━━━━━━
“I don’t just reply.
I understand.”`,
        info.messageID
      );
    } catch (e) {
      api.editMessage(
        filipino
          ? "❌ May aberya sa pag-iisip ko. Subukan ulit."
          : "❌ My cognitive process failed. Try again.",
        info.messageID
      );
    }
  });
};