/* ================= JERO.AI.3.0 ================= */

const OWNER_INFO = {
  name: "Jr jerobie",
  facebook: "https://www.facebook.com/jirokeene.bundang",
  phone: "09771256938",
  gmail: "jeroAilauglaug.help.org@gmail.com"
};

/* ================= MAIN AI FUNCTION ================= */
async function JeroAI3(question) {

  // OWNER INFO TRIGGER
  if (/ai owner info|owner info|about you|who made you|developer/i.test(question.toLowerCase())) {
    return {
      bot: "Jero.Ai.3.0",
      success: true,
      answer:
`🤖 Jero.Ai.3.0 — OWNER INFO
━━━━━━━━━━━━━━━━━━
👤 Name: ${OWNER_INFO.name}

🔵 Facebook:
${OWNER_INFO.facebook}

📞 Contact:
${OWNER_INFO.phone}

📧 Gmail:
${OWNER_INFO.gmail}

━━━━━━━━━━━━━━━━━━
© Jr jerobie`,
      author: "Jr jerobie"
    };
  }

  // NORMAL AI QUESTION
  try {
    const response = await fetch(
      `https://norch-project.gleeze.com/api/Gpt5?prompt=${encodeURIComponent(question)}`
    );

    const data = await response.json();

    return {
      bot: "Jero.Ai.3.0",
      model: data.model || "GPT-5",
      success: data.success ?? true,
      answer: data.result || "No response generated.",
      timestamp: new Date().toISOString(),
      author: "Jr jerobie"
    };

  } catch (err) {
    return {
      bot: "Jero.Ai.3.0",
      success: false,
      answer: "❌ AI is currently unavailable.",
      error: err.message,
      author: "Jr jerobie"
    };
  }
}

/* ================= TEST RUN ================= */
(async () => {
  // ANY QUESTION
  const res1 = await JeroAI3("Ai what is the basic fundamental in coding");
  console.log(res1);

  // OWNER INFO
  const res2 = await JeroAI3("Ai owner info");
  console.log(res2);
})();