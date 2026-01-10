const axios = require("axios");

module.exports.config = {
  name: "animequotes",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Jerobie | Rev Dev",
  description: "Random anime quotes",
  usage: "animequotes",
  commandCategory: "fun",
};

module.exports.run = async function ({ api, event }) {
  try {
    const res = await axios.get("https://urangkapolka.vercel.app/api/animequotes");
    const data = res.data;

    // adjust keys kung iba structure ng API
    const quote = data.quote || "No quote found.";
    const character = data.character || "Unknown";
    const anime = data.anime || "Unknown Anime";

    const msg = `
🌸━━━━━━━━━━━━━━━━━━🌸
🎌 𝐀𝐍𝐈𝐌𝐄 𝐐𝐔𝐎𝐓𝐄 𝐎𝐅 𝐓𝐇𝐄 𝐌𝐎𝐌𝐄𝐍𝐓 🎌
🌸━━━━━━━━━━━━━━━━━━🌸

💬
“${quote}”

🎭 𝐂𝐡𝐚𝐫𝐚𝐜𝐭𝐞𝐫: ${character}
📺 𝐀𝐧𝐢𝐦𝐞: ${anime}

━━━━━━━━━━━━━━━━━━━━
✨ Minsan anime lang… pero masakit.
🤖 Rev Dev AI
`;

    return api.sendMessage(msg, event.threadID);

  } catch (err) {
    console.error(err);
    return api.sendMessage(
      "❌ Hindi makakuha ng anime quote ngayon. Try ulit mamaya.",
      event.threadID
    );
  }
};