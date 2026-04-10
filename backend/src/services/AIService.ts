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

    const apiKey = this.getGeminiApiKey();

    const prompt = `
Extract job details from the following job description and return ONLY valid JSON:

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

    const data = await res.json();

    const content =
      data.candidates?.[0]?.content?.parts?.[0]?.text || "";

    let parsed: any;

    try {
      parsed = JSON.parse(content);
    } catch {
      const match = content.match(/\{[\s\S]*\}/);
      if (match) parsed = JSON.parse(match[0]);
      else throw new Error("Failed to parse Gemini response");
    }

    return {
      company: parsed.company || "Unknown",
      role: parsed.role || "Unknown Role",
      requiredSkills: parsed.requiredSkills || [],
      niceToHaveSkills: parsed.niceToHaveSkills || [],
      seniority: parsed.seniority || "mid",
      location: parsed.location || "Unknown",
    };
  }

  static async generateResumeSuggestions(
    role: string,
    company: string,
    skills: string[]
  ): Promise<string[]> {

    const apiKey = this.getGeminiApiKey();

    const prompt = `
Generate 4 resume bullet points for:
Role: ${role}
Company: ${company}
Skills: ${skills.join(", ")}

Return ONLY JSON array.
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

    const data: any = await res.json();

    const content =
      data.candidates?.[0]?.content?.parts?.[0]?.text || "";

    let parsed: any;

    try {
      parsed = JSON.parse(content);
    } catch {
      const match = content.match(/\[[\s\S]*\]/);
      if (match) parsed = JSON.parse(match[0]);
      else throw new Error("Failed to parse suggestions");
    }

    return Array.isArray(parsed) ? parsed : [];
  }
}