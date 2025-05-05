// backend/controllers/aiController.js

import Groq from 'groq-sdk';
import dotenv from 'dotenv';
dotenv.config();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export const aiResponseHandler = async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  console.log("Sending prompt to Groq:", prompt);
  console.log("Using API key:", process.env.GROQ_API_KEY ? "✔️ Present" : "❌ Missing");

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: 'You are an AI assistant for ticket resale and repurchasing on EventEase.' },
        { role: 'user', content: prompt },
      ],
      model: 'llama3-70b-8192', // ✅ Updated model
    });

    const reply = chatCompletion.choices[0]?.message?.content || "No response.";
    res.json({ response: reply });
  } catch (error) {
    console.error("❌ Groq AI Error:", error);
    res.status(500).json({ error: "AI request failed. Please try again later." });
  }
};
