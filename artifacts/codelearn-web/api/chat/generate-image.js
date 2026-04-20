const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = "llama-3.3-70b-versatile";

function generateFallbackSvg(concept) {
  const escaped = concept.replace(/[<>&'"]/g, (c) => {
    const map = { "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&#39;", '"': "&quot;" };
    return map[c] ?? c;
  });
  return `<svg viewBox="0 0 800 500" width="800" height="500" xmlns="http://www.w3.org/2000/svg">
  <rect width="800" height="500" fill="#0d1117"/>
  <rect x="50" y="50" width="700" height="400" rx="12" fill="#1e2530" stroke="#00d4aa" stroke-width="2"/>
  <text x="400" y="120" text-anchor="middle" font-family="Courier New, monospace" font-size="22" fill="#00d4aa">${escaped}</text>
  <text x="400" y="200" text-anchor="middle" font-family="sans-serif" font-size="16" fill="#8b949e">Diagrama conceptual</text>
  <rect x="150" y="230" width="180" height="80" rx="8" fill="#00d4aa22" stroke="#00d4aa" stroke-width="1.5"/>
  <text x="240" y="275" text-anchor="middle" font-family="Courier New, monospace" font-size="14" fill="#00d4aa">Concepto</text>
  <line x1="330" y1="270" x2="470" y2="270" stroke="#8b949e" stroke-width="2"/>
  <rect x="470" y="230" width="180" height="80" rx="8" fill="#00d4aa22" stroke="#00d4aa" stroke-width="1.5"/>
  <text x="560" y="275" text-anchor="middle" font-family="Courier New, monospace" font-size="14" fill="#00d4aa">Resultado</text>
</svg>`;
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const groqApiKey = process.env.GROQ_API_KEY;
  if (!groqApiKey) return res.status(500).json({ error: "GROQ_API_KEY not configured" });

  const { concept } = req.body || {};
  if (!concept) return res.status(400).json({ error: "concept is required" });

  try {
    const groqRes = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: { Authorization: `Bearer ${groqApiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [
          { role: "system", content: "Genera diagramas SVG educativos sobre programacion web. SVG con viewBox='0 0 800 500', fondo oscuro (#0d1117), texto claro, acento verde (#00d4aa). Responde SOLO con el SVG completo." },
          { role: "user", content: `Genera un diagrama SVG educativo que explique: "${concept}". Solo el SVG, nada mas.` },
        ],
        stream: false,
        max_tokens: 2000,
        temperature: 0.4,
      }),
    });

    if (!groqRes.ok) return res.status(200).json({ svg: generateFallbackSvg(concept), concept });

    const data = await groqRes.json();
    const content = data.choices?.[0]?.message?.content ?? "";
    const svgMatch = content.match(/<svg[\s\S]*<\/svg>/i);
    const svg = svgMatch ? svgMatch[0] : generateFallbackSvg(concept);

    return res.status(200).json({ svg, concept });
  } catch (_err) {
    return res.status(200).json({ svg: generateFallbackSvg(concept), concept });
  }
}
