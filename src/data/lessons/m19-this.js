export default {
  id: "this",
  module: 19,
  level: "advanced",
  stub: false,
  title: { en: "this", es: "this" },
  tagline: {
    en: "One keyword, five personalities: what this really is in every context.",
    es: "Una palabra clave, cinco personalidades: qué es this de verdad en cada contexto.",
  },
  sections: [
    {
      type: "concept",
      heading: { en: "The call-site rule", es: "La regla del lugar de llamada" },
      body: {
        en: `\`this\` is not fixed when you write a function — it's decided **when the function is called**, by *how* it's called. Don't ask “what IS \`this\`?” Ask: **“how was this function called?”**

## The five contexts, side by side

| Where you see it | What \`this\` is | Why (one sentence) |
|---|---|---|
| Global code (strict mode) | \`undefined\` | Nobody is calling — there is no call-site object. |
| \`obj.method()\` | \`obj\` | The object **before the dot** becomes \`this\`. |
| Plain \`fn()\` | \`undefined\` (strict) | Called bare, with no object — same as global. |
| Arrow \`() => this.x\` | the outer \`this\` | Arrows don't get their own \`this\`; they inherit it. |
| Event handler (\`function\`) | the element | The browser invokes it *on* the element. |

\`\`\`
button.addEventListener("click", function () {
  console.log(this); // the <button> — the browser calls it as button.handler()
});
\`\`\`

> The listing above is **not runnable** here (the sandbox has no DOM), but the rule is the same: whoever is *before the dot* at the call site becomes \`this\`.`,
        es: `\`this\` no queda fijado cuando escribes una función: se decide **cuando la función se llama**, según *cómo* se llame. No preguntes «¿qué ES \`this\`?». Pregunta: **«¿cómo se llamó a esta función?»**.

## Los cinco contextos, lado a lado

| Dónde lo ves | Qué es \`this\` | Por qué (una frase) |
|---|---|---|
| Código global (modo estricto) | \`undefined\` | Nadie está llamando: no hay objeto en el lugar de llamada. |
| \`obj.method()\` | \`obj\` | El objeto **antes del punto** se convierte en \`this\`. |
| \`fn()\` a secas | \`undefined\` (estricto) | Llamada sin objeto, como en el caso global. |
| Flecha \`() => this.x\` | el \`this\` exterior | Las flechas no tienen \`this\` propio; lo heredan. |
| Manejador de eventos (\`function\`) | el elemento | El navegador la invoca *sobre* el elemento. |

\`\`\`
button.addEventListener("click", function () {
  console.log(this); // el <button>: el navegador la llama como button.handler()
});
\`\`\`

> El ejemplo anterior **no es ejecutable** aquí (el sandbox no tiene DOM), pero la regla es la misma: quien esté *antes del punto* en el lugar de llamada se convierte en \`this\`.`,
      },
    },
    {
      type: "visual",
      diagram: `HOW it's called  ──▶  WHAT this is
─────────────────      ──────────────
obj.method()       ──▶  obj            (before the dot)
fn()               ──▶  undefined      (bare call, strict)
() => this.x       ──▶  outer this     (inherited, never own)
el.onclick = fn    ──▶  el             (browser calls it on el)`,
      caption: {
        en: "The call-site rule as a map: find the shape of the call, and you know this.",
        es: "La regla del lugar de llamada como mapa: encuentra la forma de la llamada y sabrás qué es this.",
      },
    },
    {
      type: "code",
      heading: { en: "Three contexts, live", es: "Tres contextos, en directo" },
      code: `// 1. Global (this sandbox runs in strict mode)
console.log(this === undefined); // true

// 2. Object method: this = the object before the dot
const user = {
  name: "Ada",
  greet() { return "hi, I'm " + this.name; }
};
console.log(user.greet());

// 3. Arrow inside a method: inherits this from member()
const team = {
  name: "JS",
  member() {
    const who = () => this.name;
    return who();
  }
};
console.log(team.member());`,
      caption: {
        en: "Output: true, \"hi, I'm Ada\", \"JS\". Note: the sandbox runs \"use strict\", so top-level this is undefined.",
        es: "Salida: true, \"hi, I'm Ada\", \"JS\". Nota: el sandbox usa \"use strict\", así que this en el nivel superior es undefined.",
      },
      body: {
        en: "Case 3 is the one to stare at: `who` is an arrow function, so it has **no `this` of its own** — it simply uses the `this` from `member()`, which was called as `team.member()`. Arrows are the standard trick for callbacks that need the outer `this`.",
        es: "El caso 3 es el que merece atención: `who` es una función flecha, así que **no tiene `this` propio**; simplemente usa el `this` de `member()`, que se llamó como `team.member()`. Las flechas son el truco estándar para callbacks que necesitan el `this` exterior.",
      },
    },
    {
      type: "lab",
      heading: { en: "this Lab: predict, then check", es: "Laboratorio de this: predice y comprueba" },
      body: {
        en: "Open the this Lab and test yourself: for each snippet, **predict** what `this` will be using the call-site rule, then run it to check. The fastest way to tame `this` is to be wrong about it a few times on purpose.",
        es: "Abre el Laboratorio de this y ponte a prueba: para cada fragmento, **predice** qué será `this` usando la regla del lugar de llamada y luego ejecútalo para comprobarlo. La forma más rápida de domar `this` es equivocarse con él unas cuantas veces a propósito.",
      },
      lab: "this-lab",
    },
    {
      type: "code",
      heading: { en: "The call-site rule in action", es: "La regla del lugar de llamada en acción" },
      code: `function greet() {
  return "hi, I'm " + this.name;
}

const ada = { name: "Ada" };
const bo = { name: "Bo" };

console.log(greet.call(ada)); // you CHOOSE this
console.log(greet.call(bo));  // same function, different this!`,
      caption: {
        en: "Output: \"hi, I'm Ada\", \"hi, I'm Bo\". One function, two identities.",
        es: "Salida: \"hi, I'm Ada\", \"hi, I'm Bo\". Una función, dos identidades.",
      },
      body: {
        en: "`fn.call(obj)` lets you **set `this` explicitly** — ultimate proof that `this` comes from the call, not from the function's definition. `apply` works the same (arguments as an array); `bind` returns a new function with `this` permanently attached.",
        es: "`fn.call(obj)` te permite **fijar `this` explícitamente**: la prueba definitiva de que `this` viene de la llamada, no de la definición de la función. `apply` funciona igual (argumentos como array); `bind` devuelve una función nueva con `this` fijado para siempre.",
      },
    },
    {
      type: "mistake",
      wrong: `const user = {
  name: "Ada",
  greet() { console.log("hi " + this.name); }
};
const fn = user.greet;
fn(); // TypeError! this is undefined here`,
      right: `const fn = user.greet.bind(user);
fn(); // "hi Ada" — this is pinned to user

// ...or keep the call site intact:
user.greet(); // "hi Ada"`,
      explanation: {
        en: "Copying a method into a plain variable **detaches it from its object**. The call `fn()` is bare — no object before the dot — so `this` is `undefined` (strict mode) and `this.name` throws. Fix it by pinning `this` with `.bind(user)`, wrapping in an arrow (`() => user.greet()`), or simply not detaching it.",
        es: "Copiar un método en una variable **lo separa de su objeto**. La llamada `fn()` es «desnuda» — sin objeto antes del punto — así que `this` es `undefined` (modo estricto) y `this.name` lanza un error. Arréglalo fijando `this` con `.bind(user)`, envolviéndolo en una flecha (`() => user.greet()`) o, simplemente, sin separarlo.",
      },
    },
    {
      type: "takeaway",
      body: {
        en: "Don't ask what `this` IS — ask how the function was CALLED. Object before the dot wins; bare calls get `undefined`; arrows inherit. When `this` surprises you, look at the call site.",
        es: "No preguntes qué ES `this`: pregunta cómo SE LLAMÓ a la función. El objeto antes del punto gana; las llamadas desnudas reciben `undefined`; las flechas heredan. Cuando `this` te sorprenda, mira el lugar de llamada.",
      },
    },
    {
      type: "underhood",
      title: { en: "Why arrows can't be rebound", es: "Por qué las flechas no se pueden reasignar" },
      body: {
        en: "Arrow functions don't just *prefer* the outer `this` — they **have no `this` slot at all**. `call`, `apply` and `bind` silently do nothing to an arrow's `this`, and arrows can't be used as constructors with `new`. That's why they're perfect for callbacks inside methods, and wrong for object methods that need their own `this`.",
        es: "Las funciones flecha no es que *prefieran* el `this` exterior: es que **no tienen ranura para `this`**. `call`, `apply` y `bind` no hacen nada silenciosamente al `this` de una flecha, y las flechas no se pueden usar como constructoras con `new`. Por eso son perfectas para callbacks dentro de métodos, e incorrectas para métodos de objeto que necesitan su propio `this`.",
      },
    },
  ],
  quiz: [
    {
      q: { en: "What will this code output?", es: "¿Qué mostrará este código?" },
      code: `const obj = {
  name: "Ada",
  getName() { return this.name; }
};
console.log(obj.getName());`,
      options: [
        { en: "\"Ada\"", es: "\"Ada\"" },
        { en: "undefined", es: "undefined" },
        { en: "It throws an error", es: "Lanza un error" },
        { en: "\"getName\"", es: "\"getName\"" },
      ],
      answer: 0,
      explanation: {
        en: "Called as `obj.getName()`, the object before the dot is `obj` — so `this === obj` and `this.name` is `\"Ada\"`.",
        es: "Al llamarse como `obj.getName()`, el objeto antes del punto es `obj`: `this === obj` y `this.name` es `\"Ada\"`.",
      },
    },
    {
      q: { en: "What happens here?", es: "¿Qué ocurre aquí?" },
      code: `const obj = {
  name: "Ada",
  getName() { return this.name; }
};
const f = obj.getName;
console.log(f());`,
      options: [
        { en: "Logs \"Ada\"", es: "Muestra \"Ada\"" },
        { en: "Logs undefined", es: "Muestra undefined" },
        { en: "Throws a TypeError", es: "Lanza un TypeError" },
        { en: "Logs the function itself", es: "Muestra la función" },
      ],
      answer: 2,
      explanation: {
        en: "`f()` is a **bare call** — no object before the dot — so `this` is `undefined` (strict mode). Reading `.name` of `undefined` throws a `TypeError`. This is the classic “lost `this`” bug.",
        es: "`f()` es una llamada **desnuda**, sin objeto antes del punto, así que `this` es `undefined` (modo estricto). Leer `.name` de `undefined` lanza un `TypeError`. Es el clásico fallo de «this perdido».",
      },
    },
    {
      q: { en: "What will this code output?", es: "¿Qué mostrará este código?" },
      code: `const obj = {
  name: "Bo",
  getName: function () {
    const inner = () => this.name;
    return inner();
  }
};
console.log(obj.getName());`,
      options: [
        { en: "\"Bo\"", es: "\"Bo\"" },
        { en: "undefined", es: "undefined" },
        { en: "It throws an error", es: "Lanza un error" },
        { en: "\"inner\"", es: "\"inner\"" },
      ],
      answer: 0,
      explanation: {
        en: "Arrows inherit `this`. `inner` uses the `this` of `getName`, which was called as `obj.getName()` — so `this === obj` and the result is `\"Bo\"`.",
        es: "Las flechas heredan `this`. `inner` usa el `this` de `getName`, que se llamó como `obj.getName()`: `this === obj` y el resultado es `\"Bo\"`.",
      },
    },
    {
      q: { en: "What will this code output? (strict mode)", es: "¿Qué mostrará este código? (modo estricto)" },
      code: `function who() { return this; }
console.log(who() === undefined);`,
      options: [
        { en: "true", es: "true" },
        { en: "false", es: "false" },
        { en: "It throws an error", es: "Lanza un error" },
        { en: "\"who\"", es: "\"who\"" },
      ],
      answer: 0,
      explanation: {
        en: "A plain `who()` call has no call-site object, so in strict mode `this` is `undefined`. (In old sloppy mode it would be the global object — one more reason to always use strict mode.)",
        es: "Una llamada simple `who()` no tiene objeto en el lugar de llamada, así que en modo estricto `this` es `undefined`. (En el antiguo modo no estricto sería el objeto global: una razón más para usar siempre el modo estricto.)",
      },
    },
  ],
  sandbox: "this-lab",
};
