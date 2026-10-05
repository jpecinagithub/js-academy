// Module 10 — The DOM (full lesson content, Phase 4)
// Note: DOM code lives in fenced listings inside concept sections, NOT in
// runnable `code` sections — the sandbox has no `document`.
export default {
  id: "dom",
  module: 10,
  level: "intermediate",
  stub: false,
  title: { en: "The DOM", es: "El DOM" },
  tagline: {
    en: "Find it, change it, build it — JavaScript meets the page.",
    es: "Encuéntralo, cámbialo, constrúyelo — JavaScript se encuentra con la página.",
  },
  sections: [
    {
      type: "concept",
      heading: { en: "Your page is a tree", es: "Tu página es un árbol" },
      body: {
        en: "When the browser loads an HTML page, it builds a model of it in memory called the **DOM** — the Document Object Model. Think of it as a family tree of your page: every tag, piece of text, and attribute becomes a **node**, nested inside its parent.\n\nThe whole tree hangs off one global object: **`document`**. It is the front door to everything on the page. JavaScript talks to the DOM through it: find a node, read it, change it, create new ones, delete old ones — the page updates instantly, because the DOM *is* the live page, not a copy of it.",
        es: "Cuando el navegador carga una página HTML, construye en memoria un modelo de ella llamado **DOM** — Document Object Model (Modelo de Objetos del Documento). Piensa en él como el árbol genealógico de tu página: cada etiqueta, cada fragmento de texto y cada atributo se convierte en un **nodo**, anidado dentro de su padre.\n\nTodo el árbol cuelga de un único objeto global: **`document`**. Es la puerta de entrada a todo lo que hay en la página. JavaScript habla con el DOM a través de él: encuentra un nodo, lo lee, lo cambia, crea nuevos, borra viejos — y la página se actualiza al instante, porque el DOM *es* la página viva, no una copia.",
      },
    },
    {
      type: "visual",
      diagram: `              document
                 │
               <html>
              ┌──┴──┐
           <head>  <body>
                      │
                    <main>
                  ┌───┴────┐
                 <h1>    <button>
               "Hello"   "Click me"`,
      caption: {
        en: "A tiny page as the browser sees it: a tree of nodes.",
        es: "Una página pequeña tal como la ve el navegador: un árbol de nodos.",
      },
      body: {
        en: "Each box is a **node**. `<h1>` is a child of `<main>`, which is a child of `<body>`, and so on up to `document`. The text `\"Hello\"` is itself a node, nested inside the `<h1>`.\n\nEvery method below is just a way to walk this tree: find a node by some description, then read or change it.",
        es: "Cada caja es un **nodo**. `<h1>` es hijo de `<main>`, que es hijo de `<body>`, y así hasta `document`. El texto `\"Hello\"` es en sí un nodo, anidado dentro del `<h1>`.\n\nCada método de abajo es solo una forma de recorrer este árbol: encontrar un nodo por alguna descripción, y luego leerlo o cambiarlo.",
      },
    },
    {
      type: "concept",
      heading: { en: "Find it, change it", es: "Encuéntralo, cámbialo" },
      body: {
        en: "The four moves you'll use every day — shown here as a listing (the sandbox can't run DOM code, so try these in the lab instead):\n\n```\nconst title = document.querySelector(\"#title\"); // by CSS selector\nconst btn = document.getElementById(\"signup\");  // by id\n\ntitle.textContent = \"Hello, world!\"; // change the text\nbtn.classList.add(\"primary\");        // add a CSS class\nbtn.classList.toggle(\"hidden\");      // flip a class on/off\n\nconst li = document.createElement(\"li\"); // build a new node\nli.textContent = \"New item\";\ndocument.querySelector(\"ul\").appendChild(li); // attach it to the tree\n```\n\n- `querySelector` takes any **CSS selector** — `\"#title\"`, `\".card\"`, `\"ul li\"` — and returns the *first* match. (`querySelectorAll` returns all of them.)\n- `textContent` sets the node's text. `classList` manages its CSS classes.\n- `createElement` builds a node that exists in memory only — until `appendChild` grafts it onto the tree and it appears on the page.",
        es: "Los cuatro movimientos que usarás a diario — mostrados aquí como listado (el sandbox no puede ejecutar código DOM, así que pruébalos en el laboratorio):\n\n```\nconst title = document.querySelector(\"#title\"); // por selector CSS\nconst btn = document.getElementById(\"signup\");  // por id\n\ntitle.textContent = \"Hello, world!\"; // cambia el texto\nbtn.classList.add(\"primary\");        // añade una clase CSS\nbtn.classList.toggle(\"hidden\");      // activa/desactiva una clase\n\nconst li = document.createElement(\"li\"); // construye un nodo nuevo\nli.textContent = \"New item\";\ndocument.querySelector(\"ul\").appendChild(li); // lo injerta en el árbol\n```\n\n- `querySelector` acepta cualquier **selector CSS** — `\"#title\"`, `\".card\"`, `\"ul li\"` — y devuelve la *primera* coincidencia. (`querySelectorAll` devuelve todas.)\n- `textContent` define el texto del nodo. `classList` gestiona sus clases CSS.\n- `createElement` construye un nodo que solo existe en memoria — hasta que `appendChild` lo injerta en el árbol y aparece en la página.",
      },
    },
    {
      type: "concept",
      heading: { en: "innerHTML vs textContent", es: "innerHTML vs textContent" },
      body: {
        en: "Two ways to set an element's content — with a crucial difference:\n\n- `textContent` treats everything as **plain text**. `<b>` stays `<b>`, shown literally.\n- `innerHTML` **parses the string as HTML**. Tags become real elements.\n\n```\nel.textContent = \"<b>Hi</b>\"; // shows literally: <b>Hi</b>\nel.innerHTML = \"<b>Hi</b>\";   // renders bold: Hi\n```\n\nThat parsing power is handy for templates, but dangerous with data you don't fully trust — which is exactly what the first mistake below is about.",
        es: "Dos formas de definir el contenido de un elemento — con una diferencia crucial:\n\n- `textContent` trata todo como **texto plano**. `<b>` sigue siendo `<b>`, mostrado literalmente.\n- `innerHTML` **interpreta la cadena como HTML**. Las etiquetas se convierten en elementos reales.\n\n```\nel.textContent = \"<b>Hi</b>\"; // muestra literalmente: <b>Hi</b>\nel.innerHTML = \"<b>Hi</b>\";   // renderiza en negrita: Hi\n```\n\nEse poder de interpretación es útil para plantillas, pero peligroso con datos en los que no confías del todo — que es justo de lo que trata el primer error de abajo.",
      },
    },
    {
      type: "lab",
      heading: { en: "Open the DOM Playground", es: "Abre el DOM Playground" },
      body: {
        en: "Three panels — HTML, JavaScript, live preview. Edit either side and watch the tree update in real time. Try the snippets from this lesson here: select, change, create, append.",
        es: "Tres paneles — HTML, JavaScript y vista previa en vivo. Edita cualquiera de los dos lados y mira cómo el árbol se actualiza en tiempo real. Prueba aquí los fragmentos de esta lección: selecciona, cambia, crea, añade.",
      },
      lab: "dom-playground",
    },
    {
      type: "mistake",
      wrong: `// userInput could be: <img src=x onerror="stealData()">
commentBox.innerHTML = userInput; // parsed as HTML — dangerous!`,
      right: `commentBox.textContent = userInput; // shown as harmless text`,
      explanation: {
        en: "`innerHTML` parses the string as HTML, so untrusted data can inject real elements — including event handlers that run code (**XSS**). Never feed user input to `innerHTML`. Use `textContent` (or a sanitizer) for anything you didn't write yourself.",
        es: "`innerHTML` interpreta la cadena como HTML, así que datos no confiables pueden inyectar elementos reales — incluidos manejadores de eventos que ejecutan código (**XSS**). Nunca alimentes `innerHTML` con entrada del usuario. Usa `textContent` (o un sanitizador) para todo lo que no hayas escrito tú.",
      },
    },
    {
      type: "mistake",
      wrong: `<!-- script in <head>: runs before <body> exists -->
<script>
  const btn = document.querySelector("#signup");
  btn.addEventListener("click", () => {}); // TypeError: btn is null!
</script>`,
      right: `<!-- put scripts at the end of <body>, or wait for the DOM -->
<script>
  document.addEventListener("DOMContentLoaded", () => {
    const btn = document.querySelector("#signup"); // exists now
    btn.addEventListener("click", () => {});
  });
</script>`,
      explanation: {
        en: "`querySelector` returns `null` when nothing matches — including when your script runs *before* the element exists. Put scripts at the end of `<body>`, or wait for the `DOMContentLoaded` event before touching the tree.",
        es: "`querySelector` devuelve `null` cuando no hay coincidencias — incluso cuando tu script se ejecuta *antes* de que el elemento exista. Coloca los scripts al final del `<body>` o espera al evento `DOMContentLoaded` antes de tocar el árbol.",
      },
    },
    {
      type: "takeaway",
      body: {
        en: "The DOM is the live tree of your page, hanging off `document`. Select nodes with `querySelector`, change them with `textContent` and `classList`, build new ones with `createElement` + `appendChild`. Prefer `textContent` over `innerHTML` for untrusted data, and make sure the DOM exists before you query it.",
        es: "El DOM es el árbol vivo de tu página, colgando de `document`. Selecciona nodos con `querySelector`, cámbialos con `textContent` y `classList`, construye nuevos con `createElement` + `appendChild`. Prefiere `textContent` sobre `innerHTML` para datos no confiables, y asegúrate de que el DOM exista antes de consultarlo.",
      },
    },
    {
      type: "underhood",
      title: { en: "The DOM is not JavaScript", es: "El DOM no es JavaScript" },
      body: {
        en: "The DOM is a **browser API** that JavaScript can talk to — not part of the language itself. Node.js has no DOM at all, which is why `document` is `undefined` there (and in our code sandbox). The same idea powers every framework: React, Vue and friends are just smarter ways to describe what the DOM should look like — and they still end up creating these same nodes.",
        es: "El DOM es una **API del navegador** con la que JavaScript puede hablar — no forma parte del lenguaje en sí. Node.js no tiene DOM, por eso `document` es `undefined` allí (y en nuestro sandbox de código). La misma idea mueve a todos los frameworks: React, Vue y compañía son solo formas más inteligentes de describir cómo debería verse el DOM — y al final siguen creando estos mismos nodos.",
      },
    },
  ],
  quiz: [
    {
      q: {
        en: 'Which method lets you select an element with a CSS selector like "#title" or ".card"?',
        es: '¿Qué método permite seleccionar un elemento con un selector CSS como "#title" o ".card"?',
      },
      options: [
        { en: "document.getElementById", es: "document.getElementById" },
        { en: "document.querySelector", es: "document.querySelector" },
        { en: "document.createElement", es: "document.createElement" },
        { en: "document.appendChild", es: "document.appendChild" },
      ],
      answer: 1,
      explanation: {
        en: "`querySelector` accepts any CSS selector and returns the first match. `getElementById` only takes a bare id (no `#`), `createElement` builds new nodes, and `appendChild` attaches them.",
        es: "`querySelector` acepta cualquier selector CSS y devuelve la primera coincidencia. `getElementById` solo acepta un id sin `#`, `createElement` construye nodos nuevos y `appendChild` los adjunta.",
      },
    },
    {
      q: {
        en: "What's the key difference between textContent and innerHTML?",
        es: "¿Cuál es la diferencia clave entre textContent e innerHTML?",
      },
      options: [
        {
          en: "textContent renders HTML, innerHTML shows plain text",
          es: "textContent renderiza HTML, innerHTML muestra texto plano",
        },
        {
          en: "innerHTML parses the string as HTML, textContent shows it literally",
          es: "innerHTML interpreta la cadena como HTML, textContent la muestra literalmente",
        },
        {
          en: "They are identical — just two names for the same thing",
          es: "Son idénticos — dos nombres para lo mismo",
        },
        {
          en: "innerHTML only works on <div> elements",
          es: "innerHTML solo funciona en elementos <div>",
        },
      ],
      answer: 1,
      explanation: {
        en: "`innerHTML = \"<b>Hi</b>\"` renders **Hi** in bold, while `textContent = \"<b>Hi</b>\"` shows the literal characters `<b>Hi</b>`. That parsing is why `innerHTML` is risky with untrusted data.",
        es: "`innerHTML = \"<b>Hi</b>\"` renderiza **Hi** en negrita, mientras que `textContent = \"<b>Hi</b>\"` muestra los caracteres literales `<b>Hi</b>`. Esa interpretación es lo que hace peligroso a `innerHTML` con datos no confiables.",
      },
    },
    {
      q: {
        en: "What does appendChild return?",
        es: "¿Qué devuelve appendChild?",
      },
      options: [
        { en: "Nothing (undefined)", es: "Nada (undefined)" },
        { en: "The appended child element", es: "El elemento hijo añadido" },
        { en: "A copy of the child", es: "Una copia del hijo" },
        { en: "The parent element", es: "El elemento padre" },
      ],
      answer: 1,
      explanation: {
        en: "`appendChild` returns the node it just attached — handy for chaining: `const li = list.appendChild(document.createElement(\"li\"))` gives you `li` ready to configure.",
        es: "`appendChild` devuelve el nodo que acaba de adjuntar — útil para encadenar: `const li = list.appendChild(document.createElement(\"li\"))` te deja `li` listo para configurar.",
      },
    },
    {
      q: {
        en: 'What does document.querySelector("#nope") return when nothing matches?',
        es: '¿Qué devuelve document.querySelector("#nope") cuando no hay coincidencias?',
      },
      options: [
        { en: "null", es: "null" },
        { en: "undefined", es: "undefined" },
        { en: "It throws an Error", es: "Lanza un Error" },
        { en: "An empty element", es: "Un elemento vacío" },
      ],
      answer: 0,
      explanation: {
        en: "`querySelector` returns `null` on no match — it never throws. That's why calling a method on the result without checking can crash with \"Cannot read properties of null\".",
        es: "`querySelector` devuelve `null` si no hay coincidencia — nunca lanza un error. Por eso llamar a un método sobre el resultado sin comprobarlo puede fallar con «Cannot read properties of null».",
      },
    },
  ],
  sandbox: "dom-playground",
};
