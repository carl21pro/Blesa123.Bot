const axios = require("axios");
const fs = require("fs").promises;
const moment = require("moment-timezone");
const path = require("path");

const MEMORY_FILE = "./gemini_memory.json";

module.exports.config = {
  name: "ai",
  version: "3.0.0-PRO",
  role: 0,
  hasPrefix: false,
  aliases: ["gemini", "gemi", "draw", "gen"],
  description: "Ultra-Fast Gemini with Memory & Image Generation",
  usage: "[message] or [draw/gen + description]",
  credits: "Jerobie & Gemini",
  cooldown: 2
};

/* 📥 UTILS & MEMORY */
async function loadMemory() {
  try {
    const data = await fs.readFile(MEMORY_FILE, "utf-8");
    return JSON.parse(data);
  } catch { return {}; }
}

async function saveMemory(data) {
  await fs.writeFile(MEMORY_FILE, JSON.stringify(data, null, 2));
}

const getMode = (text) => {
  if (/draw|gen|image|picture|create/i.test(text)) return "IMAGEN_GEN";
  if (/code|js|py|debug/i.test(text)) return "CODE_OPTIMIZER";
  return "NEURAL_TEXT";
};

/* 🚀 MAIN RUN */
module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID, senderID: uid } = event;
  const input = args.join(" ").trim();
  const timePH = moment().tz("Asia/Manila").format("hh:mm A");

  // 1. Check for Reset Command
  if (['reset', 'clear', 'forget'].includes(input.toLowerCase())) {
    const memory = await loadMemory();
    delete memory[uid];
    await saveMemory(memory);
    return api.sendMessage("🧠 **Memory Purged.** I've cleared our history.", threadID, messageID);
  }

  // 2. Initial prompt check
  if (!input) {
    return api.sendMessage("✨ **Gemini Ultra 2026**\n━━━━━━━━━━━━━━━\nHow can I help you today?\n\n🎨 `ai draw a futuristic city` \n💬 `ai explain quantum theory` \n🧹 `ai reset` to clear history.", threadID, messageID);
  }

  const mode = getMode(input);
  const statusMsg = await api.sendMessage(mode === "IMAGEN_GEN" ? "🎨 Generating your vision..." : "⚡ Processing...", threadID);

  try {
    // 3. Handle Image Generation Mode
    if (mode === "IMAGEN_GEN") {
      const imgPrompt = input.replace(/draw|gen|create|image|picture/i, "").trim();
      // Using a high-performance image endpoint
      const imgUrl = `https://wudysoft.xyz/api/ai/image/generate?prompt=${encodeURIComponent(imgPrompt)}`;
      
      const imgPath = path.join(__dirname, `cache/gen_${uid}.png`);
      const response = await axios({ url: imgUrl, responseType: 'arraybuffer' });
      await fs.writeFile(imgPath, Buffer.from(response.data));

      await api.unsendMessage(statusMsg.messageID);
      return api.sendMessage({
        body: `🎨 **Generated Visual**\nPrompt: "${imgPrompt}"\n\n© Gemini Nano Banana`,
        attachment: require("fs").createReadStream(imgPath)
      }, threadID, () => fs.unlink(imgPath)); // Delete cache after sending
    }

    // 4. Handle Text/Context Mode
    const memory = await loadMemory();
    const history = memory[uid]?.history || [];
    const context = history.map(m => `${m.role}: ${m.content}`).join("\n");
    
    const { data } = await axios.get(`https://wudysoft.xyz/api/ai/gemini/v7`, {
      params: { prompt: `${context}\nUser: ${input}` },
      timeout: 25000
    });

    const answer = data.response || data.answer || "I'm having trouble thinking right now.";
    
    // Update Memory (Keep last 10 lines)
    memory[uid] = memory[uid] || { history: [] };
    memory[uid].history.push({ role: "user", content: input }, { role: "assistant", content: answer });
    if (memory[uid].history.length > 10) memory[uid].history.splice(0, 2);
    await saveMemory(memory);

    const ui = 
`🤖 𝐆𝐄𝐌𝐈𝐍𝐈 𝐔𝐋𝐓𝐑𝐀 𝟐𝟎𝟐𝟔
━━━━━━━━━━━━━━━
${answer}
━━━━━━━━━━━━━━━
🕒 ${timePH} • Mode: ${mode}`;

    await api.editMessage(ui, statusMsg.messageID);

  } catch (err) {
    console.error(err);
    api.editMessage("🚫 **System Offline.** Please try again later.", statusMsg.messageID);
  }
};
