export default {
  id: "async-await",
  module: 15,
  level: "intermediate",
  stub: false,
  title: { en: "Async / Await", es: "Async / Await" },
  tagline: {
    en: "Promise chains rewritten as readable, steppable code.",
    es: "Cadenas de promesas reescritas como código legible paso a paso.",
  },
  sandbox: "async-race",
  sections: [
    {
      type: "concept",
      heading: { en: "Promises, written flat", es: "Promesas, escritas en plano" },
      body: {
        en: `Promises beat nested callbacks — but long chains still read like an obstacle course:

\`\`\`
// the .then() way: follow the indentation with your finger
getUser(1)
  .then((user) => getOrders(user.id))
  .then((orders) => getDetails(orders[0].id))
  .then((details) => console.log(details))
  .catch((err) => console.error(err));
\`\`\`

\`async\`/\`await\` is **the same promises underneath**, with syntax that reads like ordinary step-by-step code:

\`\`\`
// the async/await way: just read top to bottom
async function main() {
  try {
    const user = await getUser(1);
    const orders = await getOrders(user.id);
    const details = await getDetails(orders[0].id);
    console.log(details);
  } catch (err) {
    console.error(err);
  }
}
\`\`\`

Two keywords do all the work: \`async\` marks a function as asynchronous, and \`await\` **pauses that function** until the promise settles — then hands you the value. Errors are caught with plain old \`try\`/\`catch\`.`,
        es: `Las promesas vencen a los callbacks anidados, pero las cadenas largas siguen leyéndose como una carrera de obstáculos:

\`\`\`
// estilo .then(): sigue la indentación con el dedo
getUser(1)
  .then((user) => getOrders(user.id))
  .then((orders) => getDetails(orders[0].id))
  .then((details) => console.log(details))
  .catch((err) => console.error(err));
\`\`\`

\`async\`/\`await\` son **las mismas promesas por debajo**, con una sintaxis que se lee como código normal paso a paso:

\`\`\`
// estilo async/await: simplemente lee de arriba abajo
async function main() {
  try {
    const user = await getUser(1);
    const orders = await getOrders(user.id);
    const details = await getDetails(orders[0].id);
    console.log(details);
  } catch (err) {
    console.error(err);
  }
}
\`\`\`

Dos palabras clave hacen todo el trabajo: \`async\` marca una función como asíncrona y \`await\` **pausa esa función** hasta que la promesa se liquida, y entonces te entrega el valor. Los errores se atrapan con el clásico \`try\`/\`catch\`.`,
      },
    },
    {
      type: "code",
      heading: { en: "Same logic, both styles", es: "La misma lógica, en ambos estilos" },
      code: `const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Version A: .then() chains
delay(100)
  .then(() => console.log("chain: step 1"))
  .then(() => delay(100))
  .then(() => console.log("chain: step 2"));

// Version B: async / await
(async () => {
  await delay(100);
  console.log("await: step 1");
  await delay(100);
  console.log("await: step 2");
})();`,
      caption: {
        en: "Press RUN: both versions print their steps in the same order — the outputs interleave because the two versions run concurrently.",
        es: "Pulsa RUN: ambas versiones imprimen sus pasos en el mismo orden; las salidas se intercalan porque las dos versiones se ejecutan a la vez.",
      },
      body: {
        en: `Version B reads like synchronous code — \`await delay(100)\` looks like "wait here" — but nothing is blocked: while it waits, the event loop keeps running everything else (that's why version A's steps slip in between).

The \`delay\` helper is a pattern you'll reuse constantly: wrap \`setTimeout\` in a promise, and suddenly timers become \`await\`-able.`,
        es: `La versión B se lee como código síncrono —\`await delay(100)\` parece decir «espera aquí»— pero nada se bloquea: mientras espera, el event loop sigue ejecutando todo lo demás (por eso los pasos de la versión A se cuelan en medio).

El helper \`delay\` es un patrón que reutilizarás constantemente: envuelve \`setTimeout\` en una promesa y de repente los temporizadores se vuelven compatibles con \`await\`.`,
      },
    },
    {
      type: "concept",
      heading: { en: "async functions always return a promise", es: "Las funciones async siempre devuelven una promesa" },
      body: {
        en: `Marking a function \`async\` changes what it returns — **always a promise**, no exceptions:

\`\`\`
async function getAnswer() {
  return 42;               // looks like a plain number…
}
const result = getAnswer();
console.log(result);       // Promise { 42 } — a promise, not 42!
result.then((v) => console.log(v)); // 42 — unwrap it with .then
\`\`\`

- \`return value\` inside \`async\` → the promise **fulfills** with \`value\`.
- \`throw err\` inside \`async\` → the promise **rejects** with \`err\`.
- \`await\` only works **inside** an \`async\` function (using it outside is a \`SyntaxError\`).

This is why \`async\`/\`await\` and \`.then\` mix freely: they're the same currency.`,
        es: `Marcar una función como \`async\` cambia lo que devuelve: **siempre una promesa**, sin excepciones:

\`\`\`
async function getAnswer() {
  return 42;               // parece un número normal…
}
const result = getAnswer();
console.log(result);       // Promise { 42 } — ¡una promesa, no 42!
result.then((v) => console.log(v)); // 42 — desenvuélvelo con .then
\`\`\`

- \`return valor\` dentro de \`async\` → la promesa se **cumple** con \`valor\`.
- \`throw err\` dentro de \`async\` → la promesa se **rechaza** con \`err\`.
- \`await\` solo funciona **dentro** de una función \`async\` (usarlo fuera es un \`SyntaxError\`).

Por eso \`async\`/\`await\` y \`.then\` se mezclan libremente: son la misma moneda.`,
      },
    },
    {
      type: "lab",
      lab: "async-race",
      heading: { en: "Feel the timing in Async Race", es: "Siente los tiempos en Async Race" },
      body: {
        en: "Open the lab and race two strategies: `await` one delay after another (sequential) versus `await Promise.all([...])` (parallel). Watch the total time for each. This is the single most practical performance lesson in async JavaScript — and you'll *feel* the difference instead of just reading about it.",
        es: "Abre el laboratorio y haz competir dos estrategias: un `await` tras otro (secuencial) frente a `await Promise.all([...])` (paralelo). Observa el tiempo total de cada una. Es la lección de rendimiento más práctica del JavaScript asíncrono, y la *sentirás* en lugar de limitarte a leerla.",
      },
    },
    {
      type: "concept",
      heading: { en: "Sequential vs parallel", es: "Secuencial vs paralelo" },
      body: {
        en: `\`await\` pauses — so two awaits in a row **add up**:

\`\`\`
await delay(100);   // wait…
await delay(100);   // …wait again — total ≈ 200 ms
\`\`\`

When the operations **don't depend on each other**, start them together and await them all at once:

\`\`\`
await Promise.all([delay(100), delay(100)]); // both at once — total ≈ 100 ms
\`\`\`

> Rule of thumb: **sequential** when step B needs step A's result (user → their orders); **parallel** with \`Promise.all\` when the tasks are independent (user + settings + notifications). Awaiting independent promises one by one is the most common async performance bug.`,
        es: `\`await\` pausa, así que dos awaits seguidos **se suman**:

\`\`\`
await delay(100);   // espera…
await delay(100);   // …espera otra vez — total ≈ 200 ms
\`\`\`

Cuando las operaciones **no dependen entre sí**, inícialas juntas y espéralas todas a la vez:

\`\`\`
await Promise.all([delay(100), delay(100)]); // las dos a la vez — total ≈ 100 ms
\`\`\`

> Regla de oro: **secuencial** cuando el paso B necesita el resultado del paso A (usuario → sus pedidos); **paralelo** con \`Promise.all\` cuando las tareas son independientes (usuario + ajustes + notificaciones). Esperar promesas independientes una por una es el bug de rendimiento asíncrono más común.`,
      },
    },
    {
      type: "mistake",
      wrong: `async function main() {
  const price = delay(50).then(() => 99); // ← forgot await!
  console.log(price); // Promise { <pending> } — not 99!
}`,
      right: `async function main() {
  const price = await delay(50).then(() => 99); // ← await it
  console.log(price); // 99 ✓
}`,
      explanation: {
        en: `**Forgetting \`await\`.** Without it, you don't get the value — you get the **promise itself**, still pending. Any code treating it as the value (math, string methods, property access) silently misbehaves.

And the twin mistake: **using \`await\` outside an \`async\` function** is a \`SyntaxError\` — the code won't even run. (\`await\` is allowed at the top level of ES modules, but inside a classic script or function, it must be wrapped in \`async\`.)`,
        es: `**Olvidar el \`await\`.** Sin él, no obtienes el valor: obtienes **la promesa misma**, aún pendiente. Cualquier código que la trate como el valor (mates, métodos de string, acceso a propiedades) falla en silencio.

Y el error gemelo: **usar \`await\` fuera de una función \`async\`** es un \`SyntaxError\`: el código ni siquiera se ejecuta. (\`await\` está permitido en el nivel superior de los módulos ES, pero dentro de un script clásico o una función debe estar envuelto en \`async\`).`,
      },
    },
    {
      type: "takeaway",
      body: {
        en: "`async` marks a function as asynchronous (it always returns a promise); `await` pauses *that function* until the promise settles and hands you the value. Errors become plain `try`/`catch`. Use sequential `await` when steps depend on each other, `Promise.all()` when they don't.",
        es: "`async` marca una función como asíncrona (siempre devuelve una promesa); `await` pausa *esa función* hasta que la promesa se liquida y te entrega el valor. Los errores se convierten en un simple `try`/`catch`. Usa `await` secuencial cuando los pasos dependan entre sí, `Promise.all()` cuando no.",
      },
    },
    {
      type: "underhood",
      title: { en: "`await` is promises all the way down", es: "`await` son promesas hasta el fondo" },
      body: {
        en: `There are no threads hiding behind \`await\`. When an \`async\` function hits \`await somePromise\`, the engine **suspends the function** and returns to the event loop. When the promise settles, the *rest of the function* is scheduled as a **microtask** — exactly like a \`.then\` callback.

That's why \`await\` never freezes the page: it only pauses *one function*, while the event loop keeps serving timers, events and other promises. \`async\`/\`await\` is 100% syntactic sugar over the promise machinery from Module 14 — same queues, same rules, friendlier reading order.`,
        es: `No hay hilos escondidos detrás de \`await\`. Cuando una función \`async\` llega a \`await algunaPromesa\`, el motor **suspende la función** y vuelve al event loop. Cuando la promesa se liquida, *el resto de la función* se programa como una **microtarea**, exactamente igual que un callback de \`.then\`.

Por eso \`await\` nunca congela la página: solo pausa *una función*, mientras el event loop sigue atendiendo temporizadores, eventos y otras promesas. \`async\`/\`await\` es azúcar sintáctico al 100 % sobre la maquinaria de promesas del Módulo 14: las mismas colas, las mismas reglas, un orden de lectura más amable.`,
      },
    },
  ],
  quiz: [
    {
      q: { en: "What does an `async` function always return?", es: "¿Qué devuelve siempre una función `async`?" },
      options: [
        { en: "The returned value itself", es: "El valor devuelto tal cual" },
        { en: "A promise that resolves with the returned value", es: "Una promesa que se cumple con el valor devuelto" },
        { en: "undefined", es: "undefined" },
        { en: "A callback function", es: "Una función callback" },
      ],
      answer: 1,
      explanation: {
        en: "`async` wraps everything: `return 42` becomes a promise **fulfilled with 42**, and `throw err` becomes a promise **rejected with err**. That's why you can `.then()` the result of any async function.",
        es: "`async` lo envuelve todo: `return 42` se convierte en una promesa **cumplida con 42**, y `throw err` en una promesa **rechazada con err**. Por eso puedes aplicar `.then()` al resultado de cualquier función async.",
      },
    },
    {
      q: { en: "What will this code output?", es: "¿Qué mostrará este código?" },
      code: `async function main() {\n  return 7 * 6;\n}\nmain().then((v) => console.log("v =", v));`,
      options: [
        { en: '"42"', es: '"42"' },
        { en: '"v = 42"', es: '"v = 42"' },
        { en: '"v = Promise { 42 }"', es: '"v = Promise { 42 }"' },
        { en: "TypeError", es: "TypeError" },
      ],
      answer: 1,
      explanation: {
        en: "`main()` returns a promise fulfilled with `42`. `.then` **unwraps** it, so `v` is the plain number `42` — and the log prints `v = 42`.",
        es: "`main()` devuelve una promesa cumplida con `42`. `.then` la **desenvuelve**, así que `v` es el número `42` sin más, y el log imprime `v = 42`.",
      },
    },
    {
      q: {
        en: "Two independent 100 ms operations. Which statement is true?",
        es: "Dos operaciones independientes de 100 ms. ¿Qué afirmación es cierta?",
      },
      code: `const delay = (ms) => new Promise((r) => setTimeout(r, ms));\n// slow(): await delay(100); await delay(100);\n// fast(): await Promise.all([delay(100), delay(100)]);`,
      options: [
        { en: "slow() ≈ 100 ms, fast() ≈ 100 ms", es: "slow() ≈ 100 ms, fast() ≈ 100 ms" },
        { en: "slow() ≈ 200 ms, fast() ≈ 100 ms", es: "slow() ≈ 200 ms, fast() ≈ 100 ms" },
        { en: "slow() ≈ 200 ms, fast() ≈ 200 ms", es: "slow() ≈ 200 ms, fast() ≈ 200 ms" },
        { en: "Both reject after 100 ms", es: "Ambas se rechazan tras 100 ms" },
      ],
      answer: 1,
      explanation: {
        en: "Sequential `await`s **add up** (≈200 ms). `Promise.all` starts both timers **together**, so the total is just the slowest one (≈100 ms). Independent tasks → parallelize.",
        es: "Los `await` secuenciales **se suman** (≈200 ms). `Promise.all` inicia ambos temporizadores **a la vez**, así que el total es solo el más lento (≈100 ms). Tareas independientes → en paralelo.",
      },
    },
    {
      q: { en: "Why doesn't `await` freeze the whole page while it waits?", es: "¿Por qué `await` no congela toda la página mientras espera?" },
      options: [
        { en: "It runs the waiting code on a new thread", es: "Ejecuta el código en espera en un hilo nuevo" },
        {
          en: "It pauses only that async function and yields to the event loop",
          es: "Solo pausa esa función async y cede el paso al event loop",
        },
        { en: "The browser runs awaited code in parallel", es: "El navegador ejecuta el código con await en paralelo" },
        { en: "It doesn't pause at all — it's instant", es: "No pausa nada: es instantáneo" },
      ],
      answer: 1,
      explanation: {
        en: "`await` suspends **one function**; the event loop keeps running timers, events and other promises meanwhile. When the awaited promise settles, the rest of the function resumes as a microtask. No threads involved.",
        es: "`await` suspende **una función**; el event loop sigue ejecutando temporizadores, eventos y otras promesas mientras tanto. Cuando la promesa esperada se liquida, el resto de la función se reanuda como microtarea. Sin hilos de por medio.",
      },
    },
    {
      q: { en: "What will this code output?", es: "¿Qué mostrará este código?" },
      code: `const delay = (ms) => new Promise((r) => setTimeout(r, ms));\nasync function getPrice() {\n  const p = delay(20).then(() => 99);\n  console.log("price:", p);\n}\ngetPrice();`,
      options: [
        { en: '"price: 99"', es: '"price: 99"' },
        { en: '"price: Promise { <pending> }"', es: '"price: Promise { <pending> }"' },
        { en: '"price: undefined"', es: '"price: undefined"' },
        { en: "SyntaxError", es: "SyntaxError" },
      ],
      answer: 1,
      explanation: {
        en: "The `await` is missing, so `p` is the **promise itself** — still pending when `console.log` runs. Fix: `const p = await delay(20).then(() => 99);`. Whenever you see `Promise { <pending> }` in a log, a missing `await` is suspect #1.",
        es: "Falta el `await`, así que `p` es **la promesa misma**, aún pendiente cuando se ejecuta el `console.log`. Solución: `const p = await delay(20).then(() => 99);`. Cuando veas `Promise { <pending> }` en un log, el `await` olvidado es el sospechoso nº 1.",
      },
    },
  ],
};
