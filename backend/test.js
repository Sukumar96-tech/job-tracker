const API_KEY = "AIzaSyCpX6GsBexBUEb_vHn7iy-DkhlLWWrOf0E"; // 👈 paste your key

async function testGemini() {
  try {
    if (!API_KEY) {
      throw new Error("API key missing");
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: "Say hello in one line"
                }
              ]
            }
          ]
        }),
      }
    );

    const data = await response.json();

    if (data.error) {
      console.log("❌ ERROR:", data.error.message);
      return;
    }

    const output =
      data?.candidates?.[0]?.content?.parts?.[0]?.text;

    console.log("✅ SUCCESS:");
    console.log(output);

  } catch (err) {
    console.log("❌ FAILED:", err.message);
  }
}

testGemini();