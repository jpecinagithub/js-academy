export default {
  id: "what-is-js",
  module: 0,
  level: "beginner",
  stub: false,
  title: { en: "What is JavaScript?", es: "¿Qué es JavaScript?" },
  tagline: {
    en: "The language, the runtime and the engine — a visual tour.",
    es: "El lenguaje, el entorno de ejecución y el motor: un recorrido visual.",
  },
  sections: [
    {
      type: "concept",
      heading: {
        en: "The language that makes the web move",
        es: "El lenguaje que hace que la web se mueva",
      },
      body: {
        en: "JavaScript is a **programming language** created in 1995 — legend says in about 10 days — to make web pages interactive. Buttons that react, forms that validate, maps you can drag: that is JavaScript at work.\n\nEvery web page is built from three ingredients:\n\n- **HTML** — the *structure* (headings, paragraphs, buttons)\n- **CSS** — the *style* (colors, layout, fonts)\n- **JavaScript** — the *behavior* (what happens when you click, type or scroll)\n\n> JavaScript is the only language that runs natively in every browser. That is why it became the language of the web.\n\n## The great name accident\n\nDespite the name, **JavaScript has almost nothing to do with Java**. They are completely different languages. The name was a marketing decision from 1995, when Java was the hot new thing and borrowing its name sounded like a good idea. It caused decades of confusion — now you know the truth, and you are already ahead of most beginners.",
        es: "JavaScript es un **lenguaje de programación** creado en 1995 —cuenta la leyenda que en unos 10 días— para hacer interactivas las páginas web. Botones que reaccionan, formularios que se validan, mapas que puedes arrastrar: eso es JavaScript en acción.\n\nToda página web se construye con tres ingredientes:\n\n- **HTML** — la *estructura* (títulos, párrafos, botones)\n- **CSS** — el *estilo* (colores, diseño, fuentes)\n- **JavaScript** — el *comportamiento* (qué ocurre cuando haces clic, escribes o te desplazas)\n\n> JavaScript es el único lenguaje que se ejecuta de forma nativa en todos los navegadores. Por eso se convirtió en el lenguaje de la web.\n\n## El gran accidente del nombre\n\nA pesar del nombre, **JavaScript no tiene casi nada que ver con Java**. Son lenguajes completamente distintos. El nombre fue una decisión de marketing de 1995, cuando Java era la gran novedad y tomar prestado su nombre parecía buena idea. Provocó décadas de confusión: ahora tú ya conoces la verdad y vas por delante de la mayoría de principiantes.",
      },
    },
    {
      type: "concept",
      heading: {
        en: "Where JavaScript runs: engine, runtime, ECMAScript",
        es: "Dónde se ejecuta JavaScript: motor, entorno y ECMAScript",
      },
      body: {
        en: "JavaScript code cannot run by itself — it needs a **JavaScript engine**, a program that reads your code and executes it. The most famous engine is **V8**, built by Google: it powers Chrome, Edge, and also **Node.js**.\n\nThe engine never works alone. It lives inside a **runtime environment** that gives it superpowers:\n\n- In the **browser**, the runtime offers *browser APIs*: the DOM (to read and change the page), `fetch` (to ask servers for data), timers, and more.\n- In **Node.js**, the runtime offers a different set: reading files, opening network servers, talking to databases. That is how JavaScript escaped the browser and now runs **backends, CLIs, desktop apps and even robots**.\n\nFinally, **ECMAScript** is the official standard — the rulebook that every engine follows. When people say \"ES2023\" or \"ES6\", they mean a version of that rulebook. In this academy you will learn modern JavaScript (ES6 and beyond), which works everywhere today.",
        es: "El código JavaScript no puede ejecutarse solo: necesita un **motor de JavaScript**, un programa que lee tu código y lo ejecuta. El motor más famoso es **V8**, creado por Google: impulsa Chrome, Edge y también **Node.js**.\n\nEl motor nunca trabaja solo. Vive dentro de un **entorno de ejecución** que le da superpoderes:\n\n- En el **navegador**, el entorno ofrece *APIs del navegador*: el DOM (para leer y modificar la página), `fetch` (para pedir datos a servidores), temporizadores y más.\n- En **Node.js**, el entorno ofrece otro conjunto: leer archivos, abrir servidores de red, hablar con bases de datos. Así es como JavaScript escapó del navegador y hoy ejecuta **servidores, CLIs, apps de escritorio e incluso robots**.\n\nPor último, **ECMAScript** es el estándar oficial: el reglamento que sigue cada motor. Cuando la gente dice «ES2023» o «ES6», se refiere a una versión de ese reglamento. En esta academia aprenderás JavaScript moderno (ES6 en adelante), que funciona en todas partes hoy.",
      },
    },
    {
      type: "visual",
      diagram: [
        "              Browser",
        "                 ↓",
        "  HTML + CSS + JavaScript",
        "                 ↓",
        "            JS Engine",
        "                 ↓",
        "          Executes Code",
      ].join("\n"),
      caption: {
        en: "Your code travels down this stack: the browser hands it to the engine, and the engine executes it.",
        es: "Tu código recorre esta pila: el navegador se lo pasa al motor y el motor lo ejecuta.",
      },
    },
    {
      type: "code",
      heading: {
        en: "Your first program",
        es: "Tu primer programa",
      },
      code: 'console.log("Hello world");',
      caption: {
        en: "Press RUN — then change the text inside the quotes to your name and run it again. You just programmed.",
        es: "Pulsa EJECUTAR, cambia el texto entre comillas por tu nombre y vuelve a ejecutarlo. Acabas de programar.",
      },
    },
    {
      type: "lab",
      lab: "runtime-visualizer",
      heading: {
        en: "See the stack in action",
        es: "Mira la pila en acción",
      },
      body: {
        en: "Open the runtime visualizer and watch a line of code travel from the browser, through the engine, to the screen. Drag things around — nothing can break here.",
        es: "Abre el visualizador de entorno y observa cómo una línea de código viaja desde el navegador, pasa por el motor y llega a la pantalla. Mueve cosas sin miedo: aquí nada se puede romper.",
      },
    },
    {
      type: "code",
      heading: {
        en: "The engine turns text into results",
        es: "El motor convierte texto en resultados",
      },
      code: [
        "// The engine reads source code and produces results.",
        'console.log(2 + 3 * 4);         // 14 — math respects precedence',
        'console.log("Java" + "Script"); // "JavaScript" — strings glue together',
        "console.log(typeof 42);         // \"number\" — the engine knows every type",
      ].join("\n"),
      caption: {
        en: "Same engine, three tricks: math, text and types. Try changing the expressions.",
        es: "El mismo motor, tres trucos: matemáticas, texto y tipos. Prueba a cambiar las expresiones.",
      },
    },
    {
      type: "mistake",
      wrong: [
        "// A Node.js script (no browser here!):",
        'window.alert("hi");  // ❌ window only exists in browsers',
      ].join("\n"),
      right: [
        "// The same idea, written portably:",
        'console.log("hi");   // ✅ console exists in browsers AND Node.js',
      ].join("\n"),
      explanation: {
        en: "Beginners often assume **browser APIs exist everywhere**. `window`, `document` and `alert` only exist inside a browser runtime. In Node.js they are undefined. `console.log`, on the other hand, works in both — which is why every example in this academy uses it.",
        es: "Los principiantes suelen asumir que **las APIs del navegador existen en todas partes**. `window`, `document` y `alert` solo existen dentro del navegador. En Node.js no están definidas. `console.log`, en cambio, funciona en ambos, y por eso todos los ejemplos de esta academia lo usan.",
      },
    },
    {
      type: "takeaway",
      body: {
        en: "**JavaScript is the behavior layer of the web** (HTML = structure, CSS = style). It is *not* Java — the name was marketing. Your code is executed by a **JS engine** (like V8) inside a **runtime** (browser or Node.js), following the **ECMAScript** standard.",
        es: "**JavaScript es la capa de comportamiento de la web** (HTML = estructura, CSS = estilo). *No* es Java: el nombre fue marketing. Tu código lo ejecuta un **motor JS** (como V8) dentro de un **entorno** (navegador o Node.js), siguiendo el estándar **ECMAScript**.",
      },
    },
    {
      type: "underhood",
      title: {
        en: "How V8 actually runs your code",
        es: "Cómo V8 ejecuta tu código en realidad",
      },
      body: {
        en: "Modern engines like V8 do not just read your code line by line. They **parse** it into a tree, compile it to **bytecode** for a quick start, and then watch which parts run often. Hot code gets recompiled into highly optimized **machine code** — this is called *just-in-time* (JIT) compilation. That is why JavaScript, once dismissed as a \"toy language\", is fast enough to run servers, games and design tools today.",
        es: "Los motores modernos como V8 no se limitan a leer tu código línea a línea. Lo **analizan** hasta formar un árbol, lo compilan a **bytecode** para arrancar rápido y observan qué partes se ejecutan más. El código más usado se recompila a **código máquina** muy optimizado: es la compilación *just-in-time* (JIT). Por eso JavaScript, antes despreciado como «lenguaje de juguete», hoy es lo bastante rápido para servidores, juegos y herramientas de diseño.",
      },
    },
  ],
  quiz: [
    {
      q: {
        en: "What is the relationship between JavaScript and Java?",
        es: "¿Qué relación hay entre JavaScript y Java?",
      },
      options: [
        { en: "They are the same language", es: "Son el mismo lenguaje" },
        {
          en: "Completely different languages — the name was marketing",
          es: "Lenguajes completamente distintos: el nombre fue marketing",
        },
        { en: "JavaScript is a simplified Java", es: "JavaScript es un Java simplificado" },
        { en: "Java is the newer version of JavaScript", es: "Java es la versión nueva de JavaScript" },
      ],
      answer: 1,
      explanation: {
        en: "JavaScript was named after Java for marketing reasons in 1995, but the two languages share almost nothing: different syntax, different runtimes, different worlds.",
        es: "JavaScript tomó el nombre de Java por marketing en 1995, pero ambos lenguajes no comparten casi nada: sintaxis, entornos y mundos distintos.",
      },
    },
    {
      q: {
        en: "Where can JavaScript run today?",
        es: "¿Dónde puede ejecutarse JavaScript hoy?",
      },
      options: [
        { en: "Only inside web browsers", es: "Solo dentro de navegadores web" },
        { en: "Only in Google Chrome", es: "Solo en Google Chrome" },
        {
          en: "In browsers, on servers (Node.js), and on devices",
          es: "En navegadores, en servidores (Node.js) y en dispositivos",
        },
        { en: "Only if Java is installed", es: "Solo si Java está instalado" },
      ],
      answer: 2,
      explanation: {
        en: "JavaScript escaped the browser long ago: Node.js runs it on servers, and it also powers desktop apps, CLIs and embedded devices.",
        es: "JavaScript escapó del navegador hace mucho: Node.js lo ejecuta en servidores, y también impulsa apps de escritorio, CLIs y dispositivos integrados.",
      },
    },
    {
      q: {
        en: "What is V8?",
        es: "¿Qué es V8?",
      },
      options: [
        { en: "A browser API for video", es: "Una API del navegador para vídeo" },
        {
          en: "The JavaScript engine inside Chrome (and Node.js)",
          es: "El motor de JavaScript dentro de Chrome (y Node.js)",
        },
        {
          en: "A version of the ECMAScript standard",
          es: "Una versión del estándar ECMAScript",
        },
        { en: "A JavaScript package manager", es: "Un gestor de paquetes de JavaScript" },
      ],
      answer: 1,
      explanation: {
        en: "V8 is Google's JavaScript engine: it reads JS source code and executes it. Chrome embeds it for the browser; Node.js embeds it for the server.",
        es: "V8 es el motor de JavaScript de Google: lee código JS y lo ejecuta. Chrome lo integra para el navegador; Node.js, para el servidor.",
      },
    },
    {
      q: {
        en: "What does the JavaScript engine do?",
        es: "¿Qué hace el motor de JavaScript?",
      },
      options: [
        { en: "It styles the page with CSS", es: "Aplica estilos CSS a la página" },
        {
          en: "It reads JavaScript source code and executes it",
          es: "Lee el código fuente JavaScript y lo ejecuta",
        },
        { en: "It downloads images and fonts", es: "Descarga imágenes y fuentes" },
        { en: "It sends emails from the browser", es: "Envía correos desde el navegador" },
      ],
      answer: 1,
      explanation: {
        en: "The engine's only job is to take your JavaScript text and run it. Styling, downloading and networking belong to the browser or the runtime around it.",
        es: "El único trabajo del motor es tomar tu texto JavaScript y ejecutarlo. Los estilos, las descargas y la red pertenecen al navegador o al entorno que lo rodea.",
      },
    },
  ],
  sandbox: "runtime-visualizer",
};
