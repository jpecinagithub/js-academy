export default {
  id: "loops",
  module: 4,
  level: "beginner",
  stub: false,
  title: { en: "Loops", es: "Bucles" },
  tagline: {
    en: "for, while and friends — watch every iteration happen.",
    es: "for, while y amigos: observa cómo ocurre cada iteración.",
  },
  sections: [
    {
      type: "concept",
      heading: {
        en: "Doing things on repeat",
        es: "Hacer cosas en repetición",
      },
      body: {
        en: "Programs rarely do things once. Printing a list, validating ten fields, animating a game — all repetition. A **loop** repeats a block of code while a condition holds. Each single pass through the block is called an **iteration**.\n\n## The family\n\n- **`for`** — the classic: you control the start, the stop condition and the step, all in one line. Perfect when you know *how many times*.\n- **`while`** — repeats *while* a condition is true. Perfect when you know *when to stop* but not how many rounds it takes.\n- **`do...while`** — like `while`, but the body runs **at least once**, because the condition is checked at the end.\n- **`for...of`** — walks through the *values* of something iterable (arrays, strings): `for (const fruit of fruits)`.\n- **`for...in`** — walks through the *keys* of an object. Handy for objects — but **avoid it on arrays**: it yields index *strings* (`\"0\"`, `\"1\"`…), not the values, and the order is not guaranteed.\n\n> Every loop needs a way out. If the condition never becomes false, you get an **infinite loop** — the program spins forever (the sandbox in this academy stops runaway code after 3 seconds, but real browsers just freeze the tab).",
        es: "Los programas rara vez hacen las cosas una sola vez. Imprimir una lista, validar diez campos, animar un juego: todo es repetición. Un **bucle** repite un bloque de código mientras se cumpla una condición. Cada pasada por el bloque se llama **iteración**.\n\n## La familia\n\n- **`for`** — el clásico: controlas el inicio, la condición de parada y el paso, todo en una línea. Perfecto cuando sabes *cuántas veces*.\n- **`while`** — repite *mientras* una condición sea verdadera. Perfecto cuando sabes *cuándo parar* pero no cuántas vueltas llevará.\n- **`do...while`** — como `while`, pero el cuerpo se ejecuta **al menos una vez**, porque la condición se comprueba al final.\n- **`for...of`** — recorre los *valores* de algo iterable (arrays, textos): `for (const fruit of fruits)`.\n- **`for...in`** — recorre las *claves* de un objeto. Útil para objetos, pero **evítalo en arrays**: devuelve *textos* con los índices (`\"0\"`, `\"1\"`…), no los valores, y el orden no está garantizado.\n\n> Todo bucle necesita una salida. Si la condición nunca se vuelve falsa, obtienes un **bucle infinito**: el programa gira para siempre (el sandbox de esta academia detiene el código desbocado a los 3 segundos, pero los navegadores reales congelan la pestaña).",
      },
    },
    {
      type: "visual",
      diagram: [
        "  for ( let i = 0 ; i < 5 ; i++ )",
        "         ↓           ↓        ↓",
        "       start       keep     step",
        "       once       going?    after each round",
        "",
        "  i = 0 → body → i = 1 → body → i = 2 → … → i = 5 → STOP",
      ].join("\n"),
      caption: {
        en: "Anatomy of a for loop: initialize once, check before every round, update after every round.",
        es: "Anatomía de un bucle for: inicializa una vez, comprueba antes de cada vuelta y actualiza después de cada vuelta.",
      },
    },
    {
      type: "code",
      heading: {
        en: "The classic for loop",
        es: "El clásico bucle for",
      },
      code: ["for (let i = 0; i < 5; i++) {", "  console.log(i);", "}"].join("\n"),
      caption: {
        en: "Five iterations, numbers 0 to 4. Change the `5` — how far can you push it before the output gets boring?",
        es: "Cinco iteraciones, números del 0 al 4. Cambia el `5`: ¿hasta dónde puedes llegar antes de que la salida aburra?",
      },
    },
    {
      type: "lab",
      lab: "loop-visualizer",
      heading: {
        en: "Watch every iteration happen",
        es: "Observa cómo ocurre cada iteración",
      },
      body: {
        en: "Open the loop visualizer and step through a loop iteration by iteration: see the counter initialize, the condition checked, the body run, and the update applied. Slow motion is the best debugger.",
        es: "Abre el visualizador de bucles y avanza iteración a iteración: mira cómo se inicializa el contador, se comprueba la condición, se ejecuta el cuerpo y se aplica la actualización. La cámara lenta es el mejor depurador.",
      },
    },
    {
      type: "code",
      heading: {
        en: "while, do...while and for...of",
        es: "while, do...while y for...of",
      },
      code: [
        "// while: repeat while a condition holds",
        "let n = 3;",
        "while (n > 0) {",
        '  console.log("countdown: " + n);',
        "  n--;   // 👉 remove this line and watch the sandbox rescue you",
        "}",
        "",
        "// do...while: the body runs at least once",
        "let x = 10;",
        "do {",
        '  console.log("this prints once, even though x >= 5");',
        "} while (x < 5);",
        "",
        "// for...of: walk through values directly",
        'for (const fruit of ["apple", "pear", "plum"]) {',
        '  console.log("I like " + fruit);',
        "}",
      ].join("\n"),
      caption: {
        en: "Three loops, three philosophies: repeat-until-done, do-first-ask-later, and just-give-me-the-values.",
        es: "Tres bucles, tres filosofías: repite-hasta-terminar, haz-primero-pregunta-después y dame-los-valores.",
      },
    },
    {
      type: "mistake",
      wrong: [
        'const colors = ["red", "green", "blue"];',
        "for (let i = 0; i <= colors.length; i++) {   // ❌ <= goes one too far",
        "  console.log(colors[i]);",
        "}",
        "// Last round reads colors[3] → undefined. Classic off-by-one.",
      ].join("\n"),
      right: [
        'const colors = ["red", "green", "blue"];',
        "for (let i = 0; i < colors.length; i++) {    // ✅ < stops at index 2",
        "  console.log(colors[i]);",
        "}",
        "// red, green, blue — nothing more, nothing less.",
      ].join("\n"),
      explanation: {
        en: "Arrays are **zero-indexed**: three items live at indexes `0, 1, 2`, but `length` is `3`. Using `<=` runs one iteration too many and reads past the end (`undefined`). Rule of thumb: **start at `0`, keep `< length`**. And the twin danger: a `while` whose condition never flips becomes an infinite loop — always make sure something inside moves toward the exit.",
        es: "Los arrays empiezan en **índice cero**: tres elementos viven en los índices `0, 1, 2`, pero `length` es `3`. Usar `<=` ejecuta una iteración de más y lee más allá del final (`undefined`). Regla de oro: **empieza en `0` y usa `< length`**. Y el peligro gemelo: un `while` cuya condición nunca cambia se vuelve infinito; asegúrate siempre de que algo dentro avance hacia la salida.",
      },
    },
    {
      type: "challenge-ref",
      challenge: "fizzbuzz",
    },
    {
      type: "takeaway",
      body: {
        en: "**`for` counts, `while` waits, `do...while` acts first, `for...of` takes values.** Start at `0`, loop while `i < length`, and always give the loop a way out. Use `for...in` for object keys — never for array values.",
        es: "**`for` cuenta, `while` espera, `do...while` actúa primero, `for...of` toma valores.** Empieza en `0`, repite mientras `i < length` y dale siempre al bucle una salida. Usa `for...in` para las claves de objetos, nunca para los valores de un array.",
      },
    },
    {
      type: "underhood",
      title: {
        en: "What the engine does each iteration",
        es: "Qué hace el motor en cada iteración",
      },
      body: {
        en: "For `for (init; condition; update) { body }`, the engine follows a strict ritual: run `init` **once**; then repeat — check `condition`, and if true run `body`, then run `update`. The check happens *before* every round, which is why a false condition from the start means the body never runs. `while` is the same ritual without the `init`/`update` slots; `do...while` simply moves the check to the end, guaranteeing one pass.",
        es: "En `for (init; condition; update) { body }`, el motor sigue un ritual estricto: ejecuta `init` **una vez**; luego repite: comprueba `condition` y, si es verdadera, ejecuta `body` y después `update`. La comprobación ocurre *antes* de cada vuelta, por eso una condición falsa desde el inicio significa que el cuerpo nunca se ejecuta. `while` es el mismo ritual sin las ranuras `init`/`update`; `do...while` simplemente mueve la comprobación al final, garantizando una pasada.",
      },
    },
  ],
  quiz: [
    {
      q: {
        en: "How many iterations does this loop run?",
        es: "¿Cuántas iteraciones ejecuta este bucle?",
      },
      code: "for (let i = 0; i < 5; i++) {\n  // ...\n}",
      options: [
        { en: "4", es: "4" },
        { en: "5", es: "5" },
        { en: "6", es: "6" },
        { en: "Infinite", es: "Infinitas" },
      ],
      answer: 1,
      explanation: {
        en: "`i` takes the values `0, 1, 2, 3, 4` — five rounds. When `i` reaches `5`, the condition `5 < 5` is false and the loop stops before running.",
        es: "`i` toma los valores `0, 1, 2, 3, 4`: cinco vueltas. Cuando `i` llega a `5`, la condición `5 < 5` es falsa y el bucle se detiene antes de ejecutarse.",
      },
    },
    {
      q: {
        en: "What will this code output?",
        es: "¿Qué mostrará este código?",
      },
      code: "for (let i = 1; i <= 3; i++) {\n  console.log(i * 2);\n}",
      options: [
        { en: "1 2 3", es: "1 2 3" },
        { en: "2 4 6", es: "2 4 6" },
        { en: "2 4 6 8", es: "2 4 6 8" },
        { en: "0 2 4", es: "0 2 4" },
      ],
      answer: 1,
      explanation: {
        en: "`i` goes `1, 2, 3` (three iterations thanks to `<=`), and each value is doubled: `2, 4, 6`.",
        es: "`i` vale `1, 2, 3` (tres iteraciones gracias a `<=`) y cada valor se duplica: `2, 4, 6`.",
      },
    },
    {
      q: {
        en: "What will this code output? (Think carefully!)",
        es: "¿Qué mostrará este código? (¡Piensa con cuidado!)",
      },
      code: 'for (const k in ["a", "b"]) {\n  console.log(k);\n}',
      options: [
        { en: '"a" "b"', es: '"a" "b"' },
        { en: '"0" "1"', es: '"0" "1"' },
        { en: "0 1 (as numbers)", es: "0 1 (como números)" },
        { en: "TypeError", es: "TypeError" },
      ],
      answer: 1,
      explanation: {
        en: "`for...in` yields **keys**, not values — for an array those are the index *strings* `\"0\"` and `\"1\"`. This is exactly why you should use `for...of` (values) on arrays instead.",
        es: "`for...in` devuelve **claves**, no valores: en un array son los *textos* de los índices `\"0\"` y `\"1\"`. Por eso mismo debes usar `for...of` (valores) en los arrays.",
      },
    },
    {
      q: {
        en: "What will this code output?",
        es: "¿Qué mostrará este código?",
      },
      code: "let n = 3;\nwhile (n > 0) {\n  console.log(n);\n  n--;\n}",
      options: [
        { en: "3 2 1", es: "3 2 1" },
        { en: "2 1 0", es: "2 1 0" },
        { en: "3 2 1 0", es: "3 2 1 0" },
        { en: "It never stops", es: "No se detiene nunca" },
      ],
      answer: 0,
      explanation: {
        en: "The body prints `3`, then `2`, then `1`. After `n--` makes `n` equal `0`, the condition `0 > 0` fails and the loop exits — `0` is never printed.",
        es: "El cuerpo imprime `3`, luego `2` y luego `1`. Cuando `n--` deja `n` en `0`, la condición `0 > 0` falla y el bucle termina: el `0` nunca se imprime.",
      },
    },
    {
      q: {
        en: 'How many times is "hi" printed?',
        es: '¿Cuántas veces se imprime "hi"?',
      },
      code: 'let x = 10;\ndo {\n  console.log("hi");\n} while (x < 5);',
      options: [
        { en: "0", es: "0" },
        { en: "1", es: "1" },
        { en: "5", es: "5" },
        { en: "Infinite times", es: "Infinitas veces" },
      ],
      answer: 1,
      explanation: {
        en: "`do...while` checks the condition **after** the body, so the body always runs at least once — even though `10 < 5` is false from the start.",
        es: "`do...while` comprueba la condición **después** del cuerpo, así que el cuerpo siempre se ejecuta al menos una vez, aunque `10 < 5` sea falso desde el inicio.",
      },
    },
  ],
  sandbox: "loop-visualizer",
};
