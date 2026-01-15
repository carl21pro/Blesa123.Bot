module.exports.config = {
  name: "chessopath",
  version: "1.0.0",
  role: 0,
  hasPrefix: true, // NEED PREFIX
  aliases: ["rules", "ministry"],
  description: "Chessopath Ministry Rules",
  usage: "prefix + chessopath",
  credits: "Jerobie",
  cooldown: 3
};

module.exports.run = async function ({ api, event }) {
  const threadID = event.threadID;

  const message = `
🏰 HOGWARTS
━━━━━━━━━━━━━━━━━━━
📜 The Ministry Warnings

I. ❌ The Unforgivable Curse  
(No Engines) Using Stockfish or any engine is strictly forbidden.

II. 🤝 House Unity (Respect)  
Respect everyone. We are all wizards on the same 64 squares.

III. 🚫 No Dark Arts  
(No Hate) Bullying, hate speech, or toxic behavior is not allowed.

IV. 🪞 Check Your Ego  
(Be Humble) Win with grace, lose with honor.

V. 🪄 Wands at the Ready  
(Be Active) Participate in group activities and chats.

VI. 🔒 Restricted Section  
(No Porn) Absolutely no explicit or NSFW content.

VII. 🧼 Clean Incantations  
(No Vulgarity) Watch your language.

VIII. 🔕 No Howlers  
(No Spamming) Do not flood the chat.

IX. 🏳️ Loyalty  
(No Promotion) No recruiting for other groups or OCs.

X. 🏆 The Golden Rule  
(Have Fun) Enjoy the game and the company of fellow sorcerers.

━━━━━━━━━━━━━━━━━━━
By Order of the Ministry  
France Aceta Edgar Ofinel  
Jerobie  
Founders of Chessopath
`;

  api.sendMessage(message, threadID);
};