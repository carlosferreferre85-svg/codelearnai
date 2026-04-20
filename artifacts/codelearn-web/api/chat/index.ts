import type { VercelRequest, VercelResponse } from "@vercel/node";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = "llama-3.3-70b-versatile";

const SYSTEM_PROMPT = `Eres CodeLearn AI, un asistente experto en programación y diseño web en español. 
Tu misión es enseñar a personas sin experiencia a programar, crear webs y lanzarlas online gratis.

Reglas:
- Responde siempre en español
- Usa explicaciones claras y ejemplos de código cuando sea útil
- Guía paso a paso, sin saltarte pasos
- Si muestras código, usa bloques de código con triple backtick e indica el lenguaje
- Sé amable, motivador y paciente
- Cubre: HTML, CSS, JavaScript, diseño web, GitHub Pages, Netlify, Vercel, herramientas IA
- Cuando alguien tenga un error, ayúdale a resolverlo paso a paso`;

const CODE_GEN_SYSTEM_PROMPT = `Eres CodeLearn AI, un generador experto de código web listo para copiar y pegar.
Tu misión: generar código HTML, CSS y/o JavaScript completo, funcional y bien comentado en español.

Reglas:
- Responde siempre en español
- Genera código completo y funcional, listo para copiar y pegar
- Incluye todos los archivos necesarios en bloques separados
- Comenta el código en español
- Usa buenas prácticas y código moderno`;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    return res.status(204).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const groqApiKey = process.env["GROQ_API_KEY"];
  if (!groqApiKey) {
    return res.status(500).json({ error: "GROQ_API_KEY not configured" });
  }

  const { messages, codeMode } = req.body as {
    messages: Array<{ role: string; content: string }>;
    codeMode?: boolean;
  };

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "messages array is required" });
  }

  const systemPrompt = codeMode ? CODE_GEN_SYSTEM_PROMPT : SYSTEM_PROMPT;
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
    res.setHeader("Access-Control-Allow-Origin", "*");

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
    console.error("Error proxying Groq request:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
