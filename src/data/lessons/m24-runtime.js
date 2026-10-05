// Module 24: The JavaScript Runtime — the grand finale.
// Source → parser → AST → engine → memory + call stack → execution + GC.
export default {
  id: "runtime",
  module: 24,
  level: "advanced",
  stub: false,
  title: { en: "The JavaScript Runtime", es: "El runtime de JavaScript" },
  tagline: {
    en: "Everything this course taught you, happening in one pipeline: source → AST → engine → memory.",
    es: "Todo lo que te enseñó este curso, ocurriendo en un único pipeline: código → AST → motor → memoria.",
  },
  sandbox: "runtime-visualizer",
  sections: [
    {
      type: "concept",
      heading: { en: "You write text. The machine runs a model of it.", es: "Tú escribes texto. La máquina ejecuta un modelo de él." },
      body: {
        en: "Every module in this course was really about **one journey**: the text you type becomes data structures in memory, and those structures get executed. This final module walks the whole pipeline — and you'll recognize every stop.\n\n- **Modules 0–8** (syntax, variables, objects) → the **parser** and the **AST**.\n- **Modules 9, 18–21** (references, closures, `this`, prototypes, classes) → the **heap**, where objects live.\n- **Modules 5, 12–15** (functions, callbacks, promises, async/await) → the **call stack** and the **event loop**.\n- **Module 23** (storage) → memory that *outlives* the runtime.\n\nThe **runtime** is the program that performs this journey: in the browser it's the JS engine (V8 in Chrome, SpiderMonkey in Firefox, JavaScriptCore in Safari) plus the browser's APIs. In Node.js it's the same engine with different APIs.",
        es: "Cada módulo de este curso trataba en realidad de **un único viaje**: el texto que escribes se convierte en estructuras de datos en memoria, y esas estructuras se ejecutan. Este módulo final recorre todo el pipeline — y reconocerás cada parada.\n\n- **Módulos 0–8** (sintaxis, variables, objetos) → el **parser** y el **AST**.\n- **Módulos 9, 18–21** (referencias, clausuras, `this`, prototipos, clases) → el **heap**, donde viven los objetos.\n- **Módulos 5, 12–15** (funciones, callbacks, promesas, async/await) → la **pila de llamadas** y el **event loop**.\n- **Módulo 23** (almacenamiento) → memoria que *sobrevive* al runtime.\n\nEl **runtime** es el programa que ejecuta este viaje: en el navegador es el motor JS (V8 en Chrome, SpiderMonkey en Firefox, JavaScriptCore en Safari) más las APIs del navegador. En Node.js es el mismo motor con APIs distintas.",
      },
    },
    {
      type: "visual",
      caption: {
        en: "The full pipeline, end to end. Every program you've written in this course took this exact trip.",
        es: "El pipeline completo, de principio a fin. Cada programa que escribiste en este curso hizo exactamente este viaje.",
      },
      diagram: `┌─────────────────────────────────────────────────────────┐
│                    THE JAVASCRIPT RUNTIME                   │
├─────────────────────────────────────────────────────────┤
│                                                           │
│   SOURCE CODE          (your .js text)                     │
│        │                                                  │
│        ▼                                                  │
│   PARSER               (checks grammar, like a            │
│        │                spell-checker for code)            │
│        ▼                                                  │
│   AST                  (tree of what the code *means*)    │
│        │                                                  │
│        ▼                                                  │
│   JS ENGINE            (V8 / SpiderMonkey / JSC)          │
│        │               compiles & optimizes (JIT)          │
│        ├──────────────────────┬────────────────────────  │
│        ▼                      ▼                           │
│   MEMORY                  EXECUTION                       │
│   ┌──────────┐            ┌──────────────┐                │
│   │  STACK   │            │  CALL STACK  │  ← functions   │
│   │ (calls,  │            │  EVENT LOOP  │  ← async       │
│   │  prims)  │            │  TASK QUEUE  │    callbacks   │
│   ├──────────┤            └──────────────┘                │
│   │   HEAP   │ ← objects, closures, prototypes            │
│   └──────────┘                                            │
│        │                                                  │
│        ▼                                                  │
│   GARBAGE COLLECTOR  (frees unreachable objects)          │
│                                                           │
└─────────────────────────────────────────────────────────┘`,
    },
    {
      type: "concept",
      heading: { en: "Step 1 — Parsing: from text to tree", es: "Paso 1 — Análisis: de texto a árbol" },
      body: {
        en: "The engine can't execute raw text, so the **parser** first checks that your code follows the grammar (a syntax error stops everything *here*, before a single line runs) and then builds an **AST — Abstract Syntax Tree**.\n\nThe AST throws away punctuation and whitespace and keeps *meaning*: what is declared, what is called, what depends on what. Linters, formatters and bundlers all work on this tree too — it's the shared language of JS tooling.",
        es: "El motor no puede ejecutar texto crudo, así que el **parser** primero comprueba que tu código siga la gramática (un error de sintaxis detiene todo *aquí*, antes de que se ejecute una sola línea) y luego construye un **AST — árbol de sintaxis abstracta**.\n\nEl AST descarta puntuación y espacios y conserva el *significado*: qué se declara, qué se llama, qué depende de qué. Los linters, formateadores y empaquetadores también trabajan sobre este árbol — es el lenguaje común de las herramientas JS.",
      },
    },
    {
      type: "visual",
      caption: {
        en: "The AST for `let x = 5;` — the engine sees structure, not characters.",
        es: "El AST de `let x = 5;` — el motor ve estructura, no caracteres.",
      },
      diagram: `source:   let x = 5;

                    ┌───────────────────────┐
                    │ VariableDeclaration   │
                    │ kind: "let"           │
                    └───────┬───────────────┘
                            │
              ┌─────────────┴──────────────┐
              ▼                            ▼
     ┌────────────────┐          ┌────────────────┐
     │ Identifier     │          │ Literal        │
     │ name: "x"      │          │ value: 5       │
     └────────────────┘          └────────────────┘

  "declare a variable named x holding the number 5"
   — that's all the engine needs to know.`,
    },
    {
      type: "concept",
      heading: { en: "Step 2 — Compilation: the JIT makes it fast", es: "Paso 2 — Compilación: el JIT lo hace rápido" },
      body: {
        en: "JavaScript is not interpreted line-by-line like a script reader. Modern engines **compile** the AST to bytecode, run it immediately, and watch which functions get hot. The **JIT (Just-In-Time) compiler** then recompiles hot code into optimized machine code — speculating, for example, that `add(a, b)` will keep receiving numbers. If the speculation ever proves wrong, the engine *deoptimizes* back to the safe version. That's why tiny, predictable functions run absurdly fast.",
        es: "JavaScript no se interpreta línea a línea como un lector de guiones. Los motores modernos **compilan** el AST a bytecode, lo ejecutan de inmediato y observan qué funciones se calientan. El **compilador JIT (Just-In-Time)** recompila el código caliente a código máquina optimizado — especulando, por ejemplo, que `add(a, b)` seguirá recibiendo números. Si la especulación resulta falsa, el motor *desoptimiza* y vuelve a la versión segura. Por eso las funciones pequeñas y predecibles corren absurdamente rápido.",
      },
    },
    {
      type: "concept",
      heading: { en: "Step 3 — Execution: stack, heap, event loop", es: "Paso 3 — Ejecución: pila, heap, event loop" },
      body: {
        en: "Execution is where the course's mental models all meet:\n\n- The **call stack** tracks which function is running (Modules 5, 12). Push on call, pop on return — one stack, one thing at a time.\n- The **heap** holds every object you create: literals, arrays, closures, class instances, prototypes (Modules 9, 18–21). Variables hold *references* to heap addresses.\n- The **event loop** lets one thread juggle async work: timers, promises and I/O wait in queues, and their callbacks run when the stack is empty (Modules 13–15).\n\nWhen a function returns, its stack frame is discarded — but heap objects survive as long as *something still references them*.",
        es: "La ejecución es donde se encuentran todos los modelos mentales del curso:\n\n- La **pila de llamadas** registra qué función se está ejecutando (módulos 5, 12). Push al llamar, pop al retornar — una pila, una cosa cada vez.\n- El **heap** contiene cada objeto que creas: literales, arrays, clausuras, instancias de clase, prototipos (módulos 9, 18–21). Las variables guardan *referencias* a direcciones del heap.\n- El **event loop** permite a un solo hilo malabarear trabajo asíncrono: temporizadores, promesas y E/S esperan en colas, y sus callbacks se ejecutan cuando la pila se vacía (módulos 13–15).\n\nCuando una función retorna, su marco de pila se descarta — pero los objetos del heap sobreviven mientras *algo siga referenciándolos*.",
      },
    },
    {
      type: "concept",
      heading: { en: "Step 4 — Garbage collection: the runtime cleans up", es: "Paso 4 — Recolección de basura: el runtime limpia" },
      body: {
        en: "You never `free()` memory in JavaScript — the **garbage collector** does it. Periodically it walks the heap from known roots (global variables, the current stack) and marks everything reachable. Anything unmarked — an object nobody points to anymore — is swept away and its memory reused.\n\nThat's why losing the last reference to a huge array reclaims its memory automatically, and also why an accidental global reference (or a forgotten event listener) can leak memory forever: the collector only frees what is *unreachable*.",
        es: "En JavaScript nunca liberas memoria con `free()` — lo hace el **recolector de basura**. Periódicamente recorre el heap desde raíces conocidas (variables globales, la pila actual) y marca todo lo alcanzable. Lo no marcado — un objeto al que ya nadie apunta — se barre y su memoria se reutiliza.\n\nPor eso perder la última referencia a un array enorme reclama su memoria automáticamente, y también por eso una referencia global accidental (o un listener olvidado) puede fugar memoria para siempre: el recolector solo libera lo *inalcanzable*.",
      },
    },
    {
      type: "code",
      heading: { en: "Try it: trace the stack", es: "Pruébalo: traza la pila" },
      code: `function boil() {
  console.log("  boil: water is hot");
}

function cook() {
  console.log("cook: start");
  boil(); // pushed on top of cook
  console.log("cook: done");
}

console.log("main: start");
cook(); // pushed on top of main
console.log("main: done");`,
      caption: {
        en: "Before running: which frame sits on the call stack first? main → cook → boil, then they pop in reverse. You just simulated the execution step.",
        es: "Antes de ejecutar: ¿qué marco se posa primero en la pila de llamadas? main → cook → boil, y luego se desapilan en orden inverso. Acabas de simular el paso de ejecución.",
      },
      body: {
        en: "Read the output order carefully — it *is* the stack discipline: each function's frame is pushed when called and popped when it returns. The event loop (Modules 13–15) is what refills an empty stack with queued callbacks.",
        es: "Lee el orden de la salida con atención — *es* la disciplina de la pila: el marco de cada función se apila al llamarla y se desapila al retornar. El event loop (módulos 13–15) es lo que rellena una pila vacía con callbacks en cola.",
      },
    },
    {
      type: "lab",
      lab: "runtime-visualizer",
      heading: { en: "Runtime Visualizer", es: "Visualizador del runtime" },
      body: {
        en: "Open the lab and run a program **stage by stage**: watch the parser build the AST, the engine allocate heap objects, frames push and pop on the call stack, and the collector sweep unreachable memory. It's every module of this course in one window.",
        es: "Abre el laboratorio y ejecuta un programa **etapa por etapa**: observa al parser construir el AST, al motor asignar objetos en el heap, a los marcos apilarse y desapilarse en la pila de llamadas, y al recolector barrer la memoria inalcanzable. Es cada módulo de este curso en una sola ventana.",
      },
    },
    {
      type: "takeaway",
      body: {
        en: "**You now know what the runtime is doing when you execute code.** Text becomes a syntax tree; the tree becomes optimized machine code; the code runs on a call stack, with objects living in the heap, async callbacks flowing through the event loop, prototypes linking objects together — and the garbage collector quietly reclaiming whatever you stop referencing. That pipeline *is* JavaScript. Everything else is detail — and now you have the mental model to learn any of it.",
        es: "**Ahora sabes lo que hace el runtime cuando ejecutas código.** El texto se convierte en un árbol de sintaxis; el árbol en código máquina optimizado; el código corre sobre una pila de llamadas, con los objetos viviendo en el heap, los callbacks asíncronos fluyendo por el event loop, los prototipos enlazando objetos — y el recolector de basura reclamando en silencio lo que dejas de referenciar. Ese pipeline *es* JavaScript. Todo lo demás es detalle — y ahora tienes el modelo mental para aprender cualquiera de ellos.",
      },
    },
    {
      type: "underhood",
      title: { en: "Under the hood: where to go from here", es: "Bajo el capó: hacia dónde ir desde aquí" },
      body: {
        en: "This course ends where real engineering begins. Natural next steps:\n\n- **TypeScript** — the same runtime, with a type checker running *before* the parser stage.\n- **A framework** (React, Vue, Svelte) — libraries that manage the heap and the DOM for you, compiled from components to runtime calls.\n- **Node.js / Deno / Bun** — the same engine outside the browser, with filesystem and network APIs instead of the DOM.\n- **Performance** — profiling with DevTools, reading flame charts: that's literally watching the call stack and the JIT in action.\n\nThe runtime hasn't changed in any of them. You already understand it.",
        es: "Este curso termina donde empieza la ingeniería real. Próximos pasos naturales:\n\n- **TypeScript** — el mismo runtime, con un comprobador de tipos ejecutándose *antes* de la etapa del parser.\n- **Un framework** (React, Vue, Svelte) — librerías que gestionan el heap y el DOM por ti, compiladas de componentes a llamadas del runtime.\n- **Node.js / Deno / Bun** — el mismo motor fuera del navegador, con APIs de archivos y red en vez del DOM.\n- **Rendimiento** — perfilar con DevTools, leer flame charts: eso es literalmente observar la pila de llamadas y el JIT en acción.\n\nEl runtime no ha cambiado en ninguno de ellos. Ya lo entiendes.",
      },
    },
  ],
  quiz: [
    {
      q: { en: "Put the pipeline stages in order.", es: "Ordena las etapas del pipeline." },
      options: [
        { en: "Source → Parser → AST → Engine → Execution", es: "Código → Parser → AST → Motor → Ejecución" },
        { en: "Source → Engine → AST → Parser → Execution", es: "Código → Motor → AST → Parser → Ejecución" },
        { en: "Source → AST → Parser → Execution → Engine", es: "Código → AST → Parser → Ejecución → Motor" },
      ],
      answer: 0,
      explanation: {
        en: "Text is **parsed** into an **AST**, the **engine** compiles and optimizes it, then **executes** it. The parser must come before the tree exists; the tree must exist before the engine can compile it.",
        es: "El texto se **analiza** en un **AST**, el **motor** lo compila y optimiza, y luego lo **ejecuta**. El parser debe ir antes de que exista el árbol; el árbol debe existir antes de que el motor pueda compilarlo.",
      },
    },
    {
      q: { en: "What is the AST?", es: "¿Qué es el AST?" },
      code: `let x = 5;`,
      options: [
        { en: "A compressed copy of the source file", es: "Una copia comprimida del archivo fuente" },
        { en: "A tree-shaped data structure describing what the code means", es: "Una estructura de datos en forma de árbol que describe lo que significa el código" },
        { en: "The machine code the CPU executes", es: "El código máquina que ejecuta la CPU" },
      ],
      answer: 1,
      explanation: {
        en: "The **Abstract Syntax Tree** discards punctuation and keeps structure: a `VariableDeclaration` with an `Identifier` (`x`) and a `Literal` (`5`). Linters, formatters and compilers all operate on this tree.",
        es: "El **árbol de sintaxis abstracta** descarta la puntuación y conserva la estructura: un `VariableDeclaration` con un `Identifier` (`x`) y un `Literal` (`5`). Linters, formateadores y compiladores operan sobre este árbol.",
      },
    },
    {
      q: { en: "What does the JIT compiler do?", es: "¿Qué hace el compilador JIT?" },
      options: [
        { en: "Checks syntax before the parser runs", es: "Comprueba la sintaxis antes de que corra el parser" },
        { en: "Recompiles hot code into optimized machine code at runtime", es: "Recompila el código caliente a código máquina optimizado en tiempo de ejecución" },
        { en: "Frees memory of unreachable objects", es: "Libera la memoria de los objetos inalcanzables" },
      ],
      answer: 1,
      explanation: {
        en: "**Just-In-Time** compilation watches which functions run often and recompiles them to fast machine code, speculating on types (e.g. \"these are always numbers\"). Wrong speculation → deoptimization back to the safe version.",
        es: "La compilación **Just-In-Time** observa qué funciones se ejecutan a menudo y las recompila a código máquina rápido, especulando con los tipos (p. ej. \"esto siempre son números\"). Si la especulación falla → desoptimización a la versión segura.",
      },
    },
    {
      q: { en: "Where do objects live during execution?", es: "¿Dónde viven los objetos durante la ejecución?" },
      options: [
        { en: "On the call stack", es: "En la pila de llamadas" },
        { en: "In the heap, reached via references", es: "En el heap, alcanzados mediante referencias" },
        { en: "In the AST", es: "En el AST" },
      ],
      answer: 1,
      explanation: {
        en: "The **stack** holds call frames and primitives; every object — literals, arrays, closures, class instances — lives in the **heap**, and variables hold references (addresses) to it. That's Modules 9 and 18–21 in one sentence.",
        es: "La **pila** contiene marcos de llamada y primitivos; cada objeto — literales, arrays, clausuras, instancias de clase — vive en el **heap**, y las variables guardan referencias (direcciones) a él. Eso son los módulos 9 y 18–21 en una frase.",
      },
    },
    {
      q: { en: "When does the garbage collector free an object?", es: "¿Cuándo libera el recolector de basura un objeto?" },
      code: `let data = { huge: new Array(1e6) };\ndata = null; // ← here`,
      options: [
        { en: "Immediately, on the next line", es: "Inmediatamente, en la línea siguiente" },
        { en: "When it becomes unreachable — no references point to it", es: "Cuando se vuelve inalcanzable — ninguna referencia apunta a él" },
        { en: "Only when the page closes", es: "Solo cuando se cierra la página" },
      ],
      answer: 1,
      explanation: {
        en: "Setting `data = null` drops the last reference, making the object **unreachable**. The collector's next sweep reclaims it. But a forgotten global or listener keeping a reference means it lives forever — that's a memory leak.",
        es: "Asignar `data = null` elimina la última referencia y vuelve al objeto **inalcanzable**. El siguiente barrido del recolector lo reclama. Pero una variable global olvidada o un listener que conserve una referencia lo mantiene vivo para siempre — eso es una fuga de memoria.",
      },
    },
  ],
};
