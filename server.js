import express from "express";
import OpenAI from "openai";

const app = express();

app.use(express.json());

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Test route
app.get("/", (req, res) => {
  res.json({
    status: "online",
    message: "NOVA-AI backend is running!"
  });
});

// AI chat route
app.post("/api/chat", async (req, res) => {
  try {
    const message = req.body?.message;

    if (!message || typeof message !== "string") {
      return res.status(400).json({
        error: "Please provide a message."
      });
    }

    const response = await client.responses.create({
      model: "gpt-6-luna",
      input: [
        {
          role: "system",
          content:
            "You are NOVA-AI, a helpful AI assistant. Give clear, useful and friendly answers."
        },
        {
          role: "user",
          content: message
        }
      ]
    });

    res.json({
      reply: response.output_text
    });

  } catch (error) {
    console.error("AI Error:", error);

    res.status(500).json({
      error: "AI response failed. Check the server logs."
    });
  }
});

// Render provides PORT automatically
const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`NOVA-AI server running on port ${PORT}`);
});
