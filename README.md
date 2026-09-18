# drink-it-lp

Landing page, privacy policy, and browser-playable game for **Drink It: Cards & Shots**.

The marketing pages (`index.html`, `privacy-policy.html`) are static HTML — no build step, no dependencies. The game at `/jogar/` is a Vite + React web port of the mobile app and does have a build step (see [Web game](#web-game-jogar) below).

## Files

| File | Description |
|---|---|
| `index.html` | Landing page (LP) |
| `privacy-policy.html` | Privacy policy |
| `assets/ptbr/` | Screenshots in Brazilian Portuguese |
| `assets/en/` | Screenshots in English |
| `assets/es/` | Screenshots in Spanish |
| `game/` | Source of the browser game (Vite + React + TypeScript) |
| `jogar/` | **Built** output of `game/`, served at `/jogar/` — commit this after rebuilding |

## i18n

Both pages support **PT / EN / ES** via a language switcher in the nav. Language preference is persisted in `localStorage` and auto-detected from `navigator.language` on first visit.

To update copy, edit the `t` object inside the `<script>` tag at the bottom of each file.

## Assets

Each locale folder contains:

```
three.png       — 3-phone hero composite (used on the LP hero)
Slice 1–4.png   — App Store promotional screenshots (used in the screenshots carousel)
home.png        — Main game screen
users.png       — Player setup screen
share.png       — End-game results / report screen
```

## Deployment

Drop both HTML files, the `assets/` folder, and the `jogar/` folder on any static host (GitHub Pages, Netlify, Vercel, etc.). No server-side logic required — the game is a fully client-side single-page app, routed client-side with a hash router (`/jogar/#/game`, etc.) so it needs no server-side rewrite rules.

The `privacy-policy.html` URL must be kept stable — it is linked from the App Store and Google Play listings.

## Web game (`/jogar`)

`game/` is a from-scratch web port of the mobile app (`abagtech/drink-it`, React Native/Expo) built with Vite + React + TypeScript + Tailwind CSS. It reimplements the full card game — all minigame types, i18n (pt-BR/en-US/es-ES), player setup, session history, and an end-game report/ranking card you can share or download as an image — so it can be played straight from the browser, no app store required.

Game state persists to `localStorage` instead of the app's MMKV, and ads/analytics are stubbed out as no-ops (`src/core/ads`, `src/core/analytics.ts`) since there's no web ad or analytics account configured yet — wire a real provider into those two files when one exists.

### Rebuilding

GitHub Pages has no CI build step, so the compiled `jogar/` folder is committed directly and must be rebuilt by hand after any change to `game/`:

```bash
cd game
npm install     # first time only
npm run build   # builds to game/dist, then a postbuild step syncs it to ../jogar
git add ../jogar
```

Useful commands from `game/`:

```bash
npm run dev     # local dev server with hot reload
npm run build   # typecheck + production build to dist/, synced to ../jogar
npm run lint    # ESLint
```

Vite's own `outDir` is `game/dist` (not `../jogar` directly) because a Vercel
project is also connected to this repo with `game` as its root directory —
Vercel builds `game/` and expects the output inside it. The `postbuild`
script (`scripts/sync-to-jogar.mjs`) copies `dist/` to `../jogar` afterward so
both deployments stay in sync from one `npm run build`.
