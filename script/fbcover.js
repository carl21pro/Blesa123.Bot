const axios = require("axios");
const fs = require("fs");
const path = require("path");

/* ================= CONFIG ================= */
module.exports.config = {
  name: "fbcover",
  version: "1.0.0",
  role: 0,
  hasPrefix: true,
  aliases: ["cover", "fbc"],
  description: "Generate a Facebook cover using canvas API by Jerobie",
  usage: "fbcover [name]",
  credits: "Jerobie",
  cooldown: 5
};

/* ================= MAIN ================= */
module.exports.run = async function({ api, event, args }) {
  const threadID = event.threadID;
  const nameInput = args.join(" ").trim();

  if (!nameInput) {
    return api.sendMessage(
      "⚠️ Please provide a name. Example: fbcover John Doe",
      threadID
    );
  }

  try {
    // Call the FB Cover API
    const response = await axios.get("https://urangkapolka.vercel.app/api/fbcoverv1", {
      params: { name: nameInput },
      responseType: "arraybuffer",
      timeout: 30000
    });

    const imageBuffer = Buffer.from(response.data, "binary");
    const filePath = path.join(__dirname, `${nameInput}_fbcover.png`);
    fs.writeFileSync(filePath, imageBuffer);

    // Send the generated cover
    api.sendMessage(
      { body: `📌 FB Cover for: ${nameInput}`, attachment: fs.createReadStream(filePath) },
      threadID,
      () => fs.unlinkSync(filePath) // Delete local file after sending
    );

  } catch (err) {
    console.error("[FB Cover ERROR]", err.message);
    api.sendMessage("❌ Failed to generate FB Cover. Try again later.", threadID);
  }
};