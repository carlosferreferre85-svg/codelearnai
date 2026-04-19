import { useState, useCallback } from "react";
import { Link, useLocation } from "wouter";
import { ChevronLeft, ChevronRight, CheckCircle, Circle, Copy, Check, MessageSquare, Menu, X } from "lucide-react";
import SyntaxHighlighter from "react-syntax-highlighter";
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { topics } from "@/data-topics";
import { useProgress } from "@/hooks/useProgress";

function renderContent(text: string) {
  const lines = text.split("\n");
  return lines.map((line, i) => {
    if (line.startsWith("**") && line.endsWith("**")) {
      return <h4 key={i} className="font-semibold text-foreground mt-4 mb-1">{line.slice(2, -2)}</h4>;
    }
    if (line.startsWith("- ")) {
      return <li key={i} className="ml-4 text-muted-foreground text-sm list-disc">{line.slice(2)}</li>;
    }
    if (line.trim() === "") return <br key={i} />;
    const boldified = line.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
    return <p key={i} className="text-muted-foreground text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: boldified }} />;
  });
}

function CodeBlock({ code, language }: { code: string; language: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative rounded-xl overflow-hidden border border-border my-4">
      <div className="flex items-center justify-between px-4 py-2 bg-muted border-b border-border">
        <span className="text-xs font-mono text-muted-foreground">{language}</span>
        <button
          onClick={copy}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          data-testid="button-copy-code"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-primary" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? "Copiado!" : "Copiar"}
        </button>
      </div>
      <SyntaxHighlighter
        language={language === "html" ? "xml" : language}
        style={atomOneDark}
        customStyle={{ margin: 0, padding: "1rem", fontSize: "0.8rem", background: "#0d1117" }}
        wrapLongLines
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}

export default function TopicDetail({ params }: { params: { topicId: string } }) {
  const { topicId } = params;
  const topic = topics.find((t) => t.id === topicId);
  const [, navigate] = useLocation();
  const { markComplete, isComplete } = useProgress();
  const [currentLesson, setCurrentLesson] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!topic) {
    return (
      <div className="min-h-screen bg-background pt-24 flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Módulo no encontrado.</p>
          <Link href="/learn" className="text-primary hover:underline">Volver a los módulos</Link>
        </div>
      </div>
    );
  }

  const lesson = topic.lessons[currentLesson];
  const done = isComplete(topic.id, lesson.id);
  const prevLesson = currentLesson > 0 ? currentLesson - 1 : null;
  const nextLesson = currentLesson < topic.lessons.length - 1 ? currentLesson + 1 : null;

  const handleChatWithTopic = () => {
    const msg = encodeURIComponent(`Tengo una pregunta sobre "${lesson.title}" del módulo ${topic.title}:`);
    navigate(`/chat?topic=${encodeURIComponent(lesson.title)}`);
  };

  return (
    <div className="min-h-screen bg-background pt-16 flex">
      <aside className={`fixed md:sticky top-16 left-0 h-[calc(100vh-4rem)] w-72 bg-card border-r border-border flex-col overflow-y-auto z-40 transition-transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"} flex`}>
        <div className="p-4 border-b border-border">
          <Link href="/learn" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-3">
            <ChevronLeft className="w-4 h-4" /> Todos los módulos
          </Link>
          <h2 className="font-semibold text-foreground text-sm">{topic.title}</h2>
          <p className="text-xs text-muted-foreground mt-0.5">{topic.lessons.length} lecciones</p>
        </div>
        <nav className="p-2 flex-1">
          {topic.lessons.map((l, idx) => {
            const done = isComplete(topic.id, l.id);
            return (
              <button
                key={l.id}
                onClick={() => { setCurrentLesson(idx); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-sm transition-colors mb-0.5 ${
                  idx === currentLesson
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
                data-testid={`button-lesson-${l.id}`}
              >
                {done ? (
                  <CheckCircle className="w-4 h-4 text-primary shrink-0" />
                ) : (
                  <Circle className="w-4 h-4 shrink-0 opacity-40" />
                )}
                <span className="flex-1 truncate">{l.title}</span>
                <span className="text-xs text-muted-foreground shrink-0">{l.duration}</span>
              </button>
            );
          })}
        </nav>
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <main className="flex-1 min-w-0 px-4 sm:px-8 py-8 max-w-3xl mx-auto w-full">
        <div className="flex items-center gap-3 mb-6 md:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg border border-border text-muted-foreground hover:text-foreground"
            data-testid="button-sidebar-toggle"
          >
            <Menu className="w-4 h-4" />
          </button>
          <span className="text-sm text-muted-foreground font-medium">{topic.title}</span>
        </div>

        <div className="mb-2">
          <span className="text-xs text-muted-foreground font-mono">Lección {currentLesson + 1} de {topic.lessons.length}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">{lesson.title}</h1>
        <div className="flex items-center gap-3 mb-6 text-xs text-muted-foreground">
          <span>{lesson.duration}</span>
          {done && (
            <span className="flex items-center gap-1 text-primary">
              <CheckCircle className="w-3.5 h-3.5" /> Completada
            </span>
          )}
        </div>

        <div className="prose prose-sm max-w-none space-y-1 text-foreground">
          {renderContent(lesson.content)}
        </div>

        {lesson.codeExample && (
          <div className="mt-6">
            <CodeBlock code={lesson.codeExample} language={lesson.codeLanguage ?? "html"} />
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mt-8 pt-6 border-t border-border">
          <button
            onClick={handleChatWithTopic}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors"
            data-testid="button-ask-ai"
          >
            <MessageSquare className="w-4 h-4 text-primary" />
            Preguntar a la IA
          </button>

          {!done && (
            <button
              onClick={() => markComplete(topic.id, lesson.id)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
              data-testid="button-mark-complete"
            >
              <CheckCircle className="w-4 h-4" />
              Marcar completada
            </button>
          )}
        </div>

        <div className="flex items-center justify-between mt-8">
          <button
            onClick={() => prevLesson !== null && setCurrentLesson(prevLesson)}
            disabled={prevLesson === null}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border text-sm text-muted-foreground hover:text-foreground transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            data-testid="button-prev-lesson"
          >
            <ChevronLeft className="w-4 h-4" />
            Anterior
          </button>
          <span className="text-xs text-muted-foreground">{currentLesson + 1} / {topic.lessons.length}</span>
          <button
            onClick={() => nextLesson !== null && setCurrentLesson(nextLesson)}
            disabled={nextLesson === null}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            data-testid="button-next-lesson"
          >
            Siguiente
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </main>
    </div>
  );
}
