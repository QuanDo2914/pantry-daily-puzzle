# Clearline artwork refinement — review package

Branch: `codex/pantry-clearline-art-refinement`. Status: preview only; not merged or deployed.

## Open locally

Run `npm run build && npm run dev` from this repository, then open:

- Playable Quality V3 board: `http://127.0.0.1:4173/?preview=v3`
- Refined full library, 90 ingredients and 150 recipes: `http://127.0.0.1:4173/clearline-preview/gallery.html`
- Complete previous/refined comparison, with 40/48/64 px controls: `http://127.0.0.1:4173/clearline-preview/compare.html`

The prior renderer is preserved verbatim in [`src/visuals/clearline-v1.js`](../src/visuals/clearline-v1.js). The comparison uses that module directly. The catalog and puzzle JSON files have not been edited.

## Findings and changes

The [complete audit](refinement-audit.md) records the disposition of every one of the 90 ingredient IDs and 150 recipe IDs. The three reported wrong shapes were corrected: Ham and Cheese is now a sandwich, Burrito Bowl an open bowl, and Meatball Sub a long roll with meatballs. The audit also found Broccoli Rice Skillet and Tuna Patties were using less appropriate shapes; those were corrected. Other families received larger preparation cues, especially soups, pizzas, burgers, rice and curry bowls, bakes, salads, and seafood. Twenty-one ingredient drawings were revised, particularly grains, dairy, beans/legumes, sauces, and similar greens; the others were retained after review. Ingredient art is framed larger in the game grid.

All 150 approved recipes now have explicit serving-shape assignments. No approved recipe relies on the old keyword fallback, a food emoji, or a single-ingredient stand-in. Recipe art and ingredient art remain lightweight inline SVGs. The existing card hover motion remains subtle; soup steam only shifts on hover or selection. Reduced-motion preferences disable it.

## Verification

`npm test` and `npm run build` pass. The tests cover all 90 ingredient IDs, all 150 recipe IDs in both variants, explicit serving shapes, no emoji fallback, and exact-quantity uniqueness for all 200 V3 preview boards. The comparison was inspected at 40, 48, and 64 px, and the playable Hard board at desktop, 375 px, and 430 px. At 40 px, subtle within-family garnish differences are still hard to identify without labels; the recipe cards display larger art and keep the recipe names and quantities. Human review is still needed before production approval.

## Screenshots

- [Hard board desktop](refined-screenshots/v3-hard-desktop.jpg)
- [Desktop recipe cards](refined-screenshots/v3-hard-recipes-desktop.jpg)
- [Hard board at 375 px](refined-screenshots/v3-hard-375.jpg)
- [Recipe cards at 375 px](refined-screenshots/v3-hard-recipes-375.jpg)
- [Hard board at 430 px](refined-screenshots/v3-hard-430.jpg)
- [Recipe cards at 430 px](refined-screenshots/v3-hard-recipes-430.jpg)
- [Full gallery desktop](refined-screenshots/gallery-desktop.jpg)
- [Full gallery at 375 px](refined-screenshots/gallery-375.jpg)
- [Pizza before/after desktop](refined-screenshots/comparison-pizzas-desktop.jpg)
- [Soup before/after desktop](refined-screenshots/comparison-soups-desktop.jpg)
- [Soup comparison at 40 px](refined-screenshots/comparison-soups-40px-desktop.jpg)
- [Sandwich comparison at 48 px, phone layout](refined-screenshots/comparison-sandwiches-375-48px.jpg)

No production merge or deployment was performed. Stop for design approval before any additional content changes.
