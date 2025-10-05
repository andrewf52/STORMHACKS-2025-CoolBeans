import express from "express";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Load env vars
dotenv.config();

const app = express();
app.use(express.json());

// Health check (simple readiness probe)
app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

// Support a mock model for local / CI tests without calling the real API
let model;
if (process.env.MOCK_GEMINI === "true") {
  model = {
    generateContent: async () => ({
      response: {
        text: () => '{"label":"positive","confidence":0.95}'
      }
    })
  };
} else {
  if (!process.env.GEMINI_API_KEY) {
    console.warn("⚠️  GEMINI_API_KEY not set. Set it in .env or enable MOCK_GEMINI for tests.");
  }
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
    model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });
  } catch (err) {
    console.error("Failed to initialize GoogleGenerativeAI", err);
  }
}

app.post("/analyze", async (req, res) => {
  try {
    const { text } = req.body || {};
    if (!text || typeof text !== "string") {
      return res.status(400).json({ error: "'text' field (string) is required" });
    }

    if (!model) {
      return res.status(500).json({ error: "Model not initialized" });
    }

  const prompt = `Analyze the sentiment of the following news article.\nReturn ONLY a single integer score from 0 to 100, where 0 is extremely negative, 50 is neutral, and 100 is extremely positive.\nRespond ONLY with JSON: { "score": <number> }\nDo not include any other text, explanation, formatting, or fields.\nDo not use label, confidence, or any other field.\nText:\n\n${text}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const output = response.text();
    console.log('Gemini raw output:', output);

    // Try to extract the score from the output (handles JSON, markdown code blocks, etc.)
    let score = null;
    try {
      // Try direct JSON parse first
      const jsonMatch = output.match(/\{[^}]*"score"\s*:\s*(\d+)[^}]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        score = parsed.score;
      } else {
        // Fallback: just look for any number
        const numMatch = output.match(/\b(\d+)\b/);
        if (numMatch) {
          score = parseInt(numMatch[1], 10);
        }
      }
    } catch (e) {
      console.error('Parse error:', e);
    }

    if (score !== null && !isNaN(score) && score >= 0 && score <= 100) {
      res.json({ score });
    } else {
      res.json({ error: "AI did not return a valid score", raw: output });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to analyze sentiment" });
  }
});

// Only start the server if not under test
const port = process.env.PORT || 3000;
if (process.env.NODE_ENV !== "test") {
  app.listen(port, () => console.log(`✅ Server running on port ${port}`));
}

export default app;
