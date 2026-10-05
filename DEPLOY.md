# Deploy — JavaScript Fundamentals Academy

Static-first Vite + React app. No backend, no env vars, no secrets.

## GitHub → Vercel (recommended)

1. Create a repo (e.g. `js-academy`) and push this directory:
   ```bash
   git init
   git add .
   git commit -m "JS Academy MVP"
   git branch -M main
   git remote add origin git@github.com:<user>/js-academy.git
   git push -u origin main
   ```
2. In Vercel: **Add New → Project → Import** the repo.
   - Framework preset: **Vite** (auto-detected)
   - Build command: `npm run build`
   - Output directory: `dist`
3. `vercel.json` is already included: SPA rewrites (`/(.*)` → `/index.html`)
   so `/learn/variables` etc. work on refresh, plus immutable caching for `/assets/*`.
4. Vercel Analytics: the `@vercel/analytics` package is already wired
   (`<Analytics />` in `src/App.jsx` + `trackEvent()` product events).
   Enable **Analytics** in the Vercel project dashboard (Web Analytics tab).

## PWA

`vite-plugin-pwa` generates `sw.js` + `manifest.webmanifest` at build time.
Icons live in `public/icons/`. The service worker precaches the app shell;
lesson data and labs are lazy-loaded chunks and get cached on first visit.

## Local

```bash
npm install
npm run dev      # dev server
npm run build    # production build → dist/
npm run preview  # serve the production build
```

## Notes

- All user code runs locally in a sandboxed iframe; nothing is sent anywhere.
- Progress is stored in `localStorage` (`jsa-progress-v1`); language in
  `jsa-lang`; theme in `jsa-theme`. No accounts.
- Analytics events (`lesson_opened`, `lesson_completed`, `sandbox_run`,
  `challenge_completed`, `quiz_completed`, `lab_opened`, `language_changed`,
  `pwa_installed`) carry no personal data and never include user code.
