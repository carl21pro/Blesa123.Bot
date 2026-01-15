const axios = require("axios");

let fontEnabled = true;

function formatFont(text) {
  const fontMapping = {
    a: "𝖺", b: "𝖻", c: "𝖼", d: "𝖽", e: "𝖾", f: "𝖿", g: "𝗀", h: "𝗁", i: "𝗂", j: "𝗃", k: "𝗄", l: "𝗅", m: "𝗆",
    n: "𝗇", o: "𝗈", p: "𝗉", q: "𝗊", r: "𝗋", s: "𝗌", t: "𝗍", u: "𝗎", v: "𝗏", w: "𝗐", x: "𝗑", y: "𝗒", z: "𝗓",
    A: "𝖠", B: "𝖡", C: "𝖢", D: "𝖣", E: "𝖤", F: "𝖥", G: "𝖦", H: "𝖧", I: "𝖨", J: "𝖩", K: "𝖪", L: "𝖫", M: "𝖬",
    N: "𝖭", O: "𝖮", P: "𝖯", Q: "𝖰", R: "𝖱", S: "𝖲", T: "𝖳", U: "𝖴", V: "𝖵", W: "𝖶", X: "𝖷", Y: "𝖸", Z: "𝖹"
  };

  let out = "";
  for (const c of text) {
    out += fontEnabled && fontMapping[c] ? fontMapping[c] : c;
  }
  return out;
}

module.exports.config = {
  name: "ip",
  version: "1.1.0",
  role: 0,
  hasPrefix: true,
  aliases: ["ipinfo", "checkip"],
  credits: "Jerobie",
  description: "Check IP address information (Updated & Stable)",
  usages: "ip [address]",
  cooldown: 5,
};

module.exports.run = async ({ api, event, args }) => {
  const { threadID, messageID } = event;

  if (!args[0]) {
    return api.sendMessage(
      formatFont("❌ | Please enter an IP address."),
      threadID,
      messageID
    );
  }

  const ip = args[0];

  try {
    const res = await axios.get(`http://ip-api.com/json/${ip}?fields=66846719`);
    const d = res.data;

    if (d.status !== "success") {
      return api.sendMessage(
        formatFont("❌ | Invalid or private IP address."),
        threadID,
        messageID
      );
    }

    const msg = `
===== ✅ IP INFORMATION =====
🌍 IP: ${d.query}
🏙 City: ${d.city || "N/A"}
🏞 Region: ${d.regionName || "N/A"}
🏛 Country: ${d.country || "N/A"}
📮 ZIP: ${d.zip || "N/A"}
📍 Lat: ${d.lat}
📍 Lon: ${d.lon}
⏰ Timezone: ${d.timezone}
🌐 ISP: ${d.isp || "N/A"}
🏢 Org: ${d.org || "N/A"}
📡 ASN: ${d.as || "N/A"}
📱 Mobile: ${d.mobile ? "Yes" : "No"}
🛡 Proxy/VPN: ${d.proxy ? "Yes" : "No"}
    `;

    api.sendMessage(formatFont(msg.trim()), threadID, messageID);

  } catch (e) {
    api.sendMessage(
      formatFont("❌ | Service unavailable. Try again later."),
      threadID,
      messageID
    );
  }
};