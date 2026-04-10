import dotenv from "dotenv";

dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY;

async function listModels() {
  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1/models?key=${API_KEY}`
    );

    const data = await res.json();

    if (data.error) {
      console.log("❌ ERROR:", data.error.message);
      return;
    }

    console.log("✅ AVAILABLE MODELS:\n");

    data.models.forEach((model) => {
      console.log(model.name);
    });

  } catch (err) {
    console.log("❌ FAILED:", err.message);
  }
}

listModels();