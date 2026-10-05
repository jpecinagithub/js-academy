export default {
  id: "promises",
  module: 14,
  level: "intermediate",
  stub: false,
  title: { en: "Promises", es: "Promesas" },
  tagline: {
    en: "pending → fulfilled / rejected in the Promise Laboratory.",
    es: "De pending a fulfilled / rejected en el laboratorio de promesas.",
  },
  sandbox: "promise-lab",
  sections: [
    {
      type: "concept",
      heading: { en: "A promise is a placeholder for a future value", es: "Una promesa es un marcador para un valor futuro" },
      body: {
        en: `Module 13's trap — reading a value before the async work finishes — happens because callbacks give you **no handle** on the future result. A \`Promise\` fixes that: it's an **object that represents a value that isn't here yet**.

You create one with \`new Promise((resolve, reject) => { ... })\`. Inside, you do the async work, then call:

- \`resolve(value)\` — "it worked, here's the result"
- \`reject(reason)\` — "it failed, here's why"

Consumers don't get the value directly. They attach callbacks with \`.then()\` (for success) and \`.catch()\` (for failure) — and the promise calls them when the result arrives.`,
        es: `La trampa del Módulo 13 —leer un valor antes de que termine el trabajo asíncrono— ocurre porque los callbacks no te dan **ningún control** sobre el resultado futuro. Una \`Promise\` lo soluciona: es un **objeto que representa un valor que aún no está aquí**.

Se crea con \`new Promise((resolve, reject) => { ... })\`. Dentro haces el trabajo asíncrono y luego llamas a:

- \`resolve(valor)\` — «funcionó, aquí está el resultado»
- \`reject(motivo)\` — «falló, esta es la razón»

Quien la consume no recibe el valor directamente: adjunta callbacks con \`.then()\` (para el éxito) y \`.catch()\` (para el fallo), y la promesa los llama cuando llega el resultado.`,
      },
    },
    {
      type: "visual",
      diagram: `              ┌───────────┐
              │  PENDING  │   ← every promise starts here
              └─────┬─────┘
        ┌───────────┴────────────┐
        ↓                        ↓
 ┌─────────────┐          ┌─────────────┐
 │  FULFILLED  │          │  REJECTED   │
 │ (it worked) │          │ (it failed) │
 └─────────────┘          └─────────────┘

   "settled" = fulfilled OR rejected — and there's no way back`,
      caption: {
        en: "The three states of a promise. One-way streets only.",
        es: "Los tres estados de una promesa. Calles de un solo sentido.",
      },
    },
    {
      type: "code",
      heading: { en: "Your first promise chain", es: "Tu primera cadena de promesas" },
      code: `console.log("start");

new Promise((resolve) => {
  setTimeout(() => resolve("data loaded"), 100);
})
  .then((data) => console.log("then 1:", data))
  .then(() => console.log("then 2: chain done"));

console.log("end");`,
      caption: {
        en: "Press RUN and watch the order: sync code first, promise callbacks after.",
        es: "Pulsa RUN y observa el orden: primero el código síncrono, después los callbacks de la promesa.",
      },
      body: {
        en: `\`start\` and \`end\` print immediately — the promise is still **pending** at that point. 100 ms later, \`resolve("data loaded")\` settles it as **fulfilled**, the first \`.then\` receives the value, and the chain continues.

Notice the shape: instead of nesting callbacks inside callbacks, each step hangs off the previous \`.then\` in a **flat chain**. That flatness is the whole point of promises.`,
        es: `\`start\` y \`end\` se imprimen al instante: en ese momento la promesa sigue **pendiente**. 100 ms después, \`resolve("data loaded")\` la liquida como **cumplida**, el primer \`.then\` recibe el valor y la cadena continúa.

Fíjate en la forma: en lugar de anidar callbacks dentro de callbacks, cada paso cuelga del \`.then\` anterior en una **cadena plana**. Esa planitud es todo el sentido de las promesas.`,
      },
    },
    {
      type: "lab",
      lab: "promise-lab",
      heading: { en: "Enter the Promise Laboratory", es: "Entra en el laboratorio de promesas" },
      body: {
        en: "Open the lab and **build promises yourself**: resolve one, reject another, and watch the state flip from `pending` to `fulfilled` or `rejected` in real time. Try attaching `.then` *after* a promise already settled — does the callback still run? (Spoiler: yes. That's the superpower callbacks never had.)",
        es: "Abre el laboratorio y **construye promesas tú mismo**: resuelve una, rechaza otra y observa cómo el estado cambia de `pending` a `fulfilled` o `rejected` en tiempo real. Prueba a adjuntar `.then` *después* de que una promesa ya se haya liquidado: ¿el callback se ejecuta igual? (Spoiler: sí. Ese es el superpoder que los callbacks nunca tuvieron).",
      },
    },
    {
      type: "concept",
      heading: { en: "Errors travel down the chain", es: "Los errores viajan cadena abajo" },
      body: {
        en: `When a promise rejects, the rejection **skips every \`.then\`** until it finds a \`.catch\`. One \`.catch\` at the end can handle errors from any step — like a safety net under the whole chain.

\`.finally()\` runs **no matter what** — fulfilled or rejected. It's the perfect place for cleanup: hiding a loading spinner, closing a connection.

\`\`\`
loadUser(7)
  .then((user) => loadOrders(user.id))
  .then((orders) => show(orders))
  .catch((err) => showError(err))   // catches failures from EITHER .then
  .finally(() => hideSpinner());    // always runs
\`\`\``,
        es: `Cuando una promesa se rechaza, el rechazo **salta todos los \`.then\`** hasta encontrar un \`.catch\`. Un solo \`.catch\` al final puede manejar errores de cualquier paso: como una red de seguridad bajo toda la cadena.

\`.finally()\` se ejecuta **pase lo que pase**, cumplida o rechazada. Es el lugar perfecto para la limpieza: ocultar un indicador de carga, cerrar una conexión.

\`\`\`
loadUser(7)
  .then((user) => loadOrders(user.id))
  .then((orders) => show(orders))
  .catch((err) => showError(err))   // atrapa fallos de CUALQUIER .then
  .finally(() => hideSpinner());    // siempre se ejecuta
\`\`\``,
      },
    },
    {
      type: "code",
      heading: { en: "Rejection in action", es: "El rechazo en acción" },
      code: `new Promise((resolve, reject) => {
  setTimeout(() => reject("boom"), 50);
})
  .then(() => console.log("this never runs"))
  .catch((err) => console.log("caught:", err))
  .finally(() => console.log("cleanup runs anyway"));`,
      body: {
        en: `The \`.then\` is skipped entirely — a rejected promise jumps straight to \`.catch\`. Then \`.finally\` runs regardless, which is why you'll see it used for spinners, locks and "loading…" indicators everywhere.`,
        es: `El \`.then\` se salta por completo: una promesa rechazada salta directamente al \`.catch\`. Después \`.finally\` se ejecuta igualmente, por eso lo verás usado para spinners, bloqueos e indicadores de «cargando…» en todas partes.`,
      },
    },
    {
      type: "concept",
      heading: { en: "Combinators: Promise.all and Promise.race", es: "Combinadores: Promise.all y Promise.race" },
      body: {
        en: `Promises compose. When you have **several** async operations, you don't chain them one by one — you combine them:

- \`Promise.all([p1, p2, p3])\` — waits for **all** of them; resolves with an **array of results** in order. If **any one** rejects, the whole thing rejects.
- \`Promise.race([p1, p2])\` — settles with **whichever finishes first** (win or lose).
- \`Promise.allSettled([...])\` — waits for all, and **never rejects**: you get the outcome of each.

\`Promise.all\` is the workhorse: loading a user *and* their orders *and* their settings at the same time, in parallel, with one \`.then\`.`,
        es: `Las promesas se componen. Cuando tienes **varias** operaciones asíncronas, no las encadenas una por una: las combinas:

- \`Promise.all([p1, p2, p3])\` — espera a **todas**; se cumple con un **array de resultados** en orden. Si **alguna** se rechaza, todo se rechaza.
- \`Promise.race([p1, p2])\` — se liquida con **la que termine primero** (gane o pierda).
- \`Promise.allSettled([...])\` — espera a todas y **nunca se rechaza**: obtienes el resultado de cada una.

\`Promise.all\` es el caballo de batalla: cargar un usuario *y* sus pedidos *y* su configuración a la vez, en paralelo, con un solo \`.then\`.`,
      },
    },
    {
      type: "lab",
      lab: "async-race",
      heading: { en: "Race them in the Async Race lab", es: "Hazlas competir en el laboratorio Async Race" },
      body: {
        en: "Open the lab and launch several promises with different delays. Watch `Promise.all` wait for the slowest, `Promise.race` crown the fastest, and see what happens to `Promise.all` when **one** promise rejects. Try to predict each outcome before you press the button.",
        es: "Abre el laboratorio y lanza varias promesas con distintos retardos. Observa cómo `Promise.all` espera a la más lenta, `Promise.race` corona a la más rápida y qué le pasa a `Promise.all` cuando **una** promesa se rechaza. Intenta predecir cada resultado antes de pulsar el botón.",
      },
    },
    {
      type: "mistake",
      wrong: `getUser(1)
  .then((user) => {
    getOrders(user.id);   // ← forgot to return!
  })
  .then((orders) => console.log(orders)); // undefined!`,
      right: `getUser(1)
  .then((user) => {
    return getOrders(user.id);  // ← return the promise
  })
  .then((orders) => console.log(orders)); // real orders ✓`,
      explanation: {
        en: `**Forgetting to \`return\` inside \`.then\`.** Each \`.then\` passes *its return value* to the next link. Without \`return\`, the callback returns \`undefined\` — so the next \`.then\` receives \`undefined\`, not the orders.

The rule: **if the next step needs it, return it.** (Arrow-function shorthand \`.then((user) => getOrders(user.id))\` returns automatically — no braces, no \`return\` needed.)`,
        es: `**Olvidar el \`return\` dentro de \`.then\`.** Cada \`.then\` pasa *su valor de retorno* al siguiente eslabón. Sin \`return\`, el callback devuelve \`undefined\`: el siguiente \`.then\` recibe \`undefined\`, no los pedidos.

La regla: **si el siguiente paso lo necesita, devuélvelo.** (La forma corta de las arrow functions, \`.then((user) => getOrders(user.id))\`, devuelve automáticamente: sin llaves no hace falta \`return\`).`,
      },
    },
    {
      type: "takeaway",
      body: {
        en: "A promise is an object that stands in for a future value: **pending → fulfilled** or **pending → rejected**. Chain steps with `.then()`, catch any failure in the chain with one `.catch()`, clean up with `.finally()`, and combine parallel work with `Promise.all()`. **Always return** from `.then()` when the next step needs the value.",
        es: "Una promesa es un objeto que representa un valor futuro: **pending → fulfilled** o **pending → rejected**. Encadena pasos con `.then()`, atrapa cualquier fallo de la cadena con un solo `.catch()`, limpia con `.finally()` y combina trabajo paralelo con `Promise.all()`. **Devuelve siempre** desde `.then()` cuando el siguiente paso necesite el valor.",
      },
    },
    {
      type: "underhood",
      title: { en: "Settled means settled", es: "Liquidado significa liquidado" },
      body: {
        en: `Two guarantees the promise machinery makes:

1. **A promise settles exactly once.** Calling \`resolve\` and then \`reject\` (or \`resolve\` twice) does nothing the second time — the first call wins, forever. This is why you can safely attach \`.then\` even to an already-settled promise: you'll just get the stored result.
2. **Promise callbacks are always async.** Even \`Promise.resolve(42).then(...)\` runs its callback as a microtask — *after* the current synchronous code. A promise never calls you back synchronously, which is exactly the consistency callbacks lacked.

> Watch out for **unhandled rejections**: a promise that rejects with no \`.catch\` anywhere logs a warning (and in Node.js, can crash your program). If you create a promise, plan its failure path.`,
        es: `Dos garantías de la maquinaria de las promesas:

1. **Una promesa se liquida exactamente una vez.** Llamar a \`resolve\` y luego a \`reject\` (o a \`resolve\` dos veces) no hace nada la segunda vez: la primera llamada gana, para siempre. Por eso puedes adjuntar \`.then\` con seguridad incluso a una promesa ya liquidada: simplemente recibirás el resultado guardado.
2. **Los callbacks de promesas siempre son asíncronos.** Incluso \`Promise.resolve(42).then(...)\` ejecuta su callback como microtarea, *después* del código síncrono actual. Una promesa nunca te devuelve la llamada de forma síncrona, que es justo la consistencia que les faltaba a los callbacks.

> Cuidado con los **rechazos no manejados**: una promesa que se rechaza sin ningún \`.catch\` registra una advertencia (y en Node.js puede tumbar tu programa). Si creas una promesa, planifica su camino de fallo.`,
      },
    },
  ],
  quiz: [
    {
      q: { en: "A brand-new promise starts in which state?", es: "¿En qué estado empieza una promesa recién creada?" },
      options: [
        { en: "fulfilled", es: "fulfilled" },
        { en: "pending", es: "pending" },
        { en: "rejected", es: "rejected" },
        { en: "settled", es: "settled" },
      ],
      answer: 1,
      explanation: {
        en: "Every promise is born **pending**. It later becomes **fulfilled** (success) or **rejected** (failure) — and \"settled\" is just the word for \"either of those two\".",
        es: "Toda promesa nace **pending**. Después pasa a **fulfilled** (éxito) o **rejected** (fallo); «settled» es solo la palabra para «cualquiera de esos dos».",
      },
    },
    {
      q: { en: "What does `.then()` return?", es: "¿Qué devuelve `.then()`?" },
      options: [
        { en: "The value passed to resolve()", es: "El valor pasado a resolve()" },
        { en: "undefined", es: "undefined" },
        { en: "A new promise", es: "Una promesa nueva" },
        { en: "The same promise", es: "La misma promesa" },
      ],
      answer: 2,
      explanation: {
        en: "`.then()` **always returns a new promise** — that's what makes chaining possible. Whatever your callback returns becomes the fulfillment value of that new promise (and if you return another promise, the chain waits for it).",
        es: "`.then()` **siempre devuelve una promesa nueva**: eso es lo que hace posible el encadenamiento. Lo que devuelva tu callback se convierte en el valor de cumplimiento de esa nueva promesa (y si devuelves otra promesa, la cadena la espera).",
      },
    },
    {
      q: { en: "What will this code output?", es: "¿Qué mostrará este código?" },
      code: `Promise.all([\n  Promise.resolve("a"),\n  Promise.reject("oops"),\n  Promise.resolve("c"),\n])\n  .then((r) => console.log("ok:", r))\n  .catch((e) => console.log("failed:", e));`,
      options: [
        { en: '"ok: a, oops, c"', es: '"ok: a, oops, c"' },
        { en: '"failed: oops"', es: '"failed: oops"' },
        { en: '"ok: a, c"', es: '"ok: a, c"' },
        { en: "Nothing — it never settles", es: "Nada: nunca se liquida" },
      ],
      answer: 1,
      explanation: {
        en: "`Promise.all` is all-or-nothing: **one rejection rejects the whole thing**, skipping `.then` and landing in `.catch`. Need every result regardless? Use `Promise.allSettled`.",
        es: "`Promise.all` es todo o nada: **un solo rechazo rechaza el conjunto**, saltándose el `.then` y cayendo en el `.catch`. ¿Necesitas todos los resultados igualmente? Usa `Promise.allSettled`.",
      },
    },
    {
      q: { en: "What will this code output?", es: "¿Qué mostrará este código?" },
      code: `Promise.resolve(5)\n  .then((x) => x + 1)\n  .then((x) => console.log("result:", x));`,
      options: [
        { en: '"result: 6"', es: '"result: 6"' },
        { en: '"result: 5"', es: '"result: 5"' },
        { en: '"result: undefined"', es: '"result: undefined"' },
        { en: '"result: NaN"', es: '"result: NaN"' },
      ],
      answer: 0,
      explanation: {
        en: "Each `.then` receives **the previous link's return value**: `5` → `x + 1` returns `6` → the next `.then` gets `6`. That's the conveyor belt of a promise chain.",
        es: "Cada `.then` recibe **el valor de retorno del eslabón anterior**: `5` → `x + 1` devuelve `6` → el siguiente `.then` recibe `6`. Esa es la cinta transportadora de una cadena de promesas.",
      },
    },
  ],
};
