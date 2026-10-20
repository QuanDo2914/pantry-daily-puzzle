# Clearline final corrections and expansion — isolated review

Status: **experimental, not approved for production**. Branch: `codex/pantry-clearline-expansion`. V3's catalog and 200 verified boards remain unchanged. No merge or deployment was performed.

## Artwork and catalog

- Corrected Beef Burrito, Bean Burrito, and Breakfast Burrito to rolled tortillas; Chicken Wrap and Veggie Wrap now have an open, filled end. Quesadillas retain a separate folded silhouette. [Before/after comparison](http://127.0.0.1:4173/clearline-expansion/before-after.html).
- Added 35 individually drawn ingredient SVG bodies and 75 explicit complete-dish recipe presentations in the existing Clearline palette. The gallery covers **125 ingredients and 225 recipes** and can switch between Medium, Hard, and side-by-side variants. The automated check finds no missing illustration ID, duplicate full-dish SVG, or emoji in a rendered SVG. These automated assertions do not replace a final human art review.
- The original 150 V3 recipe definitions are structurally identical in the candidate catalog. The 75 added definitions all use four ingredients in Medium, 62 use five in Hard, and 13 use six in Hard. All scored quantities are positive integers in the 1–4 range. These new definitions are culinary/editorial **candidates**, not approved canonical production recipes.
- The former variant appendix counted 21 ingredient-definition differences, but only 19 currently produce different SVG drawings. Cheesy Bean Bake swaps tomato sauce for tomato; both reduce to similar red prepared marks. Cheese Flatbread's Hard garlic addition is not currently visible in the pizza-specific drawing. This was rendering behavior, **not** an intentional visual decision. Both deserve a future art pass if mode-specific differences must always be visible.
- Legacy recipe `icon` strings remain in the preserved data as unused metadata. The Clearline preview and gallery render custom SVGs, not these emoji strings; there is no emoji rendering fallback in the art component.

## Recipe-overlap network: structural finding vs actual generation

The expansion introduces repeated cross-family hubs: miso paste appears in 4 new Hard dishes (rice, noodles, soup, salmon); orzo in 4 (pasta, soup, salad, bake); edamame in 4 (rice, stir-fry, salad, bowl); cauliflower in 4 (taco, soup, gratin, curry); halloumi in 3 (wrap, burger, bowl). Farro and bulgur each appear in only 2 new Hard dishes. None of those seven ingredients appears in the preserved original 150 Hard recipes. Across the 75 new Hard recipes, a new dish shares **at least one** scored ingredient with an average of 41.37 old and 21.36 other new dishes. This is only a loose overlap measure: it does not establish quantity compatibility, exact-solution uniqueness, or high-quality decoys.

The bounded generator found the actual bottleneck. For each mode, 94,500 answer-set attempts yielded only 39 Medium and 23 Hard candidates. Medium rejected 93,699 for insufficient decoys; Hard rejected 62,270 for insufficient decoys and 31,864 for pantry range. The new Hard recipes' many 5–6-ingredient requirements often push combined pantries outside 12–16 types. The structural network therefore **has not translated into usable board diversity** under the existing strict rules.

## Independently verified pilot

Only one bounded pilot was retained; the cached answer pools were reused to complete Hard after Medium exhausted its candidates. Total recorded generator runtime: **4.92 seconds**. It produced **8/25 requested Medium** and **11/25 requested Hard** boards; no further searches were launched. The independent verifier enumerated every 3-of-8 combination (56 per Medium board) and 4-of-12 combination (495 per Hard board), confirmed exact quantities and exactly one solution for **all 19 completed boards**, and checked card counts, pantry ranges, family minima, and source-catalog preservation. The result is mathematically valid but does **not** satisfy the requested 25+25 deliverable.

| Actual measurement | Expansion Medium (8) | Expansion Hard (11) | V3 first 8 Medium | V3 first 11 Hard |
|---|---:|---:|---:|---:|
| Distinct cards shown | 35 | 34 | 55 | 77 |
| Distinct new recipes shown | 4 | 2 | — | — |
| Ingredient types across boards | 30 | 28 | 37 | 43 |
| Recipe families | 13 | 11 | 13 | 14 |
| Maximum recipe appearances | 6 | 6 | 3 | 4 |
| Mean adjacent-board card overlap | 2.29 | 1.30 | 0 | 0 |
| Mean strict near misses | 4.50 | 9.36 | 4.13 | 8.55 |
| Mean reported deduction steps | 3.50 | 5.73 | 4.00 | 5.64 |
| Mean pantry types | 11.62 | 15.45 | 11.75 | 15.09 |

The V3 columns are only size-matched **first-board slices** of the existing V3 schedule, not a controlled catalog-only experiment. V3's full verified baseline remains 100 boards/mode, 120/150 Medium and 116/150 Hard recipe coverage, Hard maximum frequency 41/100, Hard adjacent overlap 0.30, Hard strict near misses 7.48, and Hard deduction depth 5.32. Pilot figures must not be extrapolated to 100-day frequency. The expansion pilot has only five unique Medium solution sets and three unique Hard solution sets, despite distinct card arrangements, and a final pair of Hard boards overlaps by 10 of 12 cards. This is unsuitable as a daily schedule.

## Preview and responsive review

- [Complete art gallery](http://127.0.0.1:4173/clearline-expansion/gallery.html)
- [Final burrito/wrap comparison](http://127.0.0.1:4173/clearline-expansion/before-after.html)
- [Playable V3 versus expansion preview](http://127.0.0.1:4173/?preview=expansion)

The isolated selector exposes the complete existing V3 boards and the completed experimental boards, using the actual ingredient subtraction, selection, and win-condition mechanics. Medium and Hard test boards both reached the correct win state in browser testing. At 375 px the Hard pantry uses three columns; at 430 px it uses four. Ingredient labels and quantities remain readable, and recipe cards use two-column ingredient rows. The 12-card Hard list requires substantial scrolling, especially at 375 px, but the sticky controls stay accessible. The 16-type pantry is visually dense at 375 px; no tiny-type workaround was introduced. Screenshots are in `screenshots/`.

## Recommendation

Keep **V3 as the content baseline** for real gameplay testing. Retain the expanded catalog and complete custom artwork as an experimental reference, but do **not** integrate the candidate Hard definitions or schedule yet. A future targeted revision should address exact-decoy compatibility and 12–16-type pantry feasibility while preserving realistic dishes, uniqueness, and Hard difficulty; it should also review the two unchanged Medium/Hard art variants. Do not authorize a full 100/200-day run on the strength of this pilot.
