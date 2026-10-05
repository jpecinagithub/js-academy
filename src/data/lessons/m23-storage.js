// Module 23: Browser Storage — localStorage, sessionStorage, IndexedDB.
// NOTE: no {type:"code"} sections in this lesson — the runnable sandbox iframe
// has an opaque origin, so localStorage/sessionStorage access throws there.
// Storage is taught via fenced listings + the storage-inspector lab instead.
export default {
  id: "storage",
  module: 23,
  level: "beginner",
  stub: false,
  title: { en: "Browser Storage", es: "Almacenamiento" },
  tagline: {
    en: "Variables forget everything on reload — localStorage, sessionStorage and IndexedDB don't.",
    es: "Las variables lo olvidan todo al recargar — localStorage, sessionStorage e IndexedDB no.",
  },
  sandbox: "storage-inspector",
  sections: [
    {
      type: "concept",
      heading: { en: "Memory that survives a reload", es: "Memoria que sobrevive a una recarga" },
      body: {
        en: "Every variable you've used so far lives in **RAM**: close the tab and it's gone. The browser also gives you **persistent storage** — places on disk where your page can save data and read it back later, even after a restart.\n\nThere are three built-in options:\n\n- **`localStorage`** — a simple key/value store. Data persists until the user clears it. Survives restarts.\n- **`sessionStorage`** — the same key/value API, but the data dies when the *tab* closes.\n- **`IndexedDB`** — a real database in the browser for large, structured data. Asynchronous and more powerful.",
        es: "Cada variable que has usado hasta ahora vive en la **RAM**: cierra la pestaña y desaparece. El navegador también te da **almacenamiento persistente** — lugares en disco donde tu página puede guardar datos y leerlos después, incluso tras un reinicio.\n\nHay tres opciones integradas:\n\n- **`localStorage`** — un almacén simple de clave/valor. Los datos persisten hasta que el usuario los borre. Sobrevive a reinicios.\n- **`sessionStorage`** — la misma API de clave/valor, pero los datos mueren cuando se cierra la *pestaña*.\n- **`IndexedDB`** — una base de datos real en el navegador para datos grandes y estructurados. Asíncrona y más potente.",
      },
    },
    {
      type: "visual",
      caption: {
        en: "Pick the right tool: match lifetime, capacity and data shape to your need.",
        es: "Elige la herramienta adecuada: ajusta duración, capacidad y forma de los datos a tu necesidad.",
      },
      diagram: `┌──────────────┬────────────────┬────────────────┬────────────────┐
│              │  localStorage  │ sessionStorage │   IndexedDB    │
├──────────────┼────────────────┼────────────────┼────────────────┤
│ Lifetime     │ until cleared  │ until tab      │ until cleared  │
│              │ (survives      │ closes         │ (survives      │
│              │  restarts)     │                │  restarts)     │
├──────────────┼────────────────┼────────────────┼────────────────┤
│ Capacity     │ ~5 MB          │ ~5 MB          │ hundreds of MB │
├──────────────┼────────────────┼────────────────┼────────────────┤
│ Stores       │ strings only   │ strings only   │ objects, files │
├──────────────┼────────────────┼────────────────┼────────────────┤
│ API style    │ synchronous    │ synchronous    │ asynchronous   │
├──────────────┼────────────────┼────────────────┼────────────────┤
│ Good for     │ theme, prefs,  │ per-tab draft, │ offline data,  │
│              │ auth tokens    │ wizard state   │ caches, media  │
└──────────────┴────────────────┴────────────────┴────────────────┘`,
    },
    {
      type: "concept",
      heading: { en: "The localStorage API: four methods", es: "La API de localStorage: cuatro métodos" },
      body: {
        en: `The whole API is four calls. Keys and values are always **strings**:

\`\`\`
localStorage.setItem("theme", "dark");   // save
localStorage.getItem("theme");           // read → "dark" (or null if missing)
localStorage.removeItem("theme");        // delete one key
localStorage.clear();                    // delete everything for this site
\`\`\`

\`sessionStorage\` has the exact same four methods — only the lifetime differs.

> These listings are intentionally **not runnable** here: the code sandbox on this page runs in an isolated frame where storage access is blocked. Use the **Storage Inspector lab** below — it runs in the real page context, so storage works.`,
        es: `Toda la API son cuatro llamadas. Las claves y los valores siempre son **cadenas**:

\`\`\`
localStorage.setItem("theme", "dark");   // guardar
localStorage.getItem("theme");           // leer → "dark" (o null si no existe)
localStorage.removeItem("theme");        // borrar una clave
localStorage.clear();                    // borrar todo de este sitio
\`\`\`

\`sessionStorage\` tiene exactamente los mismos cuatro métodos — solo cambia la duración.

> Estos listados **no son ejecutables** aquí a propósito: el sandbox de código de esta página corre en un marco aislado donde el acceso al almacenamiento está bloqueado. Usa el **laboratorio Storage Inspector** de abajo — se ejecuta en el contexto real de la página, así que el almacenamiento funciona.`,
      },
    },
    {
      type: "lab",
      lab: "storage-inspector",
      heading: { en: "Storage Inspector", es: "Inspector de almacenamiento" },
      body: {
        en: "Open the lab and run `localStorage.setItem(\"name\", \"Jon\")` in its console. Watch the live **key/value table** update — then reload the page and see your data still sitting there. Try the same in `sessionStorage`, close the tab, and compare.",
        es: "Abre el laboratorio y ejecuta `localStorage.setItem(\"name\", \"Jon\")` en su consola. Observa cómo se actualiza la **tabla clave/valor** en vivo — luego recarga la página y verás que tus datos siguen ahí. Prueba lo mismo en `sessionStorage`, cierra la pestaña y compara.",
      },
    },
    {
      type: "concept",
      heading: { en: "sessionStorage: the per-tab twin", es: "sessionStorage: el gemelo por pestaña" },
      body: {
        en: "`sessionStorage` is identical to `localStorage` except for one thing: **each tab gets its own private copy**, and it vanishes when the tab closes.\n\nUse it for state that belongs to *this tab's* workflow:\n\n- a multi-step form the user is filling in right now\n- a checkout wizard's progress\n- anything you'd be annoyed to find resurrected tomorrow, but sad to lose on an accidental reload\n\nRule of thumb: **preferences → `localStorage`; in-progress work → `sessionStorage`.**",
        es: "`sessionStorage` es idéntico a `localStorage` salvo por una cosa: **cada pestaña tiene su propia copia privada**, y desaparece al cerrar la pestaña.\n\nÚsalo para estado que pertenece al flujo de trabajo de *esta pestaña*:\n\n- un formulario de varios pasos que el usuario está rellenando ahora\n- el progreso de un asistente de compra\n- cualquier cosa que te molestaría encontrar resucitada mañana, pero te entristecería perder con una recarga accidental\n\nRegla de oro: **preferencias → `localStorage`; trabajo en curso → `sessionStorage`.**",
      },
    },
    {
      type: "concept",
      heading: { en: "IndexedDB: when 5 MB of strings isn't enough", es: "IndexedDB: cuando 5 MB de cadenas no bastan" },
      body: {
        en: "Need to cache hundreds of images for offline use, or store thousands of records you can query? That's **IndexedDB**: a real transactional database inside the browser.\n\n- Stores **structured data** natively — objects, arrays, even files and blobs.\n- Capacity in the **hundreds of megabytes** (the browser asks the user before going huge).\n- **Asynchronous** API (promises/events) so big reads never freeze your page.\n\nThe trade-off is complexity: instead of four methods you get databases, object stores, transactions and indexes. Reach for `localStorage` first; graduate to IndexedDB when you outgrow strings.",
        es: "¿Necesitas cachear cientos de imágenes para uso sin conexión, o guardar miles de registros que puedas consultar? Eso es **IndexedDB**: una base de datos transaccional real dentro del navegador.\n\n- Guarda **datos estructurados** de forma nativa — objetos, arrays, incluso archivos y blobs.\n- Capacidad de **cientos de megabytes** (el navegador pregunta al usuario antes de crecer mucho).\n- API **asíncrona** (promesas/eventos) para que las lecturas grandes nunca congelen tu página.\n\nEl precio es la complejidad: en vez de cuatro métodos tienes bases de datos, almacenes de objetos, transacciones e índices. Empieza con `localStorage`; pasa a IndexedDB cuando las cadenas se te queden pequeñas.",
      },
    },
    {
      type: "mistake",
      wrong: `const user = { name: "Jon", level: 5 };
localStorage.setItem("user", user);   // stores... what?
localStorage.getItem("user");         // "[object Object]" 😱`,
      right: `const user = { name: "Jon", level: 5 };
localStorage.setItem("user", JSON.stringify(user)); // '{"name":"Jon","level":5}'
const back = JSON.parse(localStorage.getItem("user")); // ✓ real object again
console.log(back.name); // "Jon"`,
      explanation: {
        en: "Storage only speaks **strings**. Hand it an object and JavaScript silently converts it with `String(obj)` → `\"[object Object]\"` — your data is destroyed and nothing warns you. The ritual is always: **`JSON.stringify` on the way in, `JSON.parse` on the way out**.",
        es: "El almacenamiento solo habla **cadenas**. Si le das un objeto, JavaScript lo convierte en silencio con `String(obj)` → `\"[object Object]\"` — tus datos se destruyen sin que nada te avise. El ritual es siempre: **`JSON.stringify` al entrar, `JSON.parse` al salir**.",
      },
    },
    {
      type: "takeaway",
      body: {
        en: "**Pick storage by lifetime and shape.** `localStorage` for preferences that survive restarts, `sessionStorage` for per-tab work in progress, `IndexedDB` for large structured data. Both key/value stores hold strings only — so `JSON.stringify` going in, `JSON.parse` coming out.",
        es: "**Elige el almacenamiento por duración y forma.** `localStorage` para preferencias que sobreviven a reinicios, `sessionStorage` para trabajo en curso por pestaña, `IndexedDB` para datos estructurados grandes. Ambos almacenes clave/valor solo guardan cadenas — así que `JSON.stringify` al entrar, `JSON.parse` al salir.",
      },
    },
    {
      type: "underhood",
      title: { en: "Under the hood: origins, quota, and blocking", es: "Bajo el capó: orígenes, cuota y bloqueo" },
      body: {
        en: "Three details worth knowing:\n\n- **Same-origin**: storage is partitioned per website (protocol + domain + port). `app.com` can never read `other.com`'s storage — that's a security boundary, not a suggestion.\n- **Quota**: `localStorage`/`sessionStorage` give you roughly 5 MB per origin. Exceed it and `setItem` throws a `QuotaExceededError` — wrap writes in `try/catch` if you're storing a lot.\n- **Synchronous**: `localStorage` calls block the main thread until they finish. Fine for a theme string; don't loop over megabytes of it during an animation.",
        es: "Tres detalles que vale la pena conocer:\n\n- **Mismo origen**: el almacenamiento está separado por sitio web (protocolo + dominio + puerto). `app.com` jamás puede leer el almacenamiento de `otro.com` — es un límite de seguridad, no una sugerencia.\n- **Cuota**: `localStorage`/`sessionStorage` te dan unos 5 MB por origen. Si la superas, `setItem` lanza un `QuotaExceededError` — envuelve las escrituras en `try/catch` si guardas mucho.\n- **Síncrono**: las llamadas a `localStorage` bloquean el hilo principal hasta terminar. Bien para una cadena de tema; no iteres sobre megabytes en mitad de una animación.",
      },
    },
  ],
  quiz: [
    {
      q: { en: "Which storage survives a browser restart?", es: "¿Qué almacenamiento sobrevive a un reinicio del navegador?" },
      options: [
        { en: "localStorage", es: "localStorage" },
        { en: "sessionStorage", es: "sessionStorage" },
        { en: "A plain let variable", es: "Una variable let normal" },
      ],
      answer: 0,
      explanation: {
        en: "`localStorage` persists until the user clears site data. `sessionStorage` dies with the tab, and variables die with the page.",
        es: "`localStorage` persiste hasta que el usuario borre los datos del sitio. `sessionStorage` muere con la pestaña y las variables mueren con la página.",
      },
    },
    {
      q: { en: "What does `getItem` return here?", es: "¿Qué devuelve `getItem` aquí?" },
      code: `localStorage.setItem("user", { name: "Jon" });\nlocalStorage.getItem("user");`,
      options: [
        { en: 'The object { name: "Jon" }', es: 'El objeto { name: "Jon" }' },
        { en: '"[object Object]"', es: '"[object Object]"' },
        { en: "null", es: "null" },
      ],
      answer: 1,
      explanation: {
        en: "Storage holds strings only, so the object is coerced via `String(obj)` into `\"[object Object]\"`. The original data is lost — always `JSON.stringify` first.",
        es: "El almacenamiento solo guarda cadenas, así que el objeto se convierte con `String(obj)` en `\"[object Object]\"`. Los datos originales se pierden — usa siempre `JSON.stringify` primero.",
      },
    },
    {
      q: { en: "What is the correct round-trip for storing an object?", es: "¿Cuál es el ciclo correcto para guardar un objeto?" },
      options: [
        { en: "setItem with the object, getItem returns it", es: "setItem con el objeto, getItem lo devuelve" },
        { en: "JSON.stringify on save, JSON.parse on read", es: "JSON.stringify al guardar, JSON.parse al leer" },
        { en: "toString on save, eval on read", es: "toString al guardar, eval al leer" },
      ],
      answer: 1,
      explanation: {
        en: "`JSON.stringify(user)` turns the object into a string for storage; `JSON.parse(...)` rebuilds an equivalent object when reading. (`eval` on stored data is a security hole — never do that.)",
        es: "`JSON.stringify(user)` convierte el objeto en cadena para guardarlo; `JSON.parse(...)` reconstruye un objeto equivalente al leer. (Usar `eval` con datos guardados es un agujero de seguridad — jamás lo hagas.)",
      },
    },
    {
      q: { en: "A user is halfway through a multi-step form in one tab. Where should the draft live?", es: "Un usuario va por la mitad de un formulario multipaso en una pestaña. ¿Dónde debería vivir el borrador?" },
      options: [
        { en: "sessionStorage — per-tab, gone when the tab closes", es: "sessionStorage — por pestaña, desaparece al cerrarla" },
        { en: "localStorage — it must survive forever", es: "localStorage — debe sobrevivir para siempre" },
        { en: "IndexedDB — forms are large structured data", es: "IndexedDB — los formularios son datos estructurados grandes" },
      ],
      answer: 0,
      explanation: {
        en: "A form draft belongs to *this tab's* workflow: `sessionStorage` keeps it through accidental reloads but doesn't resurrect a stale half-filled form weeks later.",
        es: "El borrador de un formulario pertenece al flujo de *esta pestaña*: `sessionStorage` lo conserva ante recargas accidentales pero no resucita un formulario a medio rellenar semanas después.",
      },
    },
    {
      q: { en: "You need to cache 200 MB of map tiles for offline use. Which storage?", es: "Necesitas cachear 200 MB de teselas de mapa para uso sin conexión. ¿Qué almacenamiento?" },
      options: [
        { en: "localStorage", es: "localStorage" },
        { en: "sessionStorage", es: "sessionStorage" },
        { en: "IndexedDB", es: "IndexedDB" },
      ],
      answer: 2,
      explanation: {
        en: "`localStorage`/`sessionStorage` cap out around 5 MB and only store strings. IndexedDB handles hundreds of megabytes of structured data and files — it's the offline-workhorse of the three.",
        es: "`localStorage`/`sessionStorage` se quedan en unos 5 MB y solo guardan cadenas. IndexedDB maneja cientos de megabytes de datos estructurados y archivos — es el caballo de batalla sin conexión de los tres.",
      },
    },
  ],
};
