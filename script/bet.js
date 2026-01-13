const fs = require("fs");
const DATA_FILE = "./data.json";

function loadData() {
  return fs.existsSync(DATA_FILE)
    ? JSON.parse(fs.readFileSync(DATA_FILE))
    : { users: {}, bank: {} };
}

function saveData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// Bet command
function bet(uid, amount, choice) {
  const data = loadData();
  if (!data.users[uid]) return "❌ You need to register first.";
  if (amount <= 0) return "❌ Invalid bet amount.";
  if (amount > data.bank[uid].balance) return "❌ Not enough balance.";

  const options = ["head", "tails"];
  if (!options.includes(choice.toLowerCase())) return "❌ Choose head or tails.";

  const result = options[Math.floor(Math.random() * 2)];
  let message = `🎲 You chose ${choice}, result: ${result}. `;

  if (choice.toLowerCase() === result) {
    data.bank[uid].balance += amount;
    message += `✅ You won ${amount}! Balance: ${data.bank[uid].balance}`;
  } else {
    data.bank[uid].balance -= amount;
    message += `❌ You lost ${amount}. Balance: ${data.bank[uid].balance}`;
  }

  saveData(data);
  return message;
}

module.exports = { bet };