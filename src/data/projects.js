/**
 * Mini projects. Each project is a guided build with goals and starter code.
 * { id, level, title: {en,es}, description: {en,es}, goals: [{en,es}],
 *   starter: code string, lab: "/labs/dom-playground" | "/playground" }
 */
export const PROJECTS = [
  {
    id: "counter",
    level: "beginner",
    title: { en: "Counter", es: "Contador" },
    description: {
      en: "The classic first project: a number on the page with + and − buttons. State, events and DOM updates in one small app.",
      es: "El primer proyecto clásico: un número en la página con botones + y −. Estado, eventos y actualizaciones del DOM en una app pequeña.",
    },
    goals: [
      { en: "Show the count on the page", es: "Mostrar el contador en la página" },
      { en: "The + button increments the count", es: "El botón + incrementa el contador" },
      { en: "The − button decrements the count", es: "El botón − decrementa el contador" },
      { en: "Show negative numbers in red", es: "Mostrar los negativos en rojo" },
      { en: "Stretch: add a Reset button", es: "Extra: añade un botón de reinicio" },
    ],
    starter: `// Counter — builds its own UI so it runs anywhere
document.body.innerHTML = \`
  <h2>Counter</h2>
  <button id="minus">−</button>
  <span id="count" style="font-size:2rem;margin:0 16px">0</span>
  <button id="plus">+</button>\`;

let count = 0;
const display = document.querySelector("#count");

function render() {
  display.textContent = count;
  display.style.color = count < 0 ? "red" : "";
}

document.querySelector("#plus").addEventListener("click", () => {
  count++;
  render();
});

document.querySelector("#minus").addEventListener("click", () => {
  count--;
  render();
});`,
    lab: "/labs/dom-playground",
  },
  {
    id: "calculator",
    level: "beginner",
    title: { en: "Calculator", es: "Calculadora" },
    description: {
      en: "Two inputs, an operator and an = button. Practice reading form values, mapping operators to functions and handling divide-by-zero.",
      es: "Dos entradas, un operador y un botón =. Practica leer valores de formularios, mapear operadores a funciones y gestionar la división por cero.",
    },
    goals: [
      { en: "Read both numbers when = is clicked", es: "Leer ambos números al pulsar =" },
      { en: "Apply the selected operator", es: "Aplicar el operador seleccionado" },
      { en: "Show the result on the page", es: "Mostrar el resultado en la página" },
      { en: "Handle divide-by-zero gracefully", es: "Gestionar la división por cero con elegancia" },
      { en: "Stretch: also calculate on Enter", es: "Extra: calcular también con Enter" },
    ],
    starter: `// Calculator — builds its own UI so it runs anywhere
document.body.innerHTML = \`
  <h2>Calculator</h2>
  <input id="a" type="number" value="3" style="width:70px">
  <select id="op">
    <option>+</option><option>−</option><option>×</option><option>÷</option>
  </select>
  <input id="b" type="number" value="4" style="width:70px">
  <button id="eq">=</button>
  <p>Result: <strong id="out">?</strong></p>\`;

const ops = {
  "+": (a, b) => a + b,
  "−": (a, b) => a - b,
  "×": (a, b) => a * b,
  "÷": (a, b) => (b === 0 ? "∞ (cannot divide by zero)" : a / b),
};

document.querySelector("#eq").addEventListener("click", () => {
  const a = Number(document.querySelector("#a").value);
  const b = Number(document.querySelector("#b").value);
  const op = document.querySelector("#op").value;
  document.querySelector("#out").textContent = ops[op](a, b);
});`,
    lab: "/labs/dom-playground",
  },
  {
    id: "todo-list",
    level: "beginner",
    title: { en: "Todo List", es: "Lista de tareas" },
    description: {
      en: "Add tasks, mark them done, delete them. The full CRUD cycle on the DOM with createElement and event listeners.",
      es: "Añade tareas, márcalas como hechas, elimínalas. El ciclo CRUD completo sobre el DOM con createElement y event listeners.",
    },
    goals: [
      { en: "Add a task from the input", es: "Añadir una tarea desde el input" },
      { en: "Add with the Enter key too", es: "Añadir también con la tecla Enter" },
      { en: "Mark tasks as done (toggle)", es: "Marcar tareas como hechas (alternar)" },
      { en: "Delete tasks", es: "Eliminar tareas" },
      { en: "Show a message when the list is empty", es: "Mostrar un mensaje cuando la lista esté vacía" },
      { en: "Stretch: persist with localStorage", es: "Extra: persistir con localStorage" },
    ],
    starter: `// Todo List — builds its own UI so it runs anywhere
document.body.innerHTML = \`
  <h2>Todo List</h2>
  <input id="task" placeholder="New task…">
  <button id="add">Add</button>
  <ul id="list"></ul>\`;

const list = document.querySelector("#list");
const input = document.querySelector("#task");

function addTask(text) {
  const li = document.createElement("li");
  const span = document.createElement("span");
  span.textContent = text;

  const done = document.createElement("button");
  done.textContent = "✓";
  done.addEventListener("click", () => {
    span.style.textDecoration =
      span.style.textDecoration === "line-through" ? "" : "line-through";
  });

  const del = document.createElement("button");
  del.textContent = "✕";
  del.addEventListener("click", () => li.remove());

  li.append(span, " ", done, " ", del);
  list.append(li);
}

function submit() {
  const text = input.value.trim();
  if (text) {
    addTask(text);
    input.value = "";
    input.focus();
  }
}

document.querySelector("#add").addEventListener("click", submit);
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") submit();
});`,
    lab: "/labs/dom-playground",
  },
  {
    id: "quiz-app",
    level: "intermediate",
    title: { en: "Quiz App", es: "App de quiz" },
    description: {
      en: "A multiple-choice quiz with score tracking and a results screen. Data-driven rendering: the UI is generated from a questions array.",
      es: "Un quiz de opción múltiple con puntuación y pantalla de resultados. Renderizado guiado por datos: la interfaz se genera desde un array de preguntas.",
    },
    goals: [
      { en: "Render each question from the data array", es: "Renderizar cada pregunta desde el array de datos" },
      { en: "Handle answer clicks and advance", es: "Gestionar clics de respuesta y avanzar" },
      { en: "Track the score", es: "Llevar la puntuación" },
      { en: "Show a final results screen", es: "Mostrar una pantalla final de resultados" },
      { en: "Add a Play again button", es: "Añadir un botón de jugar de nuevo" },
      { en: "Stretch: shuffle the questions", es: "Extra: barajar las preguntas" },
    ],
    starter: `// Quiz App — data-driven UI
const QUESTIONS = [
  { q: "2 + 2 = ?", options: ["3", "4", "5"], answer: 1 },
  { q: "Which method transforms each element?", options: ["filter", "map", "forEach"], answer: 1 },
  { q: "typeof null is…", options: ["null", "undefined", "object"], answer: 2 },
];

document.body.innerHTML = "<h2>Quiz</h2><div id='quiz'></div>";
const box = document.querySelector("#quiz");
let current = 0;
let score = 0;

function renderQuestion() {
  const { q, options } = QUESTIONS[current];
  box.innerHTML = "";
  const p = document.createElement("p");
  p.innerHTML = "<strong>Q" + (current + 1) + ".</strong> " + q;
  box.append(p);
  options.forEach((opt, i) => {
    const btn = document.createElement("button");
    btn.textContent = opt;
    btn.style.marginRight = "8px";
    btn.addEventListener("click", () => answer(i));
    box.append(btn);
  });
}

function answer(i) {
  if (i === QUESTIONS[current].answer) score++;
  current++;
  if (current < QUESTIONS.length) {
    renderQuestion();
  } else {
    box.innerHTML =
      "<h3>Score: " + score + "/" + QUESTIONS.length + "</h3>" +
      "<button id='again'>Play again</button>";
    document.querySelector("#again").addEventListener("click", () => {
      current = 0;
      score = 0;
      renderQuestion();
    });
  }
}

renderQuestion();`,
    lab: "/labs/dom-playground",
  },
  {
    id: "expense-tracker",
    level: "intermediate",
    title: { en: "Expense Tracker", es: "Registro de gastos" },
    description: {
      en: "Log expenses, see the running total, delete entries. Arrays of objects plus reduce for the total — real app data flow.",
      es: "Registra gastos, mira el total acumulado, elimina entradas. Arrays de objetos más reduce para el total — flujo de datos de app real.",
    },
    goals: [
      { en: "Add an expense (name + amount)", es: "Añadir un gasto (nombre + cantidad)" },
      { en: "Render the expense list", es: "Renderizar la lista de gastos" },
      { en: "Compute the total with reduce", es: "Calcular el total con reduce" },
      { en: "Delete individual expenses", es: "Eliminar gastos individuales" },
      { en: "Validate the input (no empty/negative amounts)", es: "Validar la entrada (sin cantidades vacías/negativas)" },
      { en: "Stretch: persist with localStorage", es: "Extra: persistir con localStorage" },
    ],
    starter: `// Expense Tracker — builds its own UI so it runs anywhere
document.body.innerHTML = \`
  <h2>Expense Tracker</h2>
  <input id="name" placeholder="What?">
  <input id="amount" type="number" placeholder="€" style="width:80px">
  <button id="add">Add</button>
  <ul id="list"></ul>
  <p>Total: <strong id="total">0.00</strong></p>\`;

let expenses = [];

function render() {
  const list = document.querySelector("#list");
  list.innerHTML = "";
  expenses.forEach((e, i) => {
    const li = document.createElement("li");
    li.textContent = e.name + ": €" + e.amount.toFixed(2) + " ";
    const del = document.createElement("button");
    del.textContent = "✕";
    del.addEventListener("click", () => {
      expenses.splice(i, 1);
      render();
    });
    li.append(del);
    list.append(li);
  });
  const total = expenses.reduce((sum, e) => sum + e.amount, 0);
  document.querySelector("#total").textContent = "€" + total.toFixed(2);
}

document.querySelector("#add").addEventListener("click", () => {
  const name = document.querySelector("#name").value.trim();
  const amount = Number(document.querySelector("#amount").value);
  if (name && amount > 0) {
    expenses.push({ name, amount });
    render();
  }
});

render();`,
    lab: "/labs/dom-playground",
  },
  {
    id: "search-filter",
    level: "intermediate",
    title: { en: "Search Filter", es: "Filtro de búsqueda" },
    description: {
      en: "A live search box filtering a product list as you type. The input event, string matching and re-rendering — the core of every search UI.",
      es: "Una caja de búsqueda que filtra una lista de productos mientras escribes. El evento input, coincidencia de cadenas y re-renderizado — el núcleo de toda interfaz de búsqueda.",
    },
    goals: [
      { en: "Filter the list on every keystroke", es: "Filtrar la lista con cada pulsación" },
      { en: "Make the search case-insensitive", es: "Hacer la búsqueda insensible a mayúsculas" },
      { en: "Show a 'no matches' state", es: "Mostrar un estado de 'sin resultados'" },
      { en: "Show all items when the query is empty", es: "Mostrar todo cuando la búsqueda está vacía" },
      { en: "Stretch: highlight the matched text", es: "Extra: resaltar el texto coincidente" },
    ],
    starter: `// Search Filter — live filtering as you type
document.body.innerHTML = \`
  <h2>Search Filter</h2>
  <input id="q" placeholder="Search products…" style="width:220px">
  <ul id="results"></ul>\`;

const PRODUCTS = [
  { name: "Mechanical keyboard", price: 89 },
  { name: "Wireless mouse", price: 39 },
  { name: "4K monitor", price: 399 },
  { name: "USB-C hub", price: 49 },
  { name: "Noise-cancelling headphones", price: 249 },
  { name: "Webcam 1080p", price: 79 },
];

const input = document.querySelector("#q");
const results = document.querySelector("#results");

function render(query) {
  const q = query.trim().toLowerCase();
  const matches = PRODUCTS.filter((p) =>
    p.name.toLowerCase().includes(q)
  );
  results.innerHTML = matches.length
    ? matches.map((p) => "<li>" + p.name + " — €" + p.price + "</li>").join("")
    : "<li><em>No matches</em></li>";
}

input.addEventListener("input", (e) => render(e.target.value));
render("");`,
    lab: "/labs/dom-playground",
  },
  {
    id: "weather-dashboard",
    level: "intermediate",
    title: { en: "Weather Dashboard", es: "Panel del tiempo" },
    description: {
      en: "Fetch weather for several cities from a mock API and render a dashboard. Async/await, error handling and loading states in practice.",
      es: "Obtén el tiempo de varias ciudades desde una API simulada y renderiza un panel. Async/await, manejo de errores y estados de carga en la práctica.",
    },
    goals: [
      { en: "Fetch each city's weather with async/await", es: "Obtener el tiempo de cada ciudad con async/await" },
      { en: "Render a card per city", es: "Renderizar una tarjeta por ciudad" },
      { en: "Handle unknown cities with try/catch", es: "Gestionar ciudades desconocidas con try/catch" },
      { en: "Show a loading state while fetching", es: "Mostrar un estado de carga mientras se obtiene" },
      { en: "Stretch: add wind speed to the mock API", es: "Extra: añadir velocidad del viento a la API simulada" },
    ],
    starter: `// Weather Dashboard — with a MOCK API (no network).
// The Fetch Playground lab teaches the real fetch pattern.

const MOCK_WEATHER = {
  Madrid: { temp: 24, condition: "Sunny", humidity: 35 },
  London: { temp: 14, condition: "Rainy", humidity: 82 },
  Tokyo: { temp: 19, condition: "Cloudy", humidity: 60 },
};

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

async function getWeather(city) {
  await delay(600); // pretend network latency
  const data = MOCK_WEATHER[city];
  if (!data) throw new Error("Unknown city: " + city);
  return { city, ...data };
}

async function showDashboard() {
  console.log("Loading…");
  for (const city of Object.keys(MOCK_WEATHER)) {
    try {
      const w = await getWeather(city);
      console.log(w.city + ": " + w.temp + "°C, " + w.condition + ", humidity " + w.humidity + "%");
    } catch (e) {
      console.log("Error:", e.message);
    }
  }
  // Try an unknown city to see the error path:
  try {
    await getWeather("Atlantis");
  } catch (e) {
    console.log("Error:", e.message);
  }
}

showDashboard();

// YOUR TURN: render these as DOM cards instead of console lines.`,
    lab: "/playground",
  },
  {
    id: "memory-game",
    level: "advanced",
    title: { en: "Memory Game", es: "Juego de memoria" },
    description: {
      en: "Flip cards, find the pairs. Shuffling, game state, timers and a win condition — the biggest project in the collection.",
      es: "Voltea cartas, encuentra las parejas. Barajado, estado del juego, temporizadores y condición de victoria — el proyecto más grande de la colección.",
    },
    goals: [
      { en: "Shuffle the deck (Fisher–Yates)", es: "Barajar la mazo (Fisher–Yates)" },
      { en: "Flip a card on click", es: "Voltear una carta al hacer clic" },
      { en: "Detect matching pairs", es: "Detectar parejas coincidentes" },
      { en: "Flip back mismatches after a delay", es: "Volver a tapar los fallos tras una pausa" },
      { en: "Count moves and detect the win", es: "Contar movimientos y detectar la victoria" },
      { en: "Stretch: add a Restart button", es: "Extra: añadir un botón de reinicio" },
    ],
    starter: `// Memory Game — flip cards, find the pairs
document.body.innerHTML = \`
  <h2>Memory Game</h2>
  <p>Moves: <strong id="moves">0</strong> · Pairs: <strong id="pairs">0</strong>/6</p>
  <div id="board" style="display:grid;grid-template-columns:repeat(4,64px);gap:8px"></div>
  <p id="win"></p>\`;

const SYMBOLS = ["🍎","🍎","🚀","🚀","🎧","🎧","🌵","🌵","🐙","🐙","⚡","⚡"];

// Fisher–Yates shuffle
for (let i = SYMBOLS.length - 1; i > 0; i--) {
  const j = Math.floor(Math.random() * (i + 1));
  [SYMBOLS[i], SYMBOLS[j]] = [SYMBOLS[j], SYMBOLS[i]];
}

const board = document.querySelector("#board");
let first = null;
let lock = false;
let moves = 0;
let pairs = 0;

SYMBOLS.forEach((sym) => {
  const card = document.createElement("button");
  card.textContent = "?";
  card.style.cssText = "width:64px;height:64px;font-size:28px;cursor:pointer";
  card.addEventListener("click", () => flip(card, sym));
  board.append(card);
});

function flip(card, sym) {
  if (lock || card.textContent !== "?") return;
  card.textContent = sym;

  if (!first) {
    first = { card, sym };
    return;
  }

  moves++;
  document.querySelector("#moves").textContent = moves;

  if (first.sym === sym) {
    pairs++;
    document.querySelector("#pairs").textContent = pairs;
    first = null;
    if (pairs === 6) {
      document.querySelector("#win").textContent =
        "🎉 You won in " + moves + " moves!";
    }
  } else {
    lock = true;
    const prev = first;
    first = null;
    setTimeout(() => {
      card.textContent = "?";
      prev.card.textContent = "?";
      lock = false;
    }, 700);
  }
}`,
    lab: "/labs/dom-playground",
  },
];
