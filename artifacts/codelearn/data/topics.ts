export type Topic = {
  id: string;
  title: string;
  description: string;
  icon: string;
  tag: "html" | "css" | "javascript" | "web" | "deploy" | "programming";
  tagLabel: string;
  lessons: Lesson[];
};

export type Lesson = {
  id: string;
  title: string;
  duration: string;
  content: string;
  codeExample?: string;
  codeLanguage?: string;
};

export const topics: Topic[] = [
  {
    id: "html-basics",
    title: "HTML desde Cero",
    description: "Aprende la estructura básica de cualquier página web. Etiquetas, atributos, formularios y más.",
    icon: "code",
    tag: "html",
    tagLabel: "HTML",
    lessons: [
      {
        id: "html-1",
        title: "¿Qué es HTML?",
        duration: "5 min",
        content: `HTML (HyperText Markup Language) es el lenguaje de marcado estándar para crear páginas web. Es como el esqueleto de una web — define la estructura y el contenido.

Cada página web que visitas está construida con HTML. Los navegadores como Chrome, Firefox o Safari leen el HTML y lo muestran como una página visual.

**¿Por qué aprenderlo?**
- Es el punto de partida de cualquier web
- Sin HTML no hay página web posible
- Es fácil de aprender y ver resultados inmediatos

**¿Cómo funciona?**
HTML usa "etiquetas" (tags) para marcar el contenido. Las etiquetas van entre corchetes angulares < >.`,
        codeExample: `<!DOCTYPE html>
<html>
  <head>
    <title>Mi Primera Página</title>
  </head>
  <body>
    <h1>¡Hola Mundo!</h1>
    <p>Esta es mi primera página web.</p>
  </body>
</html>`,
        codeLanguage: "html",
      },
      {
        id: "html-2",
        title: "Etiquetas Esenciales",
        duration: "8 min",
        content: `Las etiquetas HTML son los bloques de construcción de toda página web. Aquí están las más importantes que debes conocer:

**Encabezados (h1 a h6)**
Los encabezados van del más grande (h1) al más pequeño (h6). El h1 es el título principal de la página.

**Párrafos (p)**
Para bloques de texto normal, usamos la etiqueta p.

**Enlaces (a)**
Para crear links a otras páginas. El atributo href indica la URL de destino.

**Imágenes (img)**
Para insertar imágenes. src indica la ruta y alt describe la imagen.

**Listas (ul, ol, li)**
ul = lista sin orden (puntos), ol = lista ordenada (números), li = cada elemento.

**Divisiones (div)**
Contenedores genéricos para agrupar elementos.`,
        codeExample: `<h1>Título Principal</h1>
<h2>Subtítulo</h2>

<p>Este es un párrafo de texto.</p>

<a href="https://google.com">Ir a Google</a>

<img src="foto.jpg" alt="Mi foto" />

<ul>
  <li>Manzana</li>
  <li>Pera</li>
  <li>Naranja</li>
</ul>

<div>
  <p>Contenido agrupado aquí</p>
</div>`,
        codeLanguage: "html",
      },
      {
        id: "html-3",
        title: "Formularios",
        duration: "10 min",
        content: `Los formularios permiten que los usuarios envíen información en tu web. Son fundamentales para contactos, registros, búsquedas, etc.

**Elementos de formulario:**
- **input text** - campo de texto
- **input email** - campo de email
- **input password** - contraseña (oculta el texto)
- **textarea** - área de texto multilínea
- **select** - lista desplegable
- **button** - botón para enviar

**Atributos importantes:**
- **placeholder** - texto de ayuda dentro del campo
- **required** - hace el campo obligatorio
- **name** - nombre del campo (importante para enviar datos)`,
        codeExample: `<form action="/enviar" method="post">
  <label>Nombre:
    <input type="text" name="nombre" 
           placeholder="Tu nombre" required />
  </label>
  
  <label>Email:
    <input type="email" name="email" 
           placeholder="tu@email.com" required />
  </label>
  
  <label>Mensaje:
    <textarea name="mensaje" 
              placeholder="Escribe aquí..."></textarea>
  </label>
  
  <button type="submit">Enviar</button>
</form>`,
        codeLanguage: "html",
      },
    ],
  },
  {
    id: "css-basics",
    title: "CSS: Diseño y Estilos",
    description: "Dale vida y color a tus páginas web. Aprende a diseñar layouts modernos y responsivos.",
    icon: "layers",
    tag: "css",
    tagLabel: "CSS",
    lessons: [
      {
        id: "css-1",
        title: "¿Qué es CSS?",
        duration: "5 min",
        content: `CSS (Cascading Style Sheets) es el lenguaje que controla el aspecto visual de una página HTML. Si HTML es el esqueleto, CSS es la ropa y el maquillaje.

**Con CSS puedes:**
- Cambiar colores de texto y fondo
- Controlar tamaños y fuentes
- Crear layouts (distribución de columnas y filas)
- Agregar animaciones y transiciones
- Hacer webs responsivas (que se adapten al móvil)

**Cómo conectar CSS con HTML:**
Puedes poner CSS dentro de una etiqueta style, o en un archivo .css separado.`,
        codeExample: `/* Esto es un comentario en CSS */

/* Selector de etiqueta */
h1 {
  color: #333333;
  font-size: 32px;
}

/* Selector de clase */
.mi-clase {
  background-color: #007bff;
  color: white;
  padding: 10px;
}

/* Selector de ID */
#mi-id {
  border: 2px solid red;
}`,
        codeLanguage: "css",
      },
      {
        id: "css-2",
        title: "Box Model y Espaciado",
        duration: "8 min",
        content: `El Box Model es uno de los conceptos más importantes de CSS. Todo elemento HTML es como una caja con estas capas:

1. **Content** - El contenido real (texto, imagen)
2. **Padding** - Espacio entre el contenido y el borde
3. **Border** - El borde de la caja
4. **Margin** - Espacio fuera de la caja

**Propiedades clave:**
- padding: 10px → espacio interior en los 4 lados
- margin: 10px → espacio exterior en los 4 lados
- border: 1px solid black → borde de 1px sólido negro
- width / height → ancho y alto del elemento`,
        codeExample: `.caja {
  /* Contenido */
  width: 200px;
  height: 100px;
  
  /* Padding (espacio interior) */
  padding: 20px;
  /* También: padding-top, padding-right, etc. */
  
  /* Border */
  border: 2px solid #333;
  border-radius: 8px; /* esquinas redondeadas */
  
  /* Margin (espacio exterior) */
  margin: 16px;
  
  /* Colores */
  background-color: #f0f0f0;
  color: #333333;
}`,
        codeLanguage: "css",
      },
      {
        id: "css-3",
        title: "Flexbox: Layouts Modernos",
        duration: "12 min",
        content: `Flexbox es el sistema más usado para crear layouts en CSS. Permite alinear y distribuir elementos con facilidad.

**Para activarlo:** display: flex en el contenedor padre.

**Propiedades del contenedor:**
- flex-direction: row | column (dirección del flujo)
- justify-content: alinea en el eje principal
- align-items: alinea en el eje cruzado
- gap: espacio entre elementos
- flex-wrap: permite que los elementos salten de línea

**Valores de justify-content:**
- flex-start: al inicio
- flex-end: al final
- center: al centro
- space-between: espacio entre elementos
- space-around: espacio alrededor`,
        codeExample: `.contenedor {
  display: flex;
  flex-direction: row;       /* horizontal */
  justify-content: center;   /* centra horizontalmente */
  align-items: center;       /* centra verticalmente */
  gap: 16px;                 /* espacio entre hijos */
  flex-wrap: wrap;           /* permite salto de línea */
}

/* Layout de 3 columnas */
.grid-tres {
  display: flex;
  gap: 20px;
}

.columna {
  flex: 1;  /* cada columna ocupa el mismo espacio */
}`,
        codeLanguage: "css",
      },
    ],
  },
  {
    id: "javascript-basics",
    title: "JavaScript: Programación Web",
    description: "El lenguaje que da vida a las webs. Eventos, funciones, arrays, APIs y mucho más.",
    icon: "zap",
    tag: "javascript",
    tagLabel: "JavaScript",
    lessons: [
      {
        id: "js-1",
        title: "Variables y Tipos de Datos",
        duration: "8 min",
        content: `JavaScript (JS) es el lenguaje de programación de la web. Con JS puedes hacer que tu web interactúe con el usuario, procese datos y sea dinámica.

**Variables:** contenedores para guardar datos
- **let** → variable que puede cambiar
- **const** → constante (no puede cambiar)
- **var** → antigua forma (evítala)

**Tipos de datos básicos:**
- **String** → texto, entre comillas
- **Number** → números (enteros y decimales)
- **Boolean** → true o false
- **Array** → lista de valores
- **Object** → conjunto de propiedades clave:valor`,
        codeExample: `// Variables
let nombre = "Ana";
const edad = 25;

// Tipos de datos
let texto = "Hola mundo";        // String
let numero = 42;                  // Number
let decimal = 3.14;               // Number decimal
let verdadero = true;             // Boolean
let lista = [1, 2, 3, "cuatro"]; // Array

// Objeto
let persona = {
  nombre: "Carlos",
  edad: 30,
  ciudad: "Madrid"
};

// Acceder a propiedades
console.log(persona.nombre);  // Carlos
console.log(lista[0]);        // 1`,
        codeLanguage: "javascript",
      },
      {
        id: "js-2",
        title: "Funciones",
        duration: "10 min",
        content: `Las funciones son bloques de código reutilizables. Las defines una vez y las puedes llamar muchas veces.

**Declaración de función:**
Se declara con la palabra function, tiene un nombre, puede recibir parámetros y puede retornar un valor.

**Arrow Functions (funciones flecha):**
Son una forma más moderna y concisa de escribir funciones. Son muy usadas en JavaScript moderno.

**¿Cuándo usar funciones?**
- Cuando un bloque de código se repite
- Para organizar tu código
- Para hacer operaciones reutilizables`,
        codeExample: `// Función tradicional
function saludar(nombre) {
  return "¡Hola, " + nombre + "!";
}

// Arrow function
const sumar = (a, b) => a + b;

// Función con múltiples líneas
const calcularDescuento = (precio, porcentaje) => {
  const descuento = precio * (porcentaje / 100);
  const precioFinal = precio - descuento;
  return precioFinal;
};

// Llamar funciones
console.log(saludar("María"));       // ¡Hola, María!
console.log(sumar(5, 3));            // 8
console.log(calcularDescuento(100, 20)); // 80`,
        codeLanguage: "javascript",
      },
      {
        id: "js-3",
        title: "DOM: Manipular el HTML",
        duration: "12 min",
        content: `El DOM (Document Object Model) es la representación del HTML como un árbol de objetos que JavaScript puede manipular.

Con JS puedes:
- Cambiar texto e imágenes dinámicamente
- Agregar o quitar elementos HTML
- Responder a clicks, teclas y otros eventos
- Validar formularios antes de enviarlos

**Métodos principales:**
- document.getElementById → busca por ID
- document.querySelector → busca por selector CSS
- element.textContent → cambia el texto
- element.style → cambia estilos
- element.addEventListener → escucha eventos`,
        codeExample: `// Obtener elementos del HTML
const boton = document.getElementById("mi-boton");
const titulo = document.querySelector("h1");
const parrafo = document.querySelector(".mi-clase");

// Cambiar contenido
titulo.textContent = "Nuevo título";
parrafo.innerHTML = "<strong>Texto en negrita</strong>";

// Cambiar estilos
titulo.style.color = "blue";
titulo.style.fontSize = "24px";

// Escuchar eventos
boton.addEventListener("click", () => {
  alert("¡Hiciste click!");
  parrafo.textContent = "Botón pulsado!";
});

// Crear elementos
const nuevo = document.createElement("p");
nuevo.textContent = "Soy nuevo";
document.body.appendChild(nuevo);`,
        codeLanguage: "javascript",
      },
    ],
  },
  {
    id: "web-design",
    title: "Diseño Web Moderno",
    description: "Principios de diseño UI/UX, tipografía, colores y cómo crear webs que enamoran a los usuarios.",
    icon: "pen-tool",
    tag: "web",
    tagLabel: "Diseño",
    lessons: [
      {
        id: "design-1",
        title: "Principios de Diseño UI",
        duration: "10 min",
        content: `El diseño UI (User Interface) se refiere al aspecto visual de una web o app. Un buen diseño hace que los usuarios disfruten usarla.

**Los 4 principios CRAP:**
1. **Contraste** → Diferencia visual entre elementos. Texto oscuro sobre fondo claro.
2. **Repetición** → Consistencia de estilos en toda la web (mismos colores, fuentes, etc.)
3. **Alineación** → Los elementos deben estar alineados entre sí, no flotando aleatoriamente.
4. **Proximidad** → Elementos relacionados deben estar cerca. Los no relacionados, separados.

**Reglas de oro:**
- Menos es más: No pongas todo a la vez
- Jerarquía visual: Lo importante debe destacar
- Espacio en blanco: El vacío también es diseño
- Consistencia: Mismo estilo en toda la web`,
        codeExample: `/* Buenos contrastes */
.texto-principal {
  color: #1a1a1a;       /* muy oscuro */
  background: #ffffff;  /* muy claro */
}

/* Jerarquía tipográfica */
h1 { font-size: 48px; font-weight: 700; }
h2 { font-size: 32px; font-weight: 600; }
h3 { font-size: 24px; font-weight: 500; }
p  { font-size: 16px; font-weight: 400; }

/* Consistencia con variables CSS */
:root {
  --color-primary: #007bff;
  --color-text: #333333;
  --radius: 8px;
  --spacing: 16px;
}`,
        codeLanguage: "css",
      },
      {
        id: "design-2",
        title: "Colores y Paletas",
        duration: "8 min",
        content: `El color es uno de los elementos más poderosos del diseño. Una buena paleta de colores puede hacer que tu web parezca profesional o amateur.

**Tipos de paletas:**
- **Monocromática** → Un solo color en distintas variaciones
- **Complementaria** → Colores opuestos en el círculo cromático
- **Análoga** → Colores cercanos en el círculo cromático
- **Triádica** → Tres colores equidistantes

**Herramientas gratis para elegir colores:**
- coolors.co → generador de paletas
- color.adobe.com → paletas de Adobe
- htmlcolorcodes.com → referencias de colores

**Regla 60-30-10:**
- 60% color principal (fondo)
- 30% color secundario (secciones)
- 10% color de acento (botones, links importantes)`,
        codeExample: `/* Ejemplo: Paleta azul-verde */
:root {
  /* Primario (60%) */
  --bg: #f8fafc;
  --bg-card: #ffffff;
  
  /* Secundario (30%) */
  --color-sec: #e2e8f0;
  --text-sec: #64748b;
  
  /* Acento (10%) */
  --accent: #06b6d4;
  --accent-hover: #0891b2;
  
  /* Texto */
  --text: #0f172a;
}

.boton-principal {
  background: var(--accent);
  color: white;
}

.boton-principal:hover {
  background: var(--accent-hover);
}`,
        codeLanguage: "css",
      },
    ],
  },
  {
    id: "launch-web",
    title: "Lanza tu Web Gratis",
    description: "Aprende a publicar tu propia web gratis con GitHub Pages, Netlify, Vercel y más plataformas.",
    icon: "globe",
    tag: "deploy",
    tagLabel: "Deploy",
    lessons: [
      {
        id: "deploy-1",
        title: "GitHub Pages: Web Gratis",
        duration: "12 min",
        content: `GitHub Pages es una de las formas más fáciles y rápidas de publicar una web gratis. Con tu código en GitHub, tu web está online en minutos.

**Pasos para publicar con GitHub Pages:**

1. **Crea una cuenta en GitHub** (github.com) — es gratis
2. **Crea un repositorio nuevo** con el botón verde "New"
3. **Nombra el repositorio** como: tunombre.github.io
4. **Sube tus archivos** HTML, CSS y JS al repositorio
5. **Activa GitHub Pages** en Settings → Pages → Source: main
6. **¡Listo!** Tu web estará en https://tunombre.github.io

**Ventajas:**
- Completamente GRATIS para siempre
- Tu propio dominio tunombre.github.io
- HTTPS incluido (conexión segura)
- Actualización automática al subir cambios

**Ideal para:**
- Portafolios personales
- Páginas de presentación
- Proyectos pequeños`,
        codeExample: `# Comandos Git básicos para subir tu web

# 1. Inicializa Git en tu carpeta
git init

# 2. Agrega todos los archivos
git add .

# 3. Guarda los cambios
git commit -m "Mi primera web"

# 4. Conecta con GitHub
git remote add origin https://github.com/TU_USUARIO/TU_USUARIO.github.io.git

# 5. Sube el código
git push -u origin main

# ✅ ¡Tu web está online!
# URL: https://TU_USUARIO.github.io`,
        codeLanguage: "bash",
      },
      {
        id: "deploy-2",
        title: "Netlify: Deploy Profesional",
        duration: "10 min",
        content: `Netlify es una plataforma increíble para publicar webs modernas. Su plan gratuito es más que suficiente para la mayoría de proyectos.

**¿Por qué Netlify?**
- Deploy con un solo drag & drop
- Conexión directa con GitHub
- Dominio .netlify.app gratis
- Formularios de contacto gratis
- Funciones serverless incluidas
- HTTPS automático

**Método 1: Drag & Drop (más fácil)**
1. Ve a app.netlify.com y regístrate gratis
2. Arrastra tu carpeta con los archivos HTML al recuadro
3. ¡Listo! En 30 segundos tienes tu URL

**Método 2: Conectar con GitHub**
1. En Netlify: New site from Git
2. Conecta tu cuenta de GitHub
3. Selecciona el repositorio
4. Netlify detecta automáticamente el tipo de proyecto
5. Cada vez que hagas push, la web se actualiza automáticamente

**Dominio propio gratis:**
Puedes conectar un dominio propio que hayas comprado (desde ~10€/año en namecheap.com).`,
        codeExample: `# netlify.toml — archivo de configuración (opcional)
# Colócalo en la raíz de tu proyecto

[build]
  # Carpeta donde está tu web compilada
  publish = "dist"
  # Comando para construir (si usas React/Vite)
  command = "npm run build"

[[redirects]]
  # Para apps de una sola página (SPA)
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  NODE_VERSION = "18"`,
        codeLanguage: "toml",
      },
      {
        id: "deploy-3",
        title: "Vercel: Para Proyectos React",
        duration: "8 min",
        content: `Vercel es la mejor plataforma para proyectos React, Next.js y frameworks modernos. Creado por el equipo de Next.js.

**¿Por qué Vercel?**
- Optimizado para React y Next.js
- Preview automático en cada Pull Request
- Funciones serverless (backend sin servidor)
- Caché global ultrarrápida (CDN)
- Analytics integrado
- GRATIS para proyectos personales

**Deploy en 3 pasos:**
1. Sube tu código a GitHub
2. Ve a vercel.com e importa el repositorio
3. Vercel detecta el framework y hace el build automático

**Preview automático:**
Cada vez que creas una rama nueva en Git, Vercel despliega automáticamente una versión de preview. Perfecto para mostrar cambios antes de publicarlos.

**Dominios:**
Gratis: tuproyecto.vercel.app
Con dominio propio: configuras tu DNS en 2 minutos`,
        codeExample: `# Instalar Vercel CLI (opcional)
npm install -g vercel

# Desde tu carpeta del proyecto:

# Deploy a producción
vercel --prod

# Deploy de preview
vercel

# Variables de entorno
vercel env add NOMBRE_VARIABLE

# Ver el estado
vercel ls`,
        codeLanguage: "bash",
      },
    ],
  },
  {
    id: "ai-tools",
    title: "IA para Programadores",
    description: "Aprende a usar herramientas de IA para programar más rápido: ChatGPT, GitHub Copilot y Replit.",
    icon: "cpu",
    tag: "programming",
    tagLabel: "IA",
    lessons: [
      {
        id: "ai-1",
        title: "ChatGPT para Programar",
        duration: "8 min",
        content: `ChatGPT es uno de los mejores asistentes de programación disponibles hoy. Puede escribir código, explicarlo, corregir errores y mucho más.

**¿Cómo usarlo para programar?**

1. **Generar código:** "Escribe una función en JavaScript que filtre un array de objetos por precio menor a 100"
2. **Corregir errores:** Pega tu código y el error. "Tengo este error: [ERROR]. Este es mi código: [CÓDIGO]"
3. **Explicar código:** "Explícame qué hace este código línea por línea"
4. **Mejorar código:** "¿Cómo puedo hacer este código más eficiente?"
5. **Convertir código:** "Convierte este código de Python a JavaScript"

**Prompts efectivos:**
- Sé específico: menciona el lenguaje y el contexto
- Incluye ejemplos de entrada/salida esperada
- Pide explicaciones si no entiendes algo

**Versiones:**
- ChatGPT 3.5: Gratis, muy capaz
- ChatGPT 4: De pago, más inteligente y preciso`,
        codeExample: `// Ejemplo de prompt para ChatGPT:
// "Escribe una función JavaScript que:
// - Reciba un array de productos
// - Filtre los que cuestan menos de 50€
// - Los ordene por precio de menor a mayor
// - Devuelva solo nombre y precio"

// ChatGPT generaría algo como esto:
const filtrarProductos = (productos) => {
  return productos
    .filter(p => p.precio < 50)
    .sort((a, b) => a.precio - b.precio)
    .map(p => ({ nombre: p.nombre, precio: p.precio }));
};

// Uso:
const productos = [
  { nombre: "Libro", precio: 15 },
  { nombre: "Teclado", precio: 80 },
  { nombre: "Ratón", precio: 25 },
];
console.log(filtrarProductos(productos));`,
        codeLanguage: "javascript",
      },
      {
        id: "ai-2",
        title: "Replit AI: Programa en el Navegador",
        duration: "10 min",
        content: `Replit es una plataforma increíble para programar directamente en el navegador, sin instalar nada. Y su IA integrada hace el desarrollo aún más fácil.

**¿Qué es Replit?**
- Editor de código online (nada que instalar)
- Ejecuta código en tiempo real
- Soporta más de 50 lenguajes
- Comparte tu proyecto con un link
- Colaboración en tiempo real

**Replit AI:**
- Autocompleta código
- Genera funciones completas
- Explica errores
- Sugiere mejoras

**¿Cómo empezar?**
1. Ve a replit.com y crea una cuenta gratis
2. Crea un nuevo "Repl" con el lenguaje que quieras
3. Empieza a programar directamente en el navegador
4. Activa el asistente de IA en la barra lateral

**Publíca tu web gratis:**
Cada proyecto en Replit tiene su propia URL pública. Tu web estará online automáticamente mientras el Repl esté activo.`,
        codeExample: `// Con Replit AI puedes escribir comentarios
// y la IA completa el código:

// Crea una función que verifique si un email es válido
function validarEmail(email) {
  // La IA puede generar esto automáticamente:
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

// Genera un color hexadecimal aleatorio
function colorAleatorio() {
  return '#' + Math.floor(Math.random()*16777215)
    .toString(16).padStart(6, '0');
}

console.log(validarEmail("usuario@ejemplo.com")); // true
console.log(colorAleatorio()); // #a3f2c1`,
        codeLanguage: "javascript",
      },
    ],
  },
];

export const learningPaths = [
  {
    id: "beginner",
    title: "Ruta para Principiantes",
    description: "Empieza desde cero hasta tener tu primera web online",
    topicIds: ["html-basics", "css-basics", "javascript-basics", "launch-web"],
    duration: "4-6 horas",
    icon: "star",
  },
  {
    id: "designer",
    title: "Ruta de Diseño Web",
    description: "Enfocada en crear webs visualmente impresionantes",
    topicIds: ["html-basics", "css-basics", "web-design", "launch-web"],
    duration: "3-5 horas",
    icon: "pen-tool",
  },
  {
    id: "ai-developer",
    title: "Ruta con IA",
    description: "Aprende a programar con herramientas de inteligencia artificial",
    topicIds: ["html-basics", "javascript-basics", "ai-tools", "launch-web"],
    duration: "3-5 horas",
    icon: "cpu",
  },
];
