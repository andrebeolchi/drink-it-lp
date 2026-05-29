# drink-it-lp

Landing page and privacy policy for **Drink It: Cards & Shots**.

Static HTML — no build step, no dependencies.

## Files

| File | Description |
|---|---|
| `index.html` | Landing page (LP) |
| `privacy-policy.html` | Privacy policy |
| `assets/ptbr/` | Screenshots in Brazilian Portuguese |
| `assets/en/` | Screenshots in English |
| `assets/es/` | Screenshots in Spanish |

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

Drop both HTML files and the `assets/` folder on any static host (GitHub Pages, Netlify, Vercel, etc.). No server-side logic required.

The `privacy-policy.html` URL must be kept stable — it is linked from the App Store and Google Play listings.
