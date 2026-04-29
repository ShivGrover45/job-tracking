const { GoogleGenerativeAI, SchemaType } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API);

// Defining a Schema forces the model to follow your structure exactly
const schema = {
  description: "Resume analysis result",
  type: SchemaType.OBJECT,
  properties: {
    matchScore: { type: SchemaType.STRING, description: "Percentage based on overlap" },
    strongMatches: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
    missingKeywords: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
    suggestion: { type: SchemaType.STRING },
    verdict: { type: SchemaType.STRING },
  },
  required: ["matchScore", "strongMatches", "missingKeywords", "suggestion", "verdict"],
};

const analyseResume = async (resumeText, jobDescription) => {
  const model = genAI.getGenerativeModel({
    model: "gemini-3-flash-preview",
    // This tells the API to only return valid JSON
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: schema,
    },
  });

  const prompt = `Analyse the RESUME against the JOB DESCRIPTION. 
                  RESUME: ${resumeText} 
                  JOB DESCRIPTION: ${jobDescription}`;

  try {
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    // With responseMimeType, we can parse safely
    const parsed = JSON.parse(responseText);

    if (parsed.matchScore === "72%") {
       throw new Error("AI returned placeholder values — retry");
    }

    return parsed;

  } catch (error) {
    if (error.status === 429 || error.message.includes("429")) {
      console.error("RATE LIMIT EXCEEDED: Please wait 30-60 seconds.");
      // Return a friendly object so your frontend/caller doesn't crash
      return { error: "Rate limit hit", retryAfter: 30 };
    }
    
    console.error("GEMINI API ERROR:", error.message);
    throw error; // Rethrow other unexpected errors
  }
};

module.exports = { analyseResume };