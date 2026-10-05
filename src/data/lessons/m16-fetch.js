export default {
  id: "fetch",
  module: 16,
  level: "intermediate",
  stub: false,
  title: { en: "Fetch & APIs", es: "Fetch y APIs" },
  tagline: {
    en: "HTTP, JSON and a playground with reliable mock data.",
    es: "HTTP, JSON y un laboratorio con datos simulados fiables.",
  },
  sandbox: "fetch-playground",
  sections: [
    {
      type: "concept",
      heading: { en: "APIs are waiters for data", es: "Las APIs son camareros de datos" },
      body: {
        en: `Your JavaScript can't reach into another company's database — but it can **ask for data** over the network. An **API** (Application Programming Interface) is the menu: a set of URLs you can request, each returning data in a predictable shape.

- An **endpoint** is one specific URL on that menu, e.g. \`https://api.example.com/users/7\`.
- Your code sends an **HTTP request** to the endpoint; the server answers with an **HTTP response**.
- The response carries a **status code**: \`200\` means "OK", \`404\` means "not found", \`500\` means "the server broke".
- The data itself usually travels as **JSON** — text shaped like JavaScript objects.

Every weather widget, live scoreboard and autocomplete search you've ever used is this loop: *ask → wait → receive → render*.`,
        es: `Tu JavaScript no puede meterse en la base de datos de otra empresa, pero sí puede **pedir datos** por la red. Una **API** (interfaz de programación de aplicaciones) es el menú: un conjunto de URLs que puedes solicitar, cada una devolviendo datos con una forma predecible.

- Un **endpoint** es una URL concreta de ese menú, p. ej. \`https://api.example.com/users/7\`.
- Tu código envía una **petición HTTP** al endpoint; el servidor responde con una **respuesta HTTP**.
- La respuesta trae un **código de estado**: \`200\` significa «OK», \`404\` significa «no encontrado», \`500\` significa «el servidor se rompió».
- Los datos en sí suelen viajar como **JSON**: texto con forma de objetos JavaScript.

Cada widget del tiempo, marcador en directo y buscador con autocompletado que hayas usado es este bucle: *pedir → esperar → recibir → mostrar*.`,
      },
    },
    {
      type: "visual",
      diagram: `JavaScript
    │  fetch(url)  →  HTTP request   (GET /api/users/7)
    ↓
   API  — a server that answers with data
    │  ←  JSON (text shaped like JS objects)
    ↓
JavaScript  →  await response.json()  →  a real JS object`,
      caption: {
        en: "The request/response loop behind every API call.",
        es: "El bucle petición/respuesta detrás de cada llamada a una API.",
      },
    },
    {
      type: "concept",
      heading: { en: "`fetch()` returns a promise", es: "`fetch()` devuelve una promesa" },
      body: {
        en: `The browser's built-in \`fetch(url)\` sends the HTTP request and returns a **promise** that fulfills with a **response object** — so everything from Modules 13–15 applies directly:

\`\`\`
const res = await fetch("https://api.example.com/users/7");
console.log(res.status); // 200
console.log(res.ok);     // true — status is in the 200–299 range
const user = await res.json(); // parse the JSON body into a JS object
console.log(user.name);
\`\`\`

Two things to memorize:

1. **The response is not the data.** \`fetch\` gives you a response *envelope* (status, headers). The JSON body still needs parsing with \`await res.json()\` — which is itself async.
2. **Status codes are grouped**: \`2xx\` success (200 OK, 201 Created), \`3xx\` redirection, \`4xx\` client error (400 Bad Request, **404 Not Found**), \`5xx\` server error (500 Internal Server Error).

HTTP **methods** say *what kind* of request it is: \`GET\` reads data (the default), \`POST\` sends/creates data, \`PUT\`/\`PATCH\` update it, \`DELETE\` removes it.`,
        es: `El \`fetch(url)\` integrado en el navegador envía la petición HTTP y devuelve una **promesa** que se cumple con un **objeto de respuesta**; así que todo lo de los Módulos 13–15 se aplica directamente:

\`\`\`
const res = await fetch("https://api.example.com/users/7");
console.log(res.status); // 200
console.log(res.ok);     // true — el estado está en el rango 200–299
const user = await res.json(); // convierte el cuerpo JSON en objeto JS
console.log(user.name);
\`\`\`

Dos cosas para memorizar:

1. **La respuesta no son los datos.** \`fetch\` te da un *sobre* de respuesta (estado, cabeceras). El cuerpo JSON aún hay que convertirlo con \`await res.json()\`, que también es asíncrono.
2. **Los códigos de estado van por grupos**: \`2xx\` éxito (200 OK, 201 Created), \`3xx\` redirección, \`4xx\` error del cliente (400 Bad Request, **404 Not Found**), \`5xx\` error del servidor (500 Internal Server Error).

Los **métodos** HTTP dicen *qué tipo* de petición es: \`GET\` lee datos (el valor por defecto), \`POST\` envía/crea datos, \`PUT\`/\`PATCH\` los actualizan, \`DELETE\` los elimina.`,
      },
    },
    {
      type: "code",
      heading: { en: "JSON: text in, object out", es: "JSON: entra texto, sale objeto" },
      code: `const text = '{"name":"Ada Lovelace","year":1843}';

const obj = JSON.parse(text);    // JSON text → JS object
console.log(obj.name, "|", typeof obj.name);

const back = JSON.stringify(obj); // JS object → JSON text
console.log(back, "|", typeof back);`,
      body: {
        en: `**JSON** (JavaScript Object Notation) is just **text** with strict rules: double quotes, no functions, no comments, no trailing commas. \`JSON.parse\` turns that text into a real JS object; \`JSON.stringify\` does the reverse.

It's called "JavaScript" Object Notation for historical reasons — today **every** language speaks JSON. That's exactly why APIs use it: it's the neutral middle ground between your code and theirs.`,
        es: `**JSON** (notación de objetos de JavaScript) es solo **texto** con reglas estrictas: comillas dobles, sin funciones, sin comentarios, sin comas finales. \`JSON.parse\` convierte ese texto en un objeto JS real; \`JSON.stringify\` hace lo contrario.

Se llama notación «de JavaScript» por razones históricas: hoy **todos** los lenguajes hablan JSON. Por eso lo usan las APIs: es el terreno neutral entre tu código y el suyo.`,
      },
    },
    {
      type: "code",
      heading: { en: "A fetch you can actually run", es: "Un fetch que sí puedes ejecutar" },
      code: `// A mock fetch — same shape as the real one, zero network
const fakeFetch = (url) =>
  Promise.resolve({
    ok: true,
    status: 200,
    json: () => Promise.resolve({ name: "Ada", lang: "JavaScript" }),
  });

(async () => {
  const res = await fakeFetch("https://api.example.com/user");
  console.log("status:", res.status);
  if (!res.ok) throw new Error("bad response");
  const data = await res.json();
  console.log("name:", data.name);
})();`,
      caption: {
        en: "Press RUN: the full fetch pattern — status check, then parse.",
        es: "Pulsa RUN: el patrón completo de fetch: comprobar el estado y luego convertir.",
      },
      body: {
        en: `Real network calls don't work in this sandbox, so this lesson uses a **mock** with the exact same shape as a real response: \`ok\`, \`status\`, and a \`json()\` method returning a promise.

Notice the pattern you'll use in real code: \`await fetch(...)\` → check \`res.ok\` → \`await res.json()\`. Two awaits, because the headers arrive before the body finishes downloading.`,
        es: `Las llamadas de red reales no funcionan en este sandbox, así que esta lección usa un **simulacro** con exactamente la misma forma que una respuesta real: \`ok\`, \`status\` y un método \`json()\` que devuelve una promesa.

Fíjate en el patrón que usarás en código real: \`await fetch(...)\` → comprobar \`res.ok\` → \`await res.json()\`. Dos awaits, porque las cabeceras llegan antes de que el cuerpo termine de descargarse.`,
      },
    },
    {
      type: "lab",
      lab: "fetch-playground",
      heading: { en: "Play in the Fetch Playground", es: "Juega en el Fetch Playground" },
      body: {
        en: "The Fetch Playground gives you a **reliable mock API** — users, posts and todos with realistic delays, plus endpoints that return 404 and 500 on demand. Practice the full pattern: `await fetch`, check `res.ok`, `await res.json()`, and handle each status code gracefully. (The playground renders a “coming soon” card until Phase 5 ships the interactive version.)",
        es: "El Fetch Playground te ofrece una **API simulada y fiable**: usuarios, posts y todos con retardos realistas, además de endpoints que devuelven 404 y 500 a demanda. Practica el patrón completo: `await fetch`, comprueba `res.ok`, `await res.json()` y gestiona cada código de estado con elegancia. (El laboratorio muestra una tarjeta de «próximamente» hasta que la Fase 5 publique la versión interactiva).",
      },
    },
    {
      type: "mistake",
      wrong: `const res = await fetch(url);
const data = res.json();      // ← missing await: data is a Promise!
console.log(data.name);       // undefined 💥`,
      right: `const res = await fetch(url);
if (!res.ok) throw new Error("HTTP " + res.status); // ← check FIRST
const data = await res.json(); // ← await the parsing
console.log(data.name);        // ✓`,
      explanation: {
        en: `Two classic fetch bugs in one snippet:

1. **Forgetting \`await\` on \`res.json()\`.** Parsing the body is async too — without \`await\`, \`data\` is a pending promise and \`data.name\` is \`undefined\`.
2. **Not checking \`res.ok\` before parsing.** A 404 page is usually HTML, not JSON — parsing it throws a confusing error far from the real problem. Check the status first, parse second.`,
        es: `Dos bugs clásicos de fetch en un solo fragmento:

1. **Olvidar el \`await\` en \`res.json()\`.** Convertir el cuerpo también es asíncrono: sin \`await\`, \`data\` es una promesa pendiente y \`data.name\` es \`undefined\`.
2. **No comprobar \`res.ok\` antes de convertir.** Una página 404 suele ser HTML, no JSON: convertirla lanza un error confuso lejos del problema real. Primero comprueba el estado, después convierte.`,
      },
    },
    {
      type: "takeaway",
      body: {
        en: "APIs serve data over HTTP: your code sends a **request** to an **endpoint** and gets a **response** with a **status code** (200 OK, 404 not found, 500 server error) plus a **JSON** body. `fetch()` returns a promise of the response — check `res.ok`, then `await res.json()` to get a real JavaScript object.",
        es: "Las APIs sirven datos por HTTP: tu código envía una **petición** a un **endpoint** y recibe una **respuesta** con un **código de estado** (200 OK, 404 no encontrado, 500 error del servidor) más un cuerpo **JSON**. `fetch()` devuelve una promesa de la respuesta: comprueba `res.ok` y luego `await res.json()` para obtener un objeto JavaScript real.",
      },
    },
    {
      type: "underhood",
      title: { en: "`fetch` doesn't reject on 404", es: "`fetch` no se rechaza con un 404" },
      body: {
        en: `This surprises everyone once: **\`fetch\` only rejects on network failure** — DNS errors, no connection, CORS blocks. An HTTP **404 or 500 is a perfectly successful fetch** as far as the promise is concerned: it *fulfills* with a response whose \`ok\` is \`false\`.

That's exactly why the \`if (!res.ok)\` check isn't optional style — it's the **only** place HTTP errors surface. Skip it and your code will happily try to parse an error page as JSON.

> Sending data? Pass a second argument: \`fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) })\`. The body must be a **string** — another job for \`JSON.stringify\`.`,
        es: `Esto sorprende a todo el mundo una vez: **\`fetch\` solo se rechaza por fallos de red**: errores de DNS, sin conexión, bloqueos de CORS. Un **404 o 500 HTTP es un fetch perfectamente exitoso** para la promesa: se *cumple* con una respuesta cuyo \`ok\` es \`false\`.

Por eso la comprobación \`if (!res.ok)\` no es estilo opcional: es el **único** lugar donde afloran los errores HTTP. Si la omites, tu código intentará tan contento convertir una página de error en JSON.

> ¿Enviar datos? Pasa un segundo argumento: \`fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) })\`. El cuerpo debe ser un **string**: otro trabajo para \`JSON.stringify\`.`,
      },
    },
  ],
  quiz: [
    {
      q: { en: "What is JSON?", es: "¿Qué es JSON?" },
      options: [
        { en: "A JavaScript library for calling APIs", es: "Una librería de JavaScript para llamar a APIs" },
        { en: "A text-based data format", es: "Un formato de datos basado en texto" },
        { en: "A NoSQL database", es: "Una base de datos NoSQL" },
        { en: "A faster alternative to JavaScript", es: "Una alternativa más rápida a JavaScript" },
      ],
      answer: 1,
      explanation: {
        en: "JSON (JavaScript Object Notation) is **plain text** with strict syntax — double quotes, no functions. Every major language can parse it, which is why APIs use it as the neutral data format.",
        es: "JSON (notación de objetos de JavaScript) es **texto plano** con sintaxis estricta: comillas dobles, sin funciones. Todos los lenguajes importantes pueden interpretarlo, por eso las APIs lo usan como formato neutral de datos.",
      },
    },
    {
      q: { en: "Which status code means “not found”?", es: "¿Qué código de estado significa «no encontrado»?" },
      options: [
        { en: "200", es: "200" },
        { en: "301", es: "301" },
        { en: "404", es: "404" },
        { en: "500", es: "500" },
      ],
      answer: 2,
      explanation: {
        en: "`2xx` = success, `3xx` = redirection, **`4xx` = client error** (400 bad request, **404 not found**), `5xx` = server error (500). The first digit tells the whole story.",
        es: "`2xx` = éxito, `3xx` = redirección, **`4xx` = error del cliente** (400 petición errónea, **404 no encontrado**), `5xx` = error del servidor (500). El primer dígito lo cuenta todo.",
      },
    },
    {
      q: { en: "What is the difference between GET and POST?", es: "¿Cuál es la diferencia entre GET y POST?" },
      options: [
        { en: "GET sends data, POST reads data", es: "GET envía datos, POST lee datos" },
        { en: "GET reads data, POST sends / creates data", es: "GET lee datos, POST envía / crea datos" },
        { en: "They are identical", es: "Son idénticos" },
        { en: "GET is for JSON, POST is for plain text", es: "GET es para JSON, POST es para texto plano" },
      ],
      answer: 1,
      explanation: {
        en: "**GET** (the default) *reads* — fetching a user, searching, loading a page. **POST** *sends* data to be processed or created — submitting a form, creating a record. Same URL can do both, with very different meanings.",
        es: "**GET** (el valor por defecto) *lee*: obtener un usuario, buscar, cargar una página. **POST** *envía* datos para procesarlos o crearlos: enviar un formulario, crear un registro. La misma URL puede hacer ambas cosas, con significados muy distintos.",
      },
    },
    {
      q: { en: "What will this code output?", es: "¿Qué mostrará este código?" },
      code: `const text = '{"score":10}';\nconsole.log(typeof JSON.parse(text));`,
      options: [
        { en: '"string"', es: '"string"' },
        { en: '"object"', es: '"object"' },
        { en: '"JSON"', es: '"JSON"' },
        { en: '"number"', es: '"number"' },
      ],
      answer: 1,
      explanation: {
        en: "`JSON.parse` turns the **text** `'{\"score\":10}'` into a real JavaScript **object** — so `typeof` gives `\"object\"`. (There is no `\"JSON\"` type; JSON is a format, not a type.)",
        es: "`JSON.parse` convierte el **texto** `'{\"score\":10}'` en un **objeto** JavaScript real, así que `typeof` da `\"object\"`. (No existe el tipo `\"JSON\"`: JSON es un formato, no un tipo).",
      },
    },
    {
      q: {
        en: "The server answers with a 404. What happens to the promise returned by `fetch()`?",
        es: "El servidor responde con un 404. ¿Qué le pasa a la promesa que devuelve `fetch()`?",
      },
      code: `fetch("https://api.example.com/missing"); // server answers 404`,
      options: [
        { en: "It rejects with a 404 error", es: "Se rechaza con un error 404" },
        { en: "It fulfills — check response.ok to detect the 404", es: "Se cumple: comprueba response.ok para detectar el 404" },
        { en: "It hangs forever", es: "Se queda colgada para siempre" },
        { en: "It throws synchronously", es: "Lanza el error de forma síncrona" },
      ],
      answer: 1,
      explanation: {
        en: "`fetch` only rejects on **network failure**. A 404 is a completed HTTP conversation, so the promise **fulfills** with `ok: false`. The `if (!res.ok)` check is the only place HTTP errors surface — never skip it.",
        es: "`fetch` solo se rechaza por **fallos de red**. Un 404 es una conversación HTTP completada, así que la promesa **se cumple** con `ok: false`. La comprobación `if (!res.ok)` es el único lugar donde afloran los errores HTTP: nunca la omitas.",
      },
    },
  ],
};
