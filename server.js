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
    model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });
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

    const prompt = `Classify this article as positive, neutral, or negative.\nReturn JSON with "label" and "confidence".\nText:\n\n${text}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const output = response.text();

    res.json({ result: output });
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
