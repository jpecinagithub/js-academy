/**
 * Glossary entries. Expanded in Phase 5 — keep the same shape.
 * { term: {en, es}, def: {en, es}, example: code string, module: lesson id }
 */
export const GLOSSARY = [
  {
    term: { en: "Callback", es: "Callback" },
    def: {
      en: "A function passed as an argument to another function, to be executed later — when an event fires, a timer ends or data arrives.",
      es: "Una función que se pasa como argumento a otra función para ejecutarse más tarde — cuando ocurre un evento, termina un temporizador o llegan datos.",
    },
    example: `button.addEventListener("click", () => {
  console.log("clicked!");
});`,
    module: "callbacks",
  },
  {
    term: { en: "Closure", es: "Clausura (closure)" },
    def: {
      en: "A function that remembers the variables of the scope where it was created, even after that scope has finished executing.",
      es: "Una función que recuerda las variables del ámbito donde fue creada, incluso después de que ese ámbito haya terminado de ejecutarse.",
    },
    example: `function counter() {
  let count = 0;
  return () => ++count;
}`,
    module: "closures",
  },
  {
    term: { en: "Event Loop", es: "Event Loop" },
    def: {
      en: "The mechanism that lets JavaScript handle async work: it takes callbacks from the task/microtask queues and pushes them onto the call stack when it's empty.",
      es: "El mecanismo que permite a JavaScript gestionar trabajo asíncrono: toma callbacks de las colas de tareas/microtareas y los pone en la pila de llamadas cuando está vacía.",
    },
    example: `console.log("A");
setTimeout(() => console.log("B"), 0);
console.log("C"); // A, C, B`,
    module: "async",
  },
  {
    term: { en: "Promise", es: "Promesa" },
    def: {
      en: "An object representing a value that will be available in the future. States: pending → fulfilled or rejected.",
      es: "Un objeto que representa un valor que estará disponible en el futuro. Estados: pending → fulfilled o rejected.",
    },
    example: `fetch("/api").then(r => r.json());`,
    module: "promises",
  },
  {
    term: { en: "Scope", es: "Ámbito (scope)" },
    def: {
      en: "The region of code where a variable is visible and accessible. JavaScript has global, function and block scope.",
      es: "La región del código donde una variable es visible y accesible. JavaScript tiene ámbito global, de función y de bloque.",
    },
    example: `if (true) {
  const x = 1;
}
console.log(x); // ReferenceError`,
    module: "scope",
  },
  {
    term: { en: "Hoisting", es: "Hoisting" },
    def: {
      en: "Declarations are registered in memory before code runs, so functions and `var` can be referenced before their line — `let`/`const` live in the temporal dead zone until then.",
      es: "Las declaraciones se registran en memoria antes de ejecutar el código, por eso funciones y `var` se pueden referenciar antes de su línea — `let`/`const` viven en la zona muerta temporal hasta entonces.",
    },
    example: `console.log(a); // undefined
var a = 1;`,
    module: "variables",
  },
  {
    term: { en: "Prototype", es: "Prototipo" },
    def: {
      en: "An object that other objects inherit from. When you read obj.method and it is not on the object, JavaScript walks up the prototype chain until it finds it (or reaches null).",
      es: "Un objeto del que otros objetos heredan. Cuando lees obj.method y no está en el objeto, JavaScript sube por la cadena de prototipos hasta encontrarlo (o llegar a null).",
    },
    example: `const arr = [1, 2];
arr.__proto__ === Array.prototype; // true
Array.prototype.__proto__ === Object.prototype; // true`,
    module: "prototypes",
  },
  {
    term: { en: "Runtime", es: "Runtime" },
    def: {
      en: "The environment that executes your JavaScript: the engine (V8, SpiderMonkey…) plus the host APIs (DOM, timers, fetch) and the event loop.",
      es: "El entorno que ejecuta tu JavaScript: el motor (V8, SpiderMonkey…) más las APIs del anfitrión (DOM, temporizadores, fetch) y el event loop.",
    },
    example: `// engine: parses + runs JS
// host: setTimeout, document, fetch
setTimeout(() => console.log("host API"), 100);`,
    module: "runtime",
  },
  {
    term: { en: "Stack", es: "Pila (stack)" },
    def: {
      en: "The call stack: a last-in-first-out structure where JavaScript pushes a frame for every function call and pops it when the function returns. Too many nested calls cause a stack overflow.",
      es: "La pila de llamadas: una estructura LIFO donde JavaScript apila un marco por cada llamada a función y lo desapila al retornar. Demasiadas llamadas anidadas provocan un desbordamiento de pila.",
    },
    example: `function a() { b(); }
function b() { console.trace(); } // stack: b → a → (anonymous)
a();`,
    module: "runtime",
  },
  {
    term: { en: "Heap", es: "Montón (heap)" },
    def: {
      en: "The memory region where objects live. Variables hold references (pointers) to heap objects; assigning an object copies the reference, not the object itself.",
      es: "La región de memoria donde viven los objetos. Las variables guardan referencias (punteros) a objetos del heap; asignar un objeto copia la referencia, no el objeto.",
    },
    example: `const a = { x: 1 };
const b = a; // same object!
b.x = 2;
console.log(a.x); // 2`,
    module: "references",
  },
  {
    term: { en: "DOM", es: "DOM" },
    def: {
      en: "The Document Object Model: a tree of objects the browser builds from your HTML. JavaScript reads and changes the page by manipulating this tree.",
      es: "El Document Object Model: un árbol de objetos que el navegador construye a partir de tu HTML. JavaScript lee y cambia la página manipulando este árbol.",
    },
    example: `document.querySelector("h1").textContent = "Hello!";`,
    module: "dom",
  },
  {
    term: { en: "API", es: "API" },
    def: {
      en: "Application Programming Interface: a set of functions or endpoints another program offers you — like the DOM API in the browser, or a REST API you reach with fetch.",
      es: "Interfaz de Programación de Aplicaciones: un conjunto de funciones o endpoints que otro programa te ofrece — como la API del DOM en el navegador o una API REST a la que llegas con fetch.",
    },
    example: `// browser API        // web API
localStorage.setItem("k", "v");
const users = await (await fetch("/api/users")).json();`,
    module: "fetch",
  },
  {
    term: { en: "JSON", es: "JSON" },
    def: {
      en: "JavaScript Object Notation: a text format for structured data. APIs speak JSON, so you parse responses with JSON.parse and send bodies with JSON.stringify.",
      es: "JavaScript Object Notation: un formato de texto para datos estructurados. Las APIs hablan JSON, así que parseas respuestas con JSON.parse y envías cuerpos con JSON.stringify.",
    },
    example: `const text = '{"name":"Ada"}';
const obj = JSON.parse(text);
JSON.stringify(obj); // '{"name":"Ada"}'`,
    module: "fetch",
  },
  {
    term: { en: "Module", es: "Módulo" },
    def: {
      en: "A file that exports values and imports values from other files. Modules keep code organized: each file has its own scope and declares exactly what it shares.",
      es: "Un archivo que exporta valores e importa valores de otros archivos. Los módulos mantienen el código organizado: cada archivo tiene su propio ámbito y declara exactamente lo que comparte.",
    },
    example: `// math.js
export const PI = 3.14159;
// app.js
import { PI } from "./math.js";`,
    module: "modules",
  },
  {
    term: { en: "Event Bubbling", es: "Propagación de eventos (bubbling)" },
    def: {
      en: "When an event fires on an element, it travels up through its ancestors. This lets you put one listener on a parent and handle clicks from any child (event delegation).",
      es: "Cuando un evento se dispara en un elemento, viaja hacia arriba por sus ancestros. Esto permite poner un solo listener en el padre y gestionar clics de cualquier hijo (delegación de eventos).",
    },
    example: `ul.addEventListener("click", (e) => {
  // e.target = the <li> actually clicked
  console.log("bubbled from", e.target);
});`,
    module: "events",
  },
  {
    term: { en: "Destructuring", es: "Desestructuración" },
    def: {
      en: "A syntax that unpacks values from objects or arrays into variables in one line. It also works in function parameters.",
      es: "Una sintaxis que extrae valores de objetos o arrays a variables en una línea. También funciona en parámetros de funciones.",
    },
    example: `const { name, age } = user;
const [first, ...rest] = [1, 2, 3];
function greet({ name }) { return "Hi " + name; }`,
    module: "objects",
  },
  {
    term: { en: "Arrow Function", es: "Función flecha" },
    def: {
      en: "A compact function syntax: (a) => a + 1. Arrow functions have no own this, no arguments object and cannot be used as constructors.",
      es: "Una sintaxis compacta de función: (a) => a + 1. Las funciones flecha no tienen this propio, ni objeto arguments, y no pueden usarse como constructoras.",
    },
    example: `const double = (n) => n * 2;
[1, 2, 3].map((n) => n * 2); // [2, 4, 6]`,
    module: "functions",
  },
  {
    term: { en: "Async / Await", es: "Async / Await" },
    def: {
      en: "Syntax for writing asynchronous code that reads like synchronous code. await pauses an async function until a promise settles; the function itself always returns a promise.",
      es: "Sintaxis para escribir código asíncrono que se lee como síncrono. await pausa una función async hasta que una promesa se resuelva; la función siempre devuelve una promesa.",
    },
    example: `async function load() {
  const res = await fetch("/api/users");
  return res.json();
}`,
    module: "async-await",
  },
  {
    term: { en: "Method", es: "Método" },
    def: {
      en: "A function stored as a property of an object. When called as obj.method(), this refers to obj.",
      es: "Una función guardada como propiedad de un objeto. Cuando se llama como obj.method(), this se refiere a obj.",
    },
    example: `const user = {
  name: "Ada",
  greet() { return "Hi, " + this.name; },
};
user.greet(); // "Hi, Ada"`,
    module: "objects",
  },
  {
    term: { en: "Spread", es: "Spread (propagación)" },
    def: {
      en: "The ... syntax expands an array into individual elements or copies an object's properties. The same ... in parameters collects arguments (rest).",
      es: "La sintaxis ... expande un array en elementos individuales o copia las propiedades de un objeto. El mismo ... en parámetros recoge argumentos (rest).",
    },
    example: `const a = [1, 2];
const b = [...a, 3]; // [1, 2, 3]
const max = Math.max(...a); // 2`,
    module: "arrays",
  },
  {
    term: { en: "Template Literal", es: "Template literal" },
    def: {
      en: "A string written with backticks that can span lines and embed expressions with ${…}.",
      es: "Una cadena escrita con comillas invertidas que puede abarcar varias líneas e insertar expresiones con ${…}.",
    },
    example: `const name = "Ada";
const msg = \`Hello, \${name}!
You have \${2 + 3} messages.\`;`,
    module: "variables",
  },
  {
    term: { en: "IIFE", es: "IIFE" },
    def: {
      en: "Immediately Invoked Function Expression: a function defined and executed at once — (() => { … })(). It creates a private scope.",
      es: "Expresión de Función Invocada Inmediatamente: una función definida y ejecutada a la vez — (() => { … })(). Crea un ámbito privado.",
    },
    example: `(() => {
  const secret = 42; // not visible outside
  console.log("runs now!");
})();`,
    module: "functions",
  },
  {
    term: { en: "this", es: "this" },
    def: {
      en: "A keyword whose value depends on how a function is called: in a method it is the object before the dot; in a plain strict-mode call it is undefined; arrow functions inherit it from their scope.",
      es: "Una palabra clave cuyo valor depende de cómo se llama la función: en un método es el objeto antes del punto; en una llamada simple en modo estricto es undefined; las flechas lo heredan de su ámbito.",
    },
    example: `const obj = { n: 5, get() { return this.n; } };
obj.get(); // 5 — this is obj
const f = obj.get; f(); // TypeError — this is undefined`,
    module: "this",
  },
  {
    term: { en: "Truthy / Falsy", es: "Truthy / Falsy" },
    def: {
      en: "Every value is truthy or falsy in a boolean context. Falsy values are exactly: false, 0, -0, 0n, \"\", null, undefined and NaN — everything else is truthy.",
      es: "Todo valor es truthy o falsy en un contexto booleano. Los valores falsy son exactamente: false, 0, -0, 0n, \"\", null, undefined y NaN — todo lo demás es truthy.",
    },
    example: `if ("") { /* never runs */ }
if ([]) { /* runs! [] is truthy */ }`,
    module: "operators",
  },
];
