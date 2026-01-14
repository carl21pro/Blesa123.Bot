const axios = require("axios");

/* ================= CONFIG ================= */
module.exports.config = {
  name: "ss", // MAIN COMMAND
  version: "1.0.0",
  role: 0,
  hasPrefix: true, // NEED PREFIX
  aliases: ["screenshot", "webshot"],
  description: "Take a screenshot of a website",
  usage: "ss <url>",
  credits: "Jerobie",
  cooldown: 5
};

/* ================= MAIN ================= */
module.exports.run = async function ({ api, event, args }) {
  const threadID = event.threadID;
  const url = args.join(" ").trim();

  if (!url) {
    return api.sendMessage(
`❌ Please provide a website URL.

Example:
ss https://google.com`,
      threadID
    );
  }

  const apiUrl =
    "https://betadash-api-swordslush-production.up.railway.app/screenshot?url=" +
    encodeURIComponent(url);

  try {
    api.sendMessage(
`📸 Taking screenshot...
Please wait...`,
      threadID,
      async () => {
        api.sendMessage(
          {
            attachment: await global.utils.getStreamFromURL(apiUrl)
          },
          threadID
        );
      }
    );

  } catch (err) {
    console.error("SS ERROR:", err.message);
    api.sendMessage(
`❌ Failed to capture screenshot.
Try again later.`,
      threadID
    );
  }
};