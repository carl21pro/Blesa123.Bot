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

// Register new user
function register(uid, name) {
  const data = loadData();
  if (data.users[uid]) return "❌ You are already registered.";
  // check if name exists
  for (const user of Object.values(data.users)) {
    if (user.name.toLowerCase() === name.toLowerCase()) {
      return "❌ Name already taken.";
    }
  }
  data.users[uid] = { name, registered: true };
  data.bank[uid] = { balance: 0, debt: 0, banned: false };
  saveData(data);
  return `✅ Registered successfully as ${name}.`;
}

// Deposit
function deposit(uid, amount) {
  const data = loadData();
  if (!data.users[uid]) return "❌ You need to register first.";
  if (amount <= 0) return "❌ Invalid amount.";
  data.bank[uid].balance += amount;
  saveData(data);
  return `✅ Deposited ${amount}. Current balance: ${data.bank[uid].balance}`;
}

// Withdraw
function withdraw(uid, amount) {
  const data = loadData();
  if (!data.users[uid]) return "❌ You need to register first.";
  if (amount > data.bank[uid].balance) return "❌ Not enough balance.";
  data.bank[uid].balance -= amount;
  saveData(data);
  return `✅ Withdrawn ${amount}. Current balance: ${data.bank[uid].balance}`;
}

// Loan
function loan(uid, amount) {
  const data = loadData();
  if (!data.users[uid]) return "❌ You need to register first.";
  if (amount > 200000) return "❌ Max loan is 200k.";
  data.bank[uid].balance += amount;
  data.bank[uid].debt += amount;
  saveData(data);
  return `✅ Loaned ${amount}. Debt: ${data.bank[uid].debt}, Balance: ${data.bank[uid].balance}`;
}

// Leaderboard
function leaderboard() {
  const data = loadData();
  const sorted = Object.entries(data.bank)
    .sort((a, b) => b[1].balance - a[1].balance)
    .map(([uid, info], index) => `${index+1}. ${data.users[uid].name} - ${info.balance}`);
  return sorted.join("\n");
}

module.exports = { register, deposit, withdraw, loan, leaderboard };