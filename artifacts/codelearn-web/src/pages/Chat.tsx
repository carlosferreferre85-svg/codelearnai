import { useState, useRef, useEffect, useCallback } from "react";
import { useLocation } from "wouter";
import { Send, Code, RotateCcw, Bot, User, Copy, Check, Image, X, Loader2, ChevronDown } from "lucide-react";
import SyntaxHighlighter from "react-syntax-highlighter";
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  imageRequest?: string;
  generatedSvg?: string;
}

const SUGGESTIONS = [
  "¿Cómo creo mi primera página web en HTML?",
  "Explícame el modelo de caja de CSS",
  "¿Cómo hago una función en JavaScript?",
  "Genera una página de presentación personal completa",
  "¿Cómo publico mi web en GitHub Pages?",
  "¿Qué es flexbox y cómo funciona?",
];

function CodeBlock({ code, language }: { code: string; language: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="rounded-xl overflow-hidden border border-border my-2">
      <div className="flex items-center justify-between px-3 py-2 bg-muted border-b border-border">
        <span className="text-xs font-mono text-muted-foreground">{language || "code"}</span>
        <button onClick={copy} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors" data-testid="button-copy-chat-code">
          {copied ? <Check className="w-3 h-3 text-primary" /> : <Copy className="w-3 h-3" />}
          {copied ? "Copiado!" : "Copiar"}
        </button>
      </div>
      <SyntaxHighlighter
        language={language === "html" ? "xml" : language || "text"}
        style={atomOneDark}
        customStyle={{ margin: 0, padding: "0.75rem", fontSize: "0.75rem", background: "#0d1117" }}
        wrapLongLines
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}

function renderMessage(content: string) {
  const parts = content.split(/(```[\w]*\n[\s\S]*?```)/g);
  return parts.map((part, i) => {
    const codeMatch = part.match(/```([\w]*)\n([\s\S]*?)```/);
    if (codeMatch) {
      return <CodeBlock key={i} language={codeMatch[1]} code={codeMatch[2].trim()} />;
    }
    const lines = part.split("\n");
    return (
      <div key={i}>
        {lines.map((line, j) => {
          const boldified = line.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
          if (line.trim() === "") return <br key={j} />;
          if (line.startsWith("- ")) return <li key={j} className="ml-4 list-disc text-sm">{line.slice(2)}</li>;
          return <p key={j} className="text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: boldified }} />;
        })}
      </div>
    );
  });
}

function SvgDiagram({ svg, concept, onClose }: { svg: string; concept: string; onClose: () => void }) {
  return (
    <div className="mt-2 rounded-xl border border-border overflow-hidden">
      <div className="flex items-center justify-between px-3 py-2 bg-muted border-b border-border">
        <span className="text-xs font-mono text-muted-foreground">Diagrama: {concept}</span>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors"><X className="w-3.5 h-3.5" /></button>
      </div>
      <div className="bg-[#0d1117] overflow-x-auto p-2">
        <div dangerouslySetInnerHTML={{ __html: svg }} className="max-w-full" style={{ minWidth: 0 }} />
      </div>
    </div>
  );
}

export default function Chat() {
  const [location] = useLocation();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [codeMode, setCodeMode] = useState(false);
  const [generatingImage, setGeneratingImage] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const topic = searchParams.get("topic");
    if (topic) {
      setInput(`Tengo una pregunta sobre "${topic}": `);
      inputRef.current?.focus();
    }
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = useCallback(async (text?: string) => {
    const content = (text ?? input).trim();
    if (!content || loading) return;

    const userMsg: Message = { id: Date.now().toString(), role: "user", content };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    const aiMsgId = (Date.now() + 1).toString();
    setMessages((prev) => [...prev, { id: aiMsgId, role: "assistant", content: "" }]);

    try {
      const allMessages = [...messages, userMsg].map((m) => ({ role: m.role, content: m.content }));
      const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");
      const res = await fetch(`${BASE}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: allMessages, codeMode }),
      });

      if (!res.ok) throw new Error("Error en el servidor");

      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let fullText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n").filter((l) => l.startsWith("data: "));
        for (const line of lines) {
          const data = line.replace("data: ", "").trim();
          if (data === "[DONE]") break;
          try {
            const parsed = JSON.parse(data);
            const delta = parsed?.choices?.[0]?.delta?.content ?? "";
            fullText += delta;
            setMessages((prev) =>
              prev.map((m) => (m.id === aiMsgId ? { ...m, content: fullText } : m))
            );
          } catch {}
        }
      }
    } catch (err) {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === aiMsgId ? { ...m, content: "Error al conectar con la IA. Por favor intenta de nuevo." } : m
        )
      );
    } finally {
      setLoading(false);
    }
  }, [input, messages, loading, codeMode]);

  const generateConceptImage = useCallback(async (msgId: string, concept: string) => {
    setGeneratingImage(msgId);
    try {
      const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");
      const res = await fetch(`${BASE}/api/chat/generate-image`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ concept }),
      });
      const data = await res.json() as { svg: string; concept: string };
      setMessages((prev) =>
        prev.map((m) => (m.id === msgId ? { ...m, generatedSvg: data.svg, imageRequest: concept } : m))
      );
    } catch {
      console.error("Error generating image");
    } finally {
      setGeneratingImage(null);
    }
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([]);
    setInput("");
  };

  const hasCode = (content: string) => /```[\w]*\n/.test(content);
  const getFirstCodeConcept = (content: string) => {
    const match = content.match(/```[\w]*\n([\s\S]*?)```/);
    return match ? match[1].split("\n")[0].replace(/[<>{}]/g, "").trim().slice(0, 60) : "concepto de código";
  };

  return (
    <div className="min-h-screen bg-background pt-16 flex flex-col" style={{ height: "100dvh" }}>
      <div className="border-b border-border bg-card px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
            <Bot className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h1 className="font-semibold text-foreground text-sm">CodeLearn AI</h1>
            <p className="text-xs text-muted-foreground">Powered by Groq · llama-3.3-70b</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCodeMode(!codeMode)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
              codeMode ? "bg-primary/10 border-primary/30 text-primary" : "border-border text-muted-foreground hover:text-foreground"
            }`}
            data-testid="button-code-mode"
          >
            <Code className="w-3.5 h-3.5" />
            Generar Código
          </button>
          {messages.length > 0 && (
            <button
              onClick={clearChat}
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              data-testid="button-clear-chat"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
        {messages.length === 0 && (
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-10">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4">
                <Bot className="w-7 h-7 text-primary" />
              </div>
              <h2 className="text-xl font-bold text-foreground mb-2">Hola, soy CodeLearn AI</h2>
              <p className="text-muted-foreground text-sm leading-relaxed max-w-md mx-auto">
                Tu asistente de programación en español. Pregúntame cualquier cosa sobre HTML, CSS, JavaScript, diseño web o cómo publicar tu sitio.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SUGGESTIONS.map((s, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(s)}
                  className="text-left p-3 rounded-xl border border-border text-sm text-muted-foreground hover:text-foreground hover:border-primary/30 hover:bg-primary/5 transition-all"
                  data-testid={`button-suggestion-${i}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-3 max-w-3xl mx-auto w-full ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            {msg.role === "assistant" && (
              <div className="w-7 h-7 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 mt-1">
                <Bot className="w-3.5 h-3.5 text-primary" />
              </div>
            )}
            <div className={`flex-1 min-w-0 ${msg.role === "user" ? "max-w-lg" : ""}`}>
              <div
                className={`px-4 py-3 rounded-2xl text-sm ${
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground rounded-tr-sm"
                    : "bg-card border border-border text-foreground rounded-tl-sm"
                }`}
              >
                {msg.role === "user" ? (
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                ) : (
                  <div>{renderMessage(msg.content)}</div>
                )}
                {msg.content === "" && msg.role === "assistant" && (
                  <div className="flex gap-1 items-center h-5">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0ms" }} />
                    <div className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: "150ms" }} />
                    <div className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                )}
              </div>

              {msg.role === "assistant" && msg.content && hasCode(msg.content) && !msg.generatedSvg && (
                <button
                  onClick={() => generateConceptImage(msg.id, getFirstCodeConcept(msg.content))}
                  disabled={generatingImage === msg.id}
                  className="mt-2 flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 transition-colors disabled:opacity-60"
                  data-testid={`button-gen-image-${msg.id}`}
                >
                  {generatingImage === msg.id ? (
                    <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Generando diagrama...</>
                  ) : (
                    <><Image className="w-3.5 h-3.5" /> Ver diagrama visual</>
                  )}
                </button>
              )}

              {msg.generatedSvg && (
                <SvgDiagram
                  svg={msg.generatedSvg}
                  concept={msg.imageRequest ?? "Concepto"}
                  onClose={() =>
                    setMessages((prev) =>
                      prev.map((m) => (m.id === msg.id ? { ...m, generatedSvg: undefined } : m))
                    )
                  }
                />
              )}
            </div>
            {msg.role === "user" && (
              <div className="w-7 h-7 rounded-full bg-muted border border-border flex items-center justify-center shrink-0 mt-1">
                <User className="w-3.5 h-3.5 text-muted-foreground" />
              </div>
            )}
          </div>
        ))}

        <div ref={bottomRef} />
      </div>

      <div className="border-t border-border bg-card px-4 py-4">
        <div className="max-w-3xl mx-auto">
          {codeMode && (
            <div className="flex items-center gap-2 mb-2 px-3 py-1.5 rounded-lg bg-primary/5 border border-primary/20">
              <Code className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs text-primary font-medium">Modo generador de código activo — la IA generará código completo listo para copiar</span>
            </div>
          )}
          <div className="flex gap-3 items-end">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={codeMode ? "Describe qué código quieres generar..." : "Escribe tu pregunta... (Enter para enviar, Shift+Enter nueva línea)"}
              rows={1}
              className="flex-1 resize-none rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground text-sm px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary max-h-32 overflow-y-auto"
              style={{ minHeight: "48px" }}
              data-testid="input-chat-message"
              onInput={(e) => {
                const el = e.currentTarget;
                el.style.height = "auto";
                el.style.height = Math.min(el.scrollHeight, 128) + "px";
              }}
            />
            <button
              onClick={() => sendMessage()}
              disabled={loading || !input.trim()}
              className="w-12 h-12 rounded-xl bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
              data-testid="button-send-message"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </button>
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">Responde en español · Powered by Groq llama-3.3-70b</p>
        </div>
      </div>
    </div>
  );
}
