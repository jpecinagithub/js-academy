/**
 * Cheat sheet entries. Expanded in Phase 5 — keep the same shape.
 * { section: {en, es}, entries: [ { name, code, note: {en, es} } ] }
 */
export const CHEATSHEET = [
  {
    section: { en: "Variables", es: "Variables" },
    entries: [
      { name: "let", code: "let x = 1;\nx = 2;", note: { en: "Reassignable binding.", es: "Enlace reasignable." } },
      { name: "const", code: "const x = 1;", note: { en: "Cannot be reassigned.", es: "No se puede reasignar." } },
      { name: "var (legacy)", code: "var x = 1;", note: { en: "Old-style; function-scoped and hoisted. Prefer let/const.", es: "Estilo antiguo; ámbito de función y hoisted. Prefiere let/const." } },
      { name: "typeof", code: 'typeof "hi" // "string"', note: { en: "Returns the type as a string.", es: "Devuelve el tipo como cadena." } },
      { name: "Destructuring", code: "const { name, age } = user;\nconst [a, b] = [1, 2];", note: { en: "Unpack values from objects/arrays.", es: "Extrae valores de objetos/arrays." } },
    ],
  },
  {
    section: { en: "Strings", es: "Cadenas" },
    entries: [
      { name: "length", code: '"hello".length // 5', note: { en: "Number of characters.", es: "Número de caracteres." } },
      { name: "Template literal", code: "`Hi, ${name}!`", note: { en: "Embed expressions with ${…}.", es: "Inserta expresiones con ${…}." } },
      { name: "includes", code: '"hello".includes("ell") // true', note: { en: "Checks for a substring.", es: "Comprueba si contiene una subcadena." } },
      { name: "slice", code: '"hello".slice(1, 4) // "ell"', note: { en: "Extract a portion (end not included).", es: "Extrae una porción (el fin no se incluye)." } },
      { name: "split / join", code: '"a,b".split(",") // ["a","b"]\n["a","b"].join("-") // "a-b"', note: { en: "String ↔ array conversion.", es: "Conversión cadena ↔ array." } },
    ],
  },
  {
    section: { en: "Arrays", es: "Arrays" },
    entries: [
      { name: "Literal", code: "const xs = [1, 2, 3];", note: { en: "Ordered list of values.", es: "Lista ordenada de valores." } },
      { name: "Index access", code: "xs[0] // 1\nxs[xs.length - 1] // last", note: { en: "Zero-based; length - 1 is the last index.", es: "Base cero; length - 1 es el último índice." } },
      { name: "push / pop", code: "xs.push(4); // add end\nxs.pop();   // remove end", note: { en: "Add or remove from the end.", es: "Añade o quita del final." } },
      { name: "splice", code: "xs.splice(1, 1); // remove index 1", note: { en: "Remove/replace in place (mutates).", es: "Quita/reemplaza in situ (muta)." } },
      { name: "slice", code: "xs.slice(0, 2) // copy of first two", note: { en: "Copy a portion; does not mutate.", es: "Copia una porción; no muta." } },
    ],
  },
  {
    section: { en: "Array methods", es: "Métodos de array" },
    entries: [
      { name: "map", code: "[1,2,3].map(x => x * 2) // [2,4,6]", note: { en: "Transform each element.", es: "Transforma cada elemento." } },
      { name: "filter", code: "[1,2,3].filter(x => x > 1) // [2,3]", note: { en: "Keep matching elements.", es: "Conserva los que cumplen." } },
      { name: "reduce", code: "[1,2,3].reduce((a,x) => a + x, 0) // 6", note: { en: "Fold into a single value.", es: "Reduce a un único valor." } },
      { name: "find", code: "[1,2,3].find(x => x > 1) // 2", note: { en: "First element that matches.", es: "Primer elemento que cumple." } },
      { name: "some / every", code: "[1,2].some(x => x > 1) // true\n[1,2].every(x => x > 0) // true", note: { en: "Test: any match / all match.", es: "Comprueba: alguno cumple / todos cumplen." } },
      { name: "forEach", code: "[1,2].forEach(x => console.log(x))", note: { en: "Side effects only — returns undefined.", es: "Solo efectos secundarios — devuelve undefined." } },
    ],
  },
  {
    section: { en: "Objects", es: "Objetos" },
    entries: [
      { name: "Literal", code: 'const user = { name: "Ada", age: 36 };', note: { en: "Key-value collection.", es: "Colección clave-valor." } },
      { name: "Access", code: "user.name // dot\nuser[\"age\"] // bracket", note: { en: "Dot or bracket notation.", es: "Notación de punto o corchetes." } },
      { name: "Optional chaining", code: "user.address?.city", note: { en: "Safe access — no crash on null/undefined.", es: "Acceso seguro — no falla con null/undefined." } },
      { name: "Object.keys", code: "Object.keys(user) // [\"name\",\"age\"]", note: { en: "Array of the object's keys.", es: "Array con las claves del objeto." } },
      { name: "Spread", code: "const copy = { ...user, age: 37 };", note: { en: "Shallow copy with overrides.", es: "Copia superficial con cambios." } },
    ],
  },
  {
    section: { en: "Functions", es: "Funciones" },
    entries: [
      { name: "Declaration", code: "function add(a, b) {\n  return a + b;\n}", note: { en: "Named, hoisted function.", es: "Función nombrada, con hoisting." } },
      { name: "Arrow", code: "const add = (a, b) => a + b;", note: { en: "Concise; no own `this`.", es: "Concisa; sin `this` propio." } },
      { name: "Default params", code: "function greet(name = \"stranger\") { … }", note: { en: "Fallback when an argument is missing.", es: "Valor si falta un argumento." } },
      { name: "Rest params", code: "function sum(...ns) { return ns.reduce((a,n) => a+n, 0); }", note: { en: "Collect extra arguments into an array.", es: "Recoge los argumentos extra en un array." } },
    ],
  },
  {
    section: { en: "Loops", es: "Bucles" },
    entries: [
      { name: "for", code: "for (let i = 0; i < 3; i++) { … }", note: { en: "Classic counting loop.", es: "Bucle clásico de conteo." } },
      { name: "for…of", code: "for (const x of [1,2,3]) { … }", note: { en: "Iterate values of an iterable.", es: "Itera los valores de un iterable." } },
      { name: "while", code: "while (n > 0) { n--; }", note: { en: "Repeat while a condition holds.", es: "Repite mientras se cumple una condición." } },
      { name: "break / continue", code: "break; // exit loop\ncontinue; // next iteration", note: { en: "Exit early or skip one iteration.", es: "Sale del bucle o salta una iteración." } },
    ],
  },
  {
    section: { en: "Operators", es: "Operadores" },
    entries: [
      { name: "Strict equality", code: "1 === \"1\" // false\n1 == \"1\"  // true (coerces!)", note: { en: "=== avoids type coercion.", es: "=== evita la coerción de tipos." } },
      { name: "Logical", code: "a && b // both truthy\na || b // at least one", note: { en: "Short-circuit evaluation.", es: "Evaluación en cortocircuito." } },
      { name: "Nullish ??", code: 'name ?? "anon" // only for null/undefined', note: { en: "Default for null/undefined (not for 0 or \"\").", es: "Por defecto para null/undefined (no para 0 ni \"\")." } },
      { name: "Ternary", code: "age >= 18 ? \"adult\" : \"minor\"", note: { en: "Compact if/else expression.", es: "If/else compacto como expresión." } },
      { name: "Arithmetic", code: "10 % 3 // 1 (remainder)\n2 ** 3  // 8 (power)", note: { en: "% is remainder; ** is power.", es: "% es el resto; ** es potencia." } },
    ],
  },
  {
    section: { en: "Promises", es: "Promesas" },
    entries: [
      { name: "then / catch", code: "fetch(u).then(r => r.json()).catch(console.error)", note: { en: "Handle fulfillment and rejection.", es: "Gestiona éxito y error." } },
      { name: "new Promise", code: "new Promise((res, rej) => { … })", note: { en: "Wrap callback-style code.", es: "Envuelve código con callbacks." } },
      { name: "Promise.all", code: "Promise.all([p1, p2]) // [r1, r2]", note: { en: "Run in parallel; fails if any rejects.", es: "En paralelo; falla si alguna rechaza." } },
      { name: "Promise.race", code: "Promise.race([p1, timeout])", note: { en: "First to settle wins.", es: "Gana la primera en resolverse." } },
    ],
  },
  {
    section: { en: "Async / Await", es: "Async / Await" },
    entries: [
      { name: "async function", code: "async function load() {\n  const r = await fetch(u);\n  return r.json();\n}", note: { en: "Always returns a promise.", es: "Siempre devuelve una promesa." } },
      { name: "await", code: "const data = await load();", note: { en: "Pause until the promise settles.", es: "Pausa hasta que la promesa se resuelva." } },
      { name: "try / catch", code: "try {\n  await load();\n} catch (e) {\n  console.error(e);\n}", note: { en: "Handle async errors.", es: "Gestiona errores asíncronos." } },
      { name: "Sequential vs parallel", code: "for (const u of urls) await fetch(u); // one by one\nawait Promise.all(urls.map(fetch)); // together", note: { en: "await in a loop is sequential.", es: "await en bucle es secuencial." } },
    ],
  },
  {
    section: { en: "DOM", es: "DOM" },
    entries: [
      { name: "querySelector", code: 'document.querySelector("#app")', note: { en: "First element matching a CSS selector.", es: "Primer elemento que coincide con el selector." } },
      { name: "textContent", code: 'el.textContent = "Hi";', note: { en: "Read/write an element's text (safe).", es: "Lee/escribe el texto de un elemento (seguro)." } },
      { name: "createElement", code: 'const li = document.createElement("li");\nlist.append(li);', note: { en: "Build and insert nodes.", es: "Crea e inserta nodos." } },
      { name: "classList", code: 'el.classList.add("active");\nel.classList.toggle("open");', note: { en: "Add/remove/toggle CSS classes.", es: "Añade/quita/alterna clases CSS." } },
      { name: "style", code: 'el.style.color = "red";', note: { en: "Inline styles (use CSS classes when possible).", es: "Estilos inline (mejor clases CSS cuando se pueda)." } },
    ],
  },
  {
    section: { en: "Events", es: "Eventos" },
    entries: [
      { name: "addEventListener", code: 'el.addEventListener("click", fn)', note: { en: "React to events.", es: "Reacciona a eventos." } },
      { name: "event.target", code: 'list.addEventListener("click", (e) => {\n  console.log(e.target);\n});', note: { en: "The element that triggered the event.", es: "El elemento que disparó el evento." } },
      { name: "preventDefault", code: 'form.addEventListener("submit", (e) => {\n  e.preventDefault();\n});', note: { en: "Stop the browser's default action.", es: "Detiene la acción por defecto del navegador." } },
      { name: "Delegation", code: 'ul.addEventListener("click", (e) => {\n  if (e.target.matches("li")) { … }\n});', note: { en: "One listener for many children.", es: "Un solo listener para muchos hijos." } },
    ],
  },
  {
    section: { en: "Fetch", es: "Fetch" },
    entries: [
      { name: "GET", code: "const res = await fetch(\"/api/users\");\nconst users = await res.json();", note: { en: "Request data from a URL.", es: "Pide datos a una URL." } },
      { name: "Check res.ok", code: "if (!res.ok) throw new Error(`HTTP ${res.status}`);", note: { en: "fetch only rejects on network failure.", es: "fetch solo rechaza por fallo de red." } },
      { name: "POST JSON", code: 'await fetch("/api/users", {\n  method: "POST",\n  headers: { "Content-Type": "application/json" },\n  body: JSON.stringify({ name: "Ada" }),\n});', note: { en: "Send JSON in the request body.", es: "Envía JSON en el cuerpo de la petición." } },
      { name: "Error handling", code: "try {\n  const r = await fetch(u);\n  if (!r.ok) throw new Error(r.status);\n} catch (e) { … }", note: { en: "Catch network errors and bad statuses.", es: "Captura errores de red y estados malos." } },
    ],
  },
  {
    section: { en: "Modules", es: "Módulos" },
    entries: [
      { name: "Named export", code: "export function sum(a, b) { return a + b; }", note: { en: "Export by name; import with { }.", es: "Exporta por nombre; importa con { }." } },
      { name: "Default export", code: "export default function App() { … }", note: { en: "One per module; import without { }.", es: "Uno por módulo; importa sin { }." } },
      { name: "Import", code: 'import { sum } from "./math.js";\nimport App from "./App.js";', note: { en: "Named in braces, default without.", es: "Nombrados entre llaves, default sin llaves." } },
      { name: "import()", code: 'const mod = await import("./math.js");', note: { en: "Lazy-load a module on demand.", es: "Carga un módulo bajo demanda." } },
    ],
  },
  {
    section: { en: "JSON", es: "JSON" },
    entries: [
      { name: "stringify", code: 'JSON.stringify({ a: 1 }) // \'{"a":1}\'', note: { en: "Object → JSON text.", es: "Objeto → texto JSON." } },
      { name: "parse", code: 'JSON.parse(\'{"a":1}\') // { a: 1 }', note: { en: "JSON text → object.", es: "Texto JSON → objeto." } },
      { name: "Safe parse", code: "try {\n  JSON.parse(text);\n} catch { /* invalid JSON */ }", note: { en: "parse throws on bad input.", es: "parse lanza error con entrada inválida." } },
      { name: "localStorage", code: 'localStorage.setItem("k", JSON.stringify(obj));\nJSON.parse(localStorage.getItem("k"));', note: { en: "Storage only holds strings.", es: "El storage solo guarda cadenas." } },
    ],
  },
];
