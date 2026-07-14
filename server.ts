import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini API Client
let ai: GoogleGenAI | null = null;
try {
  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey) {
    ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  } else {
    console.warn("GEMINI_API_KEY environment variable is not defined. AI features will be unavailable.");
  }
} catch (error) {
  console.error("Failed to initialize GoogleGenAI:", error);
}

// ---------------------------------------------------------
// API ROUTES
// ---------------------------------------------------------

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// AI Quiz Generator Endpoint
app.post("/api/gemini/quiz", async (req, res) => {
  const { courseName, topic, difficulty = "intermediate" } = req.body;

  if (!ai) {
    return res.status(503).json({
      error: "Gemini AI service is not configured. Please add GEMINI_API_KEY in Secrets.",
    });
  }

  if (!courseName || !topic) {
    return res.status(400).json({ error: "Missing required parameters: courseName and topic" });
  }

  try {
    const prompt = `Generate a high-quality educational multiple-choice quiz about "${topic}" for the course "${courseName}".
The difficulty should be "${difficulty}".
Create exactly 5 interesting questions. For each question, provide 4 options, the index of the correct answer (0 to 3), and a brief, encouraging explanation of why that answer is correct.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are an expert curriculum developer and academic examiner for EnoTech Academy. You generate clean, structured educational quizzes in JSON format.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["quizTitle", "questions"],
          properties: {
            quizTitle: { type: Type.STRING },
            questions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                required: ["questionText", "options", "correctOptionIndex", "explanation"],
                properties: {
                  questionText: { type: Type.STRING },
                  options: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  correctOptionIndex: { type: Type.INTEGER },
                  explanation: { type: Type.STRING },
                },
              },
            },
          },
        },
      },
    });

    const jsonText = response.text?.trim() || "{}";
    const quizData = JSON.parse(jsonText);
    res.json(quizData);
  } catch (error: any) {
    console.error("Error generating quiz via Gemini:", error);
    res.status(500).json({ error: error.message || "Failed to generate quiz from AI model" });
  }
});

// AI Coding Assistant & Course Tutor Chat Endpoint
app.post("/api/gemini/chat", async (req, res) => {
  const { message, history = [], currentCourse = "General Studies" } = req.body;

  if (!ai) {
    return res.status(503).json({
      error: "Gemini AI service is not configured. Please add GEMINI_API_KEY in Secrets.",
    });
  }

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    const formattedHistory = history.map((msg: any) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }],
    }));

    // Start a chat session with history
    const chat = ai.chats.create({
      model: "gemini-3.5-flash",
      config: {
        systemInstruction: `You are EnoTech Academy's official AI Learning Tutor, a friendly, encouraging, and highly competent teaching assistant. 
The student is currently viewing/studying the course: "${currentCourse}".
Help them understand concepts, troubleshoot their programming errors, provide quick code snippets (with clear comments), and offer learning path advice.
Be concise, clear, and professional. Use markdown formatting for code blocks.`,
      },
      history: formattedHistory,
    });

    const response = await chat.sendMessage({ message });
    res.json({ reply: response.text });
  } catch (error: any) {
    console.error("Error with Gemini Chat:", error);
    res.status(500).json({ error: error.message || "Failed to chat with AI model" });
  }
});

// ---------------------------------------------------------
// VITE MIDDLEWARE SETUP
// ---------------------------------------------------------
async function startServer() {
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

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
