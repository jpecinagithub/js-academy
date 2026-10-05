// Module 8 — Objects. See SCHEMA.md for the section contract.
export default {
  id: "objects",
  module: 8,
  level: "beginner",
  stub: false,
  title: { en: "Objects", es: "Objetos" },
  tagline: {
    en: "Properties, methods, destructuring — code, tree and JSON at once.",
    es: "Propiedades, métodos, desestructuración — código, árbol y JSON a la vez.",
  },
  sections: [
    {
      type: "concept",
      heading: { en: "Bundles of labeled data", es: "Paquetes de datos etiquetados" },
      body: {
        en: `An **object** bundles related values under labels. Each label-value pair is a **property**:

\`const user = { name: "Ana", age: 28 };\`

- Read with a dot: \`user.name\` → \`"Ana"\`. Use brackets when the key is dynamic: \`user["na" + "me"]\`.
- Add or change freely: \`user.city = "Madrid";\`
- A property whose value is a **function** is called a **method**: it is how objects *do* things, not just *store* things.
- Objects nest: a property can hold another object, or an array — \`user = { name: "Ana", pets: ["Rex"] }\` — as deep as you need.

Two shortcuts you will use constantly: **destructuring** unpacks properties into variables (\`const { name } = user;\`), and the **spread** operator (\`...\`) clones an object while changing a few keys.`,
        es: `Un **objeto** agrupa valores relacionados bajo etiquetas. Cada par etiqueta-valor es una **propiedad**:

\`const user = { name: "Ana", age: 28 };\`

- Se lee con un punto: \`user.name\` → \`"Ana"\`. Usa corchetes cuando la clave es dinámica: \`user["na" + "me"]\`.
- Añade o cambia libremente: \`user.city = "Madrid";\`
- Una propiedad cuyo valor es una **función** se llama **método**: es como los objetos *hacen* cosas, no solo *guardan* cosas.
- Los objetos se anidan: una propiedad puede contener otro objeto o un array — \`user = { name: "Ana", pets: ["Rex"] }\` — tan profundo como necesites.

Dos atajos que usarás constantemente: la **desestructuración** desempaqueta propiedades en variables (\`const { name } = user;\`), y el operador **spread** (\`...\`) clona un objeto cambiando algunas claves.`,
      },
    },
    {
      type: "visual",
      diagram: `CODE                        TREE
const user = {              user
  name: "Ana",                |-- name  -> "Ana"
  age: 28,                    |-- age   -> 28
  pets: ["Rex"]               +-- pets  -> [ "Rex" ]
};                                    |
                                 [0] -> "Rex"

JSON (same object, data-only):
{ "name": "Ana", "age": 28, "pets": ["Rex"] }`,
      caption: {
        en: "One object, three views: the code you write, the tree it becomes, and the JSON it travels as.",
        es: "Un objeto, tres vistas: el código que escribes, el árbol en que se convierte y el JSON en que viaja.",
      },
    },
    {
      type: "code",
      heading: { en: "Build it, grow it, make it talk", es: "Constrúyelo, hazlo crecer, hazlo hablar" },
      code: `const user = {
  name: "Ana",
  age: 28,
  greet() { return "Hi, I'm " + this.name; } // a method: a function ON the object
};

user.city = "Madrid";      // add a property any time
console.log(user.greet()); // "this" is the object before the dot
console.log(user.city);`,
      caption: {
        en: "Inside a method, `this` is simply the object the method was called on. (Module 19 takes `this` much further.)",
        es: "Dentro de un método, `this` es simplemente el objeto sobre el que se llamó al método. (El módulo 19 profundiza mucho más en `this`.)",
      },
    },
    {
      type: "lab",
      lab: "object-explorer",
      heading: { en: "Climb the JSON tree", es: "Escala el árbol JSON" },
      body: {
        en: `Open the **Object Explorer** and expand a nested object level by level: properties, methods, arrays inside objects, objects inside arrays. Collapse it back down and notice — the *shape* is the data. If you can draw the tree, you can read any object.`,
        es: `Abre el **Explorador de Objetos** y expande un objeto anidado nivel a nivel: propiedades, métodos, arrays dentro de objetos, objetos dentro de arrays. Colápsalo de nuevo y fíjate: la *forma* es el dato. Si puedes dibujar el árbol, puedes leer cualquier objeto.`,
      },
    },
    {
      type: "code",
      heading: { en: "Unpack with destructuring, clone with spread", es: "Desempaqueta con desestructuración, clona con spread" },
      code: `const user = { name: "Ana", age: 28, city: "Madrid" };

// Destructuring: pull properties out into variables
const { name, age } = user;
console.log(name, "is", age);

// Spread: clone the object, changing one key
const older = { ...user, age: 29 };
console.log("copy:", older.age, "| original:", user.age);`,
      caption: {
        en: "`{ ...user }` copies every property into a fresh object — the original stays exactly as it was.",
        es: "`{ ...user }` copia cada propiedad en un objeto nuevo: el original queda exactamente como estaba.",
      },
    },
    {
      type: "mistake",
      wrong: `const user = { name: "Ana" };
user = { name: "Luis" }; // TypeError: assignment to a constant!`,
      right: `const user = { name: "Ana" };
user.name = "Luis";   // mutating a PROPERTY: fine
user.city = "Madrid"; // adding a property: fine too
console.log(user.name); // "Luis"`,
      explanation: {
        en: `**\`const\` locks the label, not the box.** You cannot point \`user\` at a different object — that is rebinding, and it throws. But changing what is *inside* the object is perfectly fine, because the label still points at the same box. This is the doorway to module 9: variables hold *references* to objects, not the objects themselves.`,
        es: `**\`const\` bloquea la etiqueta, no la caja.** No puedes apuntar \`user\` a otro objeto: eso es reasignar, y lanza un error. Pero cambiar lo que hay *dentro* del objeto está perfectamente bien, porque la etiqueta sigue apuntando a la misma caja. Esta es la puerta al módulo 9: las variables contienen *referencias* a los objetos, no los objetos en sí.`,
      },
    },
    {
      type: "takeaway",
      body: {
        en: `Objects bundle related data — and the methods that work on it — under one name. Dot access for known keys, **destructuring** to unpack, **spread** to clone. And remember: \`const\` protects the binding, not the contents.`,
        es: `Los objetos agrupan datos relacionados — y los métodos que trabajan con ellos — bajo un solo nombre. Acceso con punto para claves conocidas, **desestructuración** para desempaquetar, **spread** para clonar. Y recuerda: \`const\` protege el enlace, no el contenido.`,
      },
    },
    {
      type: "underhood",
      title: { en: "Where do objects actually live?", es: "¿Dónde viven realmente los objetos?" },
      body: {
        en: `Under the hood, an object lives in the **heap** — a big shared memory pool — and your variable holds only a *reference*, like an address pointing at it. That is why two variables can point at the same object, and why \`const\` cannot freeze its contents. Module 9 dives into this: references are the single most important idea in JavaScript data.`,
        es: `Entre bastidores, un objeto vive en el **heap** — una gran reserva de memoria compartida — y tu variable solo contiene una *referencia*, como una dirección que apunta a él. Por eso dos variables pueden apuntar al mismo objeto, y por eso \`const\` no puede congelar su contenido. El módulo 9 se sumerge en esto: las referencias son la idea más importante en los datos de JavaScript.`,
      },
    },
  ],
  quiz: [
    {
      q: { en: "What will this code print?", es: "¿Qué mostrará este código?" },
      code: `const user = { name: "Ana", age: 28 };
const { name } = user;
console.log(name);`,
      options: [
        { en: "\"Ana\"", es: "\"Ana\"" },
        { en: "{ name: \"Ana\" }", es: "{ name: \"Ana\" }" },
        { en: "undefined", es: "undefined" },
        { en: "An error is thrown", es: "Se lanza un error" },
      ],
      answer: 0,
      explanation: {
        en: `Destructuring pulls the \`name\` property out of \`user\` into a brand-new variable. \`name\` is now the string \`"Ana"\` — the rest of the object stays behind.`,
        es: `La desestructuración extrae la propiedad \`name\` de \`user\` en una variable nueva. \`name\` ahora es la cadena \`"Ana"\`; el resto del objeto se queda atrás.`,
      },
    },
    {
      q: { en: "What will this code print?", es: "¿Qué mostrará este código?" },
      code: `const user = { name: "Ana", address: { city: "Madrid" } };
const copy = { ...user };
copy.address.city = "Lyon";
console.log(user.address.city);`,
      options: [
        { en: "\"Lyon\"", es: "\"Lyon\"" },
        { en: "\"Madrid\"", es: "\"Madrid\"" },
        { en: "undefined", es: "undefined" },
      ],
      answer: 0,
      explanation: {
        en: `Spread makes a **shallow** copy: top-level properties are cloned, but the nested \`address\` object is *shared* — \`copy.address\` and \`user.address\` point at the same object. Changing the city through one changes it for both. (Module 9 explains why.)`,
        es: `Spread hace una copia **superficial**: las propiedades de primer nivel se clonan, pero el objeto anidado \`address\` se *comparte*: \`copy.address\` y \`user.address\` apuntan al mismo objeto. Cambiar la ciudad a través de uno la cambia para ambos. (El módulo 9 explica por qué.)`,
      },
    },
    {
      q: { en: "What will this code print?", es: "¿Qué mostrará este código?" },
      code: `const user = {
  name: "Ana",
  greet() { return "Hi, I'm " + this.name; }
};
console.log(user.greet());`,
      options: [
        { en: "\"Hi, I'm Ana\"", es: "\"Hi, I'm Ana\"" },
        { en: "\"Hi, I'm undefined\"", es: "\"Hi, I'm undefined\"" },
        { en: "An error is thrown", es: "Se lanza un error" },
      ],
      answer: 0,
      explanation: {
        en: `When you call \`user.greet()\`, \`this\` is \`user\` — the object before the dot. So \`this.name\` is \`"Ana"\`. A method is just a function that knows which object it belongs to.`,
        es: `Cuando llamas \`user.greet()\`, \`this\` es \`user\`: el objeto antes del punto. Así que \`this.name\` es \`"Ana"\`. Un método es solo una función que sabe a qué objeto pertenece.`,
      },
    },
    {
      q: { en: "Which line throws an error?", es: "¿Qué línea lanza un error?" },
      code: `const user = { name: "Ana" };
user.name = "Luis";  // line A
user.city = "Madrid"; // line B
user = { name: "Eva" }; // line C`,
      options: [
        { en: "Line C — you cannot rebind a const variable", es: "Línea C: no puedes reasignar una variable const" },
        { en: "Line A — const objects are frozen", es: "Línea A: los objetos const están congelados" },
        { en: "Line B — you cannot add properties to const objects", es: "Línea B: no puedes añadir propiedades a objetos const" },
        { en: "None — all three lines work", es: "Ninguna: las tres líneas funcionan" },
      ],
      answer: 0,
      explanation: {
        en: `\`const\` locks the *binding* — the label \`user\` must always point at the same object — but the object's *contents* are free to change. Lines A and B mutate contents (fine); line C tries to rebind the label (TypeError).`,
        es: `\`const\` bloquea el *enlace*: la etiqueta \`user\` debe apuntar siempre al mismo objeto, pero el *contenido* del objeto puede cambiar libremente. Las líneas A y B mutan el contenido (bien); la línea C intenta reasignar la etiqueta (TypeError).`,
      },
    },
  ],
  sandbox: "object-explorer",
};
