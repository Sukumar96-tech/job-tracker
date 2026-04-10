import fetch from "node-fetch";
import { ParsedJobDescription } from '../types/index.js';

export class AIService {

  private static getGeminiApiKey(): string {
    const key = process.env.GEMINI_API_KEY;
    if (!key) throw new Error('GEMINI_API_KEY is not set');
    return key;
  }

  static async parseJobDescription(
    jobDescription: string
  ): Promise<ParsedJobDescription> {

    try {
      const apiKey = this.getGeminiApiKey();

      const prompt = `
Extract job details and return ONLY valid JSON.

Do NOT include explanation.

Format:
{
  "company": "",
  "role": "",
  "requiredSkills": [],
  "niceToHaveSkills": [],
  "seniority": "",
  "location": ""
}

Job Description:
${jobDescription}
`;

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text: prompt }]
              }
            ]
          }),
        }
      );

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`Gemini API error ${res.status}: ${txt}`);
      }

      const data = await res.json() as any;

      console.log("📦 Gemini RAW:", JSON.stringify(data));

      const content =
        data?.candidates?.[0]?.content?.parts?.[0]?.text;

      console.log("🧠 Content:", content);

      if (!content) {
        throw new Error("No response from Gemini");
      }

      let parsed: any = {};

      try {
        parsed = JSON.parse(content);
      } catch {
        const match = content.match(/\{[\s\S]*\}/);
        if (match) {
          try {
            parsed = JSON.parse(match[0]);
          } catch {
            parsed = {};
          }
        }
      }

      return {
        company: parsed.company || "Unknown",
        role: parsed.role || "Unknown Role",
        requiredSkills: Array.isArray(parsed.requiredSkills) ? parsed.requiredSkills : [],
        niceToHaveSkills: Array.isArray(parsed.niceToHaveSkills) ? parsed.niceToHaveSkills : [],
        seniority: parsed.seniority || "mid",
        location: parsed.location || "Unknown",
      };

    } catch (error: any) {
      console.error("❌ REAL ERROR:", error);
      throw new Error(error?.message || "AI parsing failed");
    }
  }

  static async generateResumeSuggestions(
    role: string,
    company: string,
    skills: string[]
  ): Promise<string[]> {

    try {
      const apiKey = this.getGeminiApiKey();

      const prompt = `
Generate 4 resume bullet points.

Return ONLY JSON array.

Role: ${role}
Company: ${company}
Skills: ${skills.join(", ")}
`;

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text: prompt }]
              }
            ]
          }),
        }
      );

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`Gemini API error ${res.status}: ${txt}`);
      }

      const data = await res.json() as any;

      const content =
        data?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!content) {
        throw new Error("No suggestions from Gemini");
      }

      let parsed: any = [];

      try {
        parsed = JSON.parse(content);
      } catch {
        const match = content.match(/\[[\s\S]*\]/);
        if (match) {
          try {
            parsed = JSON.parse(match[0]);
          } catch {
            parsed = [];
          }
        }
      }

      return Array.isArray(parsed) ? parsed : [];

    } catch (error: any) {
      console.error("❌ REAL SUGGESTION ERROR:", error);
      throw new Error(error?.message || "Suggestion generation failed");
    }
  }
}