const axios = require("axios");

module.exports.config = {
  name: "bible",
  version: "1.0.0",
  role: 0,
  hasPrefix: true, // kailangan ng prefix
  aliases: ["verse", "randombible"],
  description: "Sends a random Bible verse",
  usage: "prefix + bible",
  credits: "Jerobie",
  cooldown: 3
};

module.exports.run = async function ({ api, event }) {
  const threadID = event.threadID;

  try {
    const { data } = await axios.get("https://urangkapolka.vercel.app/api/bible");
    // Assuming API returns { verse: "..." }
    const verse = data.verse || "📖 Could not fetch verse at the moment.";

    api.sendMessage(`📖 Random Bible Verse:\n\n${verse}`, threadID);
  } catch (err) {
    console.error(err);
    api.sendMessage("❌ Error fetching Bible verse. Try again later.", threadID);
  }
};