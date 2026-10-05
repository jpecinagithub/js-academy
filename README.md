# JavaScript Fundamentals Academy

**Learn JavaScript by manipulating JavaScript.** An interactive, bilingual (ES/EN) educational web app: 25 progressive modules, 23 interactive laboratories, test-based challenges, a JS playground, cheat sheet, glossary, knowledge map and mini projects — 100% client-side, no accounts, no backend, no AI dependencies.

> *Read less. Manipulate more.* — every concept answers: what is it, what is it for, what happens inside, and what happens if I change it?

## Run it

```bash
npm install
npm run dev      # dev server
npm run build    # production build → dist/
npm run preview  # serve the production build
```

Deploy: push to GitHub and import in Vercel (see `DEPLOY.md`). Framework preset: Vite. `vercel.json` already contains SPA rewrites and asset caching.

## Architecture

```
src/
  main.jsx            # entry + service-worker registration
  App.jsx             # router + providers (language, progress, theme)
  index.css           # design system ("interactive developer laboratory")
  i18n/               # en.js / es.js — centralized UI strings (no partial translations)
  state/progress.jsx  # localStorage progress: modules, quizzes, challenges, labs
  analytics/track.js  # Vercel Analytics events (no personal data, never user code)
  runtime/            # sandboxed code execution
    sandbox.js        # hidden iframe (srcDoc) + postMessage + timeout watchdog
    useSandbox.js     # React hook around it
  components/         # CodeEditor, Console, CodeBlock, Quiz, LessonShell, Layout…
  labs/               # 23 interactive laboratories (React.lazy, one chunk each)
  data/
    lessons/          # 25 modules as data (see SCHEMA.md) — lazy-loaded
    challenges.js     # test-based challenges + sandbox harness
    cheatsheet.js     # searchable reference
    glossary.js       # terms with examples + module links
    projects.js       # 8 guided mini projects
  pages/              # Landing, Home, Learn, ModulePage, LabsPage, Playground,
                      # Challenges, Projects, CheatSheet, Glossary, KnowledgeMap, About
```

### Code execution model

User code **never** runs in the React app's context:

```
React app → code → sandboxed iframe (allow-scripts, opaque origin)
                → captured console → postMessage → React UI
```

A 3s watchdog destroys a hung iframe (infinite-loop safe); async top-level promise returns are awaited. Lesson `code` sections, the Playground and challenge tests all go through this runtime.

### Content model

Lessons are data (`src/data/lessons/mNN-*.js`), rendered by `LessonShell` through the arc: concept → visual → runnable code → lab → common mistake → challenge → takeaway → under-the-hood. Each module ends with 3–5 "what will this output?" quiz questions; best scores persist locally.

## Conventions

- Every user-facing string exists in `en` **and** `es` (central `i18n/` for UI, local `STRINGS` in labs, `{en, es}` fields in lesson data).
- Labs are scripted pedagogical simulators, lazy-loaded via `src/labs/index.js`.
- No purple AI gradients: dark "lab" theme (default) + light theme, mint/amber accents.
- Accessibility: keyboard-navigable, aria labels, `prefers-reduced-motion` respected.
- Privacy: code runs locally; the footer states it. Analytics events carry no personal data.

Created by **Jon Peciña Iturbe**.
