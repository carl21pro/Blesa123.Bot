const axios = require("axios");

module.exports.config = {
  name: "lootedpinay",
  version: "1.1.0",
  role: 0,
  hasPrefix: false,
  aliases: ["lootpinay", "pinay"],
  description: "Fetch LootedPinay video",
  usage: "lootedpinay [limit]",
  credits: "Jerobie",
  cooldown: 3
};

module.exports.run = async function ({ api, event, args }) {
  const threadID = event.threadID;
  const limit = parseInt(args[0]) || 1;

  try {
    const { data } = await axios.get(
      "https://urangkapolka.vercel.app/api/lootedpinay",
      { params: { limit } }
    );

    if (!data || !Array.isArray(data) || data.length === 0) {
      return api.sendMessage("❌ Walang nakuha na video.", threadID);
    }

    // send first video (safe + stable)
    const videoStream = await axios.get(data[0], {
      responseType: "stream"
    });

    await api.sendMessage(
      {
        body: "📹 LootedPinay Video",
        attachment: videoStream.data
      },
      threadID
    );

    // after sending video, send chat message
    await api.sendMessage("LuLu well 🚫🚫🚫🚫🚫", threadID);

  } catch (err) {
    console.error("[LOOTEDPINAY ERROR]", err);
    api.sendMessage("❌ Error while fetching video.", threadID);
  }
};