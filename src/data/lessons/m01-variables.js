// Sample lesson — Module 1: Variables & Data Types (full quality, EN+ES).
// Other modules follow this shape; see SCHEMA.md.

export default {
  id: "variables",
  module: 1,
  level: "beginner",
  title: { en: "Variables & Data Types", es: "Variables y tipos de datos" },
  tagline: {
    en: "Named boxes for values — and the eight kinds of values JavaScript understands.",
    es: "Cajas con nombre para valores — y los ocho tipos de valores que JavaScript entiende.",
  },
  sandbox: "variable-lab",
  sections: [
    {
      type: "concept",
      heading: { en: "What is a variable?", es: "¿Qué es una variable?" },
      body: {
        en: "A **variable** is a named slot in memory where you store a value so you can use it later. You **declare** it with `let`, `const` or `var`, give it a name, and optionally assign a value with `=`.\n\n- `let` — a box you can refill (reassignable).\n- `const` — a sealed box: the binding can't be reassigned.\n- `var` — the old way. Function-scoped, hoisted, and full of surprises. Prefer `let`/`const`.",
        es: "Una **variable** es un espacio con nombre en la memoria donde guardas un valor para usarlo después. La **declaras** con `let`, `const` o `var`, le das un nombre y opcionalmente le asignas un valor con `=`.\n\n- `let` — una caja que puedes rellenar de nuevo (reasignable).\n- `const` — una caja sellada: el enlace no se puede reasignar.\n- `var` — la forma antigua. Con ámbito de función, hoisting y sorpresas. Prefiere `let`/`const`.",
      },
    },
    {
      type: "visual",
      caption: {
        en: "A simplified view of memory after running the code above.",
        es: "Una vista simplificada de la memoria tras ejecutar el código anterior.",
      },
      diagram: `MEMORY

  ┌──────────┬─────────┐
  │   age    │   25    │
  ├──────────┼─────────┤
  │   name   │  "Jon"  │
  └──────────┴─────────┘

  age = 30;   →   the slot "age" now holds 30`,
    },
    {
      type: "code",
      heading: { en: "Try it: declare and reassign", es: "Pruébalo: declara y reasigna" },
      code: `let age = 25;
let name = "Jon";

console.log(age);
console.log(name);

age = 30; // refill the box
console.log(age);`,
      caption: {
        en: "Run it, then change the values and run again.",
        es: "Ejecútalo, cambia los valores y vuelve a ejecutar.",
      },
    },
    {
      type: "lab",
      lab: "variable-lab",
      heading: { en: "Variable Lab", es: "Laboratorio de variables" },
      body: {
        en: "Open the lab: execute code **line by line** and watch memory update in real time.",
        es: "Abre el laboratorio: ejecuta el código **línea a línea** y observa cómo se actualiza la memoria en tiempo real.",
      },
    },
    {
      type: "concept",
      heading: { en: "The 8 data types", es: "Los 8 tipos de datos" },
      body: {
        en: "JavaScript has **7 primitive types** (single, immutable values) and **objects**:\n\n- `string` — text: `\"hello\"`\n- `number` — any number: `42`, `3.14`\n- `boolean` — `true` / `false`\n- `undefined` — declared but no value yet\n- `null` — intentionally empty\n- `bigint` — huge integers: `9007199254740993n`\n- `symbol` — unique identifiers\n- `object` — collections: `{ name: \"Jon\" }`, `[1, 2]`, functions…\n\nUse `typeof` to ask JavaScript what something is.",
        es: "JavaScript tiene **7 tipos primitivos** (valores simples e inmutables) y **objetos**:\n\n- `string` — texto: `\"hola\"`\n- `number` — cualquier número: `42`, `3.14`\n- `boolean` — `true` / `false`\n- `undefined` — declarada pero sin valor aún\n- `null` — vacío intencionado\n- `bigint` — enteros enormes: `9007199254740993n`\n- `symbol` — identificadores únicos\n- `object` — colecciones: `{ name: \"Jon\" }`, `[1, 2]`, funciones…\n\nUsa `typeof` para preguntarle a JavaScript qué es algo.",
      },
    },
    {
      type: "code",
      code: `console.log(typeof "hello");   // string
console.log(typeof 42);        // number
console.log(typeof true);       // boolean
console.log(typeof undefined);  // undefined
console.log(typeof null);       // object (a famous bug!)
console.log(typeof 10n);        // bigint
console.log(typeof {});         // object`,
      caption: {
        en: "`typeof null` returning \"object\" is a bug from 1995 that can never be fixed — too much code depends on it.",
        es: "Que `typeof null` devuelva \"object\" es un bug de 1995 que nunca se podrá corregir — demasiado código depende de él.",
      },
    },
    {
      type: "mistake",
      wrong: `const age = 25;
age = 30; // TypeError: Assignment to constant variable.`,
      right: `let age = 25;
age = 30; // ✓ works — let allows reassignment`,
      explanation: {
        en: "`const` locks the **binding**, not the value. Use `const` by default and switch to `let` only when you know the variable must change. This one habit prevents a whole class of bugs.",
        es: "`const` bloquea el **enlace**, no el valor. Usa `const` por defecto y cambia a `let` solo cuando sepas que la variable debe cambiar. Este hábito evita toda una clase de errores.",
      },
    },
    {
      type: "takeaway",
      body: {
        en: "**Variables are named memory slots.** `const` by default, `let` when it must change, `var` almost never. Primitives hold values directly; `typeof` tells you which of the 8 types you're holding.",
        es: "**Las variables son espacios de memoria con nombre.** `const` por defecto, `let` cuando deba cambiar, `var` casi nunca. Los primitivos contienen valores directamente; `typeof` te dice cuál de los 8 tipos tienes entre manos.",
      },
    },
    {
      type: "underhood",
      title: { en: "Under the hood: primitives vs references", es: "Bajo el capó: primitivos vs referencias" },
      body: {
        en: "Primitives (`string`, `number`, …) are stored **by value**: copying a variable copies the value. Objects are stored **by reference**: copying a variable copies a pointer to the same object in the heap. Module 9 explores this with a full memory simulator.",
        es: "Los primitivos (`string`, `number`, …) se guardan **por valor**: copiar una variable copia el valor. Los objetos se guardan **por referencia**: copiar una variable copia un puntero al mismo objeto en el heap. El módulo 9 lo explora con un simulador de memoria completo.",
      },
    },
  ],
  quiz: [
    {
      q: { en: "What will this code output?", es: "¿Qué mostrará este código?" },
      code: `let a = 5;\nconst b = a;\na = 10;\nconsole.log(b);`,
      options: [{ en: "5", es: "5" }, { en: "10", es: "10" }, { en: "undefined", es: "undefined" }],
      answer: 0,
      explanation: {
        en: "`b` copied the **value** `5` at assignment time. Reassigning `a` later doesn't affect `b` — numbers are primitives, copied by value.",
        es: "`b` copió el **valor** `5` en el momento de la asignación. Reasignar `a` después no afecta a `b` — los números son primitivos y se copian por valor.",
      },
    },
    {
      q: { en: "What happens here?", es: "¿Qué ocurre aquí?" },
      code: `const name = "Ada";\nname = "Grace";`,
      options: [
        { en: 'name becomes "Grace"', es: 'name pasa a ser "Grace"' },
        { en: "TypeError: Assignment to constant variable", es: "TypeError: Assignment to constant variable" },
        { en: "Nothing, it is silently ignored", es: "Nada, se ignora en silencio" },
      ],
      answer: 1,
      explanation: {
        en: "`const` forbids rebinding. The engine throws a `TypeError` at runtime.",
        es: "`const` prohíbe reasignar el enlace. El motor lanza un `TypeError` en tiempo de ejecución.",
      },
    },
    {
      q: { en: "What is the value of `x` after this runs?", es: "¿Cuál es el valor de `x` tras ejecutar esto?" },
      code: `let x;\nconsole.log(typeof x);`,
      options: [
        { en: '"undefined" (and it prints)', es: '"undefined" (y se imprime)' },
        { en: '"null"', es: '"null"' },
        { en: "ReferenceError", es: "ReferenceError" },
      ],
      answer: 0,
      explanation: {
        en: "Declared but unassigned variables hold `undefined`. `typeof` safely returns the string `\"undefined\"`.",
        es: "Las variables declaradas pero sin asignar contienen `undefined`. `typeof` devuelve con seguridad la cadena `\"undefined\"`.",
      },
    },
    {
      q: { en: "Why does this print \"object\"?", es: "¿Por qué imprime \"object\"?" },
      code: `console.log(typeof null);`,
      options: [
        { en: "Because null is an object", es: "Porque null es un objeto" },
        { en: "A legacy bug from the first JavaScript implementation", es: "Un bug histórico de la primera implementación de JavaScript" },
        { en: "Because typeof is broken for all values", es: "Porque typeof falla con todos los valores" },
      ],
      answer: 1,
      explanation: {
        en: "In the original implementation, values were tagged with type bits and `null` shared the object tag (`0`). Fixing it would break the web, so it stays.",
        es: "En la implementación original los valores llevaban etiquetas de tipo y `null` compartía la etiqueta de objeto (`0`). Corregirlo rompería la web, así que se queda.",
      },
    },
  ],
};
