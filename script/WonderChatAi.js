const axios = require("axios");

module.exports.config = {
  name: "wonderchat",
  version: "1.0.0",
  role: 0,
  hasPrefix: true,
  aliases: ["wc", "wonder"],
  description: "WonderChat AI – structured intelligent response system",
  usage: "wonderchat <question>",
  credits: "Jerobie Lauglaug"
};

module.exports.run = async function ({
  api,
  event,
  args,
  prefix
}) {
  const question = args.join(" ");
  if (!question) {
    return api.sendMessage(
      `⚠️ Usage: ${prefix}wonderchat <your question>`,
      event.threadID,
      event.messageID
    );
  }

  const startTime = Date.now();

  try {
    const res = await axios.get(
      "https://ioark-apiv1.onrender.com/ai/wonderchat-ai",
      { params: { question } }
    );

    const endTime = Date.now();
    const responseTime = `${endTime - startTime}ms`;

    const now = new Date();
    const globalDate = now.toISOString().split("T")[0];
    const globalTime = now.toTimeString().split(" ")[0].slice(0, 5);

    const reply = res.data?.result || "No response generated.";

    const message =
`🤖 WonderChat AI
━━━━━━━━━━━━━━━━━━
🧠 Framework: WC-Core v1.0
👤 Owner: Jerobie Lauglaug
📅 Date: ${globalDate}
⏰ Time: ${globalTime}
⚡ Response: ${responseTime}
━━━━━━━━━━━━━━━━━━

${reply}
`;

    api.sendMessage(message, event.threadID, event.messageID);

  } catch (err) {
    console.error(err);
    api.sendMessage(
      "❌ WonderChat AI encountered an error. Please try again later.",
      event.threadID,
      event.messageID
    );
  }
};