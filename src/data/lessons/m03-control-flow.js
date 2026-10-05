export default {
  id: "control-flow",
  module: 3,
  level: "beginner",
  stub: false,
  title: { en: "Control Flow", es: "Flujo de control" },
  tagline: {
    en: "if / else / switch with a decision-flow visualizer.",
    es: "if / else / switch con un visualizador de flujo de decisiones.",
  },
  sections: [
    {
      type: "concept",
      heading: {
        en: "Programs that make decisions",
        es: "Programas que toman decisiones",
      },
      body: {
        en: "So far your programs run top to bottom, every line, every time. **Control flow** breaks that straight line: it lets the program *choose* which lines to run based on a condition.\n\n## if / else if / else\n\n```\nif (condition) {\n  // runs when the condition is true\n} else if (otherCondition) {\n  // runs when the first failed but this one is true\n} else {\n  // runs when nothing above was true\n}\n```\n\nThe conditions are checked **in order**, and only the **first** true branch runs. Once a branch runs, the rest are skipped.\n\n## Truthy and falsy\n\nThe condition does not have to be literally `true`. JavaScript converts any value to a boolean for the test. Most values are **truthy**, but a famous gang of seven is **falsy**:\n\n- `false`, `0`, `-0`, `0n`, `\"\"` (empty string), `null`, `undefined`, `NaN`\n\nEverything else — including `\"0\"`, `\"false\"`, `[]` and `{}` — is truthy. Yes, an empty array is truthy. This surprises everyone exactly once.\n\n## switch\n\nWhen one value has many possible cases, `switch` reads cleaner than a long `else if` chain. Each `case` is compared against the value, and `break` stops the fall-through to the next case. `default` catches everything else — like the final `else`.",
        es: "Hasta ahora tus programas se ejecutan de arriba abajo, línea a línea, siempre. El **flujo de control** rompe esa línea recta: permite que el programa *elija* qué líneas ejecutar según una condición.\n\n## if / else if / else\n\n```\nif (condition) {\n  // se ejecuta cuando la condición es verdadera\n} else if (otherCondition) {\n  // se ejecuta si la primera falló pero esta es verdadera\n} else {\n  // se ejecuta cuando nada de lo anterior fue verdad\n}\n```\n\nLas condiciones se comprueban **en orden** y solo se ejecuta la **primera** rama verdadera. Cuando una rama se ejecuta, el resto se omite.\n\n## Verdadero y falso (truthy / falsy)\n\nLa condición no tiene que ser literalmente `true`. JavaScript convierte cualquier valor a booleano para la prueba. La mayoría de valores son **verdaderos** (truthy), pero una famosa pandilla de siete es **falsa** (falsy):\n\n- `false`, `0`, `-0`, `0n`, `\"\"` (texto vacío), `null`, `undefined`, `NaN`\n\nTodo lo demás —incluidos `\"0\"`, `\"false\"`, `[]` y `{}`— es verdadero. Sí, un array vacío es verdadero. Esto sorprende a todo el mundo exactamente una vez.\n\n## switch\n\nCuando un valor tiene muchos casos posibles, `switch` se lee mejor que una larga cadena de `else if`. Cada `case` se compara con el valor y `break` detiene la caída al siguiente caso. `default` atrapa todo lo demás, como el `else` final.",
      },
    },
    {
      type: "visual",
      diagram: [
        "            age >= 18 ?",
        "           /           \\",
        "        TRUE           FALSE",
        "         ↓               ↓",
        '      "Adult"         "Minor"',
        "",
        "      Only ONE branch runs.",
      ].join("\n"),
      caption: {
        en: "A condition is a fork in the road: the program evaluates it, picks the true path, and skips the other.",
        es: "Una condición es una bifurcación: el programa la evalúa, elige el camino verdadero y se salta el otro.",
      },
    },
    {
      type: "code",
      heading: {
        en: "The age checker",
        es: "El comprobador de edad",
      },
      code: [
        "const age = 20;   // 👉 change this number and run again",
        "",
        "if (age >= 18) {",
        '  console.log("Adult — welcome!");',
        "} else if (age >= 13) {",
        '  console.log("Teenager — almost there.");',
        "} else {",
        '  console.log("Minor — come back later!");',
        "}",
      ].join("\n"),
      caption: {
        en: "Try 15, then 8: watch a different branch win each time. Only one ever runs.",
        es: "Prueba con 15 y luego con 8: observa cómo gana una rama distinta cada vez. Solo una se ejecuta.",
      },
    },
    {
      type: "lab",
      lab: "decision-flow",
      heading: {
        en: "Drive the decision yourself",
        es: "Toma la decisión tú mismo",
      },
      body: {
        en: "Open the decision-flow lab and drag the slider: the condition re-evaluates live and the winning branch lights up. Feel how `if`, `else if` and `else` divide the number line into territories.",
        es: "Abre el laboratorio de flujo de decisiones y mueve el deslizador: la condición se reevalúa en directo y la rama ganadora se ilumina. Siente cómo `if`, `else if` y `else` dividen la recta numérica en territorios.",
      },
    },
    {
      type: "code",
      heading: {
        en: "switch: one value, many cases",
        es: "switch: un valor, muchos casos",
      },
      code: [
        "const day = 3;   // 1 = Monday … 7 = Sunday — 👉 try 6",
        "",
        "switch (day) {",
        '  case 1: console.log("Monday"); break;',
        '  case 2: console.log("Tuesday"); break;',
        '  case 3: console.log("Wednesday"); break;',
        '  default: console.log("Some other day");',
        "}",
      ].join("\n"),
      caption: {
        en: "Each `case` is checked against `day`. Without `break`, execution would fall through into the next case!",
        es: "Cada `case` se compara con `day`. Sin `break`, la ejecución caería al siguiente caso.",
      },
    },
    {
      type: "mistake",
      wrong: [
        "const x = 1;",
        "if (x = 5) {            // ❌ assigns 5 to x!",
        '  console.log("x is five");',
        "}",
        "// Prints — but x was 1, not 5.",
      ].join("\n"),
      right: [
        "const x = 1;",
        "if (x === 5) {          // ✅ compares — branch is skipped",
        '  console.log("x is five");',
        "}",
        "// Prints nothing. Correct!",
      ].join("\n"),
      explanation: {
        en: "Inside a condition, a single `=` **assigns** instead of comparing. `x = 5` puts `5` into `x`, and since `5` is truthy, the branch always runs — with `x` silently changed as a side effect. This is the same `=` vs `===` trap from the operators module, wearing a new disguise.",
        es: "Dentro de una condición, un solo `=` **asigna** en lugar de comparar. `x = 5` mete `5` en `x`, y como `5` es verdadero, la rama siempre se ejecuta, con `x` cambiado en silencio como efecto secundario. Es la misma trampa de `=` frente a `===` del módulo de operadores, con un disfraz nuevo.",
      },
    },
    {
      type: "takeaway",
      body: {
        en: "**Conditions fork your program**: `if` / `else if` / `else` pick the first true branch; `switch` matches one value against many cases (don't forget `break`). Any value can be a condition — just remember the falsy seven: `false`, `0`, `\"\"`, `null`, `undefined`, `NaN` (and friends).",
        es: "**Las condiciones bifurcan tu programa**: `if` / `else if` / `else` eligen la primera rama verdadera; `switch` compara un valor con muchos casos (no olvides `break`). Cualquier valor puede ser una condición: recuerda solo a los siete falsos: `false`, `0`, `\"\"`, `null`, `undefined`, `NaN` (y amigos).",
      },
    },
    {
      type: "underhood",
      title: {
        en: "switch uses strict comparison",
        es: "switch usa comparación estricta",
      },
      body: {
        en: "Under the hood, `switch` compares with the **strict** algorithm — the same as `===`. So `case \"3\"` will *not* match the number `3`. This is usually what you want, but it bites when the value comes from user input (which is always a string) and the cases are numbers. Convert first, switch second.",
        es: "Por dentro, `switch` compara con el algoritmo **estricto**, igual que `===`. Así que `case \"3\"` *no* coincidirá con el número `3`. Normalmente es lo que quieres, pero muerde cuando el valor viene de la entrada del usuario (que siempre es texto) y los casos son números. Convierte primero, usa `switch` después.",
      },
    },
  ],
  quiz: [
    {
      q: {
        en: "What will this code output?",
        es: "¿Qué mostrará este código?",
      },
      code: ["const x = 0;", "if (x) {", '  console.log("yes");', "} else {", '  console.log("no");', "}"].join("\n"),
      options: [
        { en: '"yes"', es: '"yes"' },
        { en: '"no"', es: '"no"' },
        { en: "Nothing", es: "Nada" },
        { en: "TypeError", es: "TypeError" },
      ],
      answer: 1,
      explanation: {
        en: "`0` is one of the falsy seven, so `if (x)` fails and the `else` branch runs: `\"no\"`.",
        es: "`0` es uno de los siete falsos, así que `if (x)` falla y se ejecuta la rama `else`: `\"no\"`.",
      },
    },
    {
      q: {
        en: "What will this code output?",
        es: "¿Qué mostrará este código?",
      },
      code: ['const name = "";', "if (!name) {", '  console.log("anonymous");', "}"].join("\n"),
      options: [
        { en: '"anonymous"', es: '"anonymous"' },
        { en: "Nothing is printed", es: "No se imprime nada" },
        { en: '"name"', es: '"name"' },
        { en: "TypeError", es: "TypeError" },
      ],
      answer: 0,
      explanation: {
        en: "An empty string `\"\"` is falsy, and `!` flips it to `true` — so the branch runs and prints `\"anonymous\"`. This `if (!value)` pattern is the idiomatic way to check for missing input.",
        es: "Un texto vacío `\"\"` es falso, y `!` lo invierte a `true`, así que la rama se ejecuta e imprime `\"anonymous\"`. Este patrón `if (!value)` es la forma habitual de comprobar una entrada ausente.",
      },
    },
    {
      q: {
        en: "What will this code output?",
        es: "¿Qué mostrará este código?",
      },
      code: ['if ("0") {', '  console.log("truthy");', "} else {", '  console.log("falsy");', "}"].join("\n"),
      options: [
        { en: '"truthy"', es: '"truthy"' },
        { en: '"falsy"', es: '"falsy"' },
        { en: "Nothing is printed", es: "No se imprime nada" },
        { en: "TypeError", es: "TypeError" },
      ],
      answer: 0,
      explanation: {
        en: "Only the *empty* string is falsy. `\"0\"` is a non-empty string, so it is truthy — even though it *looks* like the number zero. Strings and numbers play by different rules.",
        es: "Solo el texto *vacío* es falso. `\"0\"` es un texto no vacío, así que es verdadero, aunque *parezca* el número cero. Textos y números juegan con reglas distintas.",
      },
    },
    {
      q: {
        en: "Which message is printed?",
        es: "¿Qué mensaje se imprime?",
      },
      code: [
        "const score = 75;",
        'if (score >= 90) console.log("A");',
        'else if (score >= 70) console.log("B");',
        'else console.log("C");',
      ].join("\n"),
      options: [
        { en: '"A"', es: '"A"' },
        { en: '"B"', es: '"B"' },
        { en: '"C"', es: '"C"' },
        { en: '"A" and "B"', es: '"A" y "B"' },
      ],
      answer: 1,
      explanation: {
        en: "Conditions are checked in order: `75 >= 90` fails, `75 >= 70` succeeds — `\"B\"` prints and the chain stops. Only the first true branch ever runs.",
        es: "Las condiciones se comprueban en orden: `75 >= 90` falla, `75 >= 70` tiene éxito: se imprime `\"B\"` y la cadena se detiene. Solo la primera rama verdadera se ejecuta.",
      },
    },
    {
      q: {
        en: "What will this code output?",
        es: "¿Qué mostrará este código?",
      },
      code: [
        "const n = 2;",
        "switch (n) {",
        '  case 1: console.log("one"); break;',
        '  case 2: console.log("two"); break;',
        '  default: console.log("other");',
        "}",
      ].join("\n"),
      options: [
        { en: '"one"', es: '"one"' },
        { en: '"two"', es: '"two"' },
        { en: '"other"', es: '"other"' },
        { en: '"two" and "other"', es: '"two" y "other"' },
      ],
      answer: 1,
      explanation: {
        en: "`n` is `2`, so `case 2` matches and prints `\"two\"`. The `break` stops execution there — `default` never runs.",
        es: "`n` es `2`, así que `case 2` coincide e imprime `\"two\"`. El `break` detiene la ejecución ahí: `default` nunca se ejecuta.",
      },
    },
  ],
  sandbox: "decision-flow",
};
