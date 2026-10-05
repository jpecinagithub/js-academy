// Module 7 — Arrays. See SCHEMA.md for the section contract.
export default {
  id: "arrays",
  module: 7,
  level: "beginner",
  stub: false,
  title: { en: "Arrays", es: "Arrays" },
  tagline: {
    en: "map, filter, reduce — see every element travel through.",
    es: "map, filter, reduce — mira cada elemento viajar a través de ellos.",
  },
  sections: [
    {
      type: "concept",
      heading: { en: "Lists with superpowers", es: "Listas con superpoderes" },
      body: {
        en: `An **array** is an ordered list: \`const scores = [3, 8, 12, 4, 20];\`. Elements sit at numbered positions starting at **0** — \`scores[0]\` is \`3\`.

First, the mechanics for changing the list itself:

- \`push(x)\` / \`pop()\` — add / remove at the **end**
- \`unshift(x)\` / \`shift()\` — add / remove at the **start**
- \`slice(a, b)\` — *copies* a piece out, original untouched
- \`splice(a, n)\` — *cuts* \`n\` elements out, original changed

Then come the stars — methods that take a **callback** and run it once per element: \`map\` transforms every element, \`filter\` keeps the ones that pass a test, \`reduce\` boils the whole array down to a single value, \`find\` grabs the first match, and \`some\` / \`every\` answer yes-or-no questions.`,
        es: `Un **array** es una lista ordenada: \`const scores = [3, 8, 12, 4, 20];\`. Los elementos ocupan posiciones numeradas que empiezan en **0**: \`scores[0]\` es \`3\`.

Primero, la mecánica para cambiar la propia lista:

- \`push(x)\` / \`pop()\` — añadir / quitar al **final**
- \`unshift(x)\` / \`shift()\` — añadir / quitar al **principio**
- \`slice(a, b)\` — *copia* un trozo fuera, el original intacto
- \`splice(a, n)\` — *corta* \`n\` elementos, el original cambia

Y luego llegan las estrellas: métodos que reciben un **callback** y lo ejecutan una vez por elemento. \`map\` transforma cada elemento, \`filter\` conserva los que pasan una prueba, \`reduce\` reduce todo el array a un único valor, \`find\` toma la primera coincidencia, y \`some\` / \`every\` responden preguntas de sí o no.`,
      },
    },
    {
      type: "visual",
      diagram: `index:   0     1     2     3     4
arr = [ "a", "b", "c", "d", "e" ]

slice(1, 3)  ->  [ "b", "c" ]     arr stays [ "a", "b", "c", "d", "e" ]
                  copy out,       original UNTOUCHED

splice(1, 2) ->  [ "b", "c" ]     arr becomes [ "a", "d", "e" ]
                  cut out,        original CHANGED`,
      caption: {
        en: "Same return value, opposite side effects. slice copies, splice cuts.",
        es: "Mismo valor de retorno, efectos secundarios opuestos. slice copia, splice corta.",
      },
    },
    {
      type: "code",
      heading: { en: "The trio: map, filter, reduce", es: "El trío: map, filter, reduce" },
      code: `const numbers = [3, 8, 12, 4, 20];

// map: transform EVERY element -> a new array
const doubled = numbers.map(n => n * 2);
console.log("map:   ", doubled);

// filter: keep only elements that pass the test -> a new array
const big = numbers.filter(n => n > 10);
console.log("filter:", big);

// reduce: boil it all down to ONE value (sum starts at 0)
const total = numbers.reduce((sum, n) => sum + n, 0);
console.log("reduce:", total);`,
      caption: {
        en: "Run it: three methods, three answers, and the original array is never touched.",
        es: "Ejecútalo: tres métodos, tres respuestas, y el array original nunca se toca.",
      },
    },
    {
      type: "lab",
      lab: "array-lab",
      heading: { en: "Follow every element", es: "Sigue a cada elemento" },
      body: {
        en: `Open the **Array Lab** and push \`[3, 8, 12, 4, 20]\` through \`map\`, \`filter\` and \`reduce\` one element at a time. Watch each value enter the callback, get transformed or tested, and land in the new array. This is the single most useful mental movie in JavaScript.`,
        es: `Abre el **laboratorio de Arrays** y pasa \`[3, 8, 12, 4, 20]\` por \`map\`, \`filter\` y \`reduce\` elemento a elemento. Observa cómo cada valor entra en el callback, se transforma o se evalúa, y aterriza en el nuevo array. Esta es la película mental más útil de todo JavaScript.`,
      },
    },
    {
      type: "code",
      heading: { en: "find, some, every — the question askers", es: "find, some, every — los que hacen preguntas" },
      code: `const numbers = [3, 8, 12, 4, 20];

console.log("find:", numbers.find(n => n > 10));       // first match: 12
console.log("some > 15?", numbers.some(n => n > 15));  // is ANY true? -> true
console.log("every > 2?", numbers.every(n => n > 2));  // are ALL true? -> true
console.log("every > 10?", numbers.every(n => n > 10)); // -> false`,
      caption: {
        en: "`find` returns the element itself; `some` and `every` return booleans.",
        es: "`find` devuelve el propio elemento; `some` y `every` devuelven booleanos.",
      },
    },
    {
      type: "mistake",
      wrong: `const numbers = [1, 2, 3];
const result = numbers.forEach(n => n * 2);
console.log(result); // undefined - forEach returns NOTHING`,
      right: `const numbers = [1, 2, 3];
const result = numbers.map(n => n * 2);
console.log(result); // [2, 4, 6] - map builds a NEW array`,
      explanation: {
        en: `The classic mix-up. **\`forEach\`** is for *side effects* — logging, saving, updating the page — and always returns \`undefined\`. If you want a **new array** back, you want **\`map\`**. When the doubled values vanish into thin air, check: did you write \`forEach\` where you meant \`map\`?`,
        es: `La confusión clásica. **\`forEach\`** es para *efectos secundarios* — mostrar por consola, guardar, actualizar la página — y siempre devuelve \`undefined\`. Si quieres **un nuevo array** de vuelta, necesitas **\`map\`**. Cuando los valores duplicados se esfumen en el aire, comprueba: ¿escribiste \`forEach\` donde querías decir \`map\`?`,
      },
    },
    {
      type: "challenge-ref",
      challenge: "fizzbuzz",
    },
    {
      type: "takeaway",
      body: {
        en: `**\`map\` transforms, \`filter\` selects, \`reduce\` summarizes** — and all three return a new array, leaving the original untouched. \`forEach\` is for side effects only. When in doubt, ask: *do I want a new array back?* Yes → \`map\`.`,
        es: `**\`map\` transforma, \`filter\` selecciona, \`reduce\` resume** — y los tres devuelven un nuevo array, dejando el original intacto. \`forEach\` es solo para efectos secundarios. Ante la duda, pregunta: *¿quiero un nuevo array de vuelta?* Sí → \`map\`.`,
      },
    },
    {
      type: "underhood",
      title: { en: "Chains: arrays that never mutate", es: "Cadenas: arrays que nunca mutan" },
      body: {
        en: `Because \`map\` and \`filter\` return new arrays, you can **chain** them: \`numbers.filter(n => n > 5).map(n => n * 2)\`. Read it as a pipeline — first keep the big ones, then double them — and the original array survives every step. This style, transforming data without mutating it, is the doorway to module 9, where we meet *references* and learn why a new array is not the same as the old one.`,
        es: `Como \`map\` y \`filter\` devuelven nuevos arrays, puedes **encadenarlos**: \`numbers.filter(n => n > 5).map(n => n * 2)\`. Léelo como una tubería: primero conserva los grandes, luego duplícalos, y el array original sobrevive a cada paso. Este estilo de transformar datos sin mutarlos es la puerta al módulo 9, donde conoceremos las *referencias* y aprenderemos por qué un array nuevo no es el mismo que el viejo.`,
      },
    },
  ],
  quiz: [
    {
      q: { en: "What does this expression return?", es: "¿Qué devuelve esta expresión?" },
      code: `[1, 2, 3].map(x => x * 2);`,
      options: [
        { en: "[2, 4, 6]", es: "[2, 4, 6]" },
        { en: "[1, 2, 3]", es: "[1, 2, 3]" },
        { en: "undefined", es: "undefined" },
        { en: "[3, 6, 9]", es: "[3, 6, 9]" },
      ],
      answer: 0,
      explanation: {
        en: `\`map\` runs the callback once per element and collects the results into a **new array**: 1→2, 2→4, 3→6. The original array is untouched.`,
        es: `\`map\` ejecuta el callback una vez por elemento y recoge los resultados en un **nuevo array**: 1→2, 2→4, 3→6. El array original queda intacto.`,
      },
    },
    {
      q: { en: "What does this expression return?", es: "¿Qué devuelve esta expresión?" },
      code: `[3, 8, 12, 4, 20].filter(n => n > 10);`,
      options: [
        { en: "[12, 20]", es: "[12, 20]" },
        { en: "[8, 12, 20]", es: "[8, 12, 20]" },
        { en: "[3, 8, 4]", es: "[3, 8, 4]" },
        { en: "true", es: "true" },
      ],
      answer: 0,
      explanation: {
        en: `\`filter\` keeps only the elements where the test is \`true\`. 8 fails the \`> 10\` test, so only 12 and 20 survive — in their original order.`,
        es: `\`filter\` conserva solo los elementos donde la prueba es \`true\`. El 8 no pasa la prueba \`> 10\`, así que solo sobreviven el 12 y el 20, en su orden original.`,
      },
    },
    {
      q: { en: "After these lines, what is part — and what happened to arr?", es: "Tras estas líneas, ¿qué vale part y qué le pasó a arr?" },
      code: `const arr = [1, 2, 3, 4];
const part = arr.slice(1, 3);`,
      options: [
        { en: "part is [2, 3]; arr is unchanged", es: "part es [2, 3]; arr no cambió" },
        { en: "part is [2, 3]; arr lost those elements", es: "part es [2, 3]; arr perdió esos elementos" },
        { en: "part is [2, 3, 4]; arr is unchanged", es: "part es [2, 3, 4]; arr no cambió" },
      ],
      answer: 0,
      explanation: {
        en: `\`slice(1, 3)\` copies from index 1 up to (but not including) index 3 — and never touches the original. If you wanted to *cut* elements out of \`arr\`, that is \`splice\`'s job.`,
        es: `\`slice(1, 3)\` copia desde el índice 1 hasta (sin incluir) el índice 3, y nunca toca el original. Si quisieras *cortar* elementos de \`arr\`, ese es el trabajo de \`splice\`.`,
      },
    },
    {
      q: { en: "What does this expression return?", es: "¿Qué devuelve esta expresión?" },
      code: `[1, 2, 3, 4].reduce((sum, n) => sum + n, 0);`,
      options: [
        { en: "10", es: "10" },
        { en: "24", es: "24" },
        { en: "[1, 2, 3, 4]", es: "[1, 2, 3, 4]" },
        { en: "undefined", es: "undefined" },
      ],
      answer: 0,
      explanation: {
        en: `\`reduce\` folds the array into one value. Starting at 0: 0+1=1, 1+2=3, 3+3=6, 6+4=10. The second argument (0) is the accumulator's starting value — forget it and the first element takes its place.`,
        es: `\`reduce\` pliega el array en un solo valor. Empezando en 0: 0+1=1, 1+2=3, 3+3=6, 6+4=10. El segundo argumento (0) es el valor inicial del acumulador: si lo olvidas, el primer elemento ocupa su lugar.`,
      },
    },
    {
      q: { en: "Why does result print undefined here?", es: "¿Por qué result muestra undefined aquí?" },
      code: `const result = [1, 2, 3].forEach(n => n * 2);
console.log(result);`,
      options: [
        { en: "forEach returns nothing — it is for side effects, not new arrays", es: "forEach no devuelve nada: es para efectos secundarios, no para nuevos arrays" },
        { en: "The callback has a bug", es: "El callback tiene un error" },
        { en: "map was needed to print anything", es: "Se necesitaba map para mostrar algo" },
      ],
      answer: 0,
      explanation: {
        en: `\`forEach\` runs your callback for its side effects and always returns \`undefined\`. Want a new array of results? That is \`map\`'s whole job — swap the method name and the values appear.`,
        es: `\`forEach\` ejecuta tu callback por sus efectos secundarios y siempre devuelve \`undefined\`. ¿Quieres un nuevo array con los resultados? Ese es todo el trabajo de \`map\`: cambia el nombre del método y los valores aparecen.`,
      },
    },
  ],
  sandbox: "array-lab",
};
