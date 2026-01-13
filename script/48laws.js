const laws48 = {
  1: "Never outshine the master.",
  2: "Never put too much trust in friends, learn how to use enemies.",
  3: "Conceal your intentions.",
  4: "Always say less than necessary.",
  5: "Guard your reputation with your life.",
  6: "Court attention at all costs.",
  7: "Get others to do the work, but take the credit.",
  8: "Make others come to you.",
  9: "Win through actions, never argument.",
  10: "Avoid the unhappy and unlucky.",
  11: "Make people depend on you.",
  12: "Use selective honesty to disarm.",
  13: "Appeal to self-interest, never mercy.",
  14: "Pose as a friend, work as a spy.",
  15: "Crush your enemy totally.",
  16: "Use absence to increase respect.",
  17: "Be unpredictable.",
  18: "Do not isolate yourself.",
  19: "Know who you are dealing with.",
  20: "Do not commit to anyone.",
  21: "Play a sucker to catch a sucker.",
  22: "Use surrender to weaken enemies.",
  23: "Concentrate your forces.",
  24: "Play the perfect courtier.",
  25: "Recreate yourself.",
  26: "Keep your hands clean.",
  27: "Create a cult-like following.",
  28: "Enter action boldly.",
  29: "Plan all the way to the end.",
  30: "Make achievements seem effortless.",
  31: "Control the options.",
  32: "Play to people's fantasies.",
  33: "Discover each man's weakness.",
  34: "Act like a king to be treated like one.",
  35: "Master the art of timing.",
  36: "Disdain what you cannot have.",
  37: "Create compelling spectacles.",
  38: "Think as you like, behave like others.",
  39: "Stir up waters to catch fish.",
  40: "Despise the free lunch.",
  41: "Avoid stepping into a great man's shoes.",
  42: "Strike the shepherd to scatter the sheep.",
  43: "Work on hearts and minds.",
  44: "Disarm with the mirror effect.",
  45: "Preach change, but never too much.",
  46: "Never appear too perfect.",
  47: "Do not go past the mark.",
  48: "Be formless."
};

module.exports = {
  name: "48laws",
  description: "48 Laws of Power (1–48)",
  usage: "(prefix)48laws <number>",
  execute(message, args) {
    const num = parseInt(args[0]);

    if (!num || num < 1 || num > 48) {
      return message.reply(
`❌ Invalid law number.
Use only 1 to 48.
Example: !48laws 7`
      );
    }

    message.reply(
`⚜️ 48 Laws of Power
━━━━━━━━━━━━━━━━━━━
📖 Law ${num}:
${laws48[num]}
━━━━━━━━━━━━━━━━━━━
By Jerobie • Laug Laug`
    );
  }
};