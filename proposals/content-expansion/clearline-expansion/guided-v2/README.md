# Expanded Pantry feasibility — guided V2 experiment

**Status:** isolated experiment on `codex/pantry-clearline-expansion`; not production content. No recipe definition, artwork, live puzzle, gameplay rule, merge, or deployment was changed in this task. The candidate catalog remains 125 ingredients / 225 recipes; its original 150 recipes equal V3's definitions. The previous 8+11 pilot and V3 baseline remain available.

## Outcome

The unchanged expanded catalog now produces **25 Medium and 25 Hard boards** with the approved 8–12 / 12–16 pantry ranges and 6 / 7 family minima. The prerequisite 10+10 batch passed before extending to 25+25. An independent Python verifier enumerated all **56** or **495** combinations per board, checked exact consumption, canonical quantities, individually feasible cards, uniqueness, near misses, competitive decoys, forced-card count, and deduction-step computation. It also compared every pair of boards with exact labeled bipartite-graph isomorphism, independently of the generator's structural hash. All 50 boards pass; all solution groups and mathematical structures are distinct within each mode. Hard retains 12 cards, four selections, and 4–6 scored ingredients. No quality gate was lowered.

| Verified measure | Previous expansion | Guided 10-board gate | Guided 25-board batch | V3 first 25 boards |
|---|---:|---:|---:|---:|
| Medium boards | 8 / 25 | 10 / 10 | **25 / 25** | 25 / 25 |
| Medium distinct recipes | 35 | 58 | **74** (19 new) | 89 |
| Medium ingredient types / families | 30 / 13 | — | **54 / 13** | 52 / 15 |
| Medium maximum appearances | 6 / 8 days | — | **7 / 25 days** | 6 / 25 days |
| Medium adjacent overlap | 2.29 | 0 | **0.04** | 0 |
| Medium strict near misses / deduction steps | 4.50 / 3.50 | 5.20 / 4.00 | **4.52 / 3.52** | 4.52 / 4.00 |
| Hard boards | 11 / 25 | 10 / 10 | **25 / 25** | 25 / 25 |
| Hard distinct recipes | 34 | 73 | **93** (21 new) | 94 |
| Hard ingredient types / families | 28 / 11 | — | **62 / 15** | 48 / 15 |
| Hard maximum appearances | 6 / 11 days | — | **11 / 25 days** | 9 / 25 days |
| Hard adjacent overlap | 1.30 | 0.22 | **0.25** | 0 |
| Hard strict near misses / deduction steps | 9.36 / 5.73 | 7.30 / 5.60 | **7.52 / 5.24** | 8.12 / 5.56 |
| Hard mean pantry types | 15.45 | — | **15.60** | 14.96 |

The V3 columns above are size-matched first-25 slices, not a catalog-only controlled experiment. The full verified V3 baseline has 100 boards per mode, recipe coverage 120 Medium / 116 Hard, mean strict near misses 4.53 / 7.48, deduction steps 3.87 / 5.32, maximum appearances 23 / 41 per 100 days, and adjacent overlap 0.03 / 0.30. Do not extrapolate any 25-day frequency to 100 days. The guided batch shows feasibility and competitive Hard difficulty, **not** long-run production readiness.

## Why the first expansion failed

The prior generator sampled full-catalog answer sets randomly while requiring a different family for every answer recipe. It discarded many combinations before finding a pantry compatible with enough decoys. Among 94,500 attempts per mode, Medium rejected **93,699** for insufficient feasible decoys; Hard rejected **62,270** for insufficient decoys and **31,864** for pantry range. Only 39 Medium and 23 Hard answer pools survived. Of 75 new dishes, the prior valid boards represented 4 Medium and 2 Hard, and only 1 new recipe appeared in a correct solution in each mode. These are measured in `../baseline-recipe-diagnostics.json`.

A first compatibility-biased nearest-neighbor constructor also failed: 7,200 attempts per mode yielded **zero** qualifying Medium and **one** qualifying Hard answer set under pantry A. This negative result is retained in `../guided-stage1.json`. Sharing ingredients alone was insufficient; exact quantity and full-menu decoy feasibility mattered.

The effective change is **answer-set substitution**: take a verified V3 solution set as a compatibility prior, replace one member with a new recipe, then recompute the pantry from scratch and require feasible decoys, family capacity, and every quality gate. This does not reuse a V3 puzzle as a new puzzle. It tests new card sets against a new exact pantry, with all solutions freshly enumerated. The code uses precomputed sparse ingredient vectors and a pantry-keyed feasibility cache, prunes pantry range early, samples new-recipe anchors evenly, caches difficulty evaluations, and uses deterministic seeds. The candidate pool was built in **3.37 seconds**, containing **101 Medium** and **493 Hard** quality-passing, structurally distinct boards; scheduling 25+25 from this cache took **0.08 seconds**. Rejection and candidate counts are in `benchmark-25.json`. The recorded diagnostic experiments plus pool build were seconds, far below the 10-minute-per-run and 30-minute total limits.

## Complete 225-recipe overlap analysis

The measured graph links recipes when they share at least **two scored ingredients** and match at least one per-card quantity. Medium has **1,027 edges**, 635 cross-family, and a largest component of **215/225** recipes. Hard has **1,409 edges**, 940 cross-family, and a largest component of **223/225**. A giant component does not imply that 8 or 12 cards make a valid board: the feasible-decoy and pantry tests are stricter. Medium's small groups include the fish/shrimp/cauliflower taco trio and sesame/spicy-peanut noodle pair; Lemon Herb Rice, Cold Sesame Noodle Salad, Ricotta Berry Toast, and Kale Apple Salad are isolated under this edge rule. Hard's isolated recipes are Oatmeal Bowl and Ricotta Berry Toast.

The 14 requested new-ingredient clusters were assessed using recipe-family count, quantity-compatible cross-family pairs, eligible answer sets, quality candidate boards, and final scheduled boards. Selected Hard findings:

| Cluster | Cross-family compatible pairs | Eligible answer sets | Quality candidate boards | Final boards |
|---|---:|---:|---:|---:|
| Miso paste | 4 | 69 | 38 | 4 |
| Orzo | 4 | 36 | 22 | 0 |
| Halloumi | 3 | 41 | 24 | 2 |
| Edamame | 6 | 34 | 21 | 3 |
| Cauliflower | 0 | 11 | 9 | 1 |
| Farro | 1 | 3 | 3 | 0 |
| Bulgur | 1 | 3 | 5 | 0 |
| Tempeh | 1 | 12 | 6 | 1 |
| Gnocchi | 0 | 8 | 0 | 0 |
| Feta | 7 | 42 | 27 | 0 |
| Ricotta | 1 | 15 | 12 | 0 |
| Bok choy | 1 | 5 | 7 | 0 |
| Scallions | 10 | 60 | 57 | 4 |
| Tahini | 3 | 3 | 5 | 0 |

Thus orzo and feta have *candidate* potential but were not selected in this 25-day schedule; gnocchi has a genuine quality-board gap under the current candidate pool. The full 225-recipe graph and a per-recipe assessment of **all 75 new dishes** are in [network-and-recipe-feasibility.json](network-and-recipe-feasibility.json) and [recipe-feasibility.md](recipe-feasibility.md). Each entry includes compatible peers, cross-family links, overlap strength, eligible answer sets, feasible-decoy pools, mean feasible decoys, pantry-size pressure, quantity mismatches, rejection counts, quality-board appearances, final appearances, and correct-solution appearances. In Hard, 69/75 new recipes enter an eligible answer set, 64/75 enter a quality candidate board, but only 21/75 appear in this 25-day schedule and 19/75 appear in a solution. This is the main remaining variety limitation.

## Pantry-range comparison

The six configurations below were tested on the same unchanged catalog. Each board-quality sweep took up to 150 evenly sampled eligible answer sets; its quality-board rate is conditional on having passed answer eligibility, not an overall generation acceptance rate. Only configuration A was used for the final batches.

| Configuration | Eligible answers | Quality boards / sampled | Mean pantry types | Mean near misses | Mean deduction steps |
|---|---:|---:|---:|---:|---:|
| Medium A: 8–12, 6 families | 79 | 64 / 79 | 11.38 | 3.89 | 3.34 |
| Medium B: 9–13, 6 families | 79 | 63 / 79 | 11.35 | 4.06 | 3.27 |
| Hard A: 12–16, 7 families | 605 | 78 / 150 | 15.46 | 8.55 | 4.94 |
| Hard B: 12–16, 8 families | 337 | 75 / 150 | 15.41 | 8.85 | 4.92 |
| Hard C: 12–18, 7 families | 849 | 64 / 150 | 15.73 | 7.94 | 5.02 |
| Hard D: 12–18, 8 families | 510 | 65 / 150 | 15.71 | 7.77 | 4.86 |

The larger Hard pantry increases raw answer eligibility but did not improve this conditional quality yield; it also raises mobile complexity. The stricter eight-family requirement reduces eligible answers. **Keep approved Medium A and Hard A; no pantry or family-rule change is recommended.** See `../substitution-quality-sweep.json` for every rejection count and `../substitution-stage1.json` for the preliminary eligibility diagnostic.

## Canonical recipe adjustment proposals — not applied

No catalog edit was needed to pass 25+25. These are small, culinarily plausible candidates for a *later* controlled test, not verified improvements and not approval requests for V3 changes:

| New recipe | Current scored ingredients | Proposed change | Measured reason / predicted tradeoff |
|---|---|---|---|
| Creamy Chicken Orzo Bake | Medium: chicken×2, orzo×1, spinach×1, cream×1. Hard: same plus parmesan×1. | Use orzo×2 in both variants; otherwise unchanged. | The other three orzo dishes score orzo×2. Quantity alignment may improve cross-family decoys, but a higher orzo requirement could make some pantries less feasible. |
| Warm Farro Lentil Salad | Medium: farro×2, lentils×1, spinach×1, lemon×1. Hard: farro×2, lentils×1, carrot×1, spinach×1, mustard×1, lemon×1. | Replace spinach×1 with kale×1 in each variant; retain counts and all other ingredients. | Creates a second matched scored ingredient with Warm Farro Vegetable Bowl and remains a plausible hearty salad. It removes spinach links and has not been benchmarked. |
| Mushroom Gnocchi Gratin | Hard: gnocchi×2, mushroom×1, cream×1, parmesan×1, breadcrumbs×1. Medium unchanged. | Replace Hard breadcrumbs×1 with spinach×1; retain Parmesan browning. | Creates gnocchi×2 + spinach×1 compatibility with Gnocchi with Spinach while remaining a creamy baked gratin. It changes the topping and needs culinary review. |

Do not modify a naturally distinctive dish solely to force graph degree. Ricotta Berry Toast, for example, is culinary plausible even though it is graph-isolated; recipe realism takes precedence. No original V3 recipe change is proposed.

## Recommendation and limits

The **generator bottleneck is materially improved**, and a small, independently verified 25+25 experiment now exists under the approved constraints with V3-like Hard near misses and deduction depth. Retain V3 as the current verified production baseline. Do not integrate the expansion yet: the 25-day Medium schedule covers fewer recipes and families than the V3 first-25 slice, Hard uses a denser pantry, 54 of 75 new recipes do not appear in the final Hard schedule, and 100-day repetition/coverage remain unmeasured. A single cached reordering that favored new-recipe coverage more heavily increased Hard new coverage from 21 to 24 but reduced near misses from 7.52 to 7.20 and deduction depth from 5.24 to 5.12, so the stronger-difficulty schedule was retained (`schedule-tradeoff.json`).

Next decision for the user: review the 25+25 samples and whether to pursue targeted content edits or real-player testing. No full 100/200-day run should begin without approval.
