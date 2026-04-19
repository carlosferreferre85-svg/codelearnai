import { useState } from "react";
import { Link } from "wouter";
import { Search, Code2, Palette, Globe, Terminal, Brain, BookOpen, CheckCircle, ChevronRight } from "lucide-react";
import { topics } from "@/data-topics";
import { useProgress } from "@/hooks/useProgress";

const tagColors: Record<string, string> = {
  html: "text-orange-400 bg-orange-400/10 border-orange-400/20",
  css: "text-blue-400 bg-blue-400/10 border-blue-400/20",
  javascript: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
  web: "text-pink-400 bg-pink-400/10 border-pink-400/20",
  deploy: "text-primary bg-primary/10 border-primary/20",
  programming: "text-purple-400 bg-purple-400/10 border-purple-400/20",
};

const tagIcons: Record<string, typeof Code2> = {
  html: Code2,
  css: Palette,
  javascript: Terminal,
  web: Palette,
  deploy: Globe,
  programming: Brain,
};

const filterLabels = [
  { value: "all", label: "Todos" },
  { value: "html", label: "HTML" },
  { value: "css", label: "CSS" },
  { value: "javascript", label: "JavaScript" },
  { value: "web", label: "Diseño" },
  { value: "deploy", label: "Deploy" },
  { value: "programming", label: "IA" },
];

export default function Learn() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const { getTopicProgress } = useProgress();

  const filtered = topics.filter((t) => {
    const matchesFilter = filter === "all" || t.tag === filter;
    const matchesSearch =
      search === "" ||
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">Módulos de Aprendizaje</h1>
          <p className="text-muted-foreground text-lg">Elige por dónde empezar. Cada módulo te lleva paso a paso con ejemplos reales.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Buscar módulos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-muted border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              data-testid="input-search-topics"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {filterLabels.map((f) => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={`px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${
                  filter === f.value
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card text-muted-foreground border-border hover:text-foreground hover:border-border/80"
                }`}
                data-testid={`button-filter-${f.value}`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p>No se encontraron módulos con ese filtro.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((topic) => {
              const pct = getTopicProgress(topic.id, topic.lessons.length);
              const Icon = tagIcons[topic.tag] ?? Code2;
              const colorClass = tagColors[topic.tag] ?? "text-primary bg-primary/10 border-primary/20";

              return (
                <Link
                  key={topic.id}
                  href={`/learn/${topic.id}`}
                  className="group flex flex-col p-6 rounded-xl bg-card border border-border hover:border-primary/30 transition-all hover:shadow-lg hover:-translate-y-0.5 cursor-pointer"
                  data-testid={`card-topic-${topic.id}`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                      <Icon className={`w-5 h-5 ${colorClass.split(" ")[0]}`} />
                    </div>
                    <span className={`text-xs font-mono font-medium px-2 py-1 rounded border ${colorClass}`}>
                      {topic.tagLabel}
                    </span>
                  </div>
                  <h3 className="font-semibold text-foreground text-base mb-2 group-hover:text-primary transition-colors">{topic.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed flex-1 mb-4">{topic.description}</p>

                  <div className="mt-auto">
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                      <span className="flex items-center gap-1">
                        <BookOpen className="w-3 h-3" />
                        {topic.lessons.length} lecciones
                      </span>
                      {pct > 0 && (
                        <span className="flex items-center gap-1 text-primary">
                          <CheckCircle className="w-3 h-3" />
                          {pct}% completado
                        </span>
                      )}
                    </div>
                    <div className="w-full h-1 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full bg-primary transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <div className="flex items-center gap-1 mt-3 text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                      Comenzar módulo <ChevronRight className="w-3 h-3" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
