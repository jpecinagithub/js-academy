export default {
  id: "errors",
  module: 17,
  level: "intermediate",
  stub: false,
  title: { en: "Error Handling", es: "Manejo de errores" },
  tagline: {
    en: "Catch crashes gracefully: try/catch/finally, throw, and the error types you'll meet.",
    es: "Atrapa los fallos con elegancia: try/catch/finally, throw y los tipos de error que encontrarás.",
  },
  sections: [
    {
      type: "concept",
      heading: { en: "Programs crash — plan for it", es: "Los programas fallan: prepárate" },
      body: {
        en: `Sooner or later, every program hits a situation it can't handle: a missing user, a broken network response, a typo in the data. In JavaScript these moments become **error objects** that are *thrown* — and if nobody catches them, your program crashes.

\`try...catch\` lets you say: "attempt this risky code; if it throws, run my backup plan instead." \`finally\` adds a cleanup step that runs **no matter what**.

## The three error types you'll meet most

- \`SyntaxError\` — the code can't even be parsed. (\`const = 5\`)
- \`ReferenceError\` — you used a variable that doesn't exist. (\`console.log(doesNotExist)\`)
- \`TypeError\` — the value is the wrong kind. (\`null.name\`, or calling something that isn't a function)

And with \`throw\` you can create your own: \`throw new Error("user not found")\`.`,
        es: `Tarde o temprano, todo programa se topa con una situación que no puede manejar: un usuario que no existe, una respuesta de red rota, un error tipográfico en los datos. En JavaScript estos momentos se convierten en **objetos de error** que se *lanzan* — y si nadie los atrapa, tu programa se cae.

\`try...catch\` te permite decir: «intenta este código arriesgado; si lanza un error, ejecuta mi plan B». \`finally\` añade un paso de limpieza que se ejecuta **pase lo que pase**.

## Los tres tipos de error más comunes

- \`SyntaxError\` — el código ni siquiera se puede interpretar. (\`const = 5\`)
- \`ReferenceError\` — usaste una variable que no existe. (\`console.log(noExiste)\`)
- \`TypeError\` — el valor es del tipo equivocado. (\`null.name\`, o llamar a algo que no es una función)

Y con \`throw\` puedes crear los tuyos: \`throw new Error("usuario no encontrado")\`.`,
      },
    },
    {
      type: "visual",
      diagram: `        ┌───────┐
        │  try  │
        └───┬───┘
    throws? │
     ┌──────┴──────┐
   yes             no
     ▼              ▼
┌─────────┐   (skip catch)
│  catch  │         │
└────┬────┘         │
     └──────┬───────┘
            ▼
      ┌───────────┐
      │  finally  │  ← always runs
      └───────────┘`,
      caption: {
        en: "The try/catch/finally flow: catch only runs when try throws; finally always runs.",
        es: "El flujo try/catch/finally: catch solo se ejecuta si try lanza un error; finally siempre se ejecuta.",
      },
    },
    {
      type: "code",
      heading: { en: "Watch a TypeError happen", es: "Mira cómo ocurre un TypeError" },
      code: `try {
  const user = null;
  console.log(user.name); // <-- crashes HERE
} catch (err) {
  console.log(err.name + ": " + err.message);
}`,
      caption: {
        en: "Output: TypeError: Cannot read properties of null (reading 'name')",
        es: "Salida: TypeError: Cannot read properties of null (reading 'name')",
      },
      body: {
        en: `**WHICH line fails?** \`console.log(user.name)\` — the one touching \`.name\`.

**WHY?** \`user\` is \`null\`, and \`null\` has no properties — reading one is a \`TypeError\`.

**HOW to fix it?** Check the value *before* touching it, or catch the error and recover. Try the fixed version next.`,
        es: `**¿QUÉ línea falla?** \`console.log(user.name)\` — la que toca \`.name\`.

**¿POR QUÉ?** \`user\` es \`null\`, y \`null\` no tiene propiedades — leer una es un \`TypeError\`.

**¿CÓMO se arregla?** Comprueba el valor *antes* de tocarlo, o atrapa el error y recupérate. Prueba la versión corregida a continuación.`,
      },
    },
    {
      type: "lab",
      heading: { en: "Bug Lab: fix the broken programs", es: "Laboratorio de errores: arregla los programas rotos" },
      body: {
        en: "Open the Bug Lab and fix each broken snippet: read the error message, find the crashing line, and apply a guard or a `try...catch`. The error message always tells you **what** went wrong — your job is to figure out **where** and **why**.",
        es: "Abre el Laboratorio de errores y arregla cada fragmento roto: lee el mensaje de error, encuentra la línea que falla y aplica una comprobación o un `try...catch`. El mensaje de error siempre te dice **qué** salió mal — tu trabajo es averiguar **dónde** y **por qué**.",
      },
      lab: "bug-lab",
    },
    {
      type: "code",
      heading: { en: "Recovering gracefully", es: "Recuperarse con elegancia" },
      code: `function getUserName(user) {
  try {
    return user.name.toUpperCase();
  } catch (err) {
    return "Guest"; // backup plan
  } finally {
    console.log("lookup done"); // always runs
  }
}

console.log(getUserName(null));
console.log(getUserName({ name: "ada" }));`,
      caption: {
        en: "finally runs on every call — even when catch handles the error.",
        es: "finally se ejecuta en cada llamada, incluso cuando catch maneja el error.",
      },
      body: {
        en: "Notice the order of the output: `\"lookup done\"` prints **before** each result, both times. `finally` doesn't care whether `try` succeeded — it's the perfect place for cleanup: closing files, hiding spinners, releasing locks.",
        es: "Fíjate en el orden de la salida: `\"lookup done\"` se imprime **antes** de cada resultado, las dos veces. A `finally` no le importa si `try` tuvo éxito: es el lugar perfecto para la limpieza — cerrar archivos, ocultar indicadores de carga, liberar bloqueos.",
      },
    },
    {
      type: "mistake",
      wrong: `try {
  saveUser(user);
} catch {}
// "It works!" ...or does it?`,
      right: `try {
  saveUser(user);
} catch (err) {
  console.error("save failed:", err.message);
  showToast("Could not save — try again");
}`,
      explanation: {
        en: "An empty `catch {}` **swallows the error silently**. The bug still exists — you just can't see it anymore, and the program keeps running with broken state. Always do *something* with a caught error: log it, show a message to the user, or re-throw it with `throw err` if you can't handle it here.",
        es: "Un `catch {}` vacío **se traga el error en silencio**. El fallo sigue existiendo, solo que ya no puedes verlo, y el programa sigue funcionando con un estado roto. Haz siempre *algo* con un error atrapado: regístralo, muestra un mensaje al usuario o relánzalo con `throw err` si no puedes manejarlo aquí.",
      },
    },
    {
      type: "takeaway",
      body: {
        en: "`try` the risky part, `catch` to recover, `finally` to clean up. Never silence an error with an empty `catch` — a hidden bug is worse than a loud crash.",
        es: "`try` para la parte arriesgada, `catch` para recuperarte, `finally` para limpiar. Nunca silencies un error con un `catch` vacío: un fallo oculto es peor que un fallo ruidoso.",
      },
    },
    {
      type: "underhood",
      title: { en: "What “uncaught” really means", es: "Qué significa «no capturado» de verdad" },
      body: {
        en: "When an error is thrown and no `catch` handles it, JavaScript **unwinds the call stack**: it abandons the current function, then its caller, then *its* caller — running any `finally` blocks on the way out — until the stack is empty. Then the script stops and the console prints the error with its stack trace. (In a browser, one crashed script or event handler doesn't kill the whole page: each task gets a fresh stack.)",
        es: "Cuando se lanza un error y ningún `catch` lo maneja, JavaScript **desenrolla la pila de llamadas**: abandona la función actual, luego a quien la llamó, luego a quien llamó a esa — ejecutando los bloques `finally` que encuentre al salir — hasta vaciar la pila. Entonces el script se detiene y la consola muestra el error con su traza. (En un navegador, un script o un manejador de eventos que falla no mata toda la página: cada tarea recibe una pila nueva.)",
      },
    },
  ],
  quiz: [
    {
      q: { en: "What will this code output?", es: "¿Qué mostrará este código?" },
      code: `try {
  console.log("a");
  throw new Error("boom");
  console.log("b");
} catch (e) {
  console.log("c");
}
console.log("d");`,
      options: [
        { en: "a b c d", es: "a b c d" },
        { en: "a c d", es: "a c d" },
        { en: "a b d", es: "a b d" },
        { en: "c d", es: "c d" },
      ],
      answer: 1,
      explanation: {
        en: "The moment `throw` runs, the rest of the `try` block is **skipped** — `\"b\"` never prints. Control jumps to `catch` (`\"c\"`), then execution continues normally after the block (`\"d\"`).",
        es: "En cuanto se ejecuta `throw`, el resto del bloque `try` se **salta**: `\"b\"` nunca se imprime. El control salta a `catch` (`\"c\"`) y luego la ejecución continúa con normalidad después del bloque (`\"d\"`).",
      },
    },
    {
      q: { en: "Which error type does this throw?", es: "¿Qué tipo de error lanza esto?" },
      code: `const user = undefined;
console.log(user.name);`,
      options: [
        { en: "SyntaxError", es: "SyntaxError" },
        { en: "ReferenceError", es: "ReferenceError" },
        { en: "TypeError", es: "TypeError" },
        { en: "RangeError", es: "RangeError" },
      ],
      answer: 2,
      explanation: {
        en: "`user` **exists** (so it's not a `ReferenceError`), but it's `undefined` — and reading a property of `undefined` is a `TypeError`: the value is the wrong *kind* of thing.",
        es: "`user` **existe** (así que no es un `ReferenceError`), pero vale `undefined`, y leer una propiedad de `undefined` es un `TypeError`: el valor es del *tipo* equivocado.",
      },
    },
    {
      q: { en: "When does the `finally` block run?", es: "¿Cuándo se ejecuta el bloque `finally`?" },
      code: `try {
  risky();
} catch (e) {
  handle(e);
} finally {
  cleanup();
}`,
      options: [
        { en: "Only when no error occurs", es: "Solo cuando no hay error" },
        { en: "Only when an error is caught", es: "Solo cuando se atrapa un error" },
        { en: "Always — error or not", es: "Siempre, haya error o no" },
        { en: "Only when you re-throw", es: "Solo cuando relanzas el error" },
      ],
      answer: 2,
      explanation: {
        en: "`finally` runs **every time** the `try` block is exited — success, caught error, even an uncaught error on its way out. That's why cleanup code belongs there.",
        es: "`finally` se ejecuta **siempre** que se sale del bloque `try`: con éxito, con error atrapado e incluso con un error no atrapado al pasar. Por eso el código de limpieza va ahí.",
      },
    },
    {
      q: { en: "What will this code output?", es: "¿Qué mostrará este código?" },
      code: `function divide(a, b) {
  if (b === 0) throw new RangeError("no zero");
  return a / b;
}
try {
  divide(1, 0);
} catch (e) {
  console.log(e.name);
}`,
      options: [
        { en: "Error", es: "Error" },
        { en: "RangeError", es: "RangeError" },
        { en: "TypeError", es: "TypeError" },
        { en: "\"no zero\"", es: "\"no zero\"" },
      ],
      answer: 1,
      explanation: {
        en: "`throw` jumps straight to `catch` with your custom error object. `e.name` is the error *type* (`\"RangeError\"`); the message `\"no zero\"` lives in `e.message`.",
        es: "`throw` salta directamente a `catch` con tu objeto de error personalizado. `e.name` es el *tipo* de error (`\"RangeError\"`); el mensaje `\"no zero\"` está en `e.message`.",
      },
    },
  ],
  sandbox: "bug-lab",
};
