# Lesson data schema

Each module is a JS file in `src/data/lessons/` exporting a default lesson object.
**Every user-facing string must exist in both `en` and `es`.** No partial translations.

```js
export default {
  id: "variables",          // unique slug, used in URLs: /learn/variables
  module: 1,                // display number (0..24)
  level: "beginner",        // "beginner" | "intermediate" | "advanced"
  stub: false,              // true only for temporary scaffolding
  title: { en: "...", es: "..." },
  tagline: { en: "...", es: "..." },   // one-line hook
  sections: [ ... ],
  quiz: [ ... ],            // 3-5 questions
  sandbox: "variable-lab",  // optional: main lab key for this module
};
```

## Section types (rendered in order — follow the UX arc)

| type | fields | renders |
|---|---|---|
| `concept` | `heading{en,es}`, `body{en,es}` (lite markdown) | numbered section heading + markdown |
| `visual` | `diagram` (ascii art string), `caption{en,es}?`, `body{en,es}?` | styled ascii diagram block |
| `code` | `heading{en,es}?`, `code` (JS string), `caption{en,es}?`, `body{en,es}?` | **runnable** snippet: runs in the isolated sandbox, output below |
| `lab` | `heading{en,es}?`, `body{en,es}?`, `lab` (key from `src/labs/index.js`) | lazy-loaded interactive laboratory |
| `mistake` | `wrong` (code), `right` (code), `explanation{en,es}` | "Common mistake" box + fix box |
| `challenge-ref` | `challenge` (challenge id) | link card to the challenge |
| `takeaway` | `body{en,es}` | highlighted key-takeaway box |
| `underhood` | `title{en,es}?`, `body{en,es}` | collapsible "Under the hood" details |

Recommended arc: `concept → visual → code → lab → code → mistake → challenge-ref → takeaway → (underhood)`.

## Lite markdown (in `body` fields)

- paragraphs separated by blank lines
- `## Heading` (h2, unnumbered)
- `**bold**`, `` `code` ``
- `- bullet` lists, `1. numbered` lists
- `> quote` → callout box
- ` ``` ` fenced code block (plain, not runnable)

## Quiz items

```js
{
  q: { en: "What will this code output?", es: "¿Qué mostrará este código?" },
  code: "let x = 1;\n...",          // optional
  options: [ {en:"A", es:"A"}, ... ], // 3-4 options; keep them short
  answer: 1,                          // index of correct option
  explanation: { en: "...", es: "..." }, // markdown lite, shown after answering
}
```

Prefer "what will this output?" / "why does this happen?" over memorization.

## Code samples

Keep runnable snippets short (< 25 lines), deterministic, no network, no
`alert/prompt` (disabled in sandbox), no infinite loops. The sandbox captures
`console.log/warn/error` and the return value, with a 3s timeout guard.
