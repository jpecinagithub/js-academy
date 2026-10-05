// Module 9 — References & Memory (full lesson content, Phase 4)
export default {
  id: "references",
  module: 9,
  level: "intermediate",
  stub: false,
  title: { en: "References & Memory", es: "Referencias y memoria" },
  tagline: {
    en: "Stack vs heap: why b.value = 10 also changes a.",
    es: "Stack vs heap: por qué b.value = 10 también cambia a.",
  },
  sections: [
    {
      type: "concept",
      heading: { en: "Two kinds of values", es: "Dos tipos de valores" },
      body: {
        en: "JavaScript values come in two flavors, and JavaScript treats them very differently when you copy them.\n\n**Primitive** values — numbers, strings, booleans, `null`, `undefined`, symbols — are copied **by value**. When you write `let b = a`, JavaScript puts a brand-new, independent copy of the value into `b`. Change `b` later and `a` never notices.\n\n**Objects** — and that includes arrays and functions — are copied **by reference**. When you write `const b = a` with an object, JavaScript does NOT duplicate the object. It copies the *reference*: a small address pointing at the same object in memory. Now `a` and `b` are two names for one object, so `b.value = 10` changes what `a.value` sees.\n\nThe usual mental model: primitives live on the **stack** (fast, fixed-size slots), objects live on the **heap** (a big shared pool), and object variables hold the *address* of their heap object.",
        es: "Los valores de JavaScript vienen en dos sabores, y JavaScript los trata de forma muy distinta al copiarlos.\n\nLos valores **primitivos** — números, cadenas, booleanos, `null`, `undefined`, símbolos — se copian **por valor**. Cuando escribes `let b = a`, JavaScript guarda en `b` una copia nueva e independiente del valor. Si luego cambias `b`, `a` ni se entera.\n\nLos **objetos** — incluidas las arrays y las funciones — se copian **por referencia**. Cuando escribes `const b = a` con un objeto, JavaScript NO duplica el objeto. Copia la *referencia*: una pequeña dirección que apunta al mismo objeto en memoria. Ahora `a` y `b` son dos nombres para un solo objeto, así que `b.value = 10` cambia lo que ve `a.value`.\n\nEl modelo mental habitual: los primitivos viven en la **pila (stack)** (espacios rápidos de tamaño fijo), los objetos viven en el **montón (heap)** (una gran reserva compartida), y las variables de objeto guardan la *dirección* de su objeto en el heap.",
      },
    },
    {
      type: "visual",
      diagram: `        STACK                        HEAP
   ┌─────────────┐
   │  a ──┐      │            ┌───────────────────┐
   │      ▼      │            │      0x001        │
   │    0x001    │ ─────────► │   { value: 5 }    │
   │      ▲      │            └───────────────────┘
   │  b ──┘      │
   └─────────────┘

   Both variables hold the SAME address,
   so they point to the SAME object.


        STACK                        HEAP
   ┌─────────────┐
   │  a: 5       │            (nothing here —
   │  b: 5       │             primitives live
   └─────────────┘              on the stack)

   Two separate copies — changing b
   doesn't touch a.`,
      caption: {
        en: "Top: two names, one object. Bottom: two independent copies.",
        es: "Arriba: dos nombres, un objeto. Abajo: dos copias independientes.",
      },
      body: {
        en: "Read the top diagram slowly: `a` and `b` each hold `0x001` — an address, not an object. The object itself lives once, in the heap. When you write `b.value = 10`, JavaScript follows `b`'s address and mutates the one shared object — which is exactly what `a` sees too.\n\nContrast that with the bottom: two primitive slots, each holding its own `5`. `b = 10` rewrites only `b`'s slot.",
        es: "Lee el diagrama superior despacio: `a` y `b` guardan `0x001` — una dirección, no un objeto. El objeto en sí vive una sola vez, en el heap. Cuando escribes `b.value = 10`, JavaScript sigue la dirección de `b` y muta el único objeto compartido — que es exactamente lo que `a` también ve.\n\nCompáralo con el de abajo: dos espacios primitivos, cada uno con su propio `5`. `b = 10` solo reescribe el espacio de `b`.",
      },
    },
    {
      type: "code",
      heading: { en: "Watch the shared object change", es: "Mira cómo cambia el objeto compartido" },
      code: `const a = { value: 5 };
const b = a; // same object, new name

b.value = 10;
console.log(a.value); // 10 — not 5!`,
      caption: {
        en: "Run it: a.value is 10, because a and b point to the same object.",
        es: "Ejecútalo: a.value es 10, porque a y b apuntan al mismo objeto.",
      },
    },
    {
      type: "lab",
      heading: { en: "Open the Memory Lab", es: "Abre el laboratorio de memoria" },
      body: {
        en: "Step through assignments and watch variables, addresses, stack and heap update side by side. Try to predict each step before you run it — that's where the intuition forms.",
        es: "Recorre las asignaciones paso a paso y observa cómo se actualizan variables, direcciones, pila y montón. Intenta predecir cada paso antes de ejecutarlo — ahí es donde nace la intuición.",
      },
      lab: "memory-reference",
    },
    {
      type: "code",
      heading: { en: "Two traps: === and shallow copies", es: "Dos trampas: === y las copias superficiales" },
      code: `const a = { value: 1 };
const b = { value: 1 };
console.log(a === b); // false — two different objects!

const user = { name: "Ada", address: { city: "Lima" } };
const copy = { ...user }; // shallow copy!
copy.address.city = "Cusco";
console.log(user.address.city); // "Cusco" — spread copied the reference`,
      caption: {
        en: "=== compares addresses, and spread only copies the top level.",
        es: "=== compara direcciones, y spread solo copia el nivel superior.",
      },
    },
    {
      type: "mistake",
      wrong: `const a = { score: 10 };
const b = { score: 10 };

if (a === b) {
  console.log("same!");
} else {
  console.log("different"); // <- this runs
}`,
      right: `const a = { score: 10 };
const b = { score: 10 };

function sameScore(x, y) {
  return x.score === y.score; // compare the CONTENTS
}
console.log(sameScore(a, b)); // true`,
      explanation: {
        en: "`===` on objects compares **references** (memory addresses), not content. Two identical-looking objects living in different memory slots are never `===`. Compare the properties you actually care about, or use a deep-equality helper.",
        es: "`===` con objetos compara **referencias** (direcciones de memoria), no contenido. Dos objetos idénticos en apariencia que viven en posiciones distintas de memoria nunca son `===`. Compara las propiedades que te importan, o usa una función de igualdad profunda.",
      },
    },
    {
      type: "mistake",
      wrong: `const user = { name: "Ada", address: { city: "Lima" } };
const backup = { ...user }; // "a copy" — or is it?
backup.address.city = "Cusco";
console.log(user.address.city); // "Cusco" — the original changed!`,
      right: `const user = { name: "Ada", address: { city: "Lima" } };
const backup = structuredClone(user); // true deep copy
backup.address.city = "Cusco";
console.log(user.address.city); // "Lima" — original untouched`,
      explanation: {
        en: "Spread `{...obj}` copies only the **top level**. Nested objects are still shared by reference, so mutating `backup.address` mutates `user.address` too. For a real deep copy, use the built-in `structuredClone()`.",
        es: "Spread `{...obj}` solo copia el **nivel superior**. Los objetos anidados siguen compartidos por referencia, así que mutar `backup.address` también muta `user.address`. Para una copia profunda de verdad, usa `structuredClone()`, que viene integrado.",
      },
    },
    {
      type: "takeaway",
      body: {
        en: "Primitives are copied **by value** (independent copies); objects are copied **by reference** (shared addresses into the heap). `===` on objects checks whether two variables point at the *same* object, and `{...obj}` is only a shallow copy — nested objects stay shared. `structuredClone()` gives you a real deep copy.",
        es: "Los primitivos se copian **por valor** (copias independientes); los objetos se copian **por referencia** (direcciones compartidas hacia el heap). `===` con objetos comprueba si dos variables apuntan al *mismo* objeto, y `{...obj}` es solo una copia superficial — los objetos anidados siguen compartidos. `structuredClone()` te da una copia profunda de verdad.",
      },
    },
    {
      type: "underhood",
      title: { en: "Who cleans up the heap?", es: "¿Quién limpia el heap?" },
      body: {
        en: "When no variable points to a heap object anymore — no references left — JavaScript's **garbage collector** reclaims that memory automatically. You never free memory by hand; the collector watches for unreachable objects and sweeps them up in the background. That's why `let big = { ...hugeData }; big = null;` lets the engine recycle the object: the reference is gone, so the object becomes unreachable.",
        es: "Cuando ninguna variable apunta ya a un objeto del heap — no quedan referencias — el **recolector de basura** (garbage collector) de JavaScript recupera esa memoria automáticamente. Nunca liberas memoria a mano; el recolector detecta los objetos inalcanzables y los barre en segundo plano. Por eso `let big = { ...datosEnormes }; big = null;` permite al motor reciclar el objeto: la referencia desapareció, así que el objeto se volvió inalcanzable.",
      },
    },
  ],
  quiz: [
    {
      q: {
        en: "What will this code output?",
        es: "¿Qué mostrará este código?",
      },
      code: "const a = [1, 2];\nconst b = a;\nb.push(3);\nconsole.log(a);",
      options: [
        { en: "[1, 2]", es: "[1, 2]" },
        { en: "[1, 2, 3]", es: "[1, 2, 3]" },
        { en: "undefined", es: "undefined" },
        { en: "Error", es: "Error" },
      ],
      answer: 1,
      explanation: {
        en: "`b = a` copies the **reference**, not the array — so `a` and `b` are two names for the same array. `b.push(3)` mutates that shared array, and `a` sees the change: `[1, 2, 3]`.",
        es: "`b = a` copia la **referencia**, no la array — así que `a` y `b` son dos nombres para la misma array. `b.push(3)` muta esa array compartida, y `a` ve el cambio: `[1, 2, 3]`.",
      },
    },
    {
      q: {
        en: "What will this code output?",
        es: "¿Qué mostrará este código?",
      },
      code: "let a = 5;\nlet b = a;\nb = 10;\nconsole.log(a);",
      options: [
        { en: "5", es: "5" },
        { en: "10", es: "10" },
        { en: "undefined", es: "undefined" },
        { en: "Error", es: "Error" },
      ],
      answer: 0,
      explanation: {
        en: "Numbers are primitives, copied **by value**. `b = a` gives `b` its own independent `5`; reassigning `b` leaves `a` untouched.",
        es: "Los números son primitivos y se copian **por valor**. `b = a` le da a `b` su propio `5` independiente; reasignar `b` deja `a` intacto.",
      },
    },
    {
      q: {
        en: "What will this code output?",
        es: "¿Qué mostrará este código?",
      },
      code: "const a = { value: 1 };\nconst b = { value: 1 };\nconsole.log(a === b);",
      options: [
        { en: "true", es: "true" },
        { en: "false", es: "false" },
        { en: "Error", es: "Error" },
        { en: '"1"', es: '"1"' },
      ],
      answer: 1,
      explanation: {
        en: "`===` on objects compares **references**, not content. `a` and `b` are two separate objects in memory, so the comparison is `false` even though they look identical.",
        es: "`===` con objetos compara **referencias**, no contenido. `a` y `b` son dos objetos distintos en memoria, así que la comparación es `false` aunque se vean idénticos.",
      },
    },
    {
      q: {
        en: "What will this code output?",
        es: "¿Qué mostrará este código?",
      },
      code: "const a = { n: { x: 1 } };\nconst b = { ...a };\nb.n.x = 2;\nconsole.log(a.n.x);",
      options: [
        { en: "1", es: "1" },
        { en: "2", es: "2" },
        { en: "undefined", es: "undefined" },
        { en: "Error", es: "Error" },
      ],
      answer: 1,
      explanation: {
        en: "Spread makes a **shallow** copy: `b.n` still references the same nested object as `a.n`. Changing `b.n.x` changes it for `a` too — the answer is `2`.",
        es: "Spread hace una copia **superficial**: `b.n` sigue referenciando al mismo objeto anidado que `a.n`. Cambiar `b.n.x` lo cambia también para `a` — la respuesta es `2`.",
      },
    },
  ],
  sandbox: "memory-reference",
};
