module.exports.config = {
  name: "hufflepuff",
  version: "1.0.0",
  role: 0,
  hasPrefix: true, // NEED PREFIX
  aliases: ["huffle", "puff"],
  description: "Hufflepuff welcome message",
  usage: "prefix + hufflepuff",
  credits: "Jerobie",
  cooldown: 3
};

module.exports.run = async function ({ api, event }) {
  const threadID = event.threadID;

  const message = `🦡 Welcome to Hufflepuff!

To all new Wizards and Witches, kindly follow the enrollment steps below:

📜 Reveal Your Identity  
Please update your NICKNAME so we can recognize you on the board.  
Format:  
Name | Chess Username  

Example:  
Harm | Seggsonchat  

🗣️ Stay Active & United  
Hufflepuff values loyalty, patience, and teamwork.  
Be active, be respectful, and support your housemates.

🏆 Join the Club (Chess.com)  
👉 https://www.chess.com/club/chessopath-gtg/join

📘 Join the Group (Facebook)  
👉 https://facebook.com/groups/2186968291656839/`;

  api.sendMessage(message, threadID);
};