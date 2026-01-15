module.exports.config = {
    name: 'help',
    version: '2.0.0',
    role: 0,
    hasPrefix: false,
    aliases: ['help'],
    description: "Beginner's guide to all commands",
    usage: "help [page] or [command]",
    credits: 'Jerobie',
};

module.exports.run = async function({
    api,
    event,
    enableCommands,
    args,
    Utils,
    prefix
}) {
    const input = args.join(' ').trim();
    try {
        const eventCommands = enableCommands[1].handleEvent;
        const commands = enableCommands[0].commands;

        const createPageHeader = (page, totalPages) => 
            `⚔️⚔️⚔️\n\n====❯ 𝗖𝗢𝗠𝗠𝗔𝗡𝗗 𝗟𝗜𝗦𝗧: ❮====\n\nPage ${page} of ${totalPages}\n▱▱▱▱▱▱▱▱▱▱▱▱▱\n\n`;

        const createEventHeader = () => 
            '\n====❮ 𝗘𝗩𝗘𝗡𝗧 𝗟𝗜𝗦𝗧: ❯====\n▱▱▱▱▱▱▱▱▱▱▱▱▱\n\n';

        if (!input) {
            // DEFAULT: show all commands
            const pages = 999;
            const page = 1;
            let helpMessage = createPageHeader(page, Math.ceil(commands.length / pages));

            for (let i = 0; i < commands.length; i++) {
                helpMessage += `┍━☽\n ➔ ${prefix}${commands[i]}\n╰━━━━━━━━━━━✶\n`;
            }

            helpMessage += createEventHeader();
            eventCommands.forEach((ev, idx) => {
                helpMessage += `╭─────────────────╮\n | ${prefix}${ev}\n╰─────────────────╯\n`;
            });

            api.sendMessage(helpMessage, event.threadID, event.messageID);
        } else if (!isNaN(input)) {
            // PAGE number
            const page = parseInt(input);
            const pages = 999;
            let start = (page - 1) * pages;
            let end = start + pages;
            let helpMessage = createPageHeader(page, Math.ceil(commands.length / pages));

            for (let i = start; i < Math.min(end, commands.length); i++) {
                helpMessage += `\t${i + 1}. ${prefix}${commands[i]}\n`;
            }

            helpMessage += createEventHeader();
            eventCommands.forEach((ev, idx) => {
                helpMessage += `\t${idx + 1}. ${prefix}${ev}\n`;
            });

            api.sendMessage(helpMessage, event.threadID, event.messageID);
        } else {
            // SPECIFIC COMMAND
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
                cooldown,
                hasPrefix
            } = command;

            const roleMessage = role !== undefined 
                ? (role === 0 ? '➛ Permission: user' : role === 1 ? '➛ Permission: admin' : role === 2 ? '➛ Permission: thread Admin' : role === 3 ? '➛ Permission: super Admin' : '')
                : '';
            const aliasesMessage = aliases.length ? `➛ Aliases: ${aliases.join(', ')}\n` : '';
            const descriptionMessage = description ? `Description: ${description}\n` : '';
            const usageMessage = usage ? `➛ Usage: ${usage}\n` : '';
            const creditsMessage = credits ? `➛ Credits: ${credits}\n` : '';
            const versionMessage = version ? `➛ Version: ${version}\n` : '';
            const cooldownMessage = cooldown ? `➛ Cooldown: ${cooldown} second(s)\n` : '';

            const message = 
`「 Command 」

➛ Name: ${name}
${versionMessage}${roleMessage}
${aliasesMessage}${descriptionMessage}${usageMessage}${creditsMessage}${cooldownMessage}`;

            api.sendMessage(message, event.threadID, event.messageID);
        }

    } catch (error) {
        console.log(error);
        api.sendMessage('❌ An error occurred while fetching help.', event.threadID, event.messageID);
    }
};

module.exports.handleEvent = async function({
    api,
    event,
    prefix
}) {
    const { threadID, messageID, body } = event;
    const message = prefix ? `This is my prefix: ${prefix}` : "𝗠𝘆 𝗽𝗿𝗲𝗳𝗶𝘅 𝗶𝘀: [set in config]";
    if (body?.toLowerCase().startsWith('prefix')) {
        api.sendMessage(message, threadID, messageID);
    }
};