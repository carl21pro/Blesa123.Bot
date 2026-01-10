/* ===============================
   TERMS CHECK
================================ */
const agreeCheckbox = document.getElementById("agreeCheckbox");
const submitButton = document.getElementById("submitButton");

agreeCheckbox.addEventListener("change", () => {
  submitButton.disabled = !agreeCheckbox.checked;
});

/* ===============================
   COMMAND STORAGE
================================ */
let Commands = [
  { commands: [] },
  { handleEvent: [] }
];

/* ===============================
   ADS (OPTIONAL SAFE)
================================ */
function showAds() {
  const ads = [""];
  if (!ads[0]) return;
  const index = Math.floor(Math.random() * ads.length);
  window.location.href = ads[index];
}

/* ===============================
   PING CHECK
================================ */
function measurePing() {
  const start = Date.now();
  fetch(location.href + "?ping=" + start)
    .then(() => {
      const ping = Date.now() - start;
      document.getElementById("ping").textContent = ping + " ms";
    })
    .catch(() => {
      document.getElementById("ping").textContent = "N/A";
    });
}
setInterval(measurePing, 1000);

/* ===============================
   TIME (PH)
================================ */
function updateTime() {
  const now = new Date();
  document.getElementById("time").textContent =
    now.toLocaleString("en-US", {
      timeZone: "Asia/Manila",
      hour12: true,
      hour: "numeric",
      minute: "numeric",
      second: "numeric"
    });
}
updateTime();
setInterval(updateTime, 1000);

/* ===============================
   SUBMIT STATE
================================ */
async function State() {
  const jsonInput = document.getElementById("json-data");

  if (!Commands[0].commands.length) {
    return showResult("❌ Please select at least one command.");
  }

  let parsedState;
  try {
    parsedState = JSON.parse(jsonInput.value);
  } catch {
    return showResult("❌ Invalid JSON Appstate.");
  }

  submitButton.disabled = true;

  try {
    const res = await fetch("/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        state: parsedState,
        commands: Commands,
        prefix: document.getElementById("inputOfPrefix").value,
        admin: document.getElementById("inputOfAdmin").value
      })
    });

    const data = await res.json();
    showResult(data.message || "✅ Bot deployed successfully!");
    jsonInput.value = "";
    showAds();

  } catch (err) {
    showResult("❌ Server error. Please try again.");
  } finally {
    setTimeout(() => {
      submitButton.disabled = false;
    }, 3000);
  }
}

/* ===============================
   RESULT DISPLAY
================================ */
function showResult(message) {
  const result = document.getElementById("result");
  result.innerHTML = `<h4>${message}</h4>`;
  result.style.display = "block";
}

/* ===============================
   LOAD COMMAND LIST
================================ */
async function commandList() {
  try {
    const res = await fetch("/commands");
    const { commands, handleEvent } = await res.json();

    commands.forEach((cmd, i) => {
      listOfCommands.appendChild(createCommand(cmd, "commands"));
    });

    handleEvent.forEach((evt, i) => {
      listOfCommandsEvent.appendChild(createCommand(evt, "handleEvent"));
    });

  } catch (e) {
    console.error("Failed to load commands", e);
  }
}

/* ===============================
   CREATE TOGGLE
================================ */
function createCommand(name, type) {
  const wrap = document.createElement("div");
  wrap.className = "command-item";

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";

  const label = document.createElement("span");
  label.textContent = name;

  wrap.onclick = () => {
    checkbox.checked = !checkbox.checked;
    toggleCommand(name, type, checkbox.checked);
    wrap.classList.toggle("active", checkbox.checked);
  };

  wrap.appendChild(checkbox);
  wrap.appendChild(label);
  return wrap;
}

/* ===============================
   TOGGLE LOGIC
================================ */
function toggleCommand(name, type, isChecked) {
  const target =
    type === "commands" ? Commands[0].commands : Commands[1].handleEvent;

  if (isChecked && !target.includes(name)) {
    target.push(name);
  } else if (!isChecked) {
    const index = target.indexOf(name);
    if (index !== -1) target.splice(index, 1);
  }
}

/* ===============================
   SELECT ALL
================================ */
function selectAllCommands() {
  document.querySelectorAll("#listOfCommands .command-item")
    .forEach(item => item.click());
}

function selectAllEvents() {
  document.querySelectorAll("#listOfCommandsEvent .command-item")
    .forEach(item => item.click());
}

/* ===============================
   INIT
================================ */
commandList();