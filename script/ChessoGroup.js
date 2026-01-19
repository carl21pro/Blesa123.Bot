module.exports.config = {
  name: "ChessoGroup",
  version: "1.0.0",
  role: 0,
  hasPrefix: true, // ✅ requires prefix
  aliases: ["chessopath", "joinchess"],
  description: "Invite everyone to join Chessopath’s official groups ♟️",
  usage: "prefix + ChessoGroup",
  credits: "Chessopath / Jerobie",
  cooldown: 3
};

module.exports.run = async ({ api, event }) => {
  const { threadID, messageID } = event;

  const message = `
♟️ 𝑾𝒆𝒍𝒄𝒐𝒎𝒆 𝒕𝒐 𝑪𝑯𝑬𝑺𝑺𝑶𝑷𝑨𝑻𝑯 ♟️  
Where strategy meets magic, and every move tells a story! ✨  

We’re building a strong and friendly community of chess wizards from all over the world 🌍  
Join us and become part of the Chessopath legacy!

🏆 𝗝𝗼𝗶𝗻 𝗼𝘂𝗿 𝗖𝗹𝘂𝗯 (Chess.com)  
👉 https://www.chess.com/club/chessopath-gtg/join

📘 𝗝𝗼𝗶𝗻 𝗼𝘂𝗿 𝗚𝗿𝗼𝘂𝗽 (Facebook)  
👉 https://facebook.com/groups/2186968291656839/

♜ 𝗝𝗼𝗶𝗻 𝗼𝘂𝗿 𝗡𝗲𝘄 𝗧𝗲𝗮𝗺 (Lichess)  
👉 https://lichess.org/team/chessopath-gtg

💬 Whether you’re a beginner or a grandmaster,  
there’s always room for one more brave mind in our magical halls of Chessopath! 🏰  

—
🧙‍♂️ 𝑶𝒘𝒏𝒆𝒓: Chessopath / Jerobie
  `.trim();

  api.sendMessage(message, threadID, messageID);
};