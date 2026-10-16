# Pantry Quality V4 — isolated Hard pilot

**Recommendation: retain V3 as the integration candidate.** The V4 edits improve several dish definitions, but this deliberately small pilot does not show a gameplay gain. No production files, daily puzzles, V3 artifacts, merge, or deployment were changed.

## Scope and verification

- Candidate catalog: the same 150 recipe IDs and families as V3. Medium variants are byte-for-byte equivalent after parsing; only the 25 specified Hard variants change. The experimental Hard distribution is 125 four-ingredient, 20 five-ingredient, and 5 six-ingredient recipes.
- Pilot: 25 new Hard boards, 12 cards and four picks each, with 14–16 pantry types. Every board contains at least one edited recipe. The V3 Hard quality gates were retained.
- Independent validator, separate from the generator: **25/25 passed**. It checked each card against the V4 canonical definition, quantities, feasibility, family rules, difficulty gates, and all 495 four-card combinations per board. Each board has exactly one solution; all 25 structures differ. There are only **16 distinct four-recipe answer sets** across the 25 boards, a serious variety caveat.
- Eight of the 25 edited recipes appear in the pilot (35 total edited-card appearances). The remaining 17 received static catalog validation, not an in-puzzle gameplay test. Of the 25 edits, 14 appeared in neither an answer set nor a feasible decoy pool in the bounded answer search. This is evidence of a constrained candidate network, not proof those dishes can never be used.
- The bounded generator used 675,000 answer-set trials and found 40 qualifying answer pools; from 1,120 board attempts it found 56 quality-passing board candidates. The recorded rerun took 1.57 seconds **with the V4 answer pool cached**. The uncached preparation time of the initial run was not separately recorded. Neither run approached the eight-minute internal deadline.

## Exact recipe changes

Quantities not listed here remain exactly as in V3. The machine-readable [change log](recipe-changes.json) gives complete before/after quantity maps for every edit.

| Recipe | Hard change |
|---|---|
| Tomato Basil Pasta | Add garlic ×1 |
| Chicken Ramen | Add mushroom ×1 |
| Pad Thai | Add lime ×1 and soy sauce ×1 |
| Beef Lo Mein | Add soy sauce ×1 |
| Vegetable Lo Mein | Add soy sauce ×1 |
| Sesame Noodles | Add ginger ×1 |
| Chicken Noodle Soup | Add onion ×1 |
| Lentil Soup | Add garlic ×1 |
| Minestrone | Add celery ×1 and zucchini ×1 |
| Breakfast Burrito | Add sausage ×1 |
| Pancakes | Add butter ×1 |
| French Toast | Add butter ×1 |
| Oatmeal Bowl | Add blueberry ×1 |
| Chicken Casserole | Add cream ×1 |
| Tuna Casserole | Add breadcrumbs ×1 |
| Mushroom Pizza | Add garlic ×1 |
| Spinach Flatbread | Add tomato ×1 |
| Breakfast Pizza | Add spinach ×1 |
| Tomato Garlic Flatbread | Add basil ×1 |
| Lemon Salmon | Add garlic ×1 and butter ×1 |
| Shrimp Tacos | Add avocado ×1 |
| Salmon Rice Bowl | Add soy sauce ×1 |
| Garlic Fish Pasta | Add lemon ×1 |
| Chicken Shawarma Bowl | Replace lettuce ×1 with cucumber ×1; add yogurt ×1 and cumin ×1 |
| Greek Chicken Bowl | Replace lettuce ×1 with cucumber ×1; add tomato ×1 and lemon ×1 |

## V3 versus V4

The directly comparable window is the first 25 scheduled V3 Hard boards versus the 25-board V4 pilot. The full 100-day V3 Hard baseline is included for context; pilot numbers should **not** be extrapolated to a 100-day frequency prediction.

| Measure | V3 Hard, first 25 | V4 Hard pilot, 25 | V3 full 100-day baseline |
|---|---:|---:|---:|
| Independently valid boards | 25/25 (preserved V3 report) | 25/25 | 100/100 |
| Distinct answer sets | 25 | 16 | 100 |
| Recipe coverage | 94/150 | 67/150 | 116/150 |
| Most appearances of one recipe | 9/25 | 17/25 | 41/100 |
| Average adjacent-board card overlap | 0.00 | 1.38 | 0.30 |
| Families represented overall | 15 | 15 | 15 |
| Average families per board | 7.56 | 7.56 | — |
| Average strict near misses | 8.12 | 6.68 | 7.48 |
| Average deduction depth | 5.56 | 4.84 | 5.32 |
| Average plausible alternatives | 23.56 | 20.56 | — |
| Average competitive decoys | 7.72 | 7.72 | — |
| Average pantry types | 14.96 | 15.68 | — |
| Pantry range | 13–16 | 14–16 | 12–16 gate |
| 4/5/6-card appearances | 300/0/0 | 265/28/7 | 1,200/0/0 |

**Culinary assessment (judgment, not a measured gameplay result):** the 25 additions generally strengthen named dish identity: soy sauce distinguishes lo mein, aromatics make soups and pasta more convincing, and yogurt/cumin make the shawarma bowl recognizable. The changes are reasonable individually. In this constrained puzzle model, however, several extra ingredients become effectively rare signatures, narrowing compatible four-dish pantry combinations. The two bowl replacements are the most meaningful content changes; the smaller additions sometimes read more like seasonings than important scored constraints.

**Difficulty and diversity finding (verified for this pilot only):** uniqueness and the minimum Hard gates survive, but average near misses and deduction depth fall, and repetitions rise. The pilot pool is less efficient at finding distinct answer sets: 40 qualifying V4 answer pools from 675,000 trials, versus 866 V3 Hard answer pools from 900,000 trials in the preserved V3 benchmark. These search samples and board-selection constraints differ, so this is a directional warning, not a precise 100-day yield ratio. A 100+ day V4 batch with unique answer sets is **not demonstrated** by this pilot; no full-batch search was run.

## Playtest and responsive review

The [isolated preview](preview/index.html) offers four V3 Medium, four V3 Hard, and six V4 Hard boards. It imports Pantry's existing inventory and exact win-condition engine, gives immediate 0/target feedback, and supports selection, undo, reset, solution reveal, and quantity lists. It does not touch daily progress or production content.

At 375 px, 15 pantry types use four columns and four rows; a complete V4 Hard board is about 2,471 px tall. At 430 px, five pantry columns shorten it to about 2,300 px. At 1280 px, the eight-column pantry is two rows and the board is about 1,813 px tall. For comparison, a V3 Medium board with 11 pantry types measured 1,891 px tall at 375 px, and a V3 Hard board with 13 types measured 2,253 px at 430 px. All tested widths had no horizontal overflow. Pantry labels and quantity comparisons stayed readable without reducing mobile text below the preview's 10–13 px labels and values. The practical cost is roughly three phone-screen lengths of scrolling and frequent visual travel between pantry and recipe cards. The preview keeps ingredient lists expanded by default and offers a show/hide control; this helps direct comparison but increases scroll length. The sticky phone control bar can cover content at the bottom of a viewport while scrolling, although the page has bottom padding.

Screenshots: [375 px](screenshots/pantry-v4-375.jpg), [430 px](screenshots/pantry-v4-430.jpg), [desktop](screenshots/pantry-v4-desktop.jpg).

## Decision

Proceed to player testing with the **verified V3 content system**, unchanged. Keep V4 as a culinary reference catalog, not a daily-batch replacement. If players find specific V3 recipes implausible, trial a smaller subset of the clearest identity fixes and test those recipes in actual boards; do not force the 125/20/5 distribution. Further large-scale generation requires explicit approval.
