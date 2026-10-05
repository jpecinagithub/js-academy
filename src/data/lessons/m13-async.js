export default {
  id: "async",
  module: 13,
  level: "intermediate",
  stub: false,
  title: { en: "Asynchronous JavaScript", es: "JavaScript asíncrono" },
  tagline: {
    en: "Sync vs async: timers, callbacks and the road to promises.",
    es: "Síncrono vs asíncrono: temporizadores, callbacks y el camino hacia las promesas.",
  },
  sandbox: "event-loop",
  sections: [
    {
      type: "concept",
      heading: { en: "JavaScript is single-threaded", es: "JavaScript es de un solo hilo" },
      body: {
        en: `JavaScript runs on **one thread**: it does one thing at a time, in order. Code that runs top-to-bottom without ever waiting is called **synchronous** — and almost everything you have written so far is exactly that.

The problem? Some operations are **slow**: waiting 2 seconds, downloading data, reading a file. If JavaScript froze and waited for each one, the whole page would **lock up** while it did.

**Asynchronous** code is the answer: start the slow operation, keep doing other work, and get a **callback** when it finishes. Timers, network requests and user events all work this way — that is why Module 12 was all about callbacks.`,
        es: `JavaScript se ejecuta en **un solo hilo**: hace una cosa cada vez, en orden. El código que se ejecuta de arriba abajo sin esperar nunca se llama **síncrono**, y casi todo lo que has escrito hasta ahora es exactamente eso.

¿El problema? Algunas operaciones son **lentas**: esperar 2 segundos, descargar datos, leer un archivo. Si JavaScript se quedara congelado esperando cada una, la página entera se **bloquearía** mientras tanto.

El código **asíncrono** es la respuesta: inicia la operación lenta, sigue haciendo otro trabajo y recibe un **callback** cuando termina. Los temporizadores, las peticiones de red y los eventos del usuario funcionan así; por eso el Módulo 12 trataba de callbacks.`,
      },
    },
    {
      type: "concept",
      heading: { en: "Callbacks and timers", es: "Callbacks y temporizadores" },
      body: {
        en: `The simplest async tool is \`setTimeout(callback, ms)\`: run this function **later**, after at least \`ms\` milliseconds. "Later" is the key word — the rest of your code keeps running first.

\`\`\`
console.log("now");
setTimeout(() => console.log("2 seconds later"), 2000);
console.log("still now");
\`\`\`

- \`setTimeout(fn, ms)\` — run \`fn\` once, after \`ms\` milliseconds (minimum).
- \`setInterval(fn, ms)\` — run \`fn\` **repeatedly**, every \`ms\` milliseconds.
- \`clearTimeout(id)\` / \`clearInterval(id)\` — cancel a scheduled timer.

The delay is a **minimum**, never a guarantee: if the thread is busy, your callback waits its turn. Where does it wait? That is the next diagram.`,
        es: `La herramienta asíncrona más simple es \`setTimeout(callback, ms)\`: ejecuta esta función **más tarde**, después de al menos \`ms\` milisegundos. "Más tarde" es la palabra clave: el resto de tu código sigue ejecutándose primero.

\`\`\`
console.log("ahora");
setTimeout(() => console.log("2 segundos después"), 2000);
console.log("todavía ahora");
\`\`\`

- \`setTimeout(fn, ms)\` — ejecuta \`fn\` una vez, después de \`ms\` milisegundos (como mínimo).
- \`setInterval(fn, ms)\` — ejecuta \`fn\` **repetidamente**, cada \`ms\` milisegundos.
- \`clearTimeout(id)\` / \`clearInterval(id)\` — cancela un temporizador programado.

El retardo es un **mínimo**, nunca una garantía: si el hilo está ocupado, tu callback espera su turno. ¿Dónde espera? Eso lo muestra el siguiente diagrama.`,
      },
    },
    {
      type: "visual",
      diagram: `SOURCE CODE
    ↓
CALL STACK        ← runs ONE thing at a time, top to bottom
    ↓
WEB APIs          ← timers, network, DOM events (the browser's job)
    ↓
MICROTASK QUEUE   ← promise .then() callbacks — run FIRST
TASK QUEUE        ← setTimeout / event callbacks — run NEXT
    ↓
EVENT LOOP        ← "stack empty? push the next waiting callback"
    ↓
CONSOLE → 1, 4, 3, 2`,
      caption: {
        en: "The full journey of an async operation — memorize this picture.",
        es: "El viaje completo de una operación asíncrona: memoriza esta imagen.",
      },
    },
    {
      type: "code",
      heading: { en: "The canonical example", es: "El ejemplo canónico" },
      code: `console.log("1");
setTimeout(() => console.log("2"), 0);
Promise.resolve().then(() => console.log("3"));
console.log("4");`,
      caption: {
        en: "Press RUN — the output order is the entire lesson in four lines.",
        es: "Pulsa RUN: el orden de salida es toda la lección en cuatro líneas.",
      },
      body: {
        en: `The output is **1, 4, 3, 2**. Here's why, following the diagram:

1. \`console.log("1")\` runs immediately — it's synchronous.
2. \`setTimeout(..., 0)\` hands its callback to the **Web APIs**, which send it to the **task queue**. It waits.
3. The promise \`.then()\` callback goes to the **microtask queue**. It also waits.
4. \`console.log("4")\` runs immediately — the stack isn't done yet.
5. Stack empty → the event loop drains the **microtask queue first** → prints **3**.
6. Then the **task queue** → prints **2**.

Microtasks always beat macrotasks, even with a 0 ms timer.`,
        es: `La salida es **1, 4, 3, 2**. He aquí el porqué, siguiendo el diagrama:

1. \`console.log("1")\` se ejecuta al instante: es síncrono.
2. \`setTimeout(..., 0)\` entrega su callback a las **Web APIs**, que lo envían a la **cola de tareas**. Espera.
3. El callback del \`.then()\` de la promesa va a la **cola de microtareas**. También espera.
4. \`console.log("4")\` se ejecuta al instante: la pila aún no ha terminado.
5. Pila vacía → el event loop vacía **primero la cola de microtareas** → imprime **3**.
6. Luego la **cola de tareas** → imprime **2**.

Las microtareas siempre ganan a las macrotareas, incluso con un temporizador de 0 ms.`,
      },
    },
    {
      type: "lab",
      lab: "event-loop",
      heading: { en: "Enter the Event Loop lab", es: "Entra en el laboratorio del Event Loop" },
      body: {
        en: "Open the lab and **replay the canonical example step by step**: watch each `console.log` land on the call stack, see the timer callback park in the task queue, and catch the moment the event loop picks it up. Then change the code — add a second timer, move the promise — and predict the output **before** you run it.",
        es: "Abre el laboratorio y **reproduce el ejemplo canónico paso a paso**: observa cómo cada `console.log` llega a la pila de llamadas, cómo el callback del temporizador aparca en la cola de tareas y el momento en que el event loop lo recoge. Después cambia el código — añade un segundo temporizador, mueve la promesa — y predice la salida **antes** de ejecutarlo.",
      },
    },
    {
      type: "code",
      heading: { en: "0 ms does not mean “now”", es: "0 ms no significa «ahora»" },
      code: `console.log("before");
setTimeout(() => console.log("timer (0ms!)"), 0);
for (let i = 0; i < 3; i++) {
  console.log("sync", i);
}
console.log("after");`,
      body: {
        en: `Even with a delay of **zero**, the timer prints **last**. \`setTimeout\` never interrupts synchronous code — its callback always waits in the task queue until the call stack is completely empty.

> Mental model: \`setTimeout(fn, 0)\` means "run \`fn\` **as soon as possible** — which is after everything currently running finishes."`,
        es: `Incluso con un retardo de **cero**, el temporizador se imprime **el último**. \`setTimeout\` nunca interrumpe el código síncrono: su callback siempre espera en la cola de tareas hasta que la pila de llamadas está completamente vacía.

> Modelo mental: \`setTimeout(fn, 0)\` significa "ejecuta \`fn\` **lo antes posible**, es decir, después de que termine todo lo que se está ejecutando ahora".`,
      },
    },
    {
      type: "mistake",
      wrong: `let price;
setTimeout(() => { price = 99; }, 500);
console.log("Total: " + price * 2); // expecting "Total: 198"`,
      right: `let price;
setTimeout(() => {
  price = 99;
  console.log("Total: " + price * 2); // "Total: 198" ✓
}, 500);`,
      explanation: {
        en: `**Reading a value before the async operation finishes.** The \`console.log\` on line 3 runs **immediately** — the timer hasn't fired yet, so \`price\` is still \`undefined\` and you get \`"Total: NaN"\`.

Code placed *after* an async operation does **not** wait for it. Move the dependent code **inside the callback** — or better, use a promise (Module 14), which was invented to escape exactly this trap.`,
        es: `**Leer un valor antes de que termine la operación asíncrona.** El \`console.log\` de la línea 3 se ejecuta **al instante**: el temporizador aún no ha sonado, así que \`price\` sigue siendo \`undefined\` y obtienes \`"Total: NaN"\`.

El código que va *después* de una operación asíncrona **no** la espera. Mueve el código dependiente **dentro del callback** o, mejor, usa una promesa (Módulo 14), que se inventó precisamente para escapar de esta trampa.`,
      },
    },
    {
      type: "takeaway",
      body: {
        en: "JavaScript has one thread, so slow work must not block it. Async code means **“start it, do other things, call me when done”** — timers park their callbacks in the task queue, promises use the microtask queue (which runs first), and the event loop feeds them back to the stack when it's empty.",
        es: "JavaScript tiene un solo hilo, así que el trabajo lento no debe bloquearlo. El código asíncrono significa **«empieza, haz otras cosas, avísame cuando termines»**: los temporizadores aparcan sus callbacks en la cola de tareas, las promesas usan la cola de microtareas (que se ejecuta primero) y el event loop los devuelve a la pila cuando está vacía.",
      },
    },
    {
      type: "underhood",
      title: { en: "Microtasks vs macrotasks: the priority rule", es: "Microtareas vs macrotareas: la regla de prioridad" },
      body: {
        en: `The precise rule the event loop follows:

1. Run the call stack until it's **empty**.
2. Drain the **entire microtask queue** (promise \`.then\`/\`.catch\` callbacks) — including microtasks queued *by* those microtasks.
3. Run **one** macrotask from the task queue (\`setTimeout\`, events, I/O).
4. Go back to step 2.

So microtasks don't just run first — they run **to completion** before a single timer callback gets its turn. That's the whole secret behind \`1, 4, 3, 2\`.

> One more detail: \`setTimeout(fn, 0)\` doesn't really mean 0 ms. Browsers clamp nested timeouts to a minimum of about **4 ms** — another reason "0" never means "now".`,
        es: `La regla precisa que sigue el event loop:

1. Ejecuta la pila de llamadas hasta que esté **vacía**.
2. Vacía **toda la cola de microtareas** (callbacks de \`.then\`/\`.catch\` de promesas), incluidas las microtareas que encolen esas mismas microtareas.
3. Ejecuta **una** macrotarea de la cola de tareas (\`setTimeout\`, eventos, E/S).
4. Vuelve al paso 2.

Así que las microtareas no solo se ejecutan primero: se ejecutan **hasta completarse** antes de que un solo callback de temporizador tenga su turno. Ese es todo el secreto detrás del \`1, 4, 3, 2\`.

> Un detalle más: \`setTimeout(fn, 0)\` no significa realmente 0 ms. Los navegadores limitan los temporizadores anidados a un mínimo de unos **4 ms**: otra razón por la que "0" nunca significa "ahora".`,
      },
    },
  ],
  quiz: [
    {
      q: { en: "What will this code output?", es: "¿Qué mostrará este código?" },
      code: `console.log("1");\nsetTimeout(() => console.log("2"), 0);\nPromise.resolve().then(() => console.log("3"));\nconsole.log("4");`,
      options: [
        { en: "1, 2, 3, 4", es: "1, 2, 3, 4" },
        { en: "1, 4, 3, 2", es: "1, 4, 3, 2" },
        { en: "1, 3, 4, 2", es: "1, 3, 4, 2" },
        { en: "4, 3, 2, 1", es: "4, 3, 2, 1" },
      ],
      answer: 1,
      explanation: {
        en: `\`1\` and \`4\` are synchronous, so they print first. Then the event loop drains the **microtask queue** (promise \`.then\` → \`3\`) before the **task queue** (\`setTimeout\` → \`2\`). Result: **1, 4, 3, 2**.`,
        es: `\`1\` y \`4\` son síncronos, así que se imprimen primero. Después el event loop vacía la **cola de microtareas** (el \`.then\` de la promesa → \`3\`) antes que la **cola de tareas** (el \`setTimeout\` → \`2\`). Resultado: **1, 4, 3, 2**.`,
      },
    },
    {
      q: {
        en: "Why does `2` print last, even though the timer delay is 0 ms?",
        es: "¿Por qué el `2` se imprime el último aunque el retardo del temporizador es de 0 ms?",
      },
      options: [
        { en: "A 0 ms delay is rounded up to 1 second", es: "Un retardo de 0 ms se redondea a 1 segundo" },
        {
          en: "The timer callback waits in the task queue until the stack is empty — and microtasks run first",
          es: "El callback del temporizador espera en la cola de tareas hasta que la pila se vacía, y las microtareas se ejecutan primero",
        },
        { en: "Promises pause setTimeout while they run", es: "Las promesas pausan setTimeout mientras se ejecutan" },
        { en: "console.log is faster with numbers than with timers", es: "console.log es más rápido con números que con temporizadores" },
      ],
      answer: 1,
      explanation: {
        en: `\`setTimeout\` never interrupts running code — \`0\` means "as soon as the stack is empty", not "now". And even then, the promise's microtask jumps the queue ahead of the timer's macrotask.`,
        es: `\`setTimeout\` nunca interrumpe el código en ejecución: \`0\` significa «en cuanto la pila se vacíe», no «ahora». Y aun así, la microtarea de la promesa se adelanta al temporizador en la cola.`,
      },
    },
    {
      q: { en: "What will this code output?", es: "¿Qué mostrará este código?" },
      code: `console.log("A");\nsetTimeout(() => console.log("B"), 0);\nPromise.resolve().then(() => console.log("C"));\nsetTimeout(() => console.log("D"), 0);\nconsole.log("E");`,
      options: [
        { en: "A, B, C, D, E", es: "A, B, C, D, E" },
        { en: "A, E, C, B, D", es: "A, E, C, B, D" },
        { en: "A, E, B, C, D", es: "A, E, B, C, D" },
        { en: "C, A, E, B, D", es: "C, A, E, B, D" },
      ],
      answer: 1,
      explanation: {
        en: `Synchronous first: **A, E**. Then the microtask queue: **C**. Then the task queue in order: **B, D**. The pattern never changes: sync → microtasks → macrotasks.`,
        es: `Primero lo síncrono: **A, E**. Después la cola de microtareas: **C**. Luego la cola de tareas en orden: **B, D**. El patrón nunca cambia: síncrono → microtareas → macrotareas.`,
      },
    },
    {
      q: { en: "What will this code output, and why?", es: "¿Qué mostrará este código y por qué?" },
      code: `let data = "loading…";\nsetTimeout(() => { data = "ready!"; }, 100);\nconsole.log(data);`,
      options: [
        { en: '"loading…" — console.log runs before the timer fires', es: '"loading…" — console.log se ejecuta antes de que suene el temporizador' },
        { en: '"ready!" — the timer runs first because it was scheduled first', es: '"ready!" — el temporizador se ejecuta primero porque se programó primero' },
        { en: "undefined", es: "undefined" },
        { en: "It throws an error", es: "Lanza un error" },
      ],
      answer: 0,
      explanation: {
        en: `\`console.log(data)\` is synchronous — it runs **immediately**, while the timer callback is still waiting in the task queue. The assignment \`data = "ready!"\` happens 100 ms later, after the log. Never read async results from code placed after the async call.`,
        es: `\`console.log(data)\` es síncrono: se ejecuta **al instante**, mientras el callback del temporizador aún espera en la cola de tareas. La asignación \`data = "ready!"\` ocurre 100 ms después, tras el log. Nunca leas resultados asíncronos desde código colocado después de la llamada asíncrona.`,
      },
    },
  ],
};
