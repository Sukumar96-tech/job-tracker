require('dotenv').config();
const fetch = global.fetch || require('node-fetch');
const forceLocal = process.argv.includes('--local');

async function parseJobDescription(jobDescription) {
  const provider = (process.env.AI_PROVIDER || 'gemini').toLowerCase();

  const system = `You are a job-description parser. Extract relevant structured fields from the job description and output a single JSON object. The JSON must include these keys: title, company, location, seniority, summary, responsibilities (array), qualifications (array), required_skills (array), nice_to_have_skills (array), suggested_resume_bullets (array), interview_prep_tips (array). If a field is unknown, use null or an empty array as appropriate. Output only valid JSON.`;

  const user = `Job description:\n\n"""\n${jobDescription}\n"""\n\nReturn the structured JSON. Do not include any other text.`;

  if (provider === 'gemini') {
    const apiKey = process.env.GEMINI_API_KEY;
    if (forceLocal || !apiKey) {
      // Fallback to a simple local parse for testing when no key is provided
      const localParse = (desc) => {
        const text = desc.toLowerCase();
        const role = /software engineer|software developer/.test(text) ? 'Software Engineer' : 'Software Developer';
        return {
          company: 'Unknown',
          role,
          required_skills: ['javascript','git'],
          nice_to_have_skills: [],
          seniority: 'mid',
          location: /remote/.test(text) ? 'Remote' : 'Unknown',
          summary: desc.slice(0,200),
        };
      };
      const parsed = localParse(jobDescription);
      console.log(JSON.stringify(parsed, null, 2));
      process.exit(0);
    }
    const model = process.env.GEMINI_MODEL || 'text-bison-001';
    const url = `https://generativelanguage.googleapis.com/v1beta2/models/${model}:generateText?key=${apiKey}`;
    const body = {
      prompt: { text: system + '\n\n' + user },
      temperature: 0.0,
      maxOutputTokens: 800,
    };
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const txt = await res.text();
      throw new Error(`Gemini API error ${res.status}: ${txt}`);
    }
    const data = await res.json();
    let content;
    if (data.candidates && data.candidates[0] && data.candidates[0].output) content = data.candidates[0].output;
    else if (data.candidates && data.candidates[0] && data.candidates[0].content) content = data.candidates[0].content;
    else if (data.output && data.output[0] && data.output[0].content) content = data.output[0].content;
    else content = JSON.stringify(data);

    try {
      const parsed = JSON.parse(content);
      return parsed;
    } catch (e) {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) return JSON.parse(jsonMatch[0]);
      throw new Error('Failed to parse JSON from Gemini output: ' + e.message + '\nModel output:\n' + content);
    }
  }

  throw new Error(`Unsupported AI_PROVIDER: ${provider}`);
}

(async () => {
  // Replace this string with the user's pasted job description if needed.
  const jobDescription = `i want to apply job for software engineer`;

  try {
    const parsed = await parseJobDescription(jobDescription);
    console.log(JSON.stringify(parsed, null, 2));
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
})();
