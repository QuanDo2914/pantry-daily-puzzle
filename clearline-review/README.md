# Clearline review package

Branch: `codex/pantry-clearline-full-library`.
Status: isolated development preview; not merged or deployed.

## Open locally

Run `npm run build && npm run dev`, then visit:

- Playable Quality V3 boards: `http://127.0.0.1:4173/?preview=v3`
- Complete ingredient and recipe gallery: `http://127.0.0.1:4173/clearline-preview/gallery.html`

The preview offers 10 existing V3 Medium and 10 existing V3 Hard boards. Board selection, undo, reset, hints, reveal, exact-quantity selection, and the win condition use the current game engine. Preview progress is kept in memory and is not written to the daily-game save. The default daily-puzzle source remains untouched on this branch; the V3 boards are loaded only through the explicit review preview. V4 is not used.

## Coverage

| Item | Result |
| --- | ---: |
| Approved ingredient IDs with explicit custom vector art | 90 / 90 |
| V3 recipe IDs with prepared-dish art | 150 / 150 |
| Medium and Hard recipe variant renders | 300 / 300 |
| Distinct rendered dish drawings per mode | 150 / 150 |
| Legacy daily-board ingredient IDs covered | 23 / 23 |
| Legacy base recipe cards rendered | 44 / 44 |
| Emoji or generic fallback paths in renderer | 0 |

The vector library lives in [`src/visuals/clearline.js`](../src/visuals/clearline.js). Ingredients have explicit ID-specific SVG geometry. Recipes are composed from a prepared-dish vessel/construction, real catalog ingredients, and preparation-specific details; the renderer rejects missing ingredient art. Similar families such as soups/bakes, bowls/skillets, pizzas, burgers, and breakfast dishes have separate forms. Medium and Hard art follows the actual variant ingredients when they differ. The module memoizes SVG strings; the app service worker caches the renderer and stylesheet.

## QA and screenshots

`npm test`, `npm run build`, and `node scripts/validate-puzzles.mjs` pass. The browser preview was checked at desktop, 375 px, and 430 px. A V3 Hard board was completed through the real selection/win flow. Hard pantry labels and quantities remain readable; mobile recipe cards show all ingredient quantities without needing an expansion tap. Reduced-motion settings disable the light hover motion.

Screenshots:

- [V3 Medium desktop](screenshots/v3-medium-desktop.jpg)
- [V3 Hard desktop](screenshots/v3-hard-desktop.jpg)
- [V3 Hard at 375 px](screenshots/v3-hard-375.jpg)
- [V3 Hard recipe detail at 375 px](screenshots/v3-hard-recipes-375.jpg)
- [V3 Hard at 430 px](screenshots/v3-hard-430.jpg)
- [V3 Hard recipe detail at 430 px](screenshots/v3-hard-recipes-430.jpg)
- [Gallery desktop](screenshots/gallery-desktop.jpg)
- [Gallery at 375 px](screenshots/gallery-375.jpg)

## Review notes

The artwork is complete at the catalog-ID level, but it is still a design review, not a production art sign-off. Prepared-dish compositions intentionally favor small-size clarity over texture or photorealism. Recipe names and exact quantities remain visible alongside artwork; no illustration is required to carry the puzzle logic on its own. The next step is visual approval and real-player usability feedback, not another content-generation search.
