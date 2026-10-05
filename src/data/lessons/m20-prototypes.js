export default {
  id: "prototypes",
  module: 20,
  level: "advanced",
  stub: false,
  title: { en: "Prototypes", es: "Prototipos" },
  tagline: {
    en: "Every object has a hidden chain of helpers. Follow it from your array to null.",
    es: "Todo objeto tiene una cadena oculta de ayudantes. Síguela desde tu array hasta null.",
  },
  sections: [
    {
      type: "concept",
      heading: { en: "Objects borrow from prototypes", es: "Los objetos toman prestado de los prototipos" },
      body: {
        en: `When you call \`arr.map(...)\`, JavaScript doesn't find \`map\` *on* the array. Instead it walks a hidden **prototype chain**: the array → \`Array.prototype\` (home of \`map\`, \`filter\`, \`push\`…) → \`Object.prototype\` (home of \`toString\`, \`hasOwnProperty\`…) → \`null\` (the end).

If the property is found anywhere along the chain, it's used **as if it were yours**. That's the whole trick: *inheritance in JavaScript is sharing via the chain*, not copying.`,
        es: `Cuando llamas a \`arr.map(...)\`, JavaScript no encuentra \`map\` *en* el array. En su lugar recorre una **cadena de prototipos** oculta: el array → \`Array.prototype\` (hogar de \`map\`, \`filter\`, \`push\`…) → \`Object.prototype\` (hogar de \`toString\`, \`hasOwnProperty\`…) → \`null\` (el final).

Si la propiedad se encuentra en algún punto de la cadena, se usa **como si fuera tuya**. Ese es todo el truco: *la herencia en JavaScript es compartir a través de la cadena*, no copiar.`,
      },
    },
    {
      type: "visual",
      diagram: `myArray ──▶ Array.prototype ──▶ Object.prototype ──▶ null
 (your      (map, filter,        (toString,
  data)      push, ...)           hasOwnProperty, ...)

lookup of arr.toString:  miss ──▶ miss ──▶ HIT ──▶ (stop)
lookup of arr.nope:      miss ──▶ miss ──▶ miss ──▶ null → undefined`,
      caption: {
        en: "Property lookup walks the chain to the right until it finds the property — or hits null.",
        es: "La búsqueda de una propiedad recorre la cadena hacia la derecha hasta encontrarla, o hasta llegar a null.",
      },
    },
    {
      type: "code",
      heading: { en: "Walking the chain", es: "Recorriendo la cadena" },
      code: `const arr = [];

console.log(arr.map === Array.prototype.map); // true!
console.log(Object.getPrototypeOf(arr) === Array.prototype); // true
console.log(Object.getPrototypeOf(Array.prototype) === Object.prototype); // true
console.log(Object.getPrototypeOf(Object.prototype)); // null — the end`,
      caption: {
        en: "map isn't ON your array — it's shared from Array.prototype. The chain ends at null.",
        es: "map no está EN tu array: se comparte desde Array.prototype. La cadena termina en null.",
      },
      body: {
        en: "`Object.getPrototypeOf(obj)` reveals the next link in the chain. Follow it and you walk the exact path JavaScript takes on every property lookup.",
        es: "`Object.getPrototypeOf(obj)` revela el siguiente eslabón de la cadena. Síguelo y recorrerás el camino exacto que JavaScript toma en cada búsqueda de propiedad.",
      },
    },
    {
      type: "lab",
      heading: { en: "Prototype Explorer", es: "Explorador de prototipos" },
      body: {
        en: "Open the Prototype Explorer: pick a property like `map`, `toString` or `length` and watch the lookup walk the chain link by link until it finds where each one lives.",
        es: "Abre el Explorador de prototipos: elige una propiedad como `map`, `toString` o `length` y observa cómo la búsqueda recorre la cadena eslabón a eslabón hasta encontrar dónde vive cada una.",
      },
      lab: "prototype-explorer",
    },
    {
      type: "code",
      heading: { en: "One shared method for all dogs", es: "Un método compartido para todos los perros" },
      code: `function Dog(name) { this.name = name; }

// ONE function object, shared by every dog:
Dog.prototype.bark = function () {
  return this.name + " says woof";
};

const a = new Dog("Rex");
const b = new Dog("Luna");
console.log(a.bark()); // "Rex says woof"
console.log(b.bark()); // "Luna says woof"
console.log(a.bark === b.bark); // true — same function!`,
      caption: {
        en: "Methods on the prototype are shared, not copied — that's why prototypes are memory-efficient.",
        es: "Los métodos del prototipo se comparten, no se copian: por eso los prototipos ahorran memoria.",
      },
      body: {
        en: "`new Dog(\"Rex\")` creates an object whose chain points at `Dog.prototype`. When you call `a.bark()`, JavaScript finds `bark` on the prototype — and calls it with `this === a`, so each dog still barks its own name.",
        es: "`new Dog(\"Rex\")` crea un objeto cuya cadena apunta a `Dog.prototype`. Cuando llamas a `a.bark()`, JavaScript encuentra `bark` en el prototipo y lo llama con `this === a`, así que cada perro sigue ladrando con su propio nombre.",
      },
    },
    {
      type: "mistake",
      wrong: `const obj = {};
obj.__proto__ = { secret: 1 }; // works... but it's slow and discouraged
console.log([].prototype);     // undefined — instances don't HAVE .prototype!`,
      right: `const obj = Object.create({ secret: 1 }); // clean way to set a prototype

function Dog() {}
console.log(typeof Dog.prototype); // "object" — only FUNCTIONS have .prototype`,
      explanation: {
        en: "Two confusions in one: `__proto__` is a legacy setter — it works, but it's slow and confusing; prefer `Object.create()`, `Object.getPrototypeOf()` and `Object.setPrototypeOf()`. And `.prototype` lives on **constructor functions** (`Dog.prototype`), not on instances: objects link to their prototype through an internal slot you inspect with `Object.getPrototypeOf()`.",
        es: "Dos confusiones en una: `__proto__` es un asignador heredado del pasado — funciona, pero es lento y confuso; prefiere `Object.create()`, `Object.getPrototypeOf()` y `Object.setPrototypeOf()`. Y `.prototype` vive en las **funciones constructoras** (`Dog.prototype`), no en las instancias: los objetos se enlazan a su prototipo mediante una ranura interna que se inspecciona con `Object.getPrototypeOf()`.",
      },
    },
    {
      type: "takeaway",
      body: {
        en: "Every object delegates to a prototype chain ending in `null`. Methods like `map` aren't on your array — they're borrowed from `Array.prototype`. Share behavior via the prototype; keep data on the instance.",
        es: "Todo objeto delega en una cadena de prototipos que termina en `null`. Métodos como `map` no están en tu array: se toman prestados de `Array.prototype`. Comparte el comportamiento vía el prototipo; guarda los datos en la instancia.",
      },
    },
    {
      type: "underhood",
      title: { en: "Classes are sugar over this", es: "Las clases son azúcar sobre esto" },
      body: {
        en: "Everything `class` does is prototype mechanics with nicer syntax: `class Dog { bark() {} }` puts `bark` on `Dog.prototype` exactly like the manual version above, and `extends` links the prototype chains together. There is no separate “class system” in JavaScript — it's prototypes all the way down. (Module 21 builds on exactly this.)",
        es: "Todo lo que hace `class` es mecánica de prototipos con una sintaxis más bonita: `class Dog { bark() {} }` coloca `bark` en `Dog.prototype` exactamente igual que la versión manual de arriba, y `extends` enlaza las cadenas de prototipos entre sí. No hay un «sistema de clases» separado en JavaScript: son prototipos hasta el fondo. (El módulo 21 se apoya exactamente en esto.)",
      },
    },
  ],
  quiz: [
    {
      q: { en: "What will this code output?", es: "¿Qué mostrará este código?" },
      code: `const arr = [];
console.log(arr.hasOwnProperty("map"));`,
      options: [
        { en: "true", es: "true" },
        { en: "false", es: "false" },
        { en: "It throws an error", es: "Lanza un error" },
        { en: "undefined", es: "undefined" },
      ],
      answer: 1,
      explanation: {
        en: "`map` is **not an own property** of the array — it lives on `Array.prototype`. That's exactly why `arr.map()` works (chain lookup finds it) while `hasOwnProperty(\"map\")` is `false`.",
        es: "`map` **no es una propiedad propia** del array: vive en `Array.prototype`. Por eso `arr.map()` funciona (la búsqueda en la cadena lo encuentra) mientras que `hasOwnProperty(\"map\")` es `false`.",
      },
    },
    {
      q: { en: "What ends every prototype chain?", es: "¿Qué termina toda cadena de prototipos?" },
      options: [
        { en: "Object", es: "Object" },
        { en: "null", es: "null" },
        { en: "undefined", es: "undefined" },
        { en: "Array.prototype", es: "Array.prototype" },
      ],
      answer: 1,
      explanation: {
        en: "`Object.getPrototypeOf(Object.prototype) === null`. When a lookup reaches `null` without finding the property, the result is `undefined`.",
        es: "`Object.getPrototypeOf(Object.prototype) === null`. Cuando una búsqueda llega a `null` sin encontrar la propiedad, el resultado es `undefined`.",
      },
    },
    {
      q: { en: "What will this code output?", es: "¿Qué mostrará este código?" },
      code: `console.log({}.hasOwnProperty === Object.prototype.hasOwnProperty);`,
      options: [
        { en: "true", es: "true" },
        { en: "false", es: "false" },
        { en: "It throws an error", es: "Lanza un error" },
        { en: "undefined", es: "undefined" },
      ],
      answer: 0,
      explanation: {
        en: "Plain objects delegate to `Object.prototype`, which is where `hasOwnProperty` lives — so `{}.hasOwnProperty` **is** that exact function. Nothing is copied; it's shared through the chain.",
        es: "Los objetos simples delegan en `Object.prototype`, que es donde vive `hasOwnProperty`: así que `{}.hasOwnProperty` **es** exactamente esa función. Nada se copia; se comparte a través de la cadena.",
      },
    },
    {
      q: { en: "What will this code output?", es: "¿Qué mostrará este código?" },
      code: `function Dog(name) { this.name = name; }
Dog.prototype.bark = function () { return "woof"; };
const a = new Dog("Rex");
const b = new Dog("Luna");
console.log(a.bark === b.bark);`,
      options: [
        { en: "true", es: "true" },
        { en: "false", es: "false" },
        { en: "It throws an error", es: "Lanza un error" },
        { en: "undefined", es: "undefined" },
      ],
      answer: 0,
      explanation: {
        en: "There is **one** function object sitting on `Dog.prototype`, and both instances find it through the chain — so `a.bark` and `b.bark` are the very same function. Shared behavior, per-instance data.",
        es: "Hay **un único** objeto función en `Dog.prototype`, y ambas instancias lo encuentran a través de la cadena: `a.bark` y `b.bark` son la misma función. Comportamiento compartido, datos por instancia.",
      },
    },
  ],
  sandbox: "prototype-explorer",
};
