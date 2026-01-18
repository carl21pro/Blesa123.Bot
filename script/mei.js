const axios = require("axios");

/* ================= FONT ================= */
let fontEnabled = true;
function formatFont(text) {
const map = {
a:"𝖺",b:"𝖻",c:"𝖼",d:"𝖽",e:"𝖾",f:"𝖿",g:"𝗀",h:"𝗁",i:"𝗂",j:"𝗃",k:"𝗄",l:"𝗅",m:"𝗆",
n:"𝗇",o:"𝗈",p:"𝗉",q:"𝗊",r:"𝗋",s:"𝗌",t:"𝗍",u:"𝗎",v:"𝗏",w:"𝗐",x:"𝗑",y:"𝗒",z:"𝗓",
A:"𝖠",B:"𝖡",C:"𝖢",D:"𝖣",E:"𝖤",F:"𝖥",G:"𝖦",H:"𝖧",I:"𝖨",J:"𝖩",K:"𝖪",L:"𝖫",M:"𝖬",
N:"𝖭",O:"𝖮",P:"𝖯",Q:"𝖰",R:"𝖱",S:"𝖲",T:"𝖳",U:"𝖴",V:"𝖵",W:"𝖶",X:"𝖷",Y:"𝖸",Z:"𝖹"
};
return text.split("").map(c => fontEnabled && map[c] ? map[c] : c).join("");
}

/* ================= CONFIG ================= */
module.exports.config = {
name: "mei",
version: "1.0.1",
role: 0,
hasPrefix: true,
aliases: ["chatmei", "meiai", "jenny"],
description: "Mei AI Girlfriend — Chat with Mei, your virtual companion",
usage: "prefix + mei <message>",
credits: "Jerobie",
cooldown: 3
};

/* ================= MAIN ================= */
module.exports.run = async ({ api, event, args }) => {
const { threadID, messageID } = event;
const query = args.join(" ");

if (!query) {
return api.sendMessage(
formatFont("❌ | Please say something for Mei 💞"),
threadID,
messageID
);
}

try {
const response = await axios.get(
https://golden-bony-solidstatedrive.vercel.app/ai/mei?message=${encodeURIComponent(query)},
{ timeout: 15000 }
);

const reply = response.data?.result || "I didn’t catch that 😅";  

const message = `

╭──────────────╮
💞 𝗠𝗘𝗜 𝗔𝗜 𝗚𝗜𝗥𝗟𝗙𝗥𝗜𝗘𝗡𝗗
╰──────────────╯

💬 ${reply}

—
👑 Owner: Jerobie Laug Laug
`;

api.sendMessage(formatFont(message.trim()), threadID);

} catch (err) {
api.sendMessage(
formatFont("❌ | Mei is currently unavailable."),
threadID
);
}
};

this is working?