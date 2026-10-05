export default {
  id: "closures",
  module: 18,
  level: "advanced",
  stub: false,
  title: { en: "Closures", es: "Clausuras" },
  tagline: {
    en: "Functions that remember: how an inner function keeps its variables alive.",
    es: "Funciones que recuerdan: cómo una función interna mantiene vivas sus variables.",
  },
  sections: [
    {
      type: "concept",
      heading: { en: "A function that remembers", es: "Una función que recuerda" },
      body: {
        en: `When a function is defined **inside** another function, it keeps access to the outer function's variables — even after the outer function has finished and returned. That surviving bundle of *function + the variables it remembers* is a **closure**.

Technically every function in JavaScript is a closure. The interesting case is when the inner function **outlives** the outer one: it's returned, stored, or passed somewhere else, and its variables should be long gone… but they aren't.`,
        es: `Cuando una función se define **dentro** de otra, conserva el acceso a las variables de la función externa, incluso después de que esta haya terminado y devuelto su valor. Ese paquete superviviente de *función + las variables que recuerda* es una **clausura** (*closure*).

En sentido estricto, toda función en JavaScript es una clausura. El caso interesante es cuando la función interna **sobrevive** a la externa: se devuelve, se guarda o se pasa a otro lugar, y sus variables deberían haber desaparecido hace tiempo… pero no lo han hecho.`,
      },
    },
    {
      type: "visual",
      diagram: `counter() runs, then RETURNS — but look what survives:

  ┌──────────────────┐
  │  count: 1        │   ◀── the variable cell
  │  (still alive!   │       stays in memory
  │   counter() has  │
  │   finished)      │
  └────────┬─────────┘
           │ holds a reference
           ▼
  ┌──────────────────┐
  │  returned        │
  │  function () {   │
  │    count++       │   ──▶ each call reads AND
  │    return count  │       writes the SAME cell
  │  }               │
  └──────────────────┘`,
      caption: {
        en: "The inner function holds a live reference to count's cell — it never gets garbage-collected while the function exists.",
        es: "La función interna conserva una referencia viva a la celda de count: nunca se libera de memoria mientras la función exista.",
      },
    },
    {
      type: "code",
      heading: { en: "The classic counter", es: "El contador clásico" },
      code: `function counter() {
  let count = 0;          // local variable...
  return function () {    // ...captured by the inner function
    count++;
    return count;
  };
}

const c = counter();
console.log(c()); // 1
console.log(c()); // 2 — count did NOT reset!`,
      caption: {
        en: "Output: 1, then 2. The inner function shares one persistent count cell.",
        es: "Salida: 1 y luego 2. La función interna comparte una única celda persistente de count.",
      },
      body: {
        en: "Each call to `c()` increments the **same** `count`. The variable belongs to a call of `counter()` that already finished — but the closure keeps it alive.",
        es: "Cada llamada a `c()` incrementa el **mismo** `count`. La variable pertenece a una llamada de `counter()` que ya terminó, pero la clausura la mantiene viva.",
      },
    },
    {
      type: "lab",
      heading: { en: "Closure Explorer", es: "Explorador de clausuras" },
      body: {
        en: "Open the Closure Explorer to **see** the closed-over variables: create counters, watch each `count` cell live in its own memory slot, and confirm that two counters never share state.",
        es: "Abre el Explorador de clausuras para **ver** las variables capturadas: crea contadores, observa cada celda de `count` en su propio espacio de memoria y confirma que dos contadores nunca comparten estado.",
      },
      lab: "closure-explorer",
    },
    {
      type: "code",
      heading: { en: "Independent memories", es: "Memorias independientes" },
      code: `function counter() {
  let count = 0;
  return function () {
    count++;
    return count;
  };
}

const a = counter();
const b = counter();
console.log(a()); // 1
console.log(a()); // 2
console.log(b()); // 1 — b has its OWN count cell!`,
      caption: {
        en: "Output: 1, 2, 1. Every call to counter() creates a fresh, private count.",
        es: "Salida: 1, 2, 1. Cada llamada a counter() crea un count nuevo y privado.",
      },
      body: {
        en: "This is why closures are powerful: `count` is **private state**. Nothing outside can touch it — no other code can reset or corrupt `a`'s counter. It's the foundation of data hiding in JavaScript, long before classes existed.",
        es: "Por eso las clausuras son tan potentes: `count` es **estado privado**. Nada de fuera puede tocarlo: ningún otro código puede reiniciar ni corromper el contador de `a`. Es la base de la ocultación de datos en JavaScript, mucho antes de que existieran las clases.",
      },
    },
    {
      type: "mistake",
      wrong: `for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0);
}
// logs 3, 3, 3 — not 0, 1, 2!`,
      right: `for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0);
}
// logs 0, 1, 2 — each iteration gets its OWN i`,
      explanation: {
        en: "`var` is function-scoped, so there is **one shared `i`**. The timers run *after* the loop finishes, when `i` is already `3` — and each closure sees that same final value. `let` is block-scoped: every iteration gets a **fresh binding**, so each closure captures its own `i`. When in doubt, default to `let`.",
        es: "`var` tiene ámbito de función, así que hay **una sola `i` compartida**. Los temporizadores se ejecutan *después* de que termine el bucle, cuando `i` ya vale `3`, y cada clausura ve ese mismo valor final. `let` tiene ámbito de bloque: cada iteración recibe una **variable nueva**, así que cada clausura captura su propia `i`. En caso de duda, usa `let`.",
      },
    },
    {
      type: "takeaway",
      body: {
        en: "A closure is a function that carries its birthplace with it: the variables it needs stay alive as long as the function does. That gives you private state — and explains why `var` in a loop famously misbehaves.",
        es: "Una clausura es una función que lleva consigo su lugar de nacimiento: las variables que necesita siguen vivas mientras la función exista. Eso te da estado privado, y explica por qué `var` en un bucle se comporta de forma tan famosa y traicionera.",
      },
    },
    {
      type: "underhood",
      title: { en: "Lexical environments, in one paragraph", es: "Entornos léxicos, en un párrafo" },
      body: {
        en: "Under the hood, every time a function runs, JavaScript creates a **lexical environment**: a record of its local variables plus a link to the environment where the function was *defined* (not where it was called). A closure is simply a function that keeps its defining environment alive — the inner function's link points back to `counter()`'s environment, so `count` can't be garbage-collected. Scope chains are just these links, followed outward.",
        es: "Entre bambalinas, cada vez que se ejecuta una función, JavaScript crea un **entorno léxico**: un registro de sus variables locales más un enlace al entorno donde la función se *definió* (no donde se llamó). Una clausura es simplemente una función que mantiene vivo su entorno de definición: el enlace de la función interna apunta al entorno de `counter()`, así que `count` no puede ser liberado por el recolector de basura. Las cadenas de ámbito son solo estos enlaces, seguidos hacia fuera.",
      },
    },
  ],
  quiz: [
    {
      q: { en: "What will this code output?", es: "¿Qué mostrará este código?" },
      code: `function counter() {
  let n = 10;
  return function () { n -= 1; return n; };
}
const c = counter();
console.log(c());
console.log(c());`,
      options: [
        { en: "10 then 9", es: "10 y luego 9" },
        { en: "9 then 8", es: "9 y luego 8" },
        { en: "10 then 10", es: "10 y luego 10" },
        { en: "9 then 9", es: "9 y luego 9" },
      ],
      answer: 1,
      explanation: {
        en: "The closure decrements the **same** `n` each time: `10 → 9` on the first call, `9 → 8` on the second. `n` never resets because the cell survives between calls.",
        es: "La clausura decrementa la **misma** `n` cada vez: `10 → 9` en la primera llamada, `9 → 8` en la segunda. `n` nunca se reinicia porque la celda sobrevive entre llamadas.",
      },
    },
    {
      q: { en: "Why doesn't `count` reset to 0 on every call?", es: "¿Por qué `count` no vuelve a 0 en cada llamada?" },
      code: `function counter() {
  let count = 0;
  return function () { count++; return count; };
}
const c = counter();`,
      options: [
        { en: "The inner function keeps a live reference to count's variable cell", es: "La función interna conserva una referencia viva a la celda de count" },
        { en: "count is a global variable", es: "count es una variable global" },
        { en: "JavaScript caches the return value", es: "JavaScript guarda en caché el valor devuelto" },
        { en: "let variables can never be reset", es: "Las variables let nunca se pueden reiniciar" },
      ],
      answer: 0,
      explanation: {
        en: "`let count = 0` runs **once**, when `counter()` is called. The returned function holds a reference to that exact variable cell, so every call reads and writes the same memory — it just keeps counting.",
        es: "`let count = 0` se ejecuta **una sola vez**, cuando se llama a `counter()`. La función devuelta conserva una referencia a esa celda exacta, así que cada llamada lee y escribe la misma memoria: simplemente sigue contando.",
      },
    },
    {
      q: { en: "What will this code output?", es: "¿Qué mostrará este código?" },
      code: `function counter() {
  let count = 0;
  return function () { count++; return count; };
}
const a = counter();
const b = counter();
a(); a();
console.log(b());`,
      options: [
        { en: "3", es: "3" },
        { en: "1", es: "1" },
        { en: "2", es: "2" },
        { en: "0", es: "0" },
      ],
      answer: 1,
      explanation: {
        en: "`a` and `b` are **separate closures** with **separate cells**. Calling `a()` twice only affects `a`'s cell; `b`'s cell is still `0`, so `b()` returns `1`.",
        es: "`a` y `b` son **clausuras distintas** con **celdas distintas**. Llamar a `a()` dos veces solo afecta a la celda de `a`; la celda de `b` sigue en `0`, así que `b()` devuelve `1`.",
      },
    },
    {
      q: { en: "Which of these creates a closure?", es: "¿Cuál de estos crea una clausura?" },
      options: [
        { en: "A function returned from another function, using the outer variable", es: "Una función devuelta por otra función, que usa la variable externa" },
        { en: "Any two nested for loops", es: "Dos bucles for anidados cualesquiera" },
        { en: "A function that takes no parameters", es: "Una función que no recibe parámetros" },
        { en: "An object with two methods", es: "Un objeto con dos métodos" },
      ],
      answer: 0,
      explanation: {
        en: "The key ingredients: an **inner function** that **uses an outer variable** and **outlives** the outer call (by being returned, stored, or passed along). Nesting alone isn't enough — the inner function must escape with its variables.",
        es: "Los ingredientes clave: una **función interna** que **usa una variable externa** y **sobrevive** a la llamada externa (al ser devuelta, guardada o pasada a otro lugar). Anidar no basta: la función interna debe escapar con sus variables.",
      },
    },
  ],
  sandbox: "closure-explorer",
};
