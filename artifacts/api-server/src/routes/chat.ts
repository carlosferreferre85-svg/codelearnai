import express from "express";
import { logger } from "../lib/logger";

const router = express.Router();

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = "llama-3.3-70b-versatile";

const SYSTEM_PROMPT = `Eres CodeLearn AI, un asistente experto en programación y diseño web en español. 
Tu misión es enseñar a personas sin experiencia a programar, crear webs y lanzarlas online gratis.

Reglas:
- Responde siempre en español
- Usa explicaciones claras y ejemplos de código cuando sea útil
- Guía paso a paso, sin saltarte pasos
- Si muestras código, usa bloques de código con triple backtick
- Sé amable, motivador y paciente
- Cubre: HTML, CSS, JavaScript, diseño web, GitHub Pages, Netlify, Vercel, herramientas IA
- Cuando alguien tenga un error, ayúdale a resolverlo paso a paso
- Anima a los usuarios a practicar y experimentar`;

router.post("/", async (req, res) => {
  const groqApiKey = process.env["GROQ_API_KEY"];

  if (!groqApiKey) {
    res.status(500).json({ error: "GROQ_API_KEY not configured" });
    return;
  }

  const { messages } = req.body as { messages: Array<{ role: string; content: string }> };

  if (!messages || !Array.isArray(messages)) {
    res.status(400).json({ error: "messages array is required" });
    return;
  }

  const allMessages = [{ role: "system", content: SYSTEM_PROMPT }, ...messages.slice(-20)];

  try {
    const groqRes = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${groqApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: allMessages,
        stream: true,
        max_tokens: 1024,
        temperature: 0.7,
      }),
    });

    if (!groqRes.ok) {
      const text = await groqRes.text();
      req.log.error({ status: groqRes.status, text }, "Groq API error");
      res.status(groqRes.status).json({ error: text });
      return;
    }

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("X-Accel-Buffering", "no");

    const reader = groqRes.body!.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value, { stream: true });
      res.write(chunk);
    }

    res.end();
  } catch (err) {
    req.log.error({ err }, "Error proxying Groq request");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
