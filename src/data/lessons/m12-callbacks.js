// Module 12 — Callbacks (full lesson content, Phase 4)
export default {
  id: "callbacks",
  module: 12,
  level: "intermediate",
  stub: false,
  title: { en: "Callbacks", es: "Callbacks" },
  tagline: {
    en: "Functions as arguments — who runs what, and when.",
    es: "Funciones como argumentos — quién ejecuta qué, y cuándo.",
  },
  sections: [
    {
      type: "concept",
      heading: { en: "Functions you hand over", es: "Funciones que entregas" },
      body: {
        en: "You've already passed data to functions. A **callback** is the same idea, one level up: instead of passing data, you pass **a function** — and the receiving function decides **when** to run it.\n\nThree words for three roles:\n\n- **function** — the reusable block of code.\n- **argument** — a value handed to a function call.\n- **callback** — an argument that happens to be a function, meant to be *called back* later.\n\n> The golden rule: pass the function **itself** (`greet`), not the result of calling it (`greet()`). One is a recipe you hand over; the other is a meal you already ate.",
        es: "Ya has pasado datos a funciones. Un **callback** es la misma idea, un nivel más arriba: en lugar de pasar datos, pasas **una función** — y la función receptora decide **cuándo** ejecutarla.\n\nTres palabras para tres roles:\n\n- **función** — el bloque de código reutilizable.\n- **argumento** — un valor entregado a una llamada de función.\n- **callback** — un argumento que resulta ser una función, destinado a ser *llamado de vuelta* más tarde.\n\n> La regla de oro: pasa la función **en sí** (`greet`), no el resultado de llamarla (`greet()`). Una es una receta que entregas; la otra es una comida que ya te comiste.",
      },
    },
    {
      type: "visual",
      diagram: `processUser("Ada", () => console.log("done"))

  1. processUser is CALLED
     ├─ name     = "Ada"
     └─ callback = () => console.log("done")   ← stored, NOT run

  2. console.log(name)        → prints "Ada"

  3. callback() is CALLED      ← NOW it runs
     └─ console.log("done")   → prints "done"`,
      caption: {
        en: "Passed at step 1, stored, executed at step 3 — that's the whole idea.",
        es: "Pasado en el paso 1, almacenado, ejecutado en el paso 3 — esa es toda la idea.",
      },
      body: {
        en: "Notice the gap between step 1 and step 3: the callback travels as a *value* — a parcel of code — until someone decides to call it. That separation between **handing over** and **running** is what makes callbacks powerful: the caller chooses the *what*, the receiver chooses the *when*.",
        es: "Fíjate en el hueco entre el paso 1 y el 3: el callback viaja como un *valor* — un paquete de código — hasta que alguien decide llamarlo. Esa separación entre **entregar** y **ejecutar** es lo que hace potentes a los callbacks: quien llama elige el *qué*, quien recibe elige el *cuándo*.",
      },
    },
    {
      type: "code",
      heading: { en: "Your first callback", es: "Tu primer callback" },
      code: `function processUser(name, callback) {
  console.log("Processing:", name);
  callback(); // the callback runs HERE, inside
}

processUser("Ada", () => console.log("done"));`,
      caption: {
        en: 'Run it: prints "Processing: Ada", then "done". The arrow function is the callback.',
        es: 'Ejecútalo: imprime "Processing: Ada" y luego "done". La función flecha es el callback.',
      },
    },
    {
      type: "lab",
      heading: { en: "From callbacks to the Event Loop", es: "De los callbacks al Event Loop" },
      body: {
        en: "The `setTimeout` demo below hints at something bigger: callbacks that run *later*, after the current code finishes. Open the Event Loop visualizer to see where \"later\" actually happens — it's the star of module 13.",
        es: "La demo de `setTimeout` de abajo insinúa algo más grande: callbacks que se ejecutan *más tarde*, cuando el código actual termina. Abre el visualizador del Event Loop para ver dónde ocurre realmente ese «más tarde» — es la estrella del módulo 13.",
      },
      lab: "event-loop",
    },
    {
      type: "code",
      heading: { en: '"Call me back later"', es: "\"Llámame más tarde\"" },
      code: `console.log("A");
setTimeout(() => console.log("B"), 0); // "call me back later"
console.log("C");`,
      caption: {
        en: "Run it: A, C, B — even with a 0 ms delay. The callback waits its turn; the rest doesn't. Your bridge into module 13.",
        es: "Ejecútalo: A, C, B — incluso con 0 ms de retardo. El callback espera su turno; el resto no. Tu puente hacia el módulo 13.",
      },
    },
    {
      type: "mistake",
      wrong: `button.addEventListener("click", handleClick());
// handleClick runs NOW, during setup —
// and its RETURN VALUE (undefined) becomes the "listener"`,
      right: `button.addEventListener("click", handleClick);
// the function itself is registered;
// the browser calls it on every click`,
      explanation: {
        en: "Parentheses mean *call it right now*. Passing `handleClick` hands over the function so someone else can call it at the right moment. If your handler fires during setup instead of on click, look for stray `()`.",
        es: "Los paréntesis significan *llámala ahora mismo*. Pasar `handleClick` entrega la función para que otro la llame en el momento adecuado. Si tu manejador se dispara durante la configuración en lugar de al pulsar, busca `()` perdidos.",
      },
    },
    {
      type: "takeaway",
      body: {
        en: "A callback is a function passed as an argument, to be executed later by someone else's code. You pass the reference (`fn`), never the call (`fn()`). Callbacks are everywhere — array methods, event listeners, timers — and they're the doorway to asynchronous JavaScript in module 13.",
        es: "Un callback es una función pasada como argumento, para que otro código la ejecute más tarde. Pasas la referencia (`fn`), nunca la llamada (`fn()`). Los callbacks están en todas partes — métodos de arrays, oyentes de eventos, temporizadores — y son la puerta de entrada al JavaScript asíncrono del módulo 13.",
      },
    },
    {
      type: "underhood",
      title: { en: "Two temperaments", es: "Dos temperamentos" },
      body: {
        en: "Callbacks come in two temperaments. **Synchronous** callbacks run immediately inside the caller — `array.map(fn)` calls `fn` for each item before `map` returns. **Asynchronous** callbacks are scheduled for later — `setTimeout(fn, 1000)` and event listeners wait for their moment. Modules 13–16 are all about the async kind.",
        es: "Los callbacks tienen dos temperamentos. Los **síncronos** se ejecutan de inmediato dentro de quien los llama — `array.map(fn)` llama a `fn` por cada elemento antes de que `map` devuelva nada. Los **asíncronos** se programan para más tarde — `setTimeout(fn, 1000)` y los oyentes de eventos esperan su momento. Los módulos 13–16 tratan sobre los asíncronos.",
      },
    },
  ],
  quiz: [
    {
      q: {
        en: 'In processUser("Ada", greetUser), which one is the callback?',
        es: 'En processUser("Ada", greetUser), ¿cuál es el callback?',
      },
      options: [
        { en: '"Ada"', es: '"Ada"' },
        { en: "greetUser", es: "greetUser" },
        { en: "processUser", es: "processUser" },
        { en: "console.log", es: "console.log" },
      ],
      answer: 1,
      explanation: {
        en: "`greetUser` is the function passed *as an argument* to be called back later — that's the definition of a callback. `\"Ada\"` is a plain data argument, and `processUser` is the function receiving it.",
        es: "`greetUser` es la función pasada *como argumento* para ser llamada más tarde — esa es la definición de callback. `\"Ada\"` es un argumento de datos normal, y `processUser` es la función que lo recibe.",
      },
    },
    {
      q: {
        en: "What will this code output?",
        es: "¿Qué mostrará este código?",
      },
      code: 'console.log("A");\nsetTimeout(() => console.log("B"), 0);\nconsole.log("C");',
      options: [
        { en: "A, B, C", es: "A, B, C" },
        { en: "A, C, B", es: "A, C, B" },
        { en: "B, A, C", es: "B, A, C" },
        { en: "C, A, B", es: "C, A, B" },
      ],
      answer: 1,
      explanation: {
        en: "`setTimeout` schedules the callback for **later** — even with 0 ms. The main code keeps running (`A`, then `C`), and only when it finishes does the callback fire (`B`). This ordering is the heart of module 13.",
        es: "`setTimeout` programa el callback para **más tarde** — incluso con 0 ms. El código principal sigue ejecutándose (`A`, luego `C`), y solo cuando termina se dispara el callback (`B`). Este orden es el corazón del módulo 13.",
      },
    },
    {
      q: {
        en: "Why does handleClick run immediately here instead of on click?",
        es: "¿Por qué se ejecuta handleClick de inmediato en lugar de al pulsar?",
      },
      code: 'button.addEventListener("click", handleClick());',
      options: [
        {
          en: "The () calls it right now; its return value becomes the listener",
          es: "Los () la llaman ahora mismo; su valor de retorno se convierte en el oyente",
        },
        {
          en: "addEventListener requires parentheses",
          es: "addEventListener requiere paréntesis",
        },
        {
          en: "It's a syntax error",
          es: "Es un error de sintaxis",
        },
        {
          en: "It actually waits for the click anyway",
          es: "En realidad espera al clic igualmente",
        },
      ],
      answer: 0,
      explanation: {
        en: "`handleClick()` **executes** the function immediately and passes whatever it *returns* (here `undefined`) as the listener. Pass `handleClick` — no parentheses — to hand over the function itself.",
        es: "`handleClick()` **ejecuta** la función de inmediato y pasa lo que *devuelve* (aquí `undefined`) como oyente. Pasa `handleClick` — sin paréntesis — para entregar la función en sí.",
      },
    },
  ],
  sandbox: "event-loop",
};
