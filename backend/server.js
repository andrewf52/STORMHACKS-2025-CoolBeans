import express from "express";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";


dotenv.config();

const app = express();
app.use(express.json());

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

app.post("/analyze", async (req,res) => {
    const { text } = req.body;
    const result = await ai.models.generateContent({
        model:"gemini-2.5-pro",
        contents:'Classify this article as positive, neutral, or negative. Return JSON with "label" and "confidence". Text:\n\n${text}'
    });
    res.send(result.text);
  });

  app.listen(3000, () => console.log("Server running on port 3000"));