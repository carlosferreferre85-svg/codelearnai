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
- Si muestras código, usa bloques de código con triple backtick e indica el lenguaje (html, css, js, etc.)
- Sé amable, motivador y paciente
- Cubre: HTML, CSS, JavaScript, diseño web, GitHub Pages, Netlify, Vercel, herramientas IA
- Cuando alguien tenga un error, ayúdale a resolverlo paso a paso
- Anima a los usuarios a practicar y experimentar`;

const CODE_GEN_SYSTEM_PROMPT = `Eres CodeLearn AI, un generador experto de código web listo para copiar y pegar.
Tu misión: generar código HTML, CSS y/o JavaScript completo, funcional y bien comentado en español.

Reglas:
- Responde siempre en español
- Genera código completo y funcional, listo para copiar y pegar
- Incluye todos los archivos necesarios (HTML, CSS, JS) en bloques separados
- Comenta el código en español para que el usuario entienda cada parte
- Usa buenas prácticas y código moderno
- Incluye una breve explicación de qué hace el código y cómo usarlo`;

router.post("/", async (req, res) => {
  const groqApiKey = process.env["GROQ_API_KEY"];

  if (!groqApiKey) {
    res.status(500).json({ error: "GROQ_API_KEY not configured" });
    return;
  }

  const { messages, codeMode } = req.body as {
    messages: Array<{ role: string; content: string }>;
    codeMode?: boolean;
  };

  if (!messages || !Array.isArray(messages)) {
    res.status(400).json({ error: "messages array is required" });
    return;
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

router.post("/generate-image", async (req, res) => {
  const groqApiKey = process.env["GROQ_API_KEY"];

  if (!groqApiKey) {
    res.status(500).json({ error: "GROQ_API_KEY not configured" });
    return;
  }

  const { concept } = req.body as { concept: string };

  if (!concept) {
    res.status(400).json({ error: "concept is required" });
    return;
  }

  const svgPromptMessages = [
    {
      role: "system",
      content: `Eres un experto en crear diagramas SVG educativos sobre programación web. 
Cuando se te pida explicar un concepto, genera un SVG educativo completo y válido que lo ilustre visualmente.
El SVG debe:
- Tener viewBox="0 0 800 500" y width="800" height="500"
- Usar colores modernos: fondo oscuro (#0d1117 o #1e2530), texto claro (#e6edf3), acento verde (#00d4aa)
- Mostrar cajas, flechas, código simplificado, etiquetas y relaciones
- Ser pedagógico: mostrar la estructura o flujo del concepto
- Incluir solo el XML del SVG, sin explicaciones adicionales
- Usar fuente monospace para código: font-family="'Courier New', monospace"`,
    },
    {
      role: "user",
      content: `Genera un diagrama SVG educativo que explique visualmente este concepto de programación web: "${concept}". 
Muestra cómo funciona con cajas, flechas y ejemplos de código simples. Responde SOLO con el SVG completo, nada más.`,
    },
  ];

  try {
    const groqRes = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${groqApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: svgPromptMessages,
        stream: false,
        max_tokens: 2000,
        temperature: 0.4,
      }),
    });

    if (!groqRes.ok) {
      const text = await groqRes.text();
      req.log.error({ status: groqRes.status, text }, "Groq API error");
      res.status(groqRes.status).json({ error: text });
      return;
    }

    const data = await groqRes.json() as {
      choices: Array<{ message: { content: string } }>;
    };

    const content = data.choices?.[0]?.message?.content ?? "";
    const svgMatch = content.match(/<svg[\s\S]*<\/svg>/i);
    const svg = svgMatch ? svgMatch[0] : generateFallbackSvg(concept);

    res.json({ svg, concept });
  } catch (err) {
    req.log.error({ err }, "Error generating concept image");
    res.status(500).json({ error: "Internal server error", svg: generateFallbackSvg(concept) });
  }
});

function generateFallbackSvg(concept: string): string {
  const escaped = concept.replace(/[<>&'"]/g, (c) => {
    const map: Record<string, string> = { "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&#39;", '"': "&quot;" };
    return map[c] ?? c;
  });
  return `<svg viewBox="0 0 800 500" width="800" height="500" xmlns="http://www.w3.org/2000/svg">
  <rect width="800" height="500" fill="#0d1117"/>
  <rect x="50" y="50" width="700" height="400" rx="12" fill="#1e2530" stroke="#00d4aa" stroke-width="2"/>
  <text x="400" y="120" text-anchor="middle" font-family="'Courier New', monospace" font-size="22" fill="#00d4aa">${escaped}</text>
  <text x="400" y="200" text-anchor="middle" font-family="sans-serif" font-size="16" fill="#8b949e">Diagrama conceptual</text>
  <rect x="150" y="230" width="180" height="80" rx="8" fill="#00d4aa22" stroke="#00d4aa" stroke-width="1.5"/>
  <text x="240" y="275" text-anchor="middle" font-family="'Courier New', monospace" font-size="14" fill="#00d4aa">Concepto</text>
  <line x1="330" y1="270" x2="470" y2="270" stroke="#8b949e" stroke-width="2" marker-end="url(#arrow)"/>
  <rect x="470" y="230" width="180" height="80" rx="8" fill="#00d4aa22" stroke="#00d4aa" stroke-width="1.5"/>
  <text x="560" y="275" text-anchor="middle" font-family="'Courier New', monospace" font-size="14" fill="#00d4aa">Resultado</text>
  <defs><marker id="arrow" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto"><polygon points="0 0, 10 3.5, 0 7" fill="#8b949e"/></marker></defs>
</svg>`;
}

export default router;
