export default {
  id: "operators",
  module: 2,
  level: "beginner",
  stub: false,
  title: { en: "Operators", es: "Operadores" },
  tagline: {
    en: "From + to ?? and ?.: tiny calculators that explain themselves.",
    es: "De + a ?? y ?.: pequeñas calculadoras que se explican solas.",
  },
  sections: [
    {
      type: "concept",
      heading: {
        en: "Operators: the verbs of JavaScript",
        es: "Operadores: los verbos de JavaScript",
      },
      body: {
        en: "If values are the nouns of JavaScript, **operators are the verbs** — the symbols that *do* things to values. You already know several from math class; JavaScript adds a few of its own.\n\n## The seven families\n\n- **Arithmetic**: `+  -  *  /  %  **` — math, plus remainder (`%`) and power (`**`)\n- **Assignment**: `=  +=  -=  *=  /=` — store values (`score += 5` means `score = score + 5`)\n- **Comparison**: `<  >  <=  >=` — is it bigger, smaller…? Result: always `true` or `false`\n- **Equality**: `==  ===  !=  !==` — the famous pair, explained below\n- **Logical**: `&&  ||  !` — combine true/false values (AND, OR, NOT)\n- **Ternary**: `condition ? a : b` — a whole `if/else` in one line\n- **Modern helpers**: `??` (nullish coalescing) and `?.` (optional chaining) — safe defaults and safe navigation\n\n## `==` vs `===`: the most important pair\n\n- `===` (**strict equality**) compares value *and* type. `10 === \"10\"` is `false`: number vs string.\n- `==` (**loose equality**) converts types first, then compares. `10 == \"10\"` is `true`, because the string becomes the number `10`.\n\n> **Default to `===`.** Loose `==` follows surprising conversion rules; strict `===` does exactly what it says. Almost every professional codebase bans `==`.",
        es: "Si los valores son los sustantivos de JavaScript, **los operadores son los verbos**: los símbolos que *hacen* cosas con los valores. Ya conoces varios de la clase de mates; JavaScript añade algunos propios.\n\n## Las siete familias\n\n- **Aritméticos**: `+  -  *  /  %  **` — mates, más resto (`%`) y potencia (`**`)\n- **Asignación**: `=  +=  -=  *=  /=` — guardan valores (`score += 5` significa `score = score + 5`)\n- **Comparación**: `<  >  <=  >=` — ¿es mayor, menor…? Resultado: siempre `true` o `false`\n- **Igualdad**: `==  ===  !=  !==` — la famosa pareja, explicada abajo\n- **Lógicos**: `&&  ||  !` — combinan valores verdadero/falso (Y, O, NO)\n- **Ternario**: `condition ? a : b` — un `if/else` entero en una línea\n- **Ayudantes modernos**: `??` (fusión de nulos) y `?.` (encadenamiento opcional) — valores por defecto y navegación seguros\n\n## `==` vs `===`: la pareja más importante\n\n- `===` (**igualdad estricta**) compara valor *y* tipo. `10 === \"10\"` es `false`: número frente a texto.\n- `==` (**igualdad débil**) convierte los tipos primero y luego compara. `10 == \"10\"` es `true`, porque el texto se convierte al número `10`.\n\n> **Usa `===` por defecto.** El `==` débil sigue reglas de conversión sorprendentes; el `===` estricto hace exactamente lo que dice. Casi todo el código profesional prohíbe `==`.",
      },
    },
    {
      type: "visual",
      diagram: [
        "  Precedence — top runs first:",
        "",
        "    **                  power",
        "    *  /  %             multiply, divide, remainder",
        "    +  -                add, subtract",
        "    <  <=  >  >=        comparisons",
        "    ==  ===  !=  !==    equality",
        "    &&                  logical AND",
        "    ||  ??              logical OR, nullish coalescing",
        "    =  +=  -=  ...      assignment (always last!)",
        "",
        "  When in doubt: (a + b) * c",
      ].join("\n"),
      caption: {
        en: "Operators higher up grab their operands first. Parentheses beat everything.",
        es: "Los operadores de arriba agarran sus operandos primero. Los paréntesis ganan a todo.",
      },
    },
    {
      type: "code",
      heading: {
        en: "Mini-calculator I: arithmetic and assignment",
        es: "Minicalculadora I: aritmética y asignación",
      },
      code: [
        'console.log(10 + 5);   // 15 — addition',
        "console.log(10 - 4);   // 6  — subtraction",
        "console.log(10 * 3);   // 30 — multiplication",
        "console.log(10 / 4);   // 2.5 — division is never integer-only",
        "console.log(10 % 3);   // 1 — remainder of the division",
        "console.log(2 ** 3);   // 8 — exponentiation",
        "",
        "let score = 10;",
        "score += 5;            // same as: score = score + 5",
        "console.log(score);    // 15",
      ].join("\n"),
      caption: {
        en: "Each line is a tiny calculator — press RUN, then change the numbers and run it again.",
        es: "Cada línea es una minicalculadora: pulsa EJECUTAR, cambia los números y vuelve a ejecutarla.",
      },
    },
    {
      type: "code",
      heading: {
        en: "Mini-calculator II: comparison and equality",
        es: "Minicalculadora II: comparación e igualdad",
      },
      code: [
        'console.log(10 === "10"); // false — same value, different type',
        'console.log(10 == "10");  // true  — == converts "10" to 10 first',
        "console.log(5 > 3);       // true",
        'console.log("a" < "b");   // true — strings compare alphabetically',
        "console.log(7 !== 7);     // false — they ARE strictly equal",
      ].join("\n"),
      caption: {
        en: "`===` checks value AND type; `==` converts first. One character of difference, worlds apart.",
        es: "`===` comprueba valor Y tipo; `==` convierte primero. Un carácter de diferencia, mundos aparte.",
      },
    },
    {
      type: "lab",
      lab: "coercion-lab",
      heading: {
        en: "Feel the coercion",
        es: "Siente la coerción",
      },
      body: {
        en: "Open the coercion lab and pit `==` against `===` on tricky pairs like `0`, `\"\"`, `false` and `null`. Your goal: predict the result *before* you reveal it. Surprises are the lesson.",
        es: "Abre el laboratorio de coerción y enfrenta `==` contra `===` con parejas tramposas como `0`, `\"\"`, `false` y `null`. Tu objetivo: predecir el resultado *antes* de revelarlo. Las sorpresas son la lección.",
      },
    },
    {
      type: "code",
      heading: {
        en: "Mini-calculator III: logic, ternary, ?? and ?.",
        es: "Minicalculadora III: lógica, ternario, ?? y ?.",
      },
      code: [
        "console.log(true && false); // false — AND needs both sides true",
        "console.log(true || false); // true  — OR needs just one side true",
        "console.log(!true);         // false — NOT flips the value",
        "",
        "const age = 20;",
        'console.log(age >= 18 ? "adult" : "minor"); // "adult" — ternary = compact if/else',
        "",
        'console.log(null ?? "default"); // "default" — null triggers ??',
        'console.log(0 ?? "default");    // 0 — ?? only reacts to null/undefined',
        "",
        'const user = { address: { city: "Bilbao" } };',
        "console.log(user?.address?.city);   // \"Bilbao\"",
        "console.log(user?.phone?.number);   // undefined — no crash, no error!",
      ].join("\n"),
      caption: {
        en: "`&&` / `||` combine truths, the ternary picks between two values, `??` fills in nulls, and `?.` navigates without crashing.",
        es: "`&&` / `||` combinan verdades, el ternario elige entre dos valores, `??` rellena nulos y `?.` navega sin romperse.",
      },
    },
    {
      type: "mistake",
      wrong: [
        'const role = "user";',
        'if (role = "admin") {      // ❌ assigns "admin" to role!',
        '  console.log("welcome, admin");',
        "}",
        "// This ALWAYS prints — an assignment is truthy.",
      ].join("\n"),
      right: [
        'const role = "user";',
        'if (role === "admin") {    // ✅ compares value and type',
        '  console.log("welcome, admin");',
        "}",
        "// This prints nothing — role is still \"user\".",
      ].join("\n"),
      explanation: {
        en: "One `=` **assigns**, two/three compare. Writing `if (role = \"admin\")` stuffs `\"admin\"` into `role` and the condition becomes that (truthy) string — so the branch always runs. Linters flag this instantly; until then, count your `=` signs.",
        es: "Un `=` **asigna**, dos/tres comparan. Escribir `if (role = \"admin\")` mete `\"admin\"` dentro de `role` y la condición se convierte en ese texto (verdadero), así que la rama siempre se ejecuta. Los linters detectan esto al instante; hasta entonces, cuenta tus signos `=`.",
      },
    },
    {
      type: "takeaway",
      body: {
        en: "**Use `===`, not `==`.** Arithmetic follows math-class precedence; `&&`/`||`/`!` combine booleans; the ternary is a one-line `if/else`; `??` supplies defaults only for `null`/`undefined`; and `?.` lets you reach into objects that might not be there — without crashing.",
        es: "**Usa `===`, no `==`.** La aritmética sigue la precedencia de la clase de mates; `&&`/`||`/`!` combinan booleanos; el ternario es un `if/else` en una línea; `??` aporta valores por defecto solo para `null`/`undefined`; y `?.` te deja entrar en objetos que quizá no existan, sin romperse.",
      },
    },
    {
      type: "underhood",
      title: {
        en: "Short-circuit: && and || return values, not booleans",
        es: "Cortocircuito: && y || devuelven valores, no booleanos",
      },
      body: {
        en: "`&&` and `||` do not necessarily return `true`/`false` — they return **one of their operands**. `||` returns the first *truthy* value it meets (or the last one); `&&` returns the first *falsy* value (or the last one). That is why `false || \"hi\"` gives `\"hi\"`, and why `user && user.name` was the old-school way to safely read a property before `?.` existed. The engine also *short-circuits*: once the answer is decided, it skips evaluating the rest.",
        es: "`&&` y `||` no devuelven necesariamente `true`/`false`: devuelven **uno de sus operandos**. `||` devuelve el primer valor *verdadero* que encuentra (o el último); `&&` devuelve el primer valor *falso* (o el último). Por eso `false || \"hi\"` da `\"hi\"`, y por eso `user && user.name` era la forma clásica de leer una propiedad con seguridad antes de que existiera `?.`. El motor además hace *cortocircuito*: cuando la respuesta ya está decidida, se salta evaluar el resto.",
      },
    },
  ],
  quiz: [
    {
      q: {
        en: "What will this code output?",
        es: "¿Qué mostrará este código?",
      },
      code: 'console.log(10 === "10");',
      options: [
        { en: "true", es: "true" },
        { en: "false", es: "false" },
        { en: "TypeError", es: "TypeError" },
        { en: "10", es: "10" },
      ],
      answer: 1,
      explanation: {
        en: "`===` is strict: it compares value **and** type. A number is never strictly equal to a string, so the result is `false`.",
        es: "`===` es estricto: compara valor **y** tipo. Un número nunca es estrictamente igual a un texto, así que el resultado es `false`.",
      },
    },
    {
      q: {
        en: "What will this code output?",
        es: "¿Qué mostrará este código?",
      },
      code: 'console.log("5" - 2);',
      options: [
        { en: '"52"', es: '"52"' },
        { en: "3", es: "3" },
        { en: "NaN", es: "NaN" },
        { en: "TypeError", es: "TypeError" },
      ],
      answer: 1,
      explanation: {
        en: "Unlike `+`, the `-` operator has no string meaning, so it converts `\"5\"` to the number `5` first: `5 - 2` is `3`. Only `+` glues strings together.",
        es: "A diferencia de `+`, el operador `-` no tiene significado con textos, así que convierte `\"5\"` al número `5` primero: `5 - 2` es `3`. Solo `+` pega textos.",
      },
    },
    {
      q: {
        en: "What will this code output?",
        es: "¿Qué mostrará este código?",
      },
      code: 'console.log(0 ?? 42);',
      options: [
        { en: "42", es: "42" },
        { en: "0", es: "0" },
        { en: "null", es: "null" },
        { en: "undefined", es: "undefined" },
      ],
      answer: 1,
      explanation: {
        en: "`??` only steps in for `null` or `undefined`. `0` is a perfectly good value (falsy, but not nullish), so it survives and the output is `0`.",
        es: "`??` solo interviene ante `null` o `undefined`. `0` es un valor perfectamente válido (falso, pero no nulo), así que sobrevive y el resultado es `0`.",
      },
    },
    {
      q: {
        en: "What will this code output?",
        es: "¿Qué mostrará este código?",
      },
      code: 'console.log(false || "hi");',
      options: [
        { en: '"hi"', es: '"hi"' },
        { en: "false", es: "false" },
        { en: "true", es: "true" },
        { en: "0", es: "0" },
      ],
      answer: 0,
      explanation: {
        en: "`||` returns the first *truthy* operand, not necessarily a boolean. `false` is falsy, so it moves on and returns `\"hi\"`.",
        es: "`||` devuelve el primer operando *verdadero*, no necesariamente un booleano. `false` es falso, así que pasa al siguiente y devuelve `\"hi\"`.",
      },
    },
  ],
  sandbox: "coercion-lab",
};
