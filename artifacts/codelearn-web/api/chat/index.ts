import type { VercelRequest, VercelResponse } from "@vercel/node";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = "llama-3.3-70b-versatile";

const SYSTEM_PROMPT = `Eres CodeLearn AI, un asistente experto en programacion y diseno web en espanol.
Tu mision es ensenar a personas sin experiencia a programar, crear webs y lanzarlas online gratis.
Reglas:
- Responde siempre en espanol
- Usa explicaciones claras y ejemplos de codigo cuando sea util
- Guia paso a paso, sin saltarte pasos
- Si muestras codigo, usa bloques de codigo con triple backtick e indica el lenguaje
- Se amable, motivador y paciente`;

const CODE_GEN_PROMPT = `Eres CodeLearn AI, un generador experto de codigo web listo para copiar y pegar.
Genera codigo HTML, CSS y/o JavaScript completo, funcional y bien comentado en espanol.
Reglas:
- Responde siempre en espanol
- Genera codigo completo y funcional, listo para copiar y pegar
- Comenta el codigo en espanol
- Usa buenas practicas y codigo moderno`;

interface Message {
  role: string;
  content: string;
}

interface RequestBody {
  messages?: Message[];
  codeMode?: boolean;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const groqApiKey = process.env["GROQ_API_KEY"];
  if (!groqApiKey) {
    return res.status(500).json({ error: "GROQ_API_KEY not configured" });
  }

  const body = req.body as RequestBody;
  const messages = body.messages;
  const codeMode = body.codeMode ?? false;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "messages array is required" });
  }

  const systemPrompt = codeMode ? CODE_GEN_PROMPT : SYSTEM_PROMPT;
  const allMessages = [{ role: "system", content: systemPrompt }, ...messages.slice(-20)];

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
        max_tokens: 2048,
        temperature: codeMode ? 0.3 : 0.7,
      }),
    });

    if (!groqRes.ok) {
      const text = await groqRes.text();
      return res.status(groqRes.status).json({ error: text });
    }

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    const reader = groqRes.body!.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value, { stream: true });
      res.write(chunk);
    }

    return res.end();
  } catch (_err) {
    return res.status(500).json({ error: "Internal server error" });
  }
}
