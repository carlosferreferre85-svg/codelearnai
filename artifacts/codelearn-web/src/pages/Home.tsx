import { Link } from "wouter";
import { ArrowRight, Code2, Palette, Globe, Zap, Terminal, Brain, CheckCircle, MessageSquare, BookOpen } from "lucide-react";

const features = [
  { icon: Code2, title: "HTML desde Cero", desc: "Estructura cualquier página web con etiquetas, atributos y formularios.", tag: "HTML", color: "text-orange-400" },
  { icon: Palette, title: "CSS Moderno", desc: "Diseña webs bellas con estilos, animaciones y diseño responsive.", tag: "CSS", color: "text-blue-400" },
  { icon: Terminal, title: "JavaScript", desc: "Añade interactividad y lógica a tus proyectos web.", tag: "JS", color: "text-yellow-400" },
  { icon: Palette, title: "Diseño Web", desc: "Principios de UX/UI, tipografía, colores y composición visual.", tag: "Diseño", color: "text-pink-400" },
  { icon: Globe, title: "Deploy Gratis", desc: "Publica tu web en GitHub Pages, Netlify o Vercel sin costo.", tag: "Deploy", color: "text-primary" },
  { icon: Brain, title: "IA para Programar", desc: "Usa Groq, ChatGPT y otras herramientas IA para crear más rápido.", tag: "IA", color: "text-purple-400" },
];

const steps = [
  { n: "01", title: "Elige un tema", desc: "Explora 6 módulos de aprendizaje, desde HTML básico hasta deploy en producción." },
  { n: "02", title: "Aprende con ejemplos reales", desc: "Cada lección tiene explicaciones claras y código listo para copiar y probar." },
  { n: "03", title: "Pregunta a la IA", desc: "El chat con IA resuelve tus dudas al instante, genera código y explica con diagramas." },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <section className="pt-32 pb-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-primary/3 rounded-full blur-3xl" />
        </div>
        <div className="max-w-4xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-8">
            <Zap className="w-3.5 h-3.5" />
            Gratis para siempre · Powered by Groq AI
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground mb-6 leading-[1.05]">
            Aprende a programar
            <span className="block text-primary">tu propia web.</span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            Desde cero hasta publicar tu sitio online. Con IA que te explica, genera código y resuelve tus dudas paso a paso. En español.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/learn"
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold text-base hover:bg-primary/90 transition-all hover:scale-[1.02] active:scale-[0.98]"
              data-testid="link-hero-learn"
            >
              Empezar a aprender
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/chat"
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl border border-border text-foreground font-semibold text-base hover:bg-muted transition-all"
              data-testid="link-hero-chat"
            >
              <MessageSquare className="w-4 h-4 text-primary" />
              Probar Chat IA
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Todo lo que necesitas para crear tu web</h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">6 módulos diseñados para llevarte de cero a tener un sitio web funcionando y publicado online.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f) => (
              <Link
                key={f.title}
                href="/learn"
                className="group p-6 rounded-xl bg-card border border-border hover:border-primary/30 transition-all hover:shadow-lg hover:-translate-y-0.5 cursor-pointer"
                data-testid={`card-feature-${f.tag.toLowerCase()}`}
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0 group-hover:bg-primary/10 transition-colors">
                    <f.icon className={`w-5 h-5 ${f.color}`} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono font-medium text-muted-foreground">{f.tag}</span>
                    </div>
                    <h3 className="font-semibold text-foreground mb-1.5">{f.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Así funciona CodeLearn AI</h2>
            <p className="text-muted-foreground text-lg">Tres pasos para pasar de "no sé nada" a publicar tu sitio web.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step) => (
              <div key={step.n} className="relative text-center">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4">
                  <span className="font-mono font-bold text-primary text-sm">{step.n}</span>
                </div>
                <h3 className="font-semibold text-foreground text-lg mb-2">{step.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="rounded-2xl bg-card border border-border p-8 sm:p-12">
            <div className="flex flex-col sm:flex-row items-start gap-6">
              <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                <MessageSquare className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-foreground mb-3">La IA que te acompaña mientras aprendes</h2>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Pregunta lo que quieras: desde "¿cómo funciona el CSS?" hasta "genera el código de mi página de presentación". La IA genera diagramas visuales, código listo para copiar y explicaciones en español.
                </p>
                <div className="space-y-2 mb-6">
                  {["Explicaciones paso a paso en español", "Genera código listo para copiar", "Diagramas visuales de conceptos", "Modo generador de código completo"].map((item) => (
                    <div key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="w-4 h-4 text-primary shrink-0" />
                      {item}
                    </div>
                  ))}
                </div>
                <Link
                  href="/chat"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors"
                  data-testid="link-bottom-chat-cta"
                >
                  Abrir Chat IA
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 border-t border-border">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <Code2 className="w-5 h-5 text-primary" />
            <span className="font-bold text-foreground">CodeLearn AI</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/learn" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5" /> Aprender
            </Link>
            <Link href="/chat" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5" /> Chat IA
            </Link>
            <Link href="/recursos" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5" /> Recursos
            </Link>
          </div>
          <p className="text-xs text-muted-foreground">Gratis para siempre</p>
        </div>
      </section>
    </div>
  );
}
