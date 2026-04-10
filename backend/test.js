import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

async function testGemini() {
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      throw new Error("API key not found in .env");
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    // ✅ Stable working model (important)
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash"
    });

    const result = await model.generateContent("Say hello in one line");

    const response = result.response.text();

    console.log("✅ SUCCESS:");
    console.log(response);

  } catch (error) {
    console.log("❌ ERROR:");
    console.log(error.message);
  }
}

testGemini();