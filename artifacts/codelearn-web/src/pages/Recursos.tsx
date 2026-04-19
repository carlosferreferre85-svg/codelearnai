import { Globe, ExternalLink, Code2, Zap, BookOpen, Server, Github } from "lucide-react";

const resources = [
  {
    name: "GitHub Pages",
    desc: "Publica tu web directamente desde GitHub de forma gratuita. Perfecto para proyectos personales y portafolios.",
    url: "https://pages.github.com",
    tag: "Deploy",
    tagColor: "text-primary bg-primary/10 border-primary/20",
    icon: Github,
    iconColor: "text-foreground",
  },
  {
    name: "Netlify",
    desc: "Plataforma de deploy con drag & drop. Arrastra tu carpeta y tu web está online en segundos.",
    url: "https://netlify.com",
    tag: "Deploy",
    tagColor: "text-primary bg-primary/10 border-primary/20",
    icon: Server,
    iconColor: "text-teal-400",
  },
  {
    name: "Vercel",
    desc: "La plataforma preferida para Next.js. Deploy automático en cada push. CDN global incluido.",
    url: "https://vercel.com",
    tag: "Deploy",
    tagColor: "text-primary bg-primary/10 border-primary/20",
    icon: Zap,
    iconColor: "text-foreground",
  },
  {
    name: "Replit",
    desc: "Editor de código en la nube. Programa, diseña y publica desde el navegador sin instalar nada.",
    url: "https://replit.com",
    tag: "Editor",
    tagColor: "text-orange-400 bg-orange-400/10 border-orange-400/20",
    icon: Code2,
    iconColor: "text-orange-400",
  },
  {
    name: "MDN Web Docs",
    desc: "La referencia definitiva de HTML, CSS y JavaScript. Documentación oficial de Mozilla, en español.",
    url: "https://developer.mozilla.org/es",
    tag: "Documentación",
    tagColor: "text-blue-400 bg-blue-400/10 border-blue-400/20",
    icon: BookOpen,
    iconColor: "text-blue-400",
  },
  {
    name: "Groq AI",
    desc: "Inferencia de IA ultra-rápida. El motor que potencia CodeLearn AI con llama-3.3-70b.",
    url: "https://groq.com",
    tag: "IA",
    tagColor: "text-purple-400 bg-purple-400/10 border-purple-400/20",
    icon: Zap,
    iconColor: "text-purple-400",
  },
  {
    name: "ChatGPT",
    desc: "El asistente de IA de OpenAI. Útil para resolver dudas, generar ideas y aprender nuevos conceptos.",
    url: "https://chat.openai.com",
    tag: "IA",
    tagColor: "text-purple-400 bg-purple-400/10 border-purple-400/20",
    icon: Zap,
    iconColor: "text-green-400",
  },
  {
    name: "CSS-Tricks",
    desc: "El mejor blog de CSS del mundo. Guías, trucos y referencias para todo lo relacionado con estilos.",
    url: "https://css-tricks.com",
    tag: "CSS",
    tagColor: "text-blue-400 bg-blue-400/10 border-blue-400/20",
    icon: Globe,
    iconColor: "text-blue-400",
  },
  {
    name: "JavaScript.info",
    desc: "El tutorial más completo de JavaScript moderno. Desde cero hasta programación avanzada.",
    url: "https://javascript.info",
    tag: "JavaScript",
    tagColor: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
    icon: Code2,
    iconColor: "text-yellow-400",
  },
];

export default function Recursos() {
  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">Recursos Esenciales</h1>
          <p className="text-muted-foreground text-lg">Herramientas, plataformas y referencias que todo desarrollador web usa a diario.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {resources.map((r) => (
            <a
              key={r.name}
              href={r.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col p-5 rounded-xl bg-card border border-border hover:border-primary/30 transition-all hover:shadow-lg hover:-translate-y-0.5"
              data-testid={`link-resource-${r.name.toLowerCase().replace(/\s+/g, "-")}`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                  <r.icon className={`w-4 h-4 ${r.iconColor}`} />
                </div>
                <span className={`text-xs font-mono font-medium px-2 py-0.5 rounded border ${r.tagColor}`}>{r.tag}</span>
              </div>
              <h3 className="font-semibold text-foreground mb-1.5 group-hover:text-primary transition-colors flex items-center gap-1.5">
                {r.name}
                <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground" />
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed flex-1">{r.desc}</p>
            </a>
          ))}
        </div>

        <div className="mt-12 p-6 rounded-xl bg-card border border-border">
          <h2 className="font-semibold text-foreground mb-2">¿Tienes dudas?</h2>
          <p className="text-sm text-muted-foreground mb-4">La IA de CodeLearn AI puede explicarte cómo usar cualquiera de estas herramientas paso a paso.</p>
          <a
            href="/chat"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
            data-testid="link-recursos-chat-cta"
          >
            Preguntar a la IA
          </a>
        </div>
      </div>
    </div>
  );
}
