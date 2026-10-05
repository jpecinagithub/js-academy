// Module 11 — Events (full lesson content, Phase 4)
// Note: DOM/event code lives in fenced listings inside concept sections, NOT in
// runnable `code` sections — the sandbox has no `document`.
export default {
  id: "events",
  module: 11,
  level: "intermediate",
  stub: false,
  title: { en: "Events", es: "Eventos" },
  tagline: {
    en: "Clicks, inputs, and the capturing/bubbling journey.",
    es: "Clics, entradas y el viaje de captura/burbuja.",
  },
  sections: [
    {
      type: "concept",
      heading: { en: "The page is listening", es: "La página está escuchando" },
      body: {
        en: "Users **do** things: click buttons, type in inputs, submit forms, press keys, move the mouse. Your code **reacts** to those things with **events**.\n\nThe pattern is always the same:\n1. Pick an element.\n2. Call `addEventListener(eventName, handler)`.\n3. The browser calls your handler function whenever the event happens — passing it an **event object** with the details.\n\n```\nconst btn = document.querySelector(\"#save\");\n\nbtn.addEventListener(\"click\", (event) => {\n  console.log(\"clicked!\", event.target); // the button itself\n});\n```\n\nCommon events: `click`, `input` (every keystroke in a field), `submit` (a form being sent), `keydown` / `keyup`, `mouseover` / `mouseout`. Unlike assigning `onclick = ...`, `addEventListener` lets you attach **many** listeners to the same event.",
        es: "Los usuarios **hacen** cosas: pulsan botones, escriben en campos, envían formularios, presionan teclas, mueven el ratón. Tu código **reacciona** a esas cosas con **eventos**.\n\nEl patrón es siempre el mismo:\n1. Elige un elemento.\n2. Llama a `addEventListener(nombreEvento, manejador)`.\n3. El navegador llama a tu función manejadora cada vez que ocurre el evento — pasándole un **objeto de evento** con los detalles.\n\n```\nconst btn = document.querySelector(\"#save\");\n\nbtn.addEventListener(\"click\", (event) => {\n  console.log(\"clicked!\", event.target); // el propio botón\n});\n```\n\nEventos comunes: `click`, `input` (cada pulsación en un campo), `submit` (envío de un formulario), `keydown` / `keyup`, `mouseover` / `mouseout`. A diferencia de asignar `onclick = ...`, `addEventListener` permite conectar **muchos** oyentes al mismo evento.",
      },
    },
    {
      type: "concept",
      heading: { en: "The event object", es: "El objeto de evento" },
      body: {
        en: "Every handler receives one argument: the **event object**. Two properties do most of the work:\n\n- `event.target` — the element where the event **originated** (what was actually clicked or typed into).\n- `event.type` — the event's name, like `\"click\"`.\n\n> Don't confuse `event.target` with the element the listener is attached to — when events travel through the tree (next section), those can be two different elements.",
        es: "Cada manejador recibe un argumento: el **objeto de evento**. Dos propiedades hacen la mayor parte del trabajo:\n\n- `event.target` — el elemento donde el evento se **originó** (lo que realmente se pulsó o donde se escribió).\n- `event.type` — el nombre del evento, como `\"click\"`.\n\n> No confundas `event.target` con el elemento al que está conectado el oyente — cuando los eventos viajan por el árbol (siguiente sección), pueden ser dos elementos distintos.",
      },
    },
    {
      type: "visual",
      diagram: `        CAPTURING (down)              BUBBLING (up)

          document     ↓                    ↑     document
          container    ↓                    ↑     container
            button     ↓   ← target phase → ↑       button

        Listener with capture:true        Regular listeners
        runs on the way DOWN.             run on the way UP.`,
      caption: {
        en: "Every click travels down the tree, hits the target, then travels back up.",
        es: "Cada clic baja por el árbol, llega al objetivo y vuelve a subir.",
      },
      body: {
        en: "An event doesn't just appear at the clicked element — it **travels**. First **capturing**: from `document` down to the target. Then **bubbling**: from the target back up to `document`.\n\nBy default your listeners run during the bubbling phase (on the way up). Pass `true` — or `{ capture: true }` — as the third argument to run during capturing instead.",
        es: "Un evento no aparece sin más en el elemento pulsado — **viaja**. Primero **captura**: desde `document` hasta el objetivo. Luego **burbuja**: desde el objetivo de vuelta hasta `document`.\n\nPor defecto tus oyentes se ejecutan durante la fase de burbuja (al subir). Pasa `true` — o `{ capture: true }` — como tercer argumento para ejecutarlos durante la captura.",
      },
    },
    {
      type: "concept",
      heading: { en: "Use bubbling: event delegation", es: "Aprovecha la burbuja: delegación de eventos" },
      body: {
        en: "Because clicks bubble up, **one listener on a parent can handle events from all its children** — even children added later. This is called **event delegation**, and it saves you from attaching hundreds of listeners:\n\n```\n// one listener on the parent handles clicks on ANY child\nconst list = document.querySelector(\"#todo-list\");\n\nlist.addEventListener(\"click\", (event) => {\n  if (event.target.tagName === \"BUTTON\") {\n    console.log(\"delete item\", event.target.dataset.id);\n  }\n});\n```\n\n`event.target` tells you which child was actually clicked; the listener itself lives on the parent. New items added with `appendChild` are covered automatically — no extra wiring.",
        es: "Como los clics suben en burbuja, **un solo oyente en un padre puede gestionar eventos de todos sus hijos** — incluso de hijos añadidos después. Esto se llama **delegación de eventos** y te ahorra conectar cientos de oyentes:\n\n```\n// un oyente en el padre gestiona clics de CUALQUIER hijo\nconst list = document.querySelector(\"#todo-list\");\n\nlist.addEventListener(\"click\", (event) => {\n  if (event.target.tagName === \"BUTTON\") {\n    console.log(\"delete item\", event.target.dataset.id);\n  }\n});\n```\n\n`event.target` te dice qué hijo fue pulsado de verdad; el oyente vive en el padre. Los elementos nuevos añadidos con `appendChild` quedan cubiertos automáticamente — sin cableado extra.",
      },
    },
    {
      type: "lab",
      heading: { en: "Watch events travel", es: "Mira viajar a los eventos" },
      body: {
        en: "Click the nested boxes and watch the capture/bubble journey light up, listener by listener. Toggle capture mode and see the firing order flip.",
        es: "Pulsa las cajas anidadas y observa cómo se ilumina el viaje de captura/burbuja, oyente por oyente. Activa el modo de captura y mira cómo se invierte el orden de ejecución.",
      },
      lab: "event-propagation",
    },
    {
      type: "mistake",
      wrong: `form.addEventListener("submit", (event) => {
  saveData(); // the page reloads anyway — your work vanishes!
});`,
      right: `form.addEventListener("submit", (event) => {
  event.preventDefault(); // stop the browser's default reload
  saveData();             // now your code owns the moment
});`,
      explanation: {
        en: "A form's default behavior is to send its data and **reload the page**. If your handler forgets `event.preventDefault()`, the browser does its thing and your JavaScript state is wiped. Call it first, then run your logic.",
        es: "El comportamiento por defecto de un formulario es enviar sus datos y **recargar la página**. Si tu manejador olvida `event.preventDefault()`, el navegador hace lo suyo y tu estado de JavaScript se borra. Llámalo primero y luego ejecuta tu lógica.",
      },
    },
    {
      type: "takeaway",
      body: {
        en: "`addEventListener` connects a handler to an event; the event object tells you what happened (`target`, `type`). Events travel down (capturing) and back up (bubbling) — delegation exploits bubbling so one parent listener can manage many children. And on forms, `event.preventDefault()` stops the reload.",
        es: "`addEventListener` conecta un manejador a un evento; el objeto de evento te dice qué pasó (`target`, `type`). Los eventos bajan (captura) y vuelven a subir (burbuja) — la delegación aprovecha la burbuja para que un solo oyente padre gestione muchos hijos. Y en formularios, `event.preventDefault()` evita la recarga.",
      },
    },
    {
      type: "underhood",
      title: { en: "The third argument, decoded", es: "El tercer argumento, descodificado" },
      body: {
        en: "`addEventListener(\"click\", fn, true)` registers the listener for the **capturing** phase, so it runs on the way *down*, before any bubbling listeners. The modern form is an options object: `{ capture: true, once: true }` — `once` makes the browser remove the listener after it fires a single time, handy for one-shot setup code.",
        es: "`addEventListener(\"click\", fn, true)` registra el oyente para la fase de **captura**, así se ejecuta al *bajar*, antes que cualquier oyente de burbuja. La forma moderna es un objeto de opciones: `{ capture: true, once: true }` — `once` hace que el navegador elimine el oyente tras dispararse una sola vez, útil para código de inicialización única.",
      },
    },
  ],
  quiz: [
    {
      q: {
        en: "Both listeners are on bubble phase. The user clicks the button. What prints, and in what order?",
        es: "Ambos oyentes están en fase de burbuja. El usuario pulsa el botón. ¿Qué se imprime y en qué orden?",
      },
      code: 'outer.addEventListener("click", () => console.log("outer"));\ninner.addEventListener("click", () => console.log("inner"));\n// inner button is inside outer div',
      options: [
        { en: "outer, then inner", es: "outer, luego inner" },
        { en: "inner, then outer", es: "inner, luego outer" },
        { en: "only inner", es: "solo inner" },
        { en: "only outer", es: "solo outer" },
      ],
      answer: 1,
      explanation: {
        en: "Bubbling travels **up** from the target: the button's listener fires first, then the event bubbles to the div. So: `inner`, then `outer`.",
        es: "La burbuja viaja **hacia arriba** desde el objetivo: primero se dispara el oyente del botón y luego el evento sube al div. Así que: `inner`, luego `outer`.",
      },
    },
    {
      q: {
        en: "What is event.target?",
        es: "¿Qué es event.target?",
      },
      options: [
        {
          en: "The element the listener is attached to",
          es: "El elemento al que está conectado el oyente",
        },
        {
          en: "The element where the event originated",
          es: "El elemento donde se originó el evento",
        },
        {
          en: "The window object",
          es: "El objeto window",
        },
        {
          en: "The document's <body>",
          es: "El <body> del documento",
        },
      ],
      answer: 1,
      explanation: {
        en: "`event.target` is the element where the event **started** — e.g. the button actually clicked. With delegation, the listener sits on a parent while `target` points at the child.",
        es: "`event.target` es el elemento donde el evento **comenzó** — p. ej., el botón realmente pulsado. Con delegación, el oyente está en un padre mientras `target` apunta al hijo.",
      },
    },
    {
      q: {
        en: "Why does the page reload when you submit a form without preventDefault()?",
        es: "¿Por qué se recarga la página al enviar un formulario sin preventDefault()?",
      },
      options: [
        {
          en: "The browser's default submit behavior sends data and reloads",
          es: "El comportamiento por defecto del navegador envía los datos y recarga",
        },
        {
          en: "JavaScript always reloads after any event",
          es: "JavaScript siempre recarga tras cualquier evento",
        },
        {
          en: "The submit listener throws an error",
          es: "El oyente de submit lanza un error",
        },
        {
          en: "It doesn't — nothing happens",
          es: "No lo hace — no pasa nada",
        },
      ],
      answer: 0,
      explanation: {
        en: "Submitting a form **natively** sends its data and reloads the page — that's the browser's default. `event.preventDefault()` cancels it so your JavaScript can take over.",
        es: "Enviar un formulario de forma **nativa** manda sus datos y recarga la página — es el comportamiento por defecto del navegador. `event.preventDefault()` lo cancela para que tu JavaScript tome el control.",
      },
    },
    {
      q: {
        en: 'What does the `true` do in addEventListener("click", handler, true)?',
        es: '¿Qué hace el `true` en addEventListener("click", handler, true)?',
      },
      options: [
        {
          en: "Runs the listener during the capturing phase",
          es: "Ejecuta el oyente durante la fase de captura",
        },
        {
          en: "Runs the listener twice",
          es: "Ejecuta el oyente dos veces",
        },
        {
          en: "Stops the event from bubbling",
          es: "Impide que el evento suba en burbuja",
        },
        {
          en: "Removes the listener after one fire",
          es: "Elimina el oyente tras un disparo",
        },
      ],
      answer: 0,
      explanation: {
        en: "`true` (or `{ capture: true }`) registers the listener for the **capturing** phase — it runs on the way down, before bubbling listeners. Removing after one fire is `{ once: true }`.",
        es: "`true` (o `{ capture: true }`) registra el oyente para la fase de **captura** — se ejecuta al bajar, antes que los oyentes de burbuja. Eliminar tras un disparo es `{ once: true }`.",
      },
    },
  ],
  sandbox: "event-propagation",
};
