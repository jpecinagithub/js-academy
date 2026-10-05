/**
 * Challenges. Tests run locally in the sandbox.
 * Each test: { call: "fn(args)", expected: <JSON-serializable> }.
 * The harness appends: run user code, eval each call, deep-compare via JSON.
 * Expanded in Phase 5 — keep the same shape.
 */

export function buildHarness(userCode, tests, helpers = "") {
  const testsJson = JSON.stringify(tests);
  // NOTE: the final `return` must be top-level in the sandbox's
  // `new Function(...)` body — otherwise the result is discarded.
  // The harness is async: `await` works in test calls; the sandbox
  // waits for the returned promise before reporting completion.
  return `${userCode}

${helpers}

;return (async () => {
  const __tests = ${testsJson};
  const __out = [];
  for (const t of __tests) {
    let actual;
    let err = null;
    try {
      actual = await eval(t.call);
    } catch (e) {
      err = e && e.name ? e.name + ": " + e.message : String(e);
    }
    let pass = false;
    if (err === null) {
      try {
        pass = JSON.stringify(actual) === JSON.stringify(t.expected);
      } catch (e) {
        pass = false;
      }
    }
    __out.push({ call: t.call, expected: t.expected, actual: err !== null ? err : actual, pass });
  }
  // Return JSON so the parent can parse results deterministically.
  // (JSON.stringify drops undefined/function values — acceptable for tests.)
  return JSON.stringify(__out);
})();`;
}

export const CHALLENGES = [
  {
    id: "fizzbuzz",
    level: "beginner",
    title: { en: "FizzBuzz", es: "FizzBuzz" },
    description: {
      en: "Write a function `fizzBuzz(n)` that returns an array from 1 to `n`, replacing multiples of 3 with `\"Fizz\"`, multiples of 5 with `\"Buzz\"`, and multiples of both with `\"FizzBuzz\"`.",
      es: "Escribe una función `fizzBuzz(n)` que devuelva un array del 1 al `n`, sustituyendo los múltiplos de 3 por `\"Fizz\"`, los de 5 por `\"Buzz\"` y los de ambos por `\"FizzBuzz\"`.",
    },
    starter: `function fizzBuzz(n) {
  // your code here
}`,
    hint: {
      en: "Loop from 1 to n. Check % 15 first, then % 3, then % 5.",
      es: "Recorre del 1 al n. Comprueba % 15 primero, luego % 3 y luego % 5.",
    },
    tests: [
      { call: "fizzBuzz(3)", expected: [1, 2, "Fizz"] },
      { call: "fizzBuzz(5)", expected: [1, 2, "Fizz", 4, "Buzz"] },
      {
        call: "fizzBuzz(15)",
        expected: [1, 2, "Fizz", 4, "Buzz", "Fizz", 7, 8, "Fizz", "Buzz", 11, "Fizz", 13, 14, "FizzBuzz"],
      },
    ],
  },
  {
    id: "reverse-string",
    level: "beginner",
    title: { en: "Reverse a string", es: "Invertir una cadena" },
    description: {
      en: "Write `reverse(str)` that returns the string reversed. Try doing it without `.reverse()` first — then compare.",
      es: "Escribe `reverse(str)` que devuelva la cadena invertida. Intenta hacerlo sin `.reverse()` primero — luego compara.",
    },
    starter: `function reverse(str) {
  // your code here
}`,
    hint: {
      en: "Strings can be split into arrays: str.split(\"\").",
      es: "Las cadenas se pueden convertir en arrays: str.split(\"\").",
    },
    tests: [
      { call: 'reverse("hello")', expected: "olleh" },
      { call: 'reverse("JavaScript")', expected: "tpircSavaJ" },
      { call: 'reverse("")', expected: "" },
    ],
  },
  {
    id: "palindrome",
    level: "beginner",
    title: { en: "Palindrome checker", es: "Detector de palíndromos" },
    description: {
      en: "Write `isPalindrome(str)` that returns `true` if the string reads the same forwards and backwards (case-insensitive, ignoring spaces).",
      es: "Escribe `isPalindrome(str)` que devuelva `true` si la cadena se lee igual al derecho y al revés (sin distinguir mayúsculas y ignorando espacios).",
    },
    starter: `function isPalindrome(str) {
  // your code here
}`,
    hint: {
      en: "Normalize first: str.toLowerCase().replace(/ /g, \"\"). Then compare with its reverse.",
      es: "Normaliza primero: str.toLowerCase().replace(/ /g, \"\"). Luego compara con su inversa.",
    },
    tests: [
      { call: 'isPalindrome("racecar")', expected: true },
      { call: 'isPalindrome("Race car")', expected: true },
      { call: 'isPalindrome("hello")', expected: false },
    ],
  },
  {
    id: "count-vowels",
    level: "beginner",
    title: { en: "Count vowels", es: "Contar vocales" },
    description: {
      en: "Write `countVowels(str)` that returns how many vowels (`a, e, i, o, u` — lowercase and uppercase) the string contains.",
      es: "Escribe `countVowels(str)` que devuelva cuántas vocales (`a, e, i, o, u` — minúsculas y mayúsculas) contiene la cadena.",
    },
    starter: `function countVowels(str) {
  // your code here
}`,
    hint: {
      en: 'Loop over the characters and check whether "aeiouAEIOU" includes each one.',
      es: 'Recorre los caracteres y comprueba si "aeiouAEIOU" incluye cada uno.',
    },
    tests: [
      { call: 'countVowels("hello")', expected: 2 },
      { call: 'countVowels("JAVASCRIPT")', expected: 3 },
      { call: 'countVowels("rhythm")', expected: 0 },
      { call: 'countVowels("")', expected: 0 },
    ],
  },
  {
    id: "max-number",
    level: "beginner",
    title: { en: "Find the maximum", es: "Encontrar el máximo" },
    description: {
      en: "Write `maxNumber(arr)` that returns the largest number in the array — without using `Math.max`.",
      es: "Escribe `maxNumber(arr)` que devuelva el número más grande del array — sin usar `Math.max`.",
    },
    starter: `function maxNumber(arr) {
  // your code here
}`,
    hint: {
      en: "Start with the first element, then compare it against every other one.",
      es: "Empieza con el primer elemento y compáralo con todos los demás.",
    },
    tests: [
      { call: "maxNumber([3, 7, 2, 9, 1])", expected: 9 },
      { call: "maxNumber([-5, -2, -9])", expected: -2 },
      { call: "maxNumber([42])", expected: 42 },
    ],
  },
  {
    id: "filter-adults",
    level: "intermediate",
    title: { en: "Filter adults", es: "Filtrar adultos" },
    description: {
      en: "Write `filterAdults(users)` that takes an array of `{ name, age }` objects and returns the names of the users aged 18 or older.",
      es: "Escribe `filterAdults(users)` que reciba un array de objetos `{ name, age }` y devuelva los nombres de los usuarios de 18 años o más.",
    },
    starter: `function filterAdults(users) {
  // your code here
}`,
    hint: {
      en: "Filter by age >= 18 first, then map to the name.",
      es: "Filtra por age >= 18 primero y luego quédate con el name.",
    },
    tests: [
      {
        call: 'filterAdults([{ name: "Ada", age: 36 }, { name: "Leo", age: 12 }, { name: "Kim", age: 18 }])',
        expected: ["Ada", "Kim"],
      },
      { call: 'filterAdults([{ name: "Max", age: 17 }])', expected: [] },
      { call: "filterAdults([])", expected: [] },
    ],
  },
  {
    id: "flatten-array",
    level: "intermediate",
    title: { en: "Flatten one level", es: "Aplanar un nivel" },
    description: {
      en: "Write `flatten(arr)` that flattens an array of arrays by exactly one level: `[[1, 2], [3], [4, 5]]` → `[1, 2, 3, 4, 5]`.",
      es: "Escribe `flatten(arr)` que aplane un array de arrays exactamente un nivel: `[[1, 2], [3], [4, 5]]` → `[1, 2, 3, 4, 5]`.",
    },
    starter: `function flatten(arr) {
  // your code here
}`,
    hint: {
      en: "Concatenate the sub-arrays into a fresh array — reduce or concat both work.",
      es: "Concatena los sub-arrays en un array nuevo — reduce o concat sirven.",
    },
    tests: [
      { call: "flatten([[1, 2], [3], [4, 5]])", expected: [1, 2, 3, 4, 5] },
      { call: "flatten([[], [1], []])", expected: [1] },
      { call: "flatten([1, 2, 3])", expected: [1, 2, 3] },
    ],
  },
  {
    id: "group-by-key",
    level: "intermediate",
    title: { en: "Group by key", es: "Agrupar por clave" },
    description: {
      en: "Write `groupByKey(items, key)` that groups an array of objects by the given key, returning an object whose values are arrays with the matching items.",
      es: "Escribe `groupByKey(items, key)` que agrupe un array de objetos por la clave dada, devolviendo un objeto cuyos valores son arrays con los elementos correspondientes.",
    },
    starter: `function groupByKey(items, key) {
  // your code here
}`,
    hint: {
      en: "Loop the items and push each one into result[item[key]], creating the bucket first if needed.",
      es: "Recorre los elementos y mete cada uno en result[item[key]], creando el cubo primero si hace falta.",
    },
    tests: [
      {
        call: 'groupByKey([{ t: "a", k: 1 }, { t: "b", k: 2 }, { t: "c", k: 1 }], "k")',
        expected: { 1: [{ t: "a", k: 1 }, { t: "c", k: 1 }], 2: [{ t: "b", k: 2 }] },
      },
      {
        call: 'groupByKey([{ role: "admin", name: "A" }, { role: "user", name: "B" }], "role")',
        expected: { admin: [{ role: "admin", name: "A" }], user: [{ role: "user", name: "B" }] },
      },
      { call: 'groupByKey([], "k")', expected: {} },
    ],
  },
  {
    id: "debounce",
    level: "advanced",
    title: { en: "Debounce", es: "Debounce" },
    description: {
      en: "Write `debounce(fn, ms)` that returns a wrapper: every call resets an `ms`-millisecond timer, and `fn` runs only after the calls stop for `ms` ms (with the last call's arguments).",
      es: "Escribe `debounce(fn, ms)` que devuelva una envoltura: cada llamada reinicia un temporizador de `ms` milisegundos y `fn` solo se ejecuta cuando las llamadas cesan durante `ms` ms (con los argumentos de la última llamada).",
    },
    starter: `function debounce(fn, ms) {
  // your code here
}`,
    hint: {
      en: "Keep a timer id in a closure; on each call, clearTimeout the previous timer and set a new one.",
      es: "Guarda el id del temporizador en una clausura; en cada llamada haz clearTimeout del anterior y crea uno nuevo.",
    },
    helpers: `const __sleepDbg = (ms) => new Promise((res) => setTimeout(res, ms));
async function __testDebounce() {
  let calls = 0;
  const debounced = debounce(() => { calls++; }, 50);
  debounced();
  debounced();
  debounced();
  await __sleepDbg(120);
  return calls;
}
async function __testDebounceArgs() {
  const seen = [];
  const debounced = debounce((v) => seen.push(v), 50);
  debounced(1);
  debounced(2);
  await __sleepDbg(120);
  return seen;
}`,
    tests: [
      { call: "__testDebounce()", expected: 1 },
      { call: "__testDebounceArgs()", expected: [2] },
    ],
  },
  {
    id: "promise-sequence",
    level: "advanced",
    title: { en: "Promise sequence", es: "Secuencia de promesas" },
    description: {
      en: "Write `async function runSequence(tasks)` that runs an array of promise-returning functions **in order**, waiting for each one before starting the next, and returns an array with all the results.",
      es: "Escribe `async function runSequence(tasks)` que ejecute un array de funciones que devuelven promesas **en orden**, esperando a cada una antes de empezar la siguiente, y devuelva un array con todos los resultados.",
    },
    starter: `async function runSequence(tasks) {
  // your code here
}`,
    hint: {
      en: "A for…of loop with await runs them one at a time. Promise.all does NOT — it starts everything at once.",
      es: "Un bucle for…of con await las ejecuta de una en una. Promise.all NO — arranca todo a la vez.",
    },
    helpers: `const __seqOrder = [];
const __sleepSeq = (ms) => new Promise((res) => setTimeout(res, ms));
function __seqTasks() {
  __seqOrder.length = 0;
  return [
    () => new Promise((res) => setTimeout(() => { __seqOrder.push("a"); res("A"); }, 130)),
    () => new Promise((res) => setTimeout(() => { __seqOrder.push("b"); res("B"); }, 85)),
    () => new Promise((res) => setTimeout(() => { __seqOrder.push("c"); res("C"); }, 40)),
  ];
}
async function __testSequence() {
  const results = await runSequence(__seqTasks());
  return { results, order: __seqOrder.slice() };
}`,
    tests: [
      {
        call: "__testSequence()",
        expected: { results: ["A", "B", "C"], order: ["a", "b", "c"] },
      },
    ],
  },
];
