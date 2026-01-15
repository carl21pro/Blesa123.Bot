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
  name: "simsimi",
  version: "1.0.0",
  role: 0,
  hasPrefix: true,
  aliases: ["sim", "chat"],
  description: "Simsimi tool (auto reply)",
  usage: "prefix + simsimi <text>",
  credits: "Jerobie",
  cooldown: 3
};

/* ================= MAIN ================= */
module.exports.run = async ({ api, event, args }) => {
  const { threadID, messageID } = event;
  const query = args.join(" ");

  if (!query) {
    return api.sendMessage(
      formatFont("❌ | Maglagay ka ng sasabihin."),
      threadID,
      messageID
    );
  }

  // loading message
  api.sendMessage(
    formatFont("⚙️ SimsimiTool processing..."),
    threadID,
    async (_, info) => {
      try {
        const res = await axios.get(
          "https://vern-rest-api.vercel.app/api/simsimi",
          { params: { query }, timeout: 20000 }
        );

        const reply = res.data?.result?.reply || "walang nasagot";
        const author = res.data?.result?.author || "system";
        const time = res.data?.result?.processingTime || "—";

        // auto delete loading
        api.unsendMessage(info.messageID);

        const message = `
╭──────────────╮
 ⚙️ 𝗦𝗜𝗠𝗦𝗜𝗠𝗜 𝗧𝗢𝗢𝗟
╰──────────────╯

💬 ${reply}

—
👤 ${author}
⏱ ${time}
        `;

        api.sendMessage(formatFont(message.trim()), threadID);

      } catch (err) {
        api.unsendMessage(info.messageID);
        api.sendMessage(
          formatFont("❌ | Simsimi tool unavailable."),
          threadID
        );
      }
    }
  );
};