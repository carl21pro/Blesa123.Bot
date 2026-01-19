
module.exports.config = {
  name: "ChessoGroup",
  version: "1.0.0",
  role: 0,
  hasPrefix: true, // NEED PREFIX
  aliases: ["chessopath", "joinchesso"],
  description: "Invite people to Chessopath groups",
  usage: "prefix + ChessoGroup",
  credits: "Chessopath / Jerobie",
  cooldown: 3
};

module.exports.run = async function ({ api, event }) {
  const threadID = event.threadID;

  const message = `
♟️ Welcome to 𝑪𝑯𝑬𝑺𝑺𝑶𝑷𝑨𝑻𝑯 ♟️  
Where strategy meets magic! ✨  

🏆 Join the Club (Chess.com)  
👉 https://www.chess.com/club/chessopath-gtg/join  

📘 Join the Group (Facebook)  
👉 https://facebook.com/groups/2186968291656839/  

♜ Join the Team (Lichess)  
👉 https://lichess.org/team/chessopath-gtg  

Become part of the most magical chess community in the realm.  
Unleash your tactics, share your wisdom, and grow with fellow wizards of the 64 squares. ⚡  

—
🧙 Owner: Chessopath | Jerobie
`;

  api.sendMessage(message, threadID);
};