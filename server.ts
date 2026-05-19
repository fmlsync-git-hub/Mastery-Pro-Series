import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import axios from "axios";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

// Gemini Initialization
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// Paystack Helper
const initializePaystack = async (email: string, amount: number, level: string, courseId: string, metadata: any, origin: string) => {
  const secretKey = process.env.PAYSTACK_SECRET_KEY;
  if (!secretKey) throw new Error("PAYSTACK_SECRET_KEY not configured");

  const response = await axios.post(
    "https://api.paystack.co/transaction/initialize",
    {
      email,
      amount,
      callback_url: `${origin}/?payment_status=success&level=${level}&courseId=${courseId}`,
      metadata,
      currency: "GHS", // Or USD depending on your account
    },
    {
      headers: {
        Authorization: `Bearer ${secretKey}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data.data; // { authorization_url, access_code, reference }
};

app.use(express.json());

// API Routes
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.post("/api/assessment/generate", async (req, res) => {
  const { topic, level, count = 10, mode = 'certification' } = req.body;

  try {
    let contextPrompt = "";
    if (mode === 'training') {
      if (level === 'kids') contextPrompt = "The audience is children (age 5-9). Use extremely simple analogies (toys, pets, magic), lots of emojis, and very clear language.";
      if (level === 'elementary') contextPrompt = "The audience is elementary students (age 10-12). Use school-related analogies, clear logic, and encouraging tone.";
      if (level === 'highschool') contextPrompt = "The audience is high school students. Use modern tech analogies (social media, gaming), slightly more technical terms, and keep it engaging.";
      if (level === 'academic') contextPrompt = "The audience is university students. Use academic terminology, theoretical foundations, and rigorous explanations.";
      if (level === 'pro') contextPrompt = "The audience is industry professionals. Use heavy technical jargon, best practices, micro-optimization concepts, and enterprise-scale context.";
    }

    const prompt = `Generate ${count} high-quality multiple-choice questions for a ${mode === 'training' ? 'practice quiz' : 'certification exam'} in "${topic}". 
    The level/audience is "${level}". ${contextPrompt}
    Each question must have exactly 4 options and one correct answer (A, B, C, or D).
    Return the response as a JSON array matching this structure:
    [{ "id": "generated_id", "question": "Question text", "options": ["Option 1", "Option 2", "Option 3", "Option 4"], "answer": "A" }]`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              question: { type: Type.STRING },
              options: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING } 
              },
              answer: { type: Type.STRING }
            },
            required: ["id", "question", "options", "answer"]
          }
        }
      }
    });

    const questions = JSON.parse(response.text);
    res.json({ questions });
  } catch (err: any) {
    console.error("Gemini Error:", err);
    res.status(500).json({ error: "Failed to generate assessment questions" });
  }
});

app.post("/api/training/content", async (req, res) => {
  const { topic, level } = req.body;

  try {
    let style = "";
    if (level === 'kids') style = "Use magic metaphors, playfulness, and simple 'How it works' steps. Use emojis. Keep sections short.";
    if (level === 'elementary') style = "Use 'Builder' metaphors (blocks, tools), clear definitions, and a 'Challenge' section.";
    if (level === 'highschool') style = "Use tech startup or gaming metaphors. Focus on 'How to build real things'.";
    if (level === 'academic') style = "Formal, structured, includes 'Quick Facts' and 'Deep Dive' theoretical sections.";
    if (level === 'pro') style = "Brevity-focused, industry patterns, common pitfalls, and architectural considerations.";

    const prompt = `Create a high-impact, professional training module for "${topic}" at the "${level}" level. 
    ${style}
    Structure the response as a JSON with these fields:
    - title: String
    - overview: String (Intro)
    - concepts: Array of { title, body } (Main lessons)
    - summary: String
    Return valid JSON.`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            overview: { type: Type.STRING },
            concepts: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  body: { type: Type.STRING }
                }
              }
            },
            summary: { type: Type.STRING }
          },
          required: ["title", "overview", "concepts", "summary"]
        }
      }
    });

    res.json(JSON.parse(response.text));
  } catch (err: any) {
    console.error("Gemini Training Error:", err);
    res.status(500).json({ error: "Failed to generate training content" });
  }
});

app.post("/api/create-checkout-session", async (req, res) => {
  const { userId, userEmail, level, courseId, origin } = req.body;
  
  try {
    const amount = parseInt(process.env.PRICE_ADVANCED_EXAM || "9900");
    const metadata = {
      userId,
      level,
      courseId,
      custom_fields: [
        { display_name: "Course", variable_name: "course", value: courseId },
        { display_name: "Level", variable_name: "level", value: level }
      ]
    };

    const paystackData = await initializePaystack(userEmail, amount, level, courseId, metadata, origin);
    
    // We append the level to the success URL in the client side handling usually, 
    // but Paystack works slightly differently with references.
    // For simplicity, we'll store specific intent in metadata.
    
    res.json({ id: paystackData.reference, url: paystackData.authorization_url });
  } catch (err: any) {
    console.error("Paystack Init Error:", err.response?.data || err.message);
    res.status(500).json({ error: err.response?.data?.message || err.message });
  }
});

// Production/Development middleware
async function setupVite() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }
}

setupVite().then(() => {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});
