// Module 6 — Scope. See SCHEMA.md for the section contract.
export default {
  id: "scope",
  module: 6,
  level: "intermediate",
  stub: false,
  title: { en: "Scope", es: "Ámbito" },
  tagline: {
    en: "Global, function and block scope — in an interactive explorer.",
    es: "Ámbitos global, de función y de bloque — en un explorador interactivo.",
  },
  sections: [
    {
      type: "concept",
      heading: { en: "Where can this variable be seen?", es: "¿Dónde se puede ver esta variable?" },
      body: {
        en: `**Scope** answers one question: from which lines of code is a variable visible? JavaScript has three scopes, nested like Russian dolls:

- **Global scope** — declared at the top level. Visible from *everywhere*.
- **Function scope** — declared inside a function with \`var\`, \`let\` or \`const\`. Visible only *inside that function*.
- **Block scope** — declared inside \`{ }\` with \`let\` or \`const\`. Visible only *inside those braces*. (\`var\` ignores blocks — see below.)

And one rule ties them together: **lexical scope**. A piece of code can see its own scope *plus every scope that contains it* — it looks outward, never inward. Code in a nested block can read a global; a global line can never read a variable trapped in a block.`,
        es: `El **ámbito** (scope) responde a una sola pregunta: ¿desde qué líneas de código es visible una variable? JavaScript tiene tres ámbitos, anidados como muñecas rusas:

- **Ámbito global** — declarado en el nivel superior. Visible desde *todas partes*.
- **Ámbito de función** — declarado dentro de una función con \`var\`, \`let\` o \`const\`. Visible solo *dentro de esa función*.
- **Ámbito de bloque** — declarado dentro de \`{ }\` con \`let\` o \`const\`. Visible solo *dentro de esas llaves*. (\`var\` ignora los bloques — ver más abajo.)

Y una regla los une a todos: el **ámbito léxico**. Un fragmento de código puede ver su propio ámbito *más todos los ámbitos que lo contienen*: mira hacia fuera, nunca hacia dentro. El código de un bloque anidado puede leer una variable global; una línea global jamás puede leer una variable atrapada en un bloque.`,
      },
    },
    {
      type: "visual",
      diagram: `GLOBAL SCOPE
|-- x
|
+-- FUNCTION test()
    |-- y
    |
    +-- BLOCK { }
        +-- z

x is visible in: GLOBAL, FUNCTION, BLOCK   (everywhere)
y is visible in: FUNCTION, BLOCK           (function and below)
z is visible in: BLOCK only                (nowhere else)`,
      caption: {
        en: "Inner scopes can reach outward. Outer code can never reach inward.",
        es: "Los ámbitos internos pueden alcanzar hacia fuera. El código exterior jamás puede alcanzar hacia dentro.",
      },
    },
    {
      type: "code",
      heading: { en: "Shadowing: the same name, two variables", es: "Sombreado (shadowing): el mismo nombre, dos variables" },
      code: `const name = "global Ana";

function greet() {
  const name = "function Ana"; // shadows the outer one
  console.log("inside: ", name);
}

greet();
console.log("outside:", name);`,
      caption: {
        en: "When a name exists in two scopes, the innermost one wins — the outer variable is *shadowed*, not overwritten.",
        es: "Cuando un nombre existe en dos ámbitos, gana el más interno: la variable exterior queda *sombreada*, no sobrescrita.",
      },
    },
    {
      type: "lab",
      lab: "scope-explorer",
      heading: { en: "Walk the scope tree", es: "Recorre el árbol de ámbitos" },
      body: {
        en: `Open the **Scope Explorer** and step through nested scopes line by line. At each stop, ask: *which variables can I see from here?* Watch the lookup walk outward — block, then function, then global. When you are ready for the strange case of \`var\` leaking out of blocks, open the **Hoisting Lab** next.`,
        es: `Abre el **Explorador de Ámbitos** y recorre los ámbitos anidados línea a línea. En cada parada, pregunta: *¿qué variables puedo ver desde aquí?* Observa cómo la búsqueda camina hacia fuera: bloque, función, global. Cuando quieras ver el extraño caso de \`var\` escapando de los bloques, abre después el **laboratorio de Hoisting**.`,
      },
    },
    {
      type: "code",
      heading: { en: "Why let and const exist: the var leak", es: "Por qué existen let y const: la fuga de var" },
      code: `if (true) {
  var leaked = "I escaped the block!";
  let contained = "I stayed inside.";
}

console.log("var:", leaked); // works - var ignores the block

try {
  console.log("let:", contained);
} catch (e) {
  console.log("let:", e.constructor.name, "- not visible outside the block");
}`,
      caption: {
        en: "`var` only respects function boundaries, so it leaks out of `if` blocks and loops. `let` and `const` respect every pair of braces — that is why modern code uses them.",
        es: "`var` solo respeta los límites de las funciones, así que se escapa de los bloques `if` y de los bucles. `let` y `const` respetan cada par de llaves: por eso el código moderno los usa.",
      },
    },
    {
      type: "mistake",
      wrong: `// oops - no let, no const
function setLevel() {
  level = 10; // accidental GLOBAL!
}
setLevel();
console.log(level); // 10 - it leaked into the global scope`,
      right: `function setLevel() {
  let level = 10; // stays inside the function
  return level;
}
console.log(setLevel()); // 10 - no leak, no global`,
      explanation: {
        en: `Assigning to a name you never declared creates an **accidental global** (in non-strict mode) — visible from everywhere, colliding with everything. It is one of the oldest sources of mystery bugs in JavaScript. Always declare with \`let\` or \`const\` before you assign.`,
        es: `Asignar un valor a un nombre que nunca declaraste crea una **variable global accidental** (en modo no estricto): visible desde todas partes y en conflicto con todo. Es una de las fuentes más antiguas de errores misteriosos en JavaScript. Declara siempre con \`let\` o \`const\` antes de asignar.`,
      },
    },
    {
      type: "takeaway",
      body: {
        en: `**Scope answers one question: where can I see this variable?** Global: everywhere. Function: inside that function. Block: inside those braces — unless it is \`var\`, which leaks. Inner scopes look outward through the lexical chain, never the other way around.`,
        es: `**El ámbito responde a una sola pregunta: ¿dónde puedo ver esta variable?** Global: en todas partes. De función: dentro de esa función. De bloque: dentro de esas llaves, salvo que sea \`var\`, que se escapa. Los ámbitos internos miran hacia fuera a través de la cadena léxica, nunca al revés.`,
      },
    },
    {
      type: "underhood",
      title: { en: "How the lookup actually works", es: "Cómo funciona realmente la búsqueda" },
      body: {
        en: `When JavaScript meets a name like \`total\`, it searches the current scope first. Not there? It walks one level out — to the enclosing function, then to the next one, all the way to the global scope. If nothing matches anywhere, you get a **ReferenceError**. This outward walk follows the *lexical* structure — where the code is written, not where it runs. That same lookup is how closures remember their birthplace — see module 18.`,
        es: `Cuando JavaScript encuentra un nombre como \`total\`, primero busca en el ámbito actual. ¿No está? Sube un nivel: a la función que lo contiene, luego a la siguiente, hasta el ámbito global. Si no hay coincidencia en ningún sitio, obtienes un **ReferenceError**. Esta búsqueda hacia fuera sigue la estructura *léxica*: dónde está escrito el código, no dónde se ejecuta. Esa misma búsqueda es la que permite a los closures recordar su lugar de nacimiento — ver el módulo 18.`,
      },
    },
  ],
  quiz: [
    {
      q: { en: "Can the line inside show() see the variable city?", es: "¿Puede la línea dentro de show() ver la variable city?" },
      code: `let city = "Madrid";

function show() {
  console.log(city);
}
show();`,
      options: [
        { en: "Yes — city is global, visible everywhere", es: "Sí: city es global, visible en todas partes" },
        { en: "No — functions cannot see outside", es: "No: las funciones no pueden ver hacia fuera" },
        { en: "Only if city is passed as an argument", es: "Solo si city se pasa como argumento" },
      ],
      answer: 0,
      explanation: {
        en: `\`city\` lives in the global scope, and the function sits *inside* it. Lexical scope means inner code sees everything outward — so \`show()\` reads \`city\` with no problem.`,
        es: `\`city\` vive en el ámbito global, y la función está *dentro* de él. El ámbito léxico hace que el código interno vea todo lo exterior, así que \`show()\` lee \`city\` sin problema.`,
      },
    },
    {
      q: { en: "What happens at the last line?", es: "¿Qué ocurre en la última línea?" },
      code: `function show() {
  let secret = "abc";
}
show();
console.log(secret);`,
      options: [
        { en: "ReferenceError — secret is trapped in the function", es: "ReferenceError: secret está atrapada en la función" },
        { en: "It prints \"abc\"", es: "Muestra \"abc\"" },
        { en: "It prints undefined", es: "Muestra undefined" },
      ],
      answer: 0,
      explanation: {
        en: `\`secret\` has function scope: it exists only inside \`show()\`. The outer line looks *inward*, which lexical scope never allows — so JavaScript throws a ReferenceError.`,
        es: `\`secret\` tiene ámbito de función: solo existe dentro de \`show()\`. La línea exterior mira *hacia dentro*, algo que el ámbito léxico jamás permite, así que JavaScript lanza un ReferenceError.`,
      },
    },
    {
      q: { en: "Can the last line see temp?", es: "¿Puede la última línea ver temp?" },
      code: `if (true) {
  let temp = 5;
}
console.log(temp);`,
      options: [
        { en: "No — let is trapped inside the block", es: "No: let queda atrapada dentro del bloque" },
        { en: "Yes — if blocks share their variables", es: "Sí: los bloques if comparten sus variables" },
        { en: "Yes — temp becomes global automatically", es: "Sí: temp se vuelve global automáticamente" },
      ],
      answer: 0,
      explanation: {
        en: `\`let\` (and \`const\`) have block scope: \`temp\` dies with the closing brace. This is exactly why modern code prefers them over \`var\`.`,
        es: `\`let\` (y \`const\`) tienen ámbito de bloque: \`temp\` muere con la llave de cierre. Por eso el código moderno las prefiere frente a \`var\`.`,
      },
    },
    {
      q: { en: "What does this print?", es: "¿Qué muestra esto?" },
      code: `if (true) {
  var temp = 5;
}
console.log(temp);`,
      options: [
        { en: "5 — var leaked out of the block", es: "5: var se escapó del bloque" },
        { en: "ReferenceError", es: "ReferenceError" },
        { en: "undefined", es: "undefined" },
      ],
      answer: 0,
      explanation: {
        en: `\`var\` ignores blocks — it only respects function boundaries. Since there is no function here, \`temp\` lands in the global scope and the last line sees it. Useful to know, dangerous to rely on.`,
        es: `\`var\` ignora los bloques: solo respeta los límites de las funciones. Como aquí no hay ninguna función, \`temp\` cae en el ámbito global y la última línea la ve. Útil saberlo, peligroso depender de ello.`,
      },
    },
  ],
  sandbox: "scope-explorer",
};
