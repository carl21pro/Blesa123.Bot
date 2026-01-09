module.exports.config = {
  name: "slytherin",
  version: "1.0.0",
  role: 0,
  hasPrefix: true, // NEED PREFIX
  aliases: ["slyth"],
  description: "Slytherin welcome message",
  usage: "prefix + slytherin",
  credits: "Jerobie",
  cooldown: 3
};

module.exports.run = async function ({ api, event }) {
  const threadID = event.threadID;

  const message = `🐍 Welcome to Slytherin!

To all new Wizards and Witches, kindly follow the enrollment steps below:

📜 Reveal Your Identity  
Please update your NICKNAME so we can recognize you on the board.  
Format:  
Name | Chess Username  

Example:  
Harm | Seggsonchat  

🗣️ Don't Be a Ghost  
Don't be shy! Feel free to mingle, keep your wands ready, and please be active.

🏆 Join the Club (Chess.com)  
👉 https://www.chess.com/club/chessopath-gtg/join

📘 Join the Group (Facebook)  
👉 https://facebook.com/groups/2186968291656839/`;

  api.sendMessage(message, threadID);
};