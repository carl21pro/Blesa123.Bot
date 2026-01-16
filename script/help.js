module.exports.config = {
  name: 'help',
  version: '1.0.1',
  role: 0,
  hasPrefix: false,
  aliases: ['help'],
  description: "Beginner's guide",
  usage: "Help [page] or [command]",
  credits: 'Jerobie',
};

module.exports.run = async function ({
  api,
  event,
  enableCommands,
  args,
  Utils,
  prefix
}) {
  const input = args.join(' ');
  try {
    const eventCommands = enableCommands[1].handleEvent;
    const commands = enableCommands[0].commands;

    // ================= DEFAULT HELP =================
    if (!input) {
      const pages = 999;
      const page = 1;
      const start = (page - 1) * pages;
      const end = start + pages;

      let helpMessage = `
⚔️━━━━━━━━━━━━━━━━━━━━⚔️
        𝗖𝗢𝗠𝗠𝗔𝗡𝗗 𝗟𝗜𝗦𝗧
⚔️━━━━━━━━━━━━━━━━━━━━⚔️

`;

      for (let i = start; i < Math.min(end, commands.length); i++) {
        helpMessage += `➤ ${i + 1}. ${prefix}${commands[i]}\n`;
      }

      helpMessage += `
━━━━━━━━━━━━━━━━━━━━━━
📌 𝗘𝗩𝗘𝗡𝗧 𝗖𝗢𝗠𝗠𝗔𝗡𝗗𝗦
━━━━━━━━━━━━━━━━━━━━━━
`;

      eventCommands.forEach((cmd, index) => {
        helpMessage += `➤ ${index + 1}. ${prefix}${cmd}\n`;
      });

      helpMessage += `
━━━━━━━━━━━━━━━━━━━━━━
📖 Usage:
• ${prefix}help <page>
• ${prefix}help <command>

🌐 Create your own bot:
https://blesa123-bot.onrender.com

Page ${page}/${Math.ceil(commands.length / pages)}
`;

      return api.sendMessage(helpMessage, event.threadID, event.messageID);
    }

    // ================= PAGE VIEW =================
    else if (!isNaN(input)) {
      const page = parseInt(input);
      const pages = 999;
      const start = (page - 1) * pages;
      const end = start + pages;

      let helpMessage = `
📚 𝗖𝗢𝗠𝗠𝗔𝗡𝗗 𝗟𝗜𝗦𝗧 (Page ${page})
━━━━━━━━━━━━━━━━━━━━━━
`;

      for (let i = start; i < Math.min(end, commands.length); i++) {
        helpMessage += `➤ ${i + 1}. ${prefix}${commands[i]}\n`;
      }

      helpMessage += `
━━━━━━━━━━━━━━━━━━━━━━
📌 𝗘𝗩𝗘𝗡𝗧 𝗖𝗢𝗠𝗠𝗔𝗡𝗗𝗦
`;

      eventCommands.forEach((cmd, index) => {
        helpMessage += `➤ ${index + 1}. ${prefix}${cmd}\n`;
      });

      helpMessage += `
━━━━━━━━━━━━━━━━━━━━━━
Page ${page}/${Math.ceil(commands.length / pages)}
`;

      return api.sendMessage(helpMessage, event.threadID, event.messageID);
    }

    // ================= COMMAND INFO =================
    else {
      const command = [...Utils.handleEvent, ...Utils.commands]
        .find(([key]) => key.includes(input.toLowerCase()))?.[1];

      if (!command) {
        return api.sendMessage('❌ Command not found.', event.threadID, event.messageID);
      }

      const {
        name,
        version,
        role,
        aliases = [],
        description,
        usage,
        credits,
        cooldown
      } = command;

      const roleText =
        role === 0 ? 'User' :
        role === 1 ? 'Admin' :
        role === 2 ? 'Thread Admin' :
        role === 3 ? 'Super Admin' : 'Unknown';

      const message = `
📘 𝗖𝗢𝗠𝗠𝗔𝗡𝗗 𝗜𝗡𝗙𝗢
━━━━━━━━━━━━━━━━━━━━━━
🔹 Name: ${name}
🔹 Version: ${version || 'N/A'}
🔹 Permission: ${roleText}
${aliases.length ? `🔹 Aliases: ${aliases.join(', ')}` : ''}
${description ? `🔹 Description: ${description}` : ''}
${usage ? `🔹 Usage: ${usage}` : ''}
${cooldown ? `🔹 Cooldown: ${cooldown}s` : ''}
${credits ? `🔹 Credits: ${credits}` : ''}
━━━━━━━━━━━━━━━━━━━━━━
`;

      return api.sendMessage(message, event.threadID, event.messageID);
    }

  } catch (err) {
    console.error(err);
  }
};

// ================= PREFIX EVENT =================
module.exports.handleEvent = async function ({ api, event, prefix }) {
  const { threadID, messageID, body } = event;
  if (body?.toLowerCase().startsWith('prefix')) {
    const msg = prefix
      ? `🔧 My prefix is: ${prefix}`
      : `🔧 No prefix set.`;
    api.sendMessage(msg, threadID, messageID);
  }
};