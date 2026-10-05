// Module 5 — Functions. See SCHEMA.md for the section contract.
export default {
  id: "functions",
  module: 5,
  level: "beginner",
  stub: false,
  title: { en: "Functions", es: "Funciones" },
  tagline: {
    en: "Declarations, arrows, parameters and return — visualized.",
    es: "Declaraciones, flechas, parámetros y return — visualizados.",
  },
  sections: [
    {
      type: "concept",
      heading: { en: "A reusable machine", es: "Una máquina reutilizable" },
      body: {
        en: `A **function** is a reusable machine that does one job. You feed values in, it hands a result back — and you can run it as many times as you want.

You write them three ways:

1. **Declaration** — \`function add(a, b) { return a + b; }\`
2. **Expression** — \`const add = function(a, b) { return a + b; };\`
3. **Arrow function** — \`const add = (a, b) => a + b;\`

The names in the definition — \`a\` and \`b\` — are **parameters**. The values you pass when you call it — \`add(4, 6)\` — are **arguments**. Think of parameters as parking spots, and arguments as the cars that park in them.

**\`return\`** decides what comes back out. No \`return\`, no value: the function just finishes and hands you \`undefined\`.`,
        es: `Una **función** es una máquina reutilizable que hace un trabajo. Le das valores de entrada, te devuelve un resultado, y puedes ejecutarla tantas veces como quieras.

Puedes escribirlas de tres maneras:

1. **Declaración** — \`function add(a, b) { return a + b; }\`
2. **Expresión** — \`const add = function(a, b) { return a + b; };\`
3. **Función flecha** — \`const add = (a, b) => a + b;\`

Los nombres en la definición — \`a\` y \`b\` — son **parámetros**. Los valores que pasas al llamarla — \`add(4, 6)\` — son **argumentos**. Piensa en los parámetros como plazas de aparcamiento, y en los argumentos como los coches que aparcan en ellas.

**\`return\`** decide lo que sale de vuelta. Sin \`return\` no hay valor: la función simplemente termina y te entrega \`undefined\`.`,
      },
    },
    {
      type: "visual",
      diagram: `add(4, 6)              <- the call: 4 and 6 are ARGUMENTS
      |
      v
function add(a, b)     <- a and b are PARAMETERS
      |
      +-- a --> 4      the value 4 flows into a
      +-- b --> 6      the value 6 flows into b
      |
      +-- return a + b --> 4 + 6 --> 10
      |
      v
console.log( 10 )      the caller receives 10`,
      caption: {
        en: "Calling a function: arguments flow into parameters, return carries the result back out.",
        es: "Llamar a una función: los argumentos entran en los parámetros, return devuelve el resultado.",
      },
    },
    {
      type: "code",
      heading: { en: "Declare it, then arrow it", es: "Declárala, luego en flecha" },
      code: `function add(a, b) {
  return a + b;
}
console.log("declaration:", add(4, 6));

// Same job, arrow style - return is implicit
const addArrow = (a, b) => a + b;
console.log("arrow:      ", addArrow(4, 6));`,
      caption: {
        en: "Both versions do the same thing. Arrows drop the braces and the word return for short bodies.",
        es: "Ambas versiones hacen lo mismo. Las flechas prescinden de las llaves y de la palabra return en cuerpos cortos.",
      },
    },
    {
      type: "lab",
      lab: "call-stack",
      heading: { en: "Watch calls stack up", es: "Mira cómo se apilan las llamadas" },
      body: {
        en: `Open the **Call Stack** lab and make functions call each other: \`greet()\` calls \`shout()\`, \`shout()\` calls \`loud()\`. Watch each frame pile on top of the last — and how every \`return\` peels one frame off. Nothing in JavaScript is truly "inside" another function while it waits: it is stacked.`,
        es: `Abre el laboratorio **Call Stack** y haz que las funciones se llamen entre sí: \`greet()\` llama a \`shout()\`, \`shout()\` llama a \`loud()\`. Observa cómo cada marco se apila sobre el anterior, y cómo cada \`return\` despega un marco. Nada en JavaScript queda realmente «dentro» de otra función mientras espera: se apila.`,
      },
    },
    {
      type: "code",
      heading: { en: "Functions feed each other — and travel as values", es: "Las funciones se alimentan entre sí — y viajan como valores" },
      code: `const double = n => n * 2;
const addOne = n => n + 1;

// The return of one call becomes the argument of the next
console.log(addOne(double(3))); // double(3) -> 6, then addOne(6) -> 7

// A function passed as a VALUE: map calls double once per element
console.log([1, 2, 3].map(double));`,
      caption: {
        en: "A return value can be the next call's argument. And functions themselves can be passed around — modules 12 and 13 build on this.",
        es: "Un valor de retorno puede ser el argumento de la siguiente llamada. Y las propias funciones pueden pasarse como valores — los módulos 12 y 13 se basan en esto.",
      },
    },
    {
      type: "mistake",
      wrong: `function add(a, b) {
  a + b; // computes 10... and throws it away
}
console.log(add(4, 6)); // undefined`,
      right: `function add(a, b) {
  return a + b; // hand the result back to the caller
}
console.log(add(4, 6)); // 10`,
      explanation: {
        en: `A function is a machine with an output tray. If you never put anything in the tray with **\`return\`**, the caller receives **\`undefined\`**. Computing a value is not the same as returning it — the result dies with the function unless you hand it back.`,
        es: `Una función es una máquina con una bandeja de salida. Si nunca pones nada en la bandeja con **\`return\`**, quien la llama recibe **\`undefined\`**. Calcular un valor no es lo mismo que devolverlo: el resultado muere con la función a menos que lo entregues.`,
      },
    },
    {
      type: "challenge-ref",
      challenge: "palindrome",
    },
    {
      type: "takeaway",
      body: {
        en: `Functions turn repetition into a single name you can call. **Parameters receive, arguments are given, return delivers.** The three forms — declaration, expression, arrow — are just three ways to build the same machine.`,
        es: `Las funciones convierten la repetición en un solo nombre que puedes invocar. **Los parámetros reciben, los argumentos se dan, return entrega.** Las tres formas — declaración, expresión, flecha — son solo tres maneras de construir la misma máquina.`,
      },
    },
    {
      type: "underhood",
      title: { en: "Why can declarations be called early?", es: "¿Por qué las declaraciones pueden llamarse antes?" },
      body: {
        en: `A **function declaration** is registered when its scope is created — before any line runs. That is why you can call it above the line where it is written (this is called *hoisting*). A \`const\` arrow function follows normal variable rules: the binding exists only after its line executes. Call it too early and you get a **ReferenceError**. Module 6 explores this in the Hoisting Lab.`,
        es: `Una **declaración de función** se registra cuando se crea su ámbito, antes de que se ejecute ninguna línea. Por eso puedes llamarla por encima de la línea donde está escrita (esto se llama *hoisting*). Una función flecha con \`const\` sigue las reglas normales de las variables: el enlace solo existe después de que se ejecute su línea. Si la llamas demasiado pronto obtienes un **ReferenceError**. El módulo 6 lo explora en el laboratorio de Hoisting.`,
      },
    },
  ],
  quiz: [
    {
      q: { en: "What will this code print?", es: "¿Qué mostrará este código?" },
      code: `function add(a, b) {
  a + b;
}
console.log(add(4, 6));`,
      options: [
        { en: "10", es: "10" },
        { en: "undefined", es: "undefined" },
        { en: "null", es: "null" },
        { en: "An error is thrown", es: "Se lanza un error" },
      ],
      answer: 1,
      explanation: {
        en: `The function computes \`a + b\` but never **returns** it. A function with no \`return\` hands back \`undefined\` — computing a value is not the same as delivering it.`,
        es: `La función calcula \`a + b\` pero nunca lo **devuelve**. Una función sin \`return\` entrega \`undefined\`: calcular un valor no es lo mismo que entregarlo.`,
      },
    },
    {
      q: { en: "In this code, which are the parameters and which are the arguments?", es: "En este código, ¿cuáles son los parámetros y cuáles los argumentos?" },
      code: `function greet(name) {
  console.log("Hi, " + name);
}
greet("Ana");`,
      options: [
        { en: "`name` is the parameter, `\"Ana\"` is the argument", es: "`name` es el parámetro, `\"Ana\"` es el argumento" },
        { en: "`\"Ana\"` is the parameter, `name` is the argument", es: "`\"Ana\"` es el parámetro, `name` es el argumento" },
        { en: "Both are parameters", es: "Ambos son parámetros" },
        { en: "Both are arguments", es: "Ambos son argumentos" },
      ],
      answer: 0,
      explanation: {
        en: `**Parameters** are the names listed in the definition (\`name\`) — the parking spots. **Arguments** are the values you hand over at the call site (\`"Ana"\`) — the cars.`,
        es: `Los **parámetros** son los nombres de la definición (\`name\`): las plazas de aparcamiento. Los **argumentos** son los valores que entregas al llamar (\`"Ana"\`): los coches.`,
      },
    },
    {
      q: { en: "What will this code print?", es: "¿Qué mostrará este código?" },
      code: `console.log(double(5));

function double(n) {
  return n * 2;
}`,
      options: [
        { en: "10", es: "10" },
        { en: "ReferenceError", es: "ReferenceError" },
        { en: "undefined", es: "undefined" },
        { en: "NaN", es: "NaN" },
      ],
      answer: 0,
      explanation: {
        en: `Function **declarations** are hoisted: fully registered before any line runs, so calling one early works. (A \`const\` arrow function on the same line would throw a ReferenceError — try swapping it and see.)`,
        es: `Las **declaraciones** de función tienen hoisting: quedan registradas por completo antes de que se ejecute ninguna línea, así que llamarlas antes funciona. (Una función flecha con \`const\` en la misma línea lanzaría un ReferenceError: prueba a cambiarla y verás.)`,
      },
    },
    {
      q: { en: "Which of these can be called on the line BEFORE it is defined?", es: "¿Cuál de estas puede llamarse en la línea ANTERIOR a su definición?" },
      code: `// option A:                    // option B:
function f() { ... }          const f = () => { ... };`,
      options: [
        { en: "Option A — the function declaration", es: "Opción A: la declaración de función" },
        { en: "Option B — the const arrow function", es: "Opción B: la función flecha con const" },
        { en: "Both", es: "Ambas" },
        { en: "Neither", es: "Ninguna" },
      ],
      answer: 0,
      explanation: {
        en: `Only declarations hoist. The \`const\` arrow follows normal variable rules: before its line runs, the binding does not exist yet, so calling it throws a ReferenceError.`,
        es: `Solo las declaraciones tienen hoisting. La flecha con \`const\` sigue las reglas normales de las variables: antes de que se ejecute su línea, el enlace aún no existe, así que llamarla lanza un ReferenceError.`,
      },
    },
  ],
  sandbox: "call-stack",
};
