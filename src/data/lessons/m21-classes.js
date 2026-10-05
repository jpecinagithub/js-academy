// Module 21: Classes — class syntax as sugar over the prototype model (Module 20).
export default {
  id: "classes",
  module: 21,
  level: "intermediate",
  stub: false,
  title: { en: "Classes", es: "Clases" },
  tagline: {
    en: "Cleaner syntax for the prototype model you already know — class, constructor, extends, super.",
    es: "Sintaxis más limpia para el modelo de prototipos que ya conoces: class, constructor, extends, super.",
  },
  sandbox: "prototype-explorer",
  sections: [
    {
      type: "concept",
      heading: { en: "A class is sugar over prototypes", es: "Una clase es azúcar sintáctico sobre prototipos" },
      body: {
        en: `In Module 20 you built objects with constructor functions and \`prototype\`. A **class** is a cleaner way to write *exactly that* — it does not create a new kind of object.

\`\`\`
class Dog {
  constructor(name) {   // runs when you call: new Dog("Rex")
    this.name = name;   // like any constructor function
  }
  bark() {              // method → lives on Dog.prototype
    return this.name + " says woof";
  }
}

const rex = new Dog("Rex");
rex.bark(); // "Rex says woof"
\`\`\`

- \`constructor\` is the function that runs when you call \`new\`.
- Methods written in the class body land on \`Dog.prototype\` — shared by every instance, just like Module 20.
- \`typeof Dog\` is \`"function"\`. A class *is* a function with a prototype. There is no magic.`,
        es: `En el módulo 20 construiste objetos con funciones constructoras y \`prototype\`. Una **clase** es una forma más limpia de escribir *exactamente eso* — no crea un nuevo tipo de objeto.

\`\`\`
class Dog {
  constructor(name) {   // se ejecuta al llamar: new Dog("Rex")
    this.name = name;   // como cualquier función constructora
  }
  bark() {              // método → vive en Dog.prototype
    return this.name + " dice guau";
  }
}

const rex = new Dog("Rex");
rex.bark(); // "Rex dice guau"
\`\`\`

- \`constructor\` es la función que se ejecuta al llamar a \`new\`.
- Los métodos escritos en el cuerpo de la clase aterrizan en \`Dog.prototype\` — compartidos por todas las instancias, igual que en el módulo 20.
- \`typeof Dog\` es \`"function"\`. Una clase *es* una función con un prototipo. No hay magia.`,
      },
    },
    {
      type: "visual",
      caption: {
        en: "Same machine, nicer dashboard: class syntax on the left, the prototype machinery it builds on the right.",
        es: "La misma máquina con un salpicadero más bonito: sintaxis de clase a la izquierda, la maquinaria de prototipos que construye a la derecha.",
      },
      diagram: `WHAT YOU WRITE                          WHAT THE ENGINE BUILDS
─────────────────                          ──────────────────────────
class Dog extends Animal {                 // 1. a constructor function
  constructor(name) {                      function Dog(name) {
    super(name);       ──────────┐            Animal.call(this, name);
    this.tricks = [];            │         }
  }                              │         // 2. prototype chain wiring
  bark() { ... }                 └─►       Dog.prototype = Object.create(
}                                              Animal.prototype);
                                           Dog.prototype.bark = function() { ... };

                                           // 3. the resulting chain:
                                           //
                                           //   rex ──► Dog.prototype ──► Animal.prototype
                                           //    ▲             │
                                           //    │   bark() lives here (shared)
                                           //  new Dog("Rex")`,
    },
    {
      type: "code",
      heading: { en: "Try it: classes are prototypes underneath", es: "Pruébalo: las clases son prototipos por debajo" },
      code: `class Counter {
  constructor() {
    this.count = 0;
  }
  increment() {
    this.count++;
  }
}

const c = new Counter();
c.increment();
c.increment();

console.log(c.count);                                    // 2
console.log(c instanceof Counter);                       // true
console.log(Object.getPrototypeOf(c) === Counter.prototype); // true
console.log(typeof Counter);                             // "function"`,
      caption: {
        en: "Every check confirms it: the instance links to Counter.prototype, and the class itself is a function.",
        es: "Cada comprobación lo confirma: la instancia enlaza con Counter.prototype y la clase en sí es una función.",
      },
    },
    {
      type: "lab",
      lab: "prototype-explorer",
      heading: { en: "Prototype Explorer", es: "Explorador de prototipos" },
      body: {
        en: "Open the lab and build the same `Counter` with a plain constructor function. Watch the prototype chain look **identical** to the class version — because it is.",
        es: "Abre el laboratorio y construye el mismo `Counter` con una función constructora normal. Observa que la cadena de prototipos es **idéntica** a la versión con clase — porque lo es.",
      },
    },
    {
      type: "concept",
      heading: { en: "Inheritance with extends and super", es: "Herencia con extends y super" },
      body: {
        en: "`extends` wires up the prototype chain for you: `Dog.prototype`'s prototype becomes `Animal.prototype`, so every `Dog` instance can use `Animal`'s methods.\n\n`super` has two jobs in a derived class:\n\n1. `super(...)` **as a function** — calls the parent constructor. You must call it before touching `this`.\n2. `super.method()` — calls a parent method, useful when you override it but still want the original behavior.",
        es: "`extends` conecta la cadena de prototipos por ti: el prototipo de `Dog.prototype` pasa a ser `Animal.prototype`, así cada instancia de `Dog` puede usar los métodos de `Animal`.\n\n`super` tiene dos trabajos en una clase derivada:\n\n1. `super(...)` **como función** — llama al constructor del padre. Debes llamarlo antes de tocar `this`.\n2. `super.method()` — llama a un método del padre, útil cuando lo sobrescribes pero quieres conservar el comportamiento original.",
      },
    },
    {
      type: "code",
      heading: { en: "Try it: extends in action", es: "Pruébalo: extends en acción" },
      code: `class Animal {
  constructor(name) {
    this.name = name;
  }
  speak() {
    return this.name + " makes a sound";
  }
}

class Dog extends Animal {
  constructor(name) {
    super(name); // must come before using 'this'
  }
  speak() {
    return super.speak() + " — woof!";
  }
}

const rex = new Dog("Rex");
console.log(rex.speak());
console.log(rex instanceof Dog);    // true
console.log(rex instanceof Animal); // true — the chain works`,
      caption: {
        en: "`instanceof` walks the chain: rex → Dog.prototype → Animal.prototype. That is all inheritance is.",
        es: "`instanceof` recorre la cadena: rex → Dog.prototype → Animal.prototype. Eso es todo lo que es la herencia.",
      },
    },
    {
      type: "mistake",
      wrong: `class Dog extends Animal {
  constructor(name) {
    this.name = name; // ReferenceError!
    super(name);
  }
}`,
      right: `class Dog extends Animal {
  constructor(name) {
    super(name);      // ✓ first: let the parent build 'this'
    this.name = name; // ✓ now it's safe to use
  }
}`,
      explanation: {
        en: "In a derived constructor, `this` doesn't exist until `super()` runs — the parent constructor is what creates it. Touching `this` first throws `ReferenceError: Must call super constructor before accessing 'this'`. Rule of thumb: **`super()` first, `this` second**.",
        es: "En un constructor derivado, `this` no existe hasta que se ejecuta `super()` — es el constructor del padre quien lo crea. Tocar `this` antes lanza `ReferenceError: Must call super constructor before accessing 'this'`. Regla de oro: **primero `super()`, después `this**`.",
      },
    },
    {
      type: "mistake",
      wrong: `class Dog {
  constructor(name) { this.name = name; }
}
const rex = Dog("Rex"); // TypeError!`,
      right: `class Dog {
  constructor(name) { this.name = name; }
}
const rex = new Dog("Rex"); // ✓ 'new' creates the instance`,
      explanation: {
        en: "Unlike plain constructor functions, a class **refuses** to run without `new`: `TypeError: Class constructor Dog cannot be invoked without 'new'`. It's a guardrail — calling a constructor as a regular function used to silently pollute the global object.",
        es: "A diferencia de las funciones constructoras normales, una clase **se niega** a ejecutarse sin `new`: `TypeError: Class constructor Dog cannot be invoked without 'new'`. Es una barandilla de seguridad — llamar a un constructor como función normal antes contaminaba silenciosamente el objeto global.",
      },
    },
    {
      type: "takeaway",
      body: {
        en: "**Classes are organized prototypes.** `class` gives you `constructor` + methods on the prototype in one tidy block; `extends` links the prototype chain; `super()` must run before `this` in a derived constructor; and a class can never be called without `new`.",
        es: "**Las clases son prototipos organizados.** `class` te da `constructor` + métodos en el prototipo en un solo bloque ordenado; `extends` enlaza la cadena de prototipos; `super()` debe ejecutarse antes de `this` en un constructor derivado; y una clase jamás puede llamarse sin `new`.",
      },
    },
    {
      type: "underhood",
      title: { en: "Under the hood: fields, static, and #private", es: "Bajo el capó: campos, static y #privado" },
      body: {
        en: "Modern classes have three more tricks, all still prototype machinery:\n\n- **Fields**: `class C { count = 0; }` — each instance gets its own `count`, as if assigned in the constructor.\n- **static**: `static version = 2;` — lives on the class itself (`C.version`), not on instances.\n- **#private**: `#secret = 42;` — truly private. Code outside the class can't even see it, unlike the old `_convention`.\n\nNone of this changes the model: instances delegate to `C.prototype`, which may delegate further up the chain.",
        es: "Las clases modernas tienen tres trucos más, todos maquinaria de prototipos:\n\n- **Campos**: `class C { count = 0; }` — cada instancia recibe su propio `count`, como si se asignara en el constructor.\n- **static**: `static version = 2;` — vive en la clase (`C.version`), no en las instancias.\n- **#privado**: `#secret = 42;` — de verdad privado. El código fuera de la clase ni siquiera puede verlo, a diferencia de la antigua convención `_`.\n\nNada de esto cambia el modelo: las instancias delegan en `C.prototype`, que puede delegar más arriba en la cadena.",
      },
    },
  ],
  quiz: [
    {
      q: { en: "What will this code output?", es: "¿Qué mostrará este código?" },
      code: `class Dog {}\nconsole.log(typeof Dog);`,
      options: [{ en: '"class"', es: '"class"' }, { en: '"function"', es: '"function"' }, { en: '"object"', es: '"object"' }],
      answer: 1,
      explanation: {
        en: "There is no `class` type in `typeof`. A class declaration creates a **function** with a `prototype` — proof that classes are sugar over the constructor/prototype model.",
        es: "No existe el tipo `class` en `typeof`. Una declaración de clase crea una **función** con un `prototype` — la prueba de que las clases son azúcar sobre el modelo constructor/prototipo.",
      },
    },
    {
      q: { en: "What will this code output?", es: "¿Qué mostrará este código?" },
      code: `class Counter {\n  constructor() { this.n = 0; }\n  inc() { this.n++; }\n}\nconst c = new Counter();\nconsole.log(c.inc === Counter.prototype.inc);`,
      options: [{ en: "true", es: "true" }, { en: "false", es: "false" }, { en: "TypeError", es: "TypeError" }],
      answer: 0,
      explanation: {
        en: "Methods defined in the class body live on `Counter.prototype` and are **shared** by all instances. `c.inc` is found by walking up the prototype chain — exactly like Module 20.",
        es: "Los métodos definidos en el cuerpo de la clase viven en `Counter.prototype` y se **comparten** entre todas las instancias. `c.inc` se encuentra subiendo por la cadena de prototipos — exactamente como en el módulo 20.",
      },
    },
    {
      q: { en: "What does `class Dog extends Animal` set up?", es: "¿Qué configura `class Dog extends Animal`?" },
      code: `class Animal {}\nclass Dog extends Animal {}`,
      options: [
        { en: "It copies Animal's methods into Dog", es: "Copia los métodos de Animal dentro de Dog" },
        { en: "It makes Dog.prototype inherit from Animal.prototype", es: "Hace que Dog.prototype herede de Animal.prototype" },
        { en: "It merges both classes into one", es: "Fusiona ambas clases en una sola" },
      ],
      answer: 1,
      explanation: {
        en: "`extends` links the chain: `Object.getPrototypeOf(Dog.prototype) === Animal.prototype`. Nothing is copied — instances *delegate* up the chain when a method isn't found locally.",
        es: "`extends` enlaza la cadena: `Object.getPrototypeOf(Dog.prototype) === Animal.prototype`. Nada se copia — las instancias *delegan* hacia arriba en la cadena cuando un método no se encuentra localmente.",
      },
    },
    {
      q: { en: "What happens here?", es: "¿Qué ocurre aquí?" },
      code: `class Dog {\n  constructor(n) { this.n = n; }\n}\nconst d = Dog("Rex");`,
      options: [
        { en: "d is a Dog named Rex", es: "d es un Dog llamado Rex" },
        { en: "TypeError: Class constructor cannot be invoked without 'new'", es: "TypeError: Class constructor cannot be invoked without 'new'" },
        { en: "d is undefined, silently", es: "d es undefined, en silencio" },
      ],
      answer: 1,
      explanation: {
        en: "Classes throw unless called with `new`. Plain constructor functions would run with `this` pointing at the global object — a classic source of bugs that classes eliminate.",
        es: "Las clases lanzan un error si no se llaman con `new`. Las funciones constructoras normales se ejecutarían con `this` apuntando al objeto global — una fuente clásica de errores que las clases eliminan.",
      },
    },
    {
      q: { en: "Why does this throw a ReferenceError?", es: "¿Por qué lanza esto un ReferenceError?" },
      code: `class Dog extends Animal {\n  constructor(name) {\n    this.tricks = [];\n    super(name);\n  }\n}`,
      options: [
        { en: "super() must be called before touching this", es: "super() debe llamarse antes de tocar this" },
        { en: "Derived classes can't have constructors", es: "Las clases derivadas no pueden tener constructor" },
        { en: "tricks must be declared as a field", es: "tricks debe declararse como campo" },
      ],
      answer: 0,
      explanation: {
        en: "In a derived class, `this` is created by the parent constructor — `super(name)` literally builds it. Using `this` before that is referencing something that doesn't exist yet.",
        es: "En una clase derivada, `this` lo crea el constructor del padre — `super(name)` literalmente lo construye. Usar `this` antes es referenciar algo que aún no existe.",
      },
    },
  ],
};
