// Module 22: Modules — export/import, named vs default, the dependency graph.
export default {
  id: "modules",
  module: 22,
  level: "intermediate",
  stub: false,
  title: { en: "Modules", es: "Módulos" },
  tagline: {
    en: "Split code into files with their own scope: export, import, and the graph that holds your app together.",
    es: "Divide el código en archivos con su propio ámbito: export, import y el grafo que mantiene unida tu app.",
  },
  sandbox: "module-graph",
  sections: [
    {
      type: "concept",
      heading: { en: "One file, one scope", es: "Un archivo, un ámbito" },
      body: {
        en: `Before modules, every \`<script>\` tag shared one giant global scope — libraries stepped on each other's variable names constantly. A **module** is simply a file with **its own scope**: nothing inside it leaks out unless you explicitly **export** it, and nothing comes in unless you **import** it.

\`\`\`
// math.js — a module
export function add(a, b) { return a + b; }
export const PI = 3.14159;
\`\`\`

\`\`\`
// app.js — another module
import { add, PI } from "./math.js";

console.log(add(2, 3)); // 5
console.log(PI);        // 3.14159
\`\`\`

> **Honest note:** the listings above are *not runnable* in the sandbox on this page — real \`import\`/\`export\` needs separate files, and the sandbox runs a single snippet. Read them as a two-file project.`,
        es: `Antes de los módulos, cada etiqueta \`<script>\` compartía un único ámbito global gigante — las librerías se pisaban los nombres de variable constantemente. Un **módulo** es simplemente un archivo con **su propio ámbito**: nada de lo que hay dentro sale fuera a menos que lo **exportes** explícitamente, y nada entra a menos que lo **importes**.

\`\`\`
// math.js — un módulo
export function add(a, b) { return a + b; }
export const PI = 3.14159;
\`\`\`

\`\`\`
// app.js — otro módulo
import { add, PI } from "./math.js";

console.log(add(2, 3)); // 5
console.log(PI);        // 3.14159
\`\`\`

> **Nota honesta:** los listados de arriba *no son ejecutables* en el sandbox de esta página — un \`import\`/\`export\` real necesita archivos separados, y el sandbox ejecuta un único fragmento. Léelos como un proyecto de dos archivos.`,
      },
    },
    {
      type: "concept",
      heading: { en: "Named exports vs default export", es: "Exports con nombre vs export por defecto" },
      body: {
        en: `There are two flavors, and the import syntax must match the export flavor:

\`\`\`
// math.js
export function add(a, b) { return a + b; }  // NAMED export
export function sub(a, b) { return a - b; }  // NAMED export (as many as you want)
export default function calc() { ... }       // DEFAULT export (only ONE per module)
\`\`\`

\`\`\`
// app.js
import calc from "./math.js";          // default: NO braces, any name you like
import { add, sub } from "./math.js";  // named: braces, names must match exactly
import calc2, { add as plus } from "./math.js"; // both at once (renaming with 'as')
\`\`\`

- **Named exports** — zero or more per module. Import with \`{ braces }\` and the exact exported name (or rename with \`as\`).
- **Default export** — at most **one** per module. Import *without* braces, and you may call it whatever you want: \`import whatever from "./math.js"\` works.`,
        es: `Hay dos sabores, y la sintaxis de importación debe coincidir con el sabor de exportación:

\`\`\`
// math.js
export function add(a, b) { return a + b; }  // export CON NOMBRE
export function sub(a, b) { return a - b; }  // CON NOMBRE (tantos como quieras)
export default function calc() { ... }       // POR DEFECTO (solo UNO por módulo)
\`\`\`

\`\`\`
// app.js
import calc from "./math.js";          // por defecto: SIN llaves, el nombre que quieras
import { add, sub } from "./math.js";  // con nombre: con llaves, nombres exactos
import calc2, { add as plus } from "./math.js"; // ambos a la vez (renombrar con 'as')
\`\`\`

- **Exports con nombre** — cero o más por módulo. Se importan con \`{ llaves }\` y el nombre exportado exacto (o se renombran con \`as\`).
- **Export por defecto** — como máximo **uno** por módulo. Se importa *sin* llaves y puedes llamarlo como quieras: \`import loquesea from "./math.js"\` funciona.`,
      },
    },
    {
      type: "visual",
      caption: {
        en: "Imports form a dependency graph. The engine walks it bottom-up: dependencies are evaluated before the files that import them.",
        es: "Los imports forman un grafo de dependencias. El motor lo recorre de abajo arriba: las dependencias se evalúan antes que los archivos que las importan.",
      },
      diagram: `THE DEPENDENCY GRAPH              EVALUATION ORDER

        app.js                         3. app.js      (uses add)
          │                              ▲
     import { add }                      │
          ▼                              │
        math.js                        2. math.js     (uses clamp)
          │                              ▲
    import { clamp }                     │
          ▼                              │
        utils.js                       1. utils.js    (no imports)

  • Each module is evaluated ONCE, even if imported by many files.
  • Cycles are allowed but fragile — keep the graph a tree when you can.`,
    },
    {
      type: "lab",
      lab: "module-graph",
      heading: { en: "Module Graph Lab", es: "Laboratorio del grafo de módulos" },
      body: {
        en: "Open the lab and drag files into an import graph: add an edge from `app.js` to `math.js`, then from `math.js` to `utils.js`. Watch the engine compute the evaluation order — and see what breaks when you create a cycle.",
        es: "Abre el laboratorio y arrastra archivos para formar un grafo de imports: añade una arista de `app.js` a `math.js` y luego de `math.js` a `utils.js`. Observa cómo el motor calcula el orden de evaluación — y mira qué se rompe cuando creas un ciclo.",
      },
    },
    {
      type: "concept",
      heading: { en: "How the browser loads modules", es: "Cómo carga el navegador los módulos" },
      body: {
        en: "In the browser you opt in with `<script type=\"module\">`:\n\n```\n<script type=\"module\" src=\"./app.js\"></script>\n```\n\nThree things change compared to classic scripts:\n\n1. **Deferred by default** — modules wait for the HTML to parse, like `defer`.\n2. **Strict mode always** — no sloppy-mode surprises, whether you asked for it or not.\n3. **One evaluation** — a module's top-level code runs exactly once per page, no matter how many files import it. Its exports are *live bindings*: if the exporter later changes a value, importers see the update.",
        es: "En el navegador activas los módulos con `<script type=\"module\">`:\n\n```\n<script type=\"module\" src=\"./app.js\"></script>\n```\n\nTres cosas cambian respecto a los scripts clásicos:\n\n1. **Diferidos por defecto** — los módulos esperan a que se analice el HTML, como con `defer`.\n2. **Modo estricto siempre** — sin sorpresas del modo permisivo, lo pidas o no.\n3. **Una sola evaluación** — el código de nivel superior de un módulo se ejecuta exactamente una vez por página, sin importar cuántos archivos lo importen. Sus exports son *enlaces vivos*: si el exportador cambia un valor después, los importadores ven la actualización.",
      },
    },
    {
      type: "mistake",
      wrong: `// math.js
export default function add(a, b) { return a + b; }

// app.js
import { add } from "./math.js"; // SyntaxError!`,
      right: `// math.js
export default function add(a, b) { return a + b; }

// app.js
import add from "./math.js";     // ✓ default import: no braces`,
      explanation: {
        en: "The braces are not decoration — they select the **flavor**. `{ add }` asks for a *named* export called `add`; without braces you get the *default* export. Mixing them up is the most common module error, and the engine reports it as a `SyntaxError` before any code runs.",
        es: "Las llaves no son decoración — seleccionan el **sabor**. `{ add }` pide un export *con nombre* llamado `add`; sin llaves obtienes el export *por defecto*. Confundirlos es el error de módulos más común, y el motor lo reporta como `SyntaxError` antes de que se ejecute nada.",
      },
    },
    {
      type: "takeaway",
      body: {
        en: "**Modules are files with their own scope.** `export` shares, `import` receives. Named exports use `{ braces }` and exact names; there is at most one `default` export per module, imported without braces. Imports form a graph the engine evaluates bottom-up, exactly once.",
        es: "**Los módulos son archivos con su propio ámbito.** `export` comparte, `import` recibe. Los exports con nombre usan `{ llaves }` y nombres exactos; hay como máximo un export `default` por módulo, que se importa sin llaves. Los imports forman un grafo que el motor evalúa de abajo arriba, exactamente una vez.",
      },
    },
    {
      type: "underhood",
      title: { en: "Under the hood: live bindings", es: "Bajo el capó: enlaces vivos" },
      body: {
        en: "An import is not a copy — it's a **live read-only view** of the exporter's variable. If `math.js` does `export let total = 0;` and later a function inside `math.js` increments it, every module that imported `{ total }` sees the new value. You can't reassign an imported binding from the outside (`total = 5` in the importer is a `TypeError`), but you always read the current value. This is how circular imports can work at all — each side sees the other's bindings once they're initialized.",
        es: "Un import no es una copia — es una **vista viva de solo lectura** de la variable del exportador. Si `math.js` hace `export let total = 0;` y luego una función dentro de `math.js` lo incrementa, cada módulo que importó `{ total }` ve el nuevo valor. No puedes reasignar un enlace importado desde fuera (`total = 5` en el importador es un `TypeError`), pero siempre lees el valor actual. Así es como los imports circulares pueden funcionar — cada lado ve los enlaces del otro una vez inicializados.",
      },
    },
  ],
  quiz: [
    {
      q: { en: "Which import matches this export?", es: "¿Qué import coincide con este export?" },
      code: `// utils.js\nexport default function format(date) { /* ... */ }`,
      options: [
        { en: 'import format from "./utils.js"', es: 'import format from "./utils.js"' },
        { en: 'import { format } from "./utils.js"', es: 'import { format } from "./utils.js"' },
        { en: 'import default from "./utils.js"', es: 'import default from "./utils.js"' },
      ],
      answer: 0,
      explanation: {
        en: "`export default` pairs with a braceless import: `import format from ...`. The braces version would look for a *named* export called `format`, which doesn't exist.",
        es: "`export default` se empareja con un import sin llaves: `import format from ...`. La versión con llaves buscaría un export *con nombre* llamado `format`, que no existe.",
      },
    },
    {
      q: { en: "Which import matches these exports?", es: "¿Qué import coincide con estos exports?" },
      code: `// math.js\nexport const PI = 3.14;\nexport function add(a, b) { return a + b; }`,
      options: [
        { en: 'import math from "./math.js"', es: 'import math from "./math.js"' },
        { en: 'import { PI, add } from "./math.js"', es: 'import { PI, add } from "./math.js"' },
        { en: 'import { default as PI } from "./math.js"', es: 'import { default as PI } from "./math.js"' },
      ],
      answer: 1,
      explanation: {
        en: "These are **named** exports, so the import needs `{ braces }` with the exact exported names. There is no default export here, so the braceless form would fail.",
        es: "Son exports **con nombre**, así que el import necesita `{ llaves }` con los nombres exportados exactos. Aquí no hay export por defecto, así que la forma sin llaves fallaría.",
      },
    },
    {
      q: { en: "How many default exports can one module have?", es: "¿Cuántos exports por defecto puede tener un módulo?" },
      options: [{ en: "At most one", es: "Como máximo uno" }, { en: "As many as you want", es: "Tantos como quieras" }, { en: "None — default exports don't exist", es: "Ninguno — no existen" }],
      answer: 0,
      explanation: {
        en: "One module, one default. That's what makes `import anything from ...` unambiguous — there is exactly one default thing to grab.",
        es: "Un módulo, un default. Eso es lo que hace que `import loquesea from ...` no sea ambiguo — hay exactamente una cosa por defecto que tomar.",
      },
    },
    {
      q: { en: "What happens if you import a name that was never exported?", es: "¿Qué ocurre si importas un nombre que nunca se exportó?" },
      code: `// math.js\nexport const PI = 3.14;\n\n// app.js\nimport { TAU } from "./math.js";`,
      options: [
        { en: "TAU is undefined at runtime", es: "TAU es undefined en tiempo de ejecución" },
        { en: "SyntaxError before any code runs", es: "SyntaxError antes de que se ejecute nada" },
        { en: "It silently imports PI instead", es: "Importa PI en silencio en su lugar" },
      ],
      answer: 1,
      explanation: {
        en: "Imports are resolved **statically**, when the module graph is linked — before execution. A missing export is a `SyntaxError` at load time, not a runtime `undefined`.",
        es: "Los imports se resuelven de forma **estática**, cuando se enlaza el grafo de módulos — antes de la ejecución. Un export ausente es un `SyntaxError` al cargar, no un `undefined` en tiempo de ejecución.",
      },
    },
  ],
};
