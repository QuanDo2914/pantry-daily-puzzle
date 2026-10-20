# Expanded catalog — 100-day validation

**Recommendation: Option B — retain V3 and improve the expansion later.** All 200 boards pass independent mathematical validation, but the expansion does not improve long-run variety enough to replace V3. Artwork, canonical recipes, V3, the previous 25+25 experiment, and production puzzles are unchanged.

## Full-batch comparison

| Measurement | V3 Medium | Expanded Medium | V3 Hard | Expanded Hard |
|---|---:|---:|---:|---:|
| Verified days | 100 | 100 | 100 | 100 |
| Distinct recipes displayed | 120 | 103 | 116 | 128 |
| Coverage of available recipe library (%) | 80.0 | 45.78 | 77.33 | 56.89 |
| Distinct recipes in solutions | 91 | 75 | 97 | 100 |
| New recipes displayed / 75 | — | 28 | — | 39 |
| New recipes in solutions / 75 | — | 27 | — | 38 |
| Ingredient coverage | 61 | 69 | 59 | 76 |
| New ingredient coverage / 35 | — | 16 | — | 24 |
| Family coverage / 15 | 15 | 14 | 15 | 15 |
| Maximum appearances / 100 days | 23 | 44 | 41 | 47 |
| Longest appearance streak | 2 | 2 | 4 | 4 |
| Near-identical board pairs | 46 | 147 | 9 | 27 |
| Average adjacent overlap | 0.03 | 0.03 | 0.3 | 0.07 |
| Average strict near misses | 4.53 | 4.22 | 7.48 | 6.99 |
| Average deduction steps | 3.87 | 3.61 | 5.32 | 5.38 |
| Average pantry types | 11.45 | 11.44 | 14.8 | 15.35 |

Counts and percentages use the complete 100-day batches in both systems. V3 has 150 recipes and 90 ingredients; the expansion has 225 and 125. Library-normalized coverage and absolute distinct counts are reported separately.

## Measured distributions and repetition

### Medium

New dishes occupy 115 card slots (14.37%); 100/100 boards show a new dish and 78/100 use one in the correct answer.

| Metric | Min | P10 | Median | Mean | P90 | Max |
|---|---:|---:|---:|---:|---:|---:|
| Near misses | 2 | 2 | 4.0 | 4.22 | 6 | 11 |
| Deduction steps | 3 | 3 | 4.0 | 3.61 | 4 | 5 |
| Pantry types | 10 | 11 | 11.0 | 11.44 | 12 | 12 |
| Adjacent overlap | 0 | 0 | 0 | 0.03 | 0 | 1 |

Highest-use recipes: chicken_shawarma_bowl: 44, chicken_salad: 42, veggie_wrap: 38, shrimp_fajita_bowl: 36, chicken_wrap: 36, greek_chicken_bowl: 33, shrimp_salad: 32, broccoli_rice_skillet: 31.

Weakest participating families: noodles: 1 card slots, breakfast_eggs: 10 card slots, pasta: 21 card slots, burgers_comfort: 29 card slots, stir_fries: 32 card slots. Missing families: pizza_flatbreads.

Lowest / highest heuristic scores: expanded-100-medium-087, expanded-100-medium-076, expanded-100-medium-008 / expanded-100-medium-062, expanded-100-medium-066, expanded-100-medium-068.

Rolling 7-day windows: mean distinct recipes 34.35, minimum 23; maximum appearances by a single recipe 4.
Rolling 30-day windows: mean distinct recipes 67.38, minimum 54; maximum appearances by a single recipe 15.

Near-identical board pairs (≥6/8 or ≥10/12 shared cards): 147. These pairs are listed in the independent report and are distinct constraints, not equivalent mathematical puzzles.

### Hard

New dishes occupy 126 card slots (10.5%); 100/100 boards show a new dish and 100/100 use one in the correct answer.

| Metric | Min | P10 | Median | Mean | P90 | Max |
|---|---:|---:|---:|---:|---:|---:|
| Near misses | 3 | 4 | 6.0 | 6.99 | 11 | 18 |
| Deduction steps | 5 | 5 | 5.0 | 5.38 | 6 | 7 |
| Pantry types | 13 | 14 | 16.0 | 15.35 | 16 | 16 |
| Adjacent overlap | 0 | 0 | 0 | 0.07 | 0 | 1 |

Highest-use recipes: greek_chicken_bowl: 47, chicken_shawarma_bowl: 45, chicken_casserole: 40, broccoli_cheese_bake: 37, broccoli_cheddar_soup: 37, broccoli_rice_skillet: 35, chicken_wrap: 33, chicken_vegetable_stir_fry: 32.

Weakest participating families: pizza_flatbreads: 3 card slots, pasta: 25 card slots, noodles: 27 card slots, salads: 30 card slots, seafood: 38 card slots. Missing families: none.

Lowest / highest heuristic scores: expanded-100-hard-054, expanded-100-hard-029, expanded-100-hard-040 / expanded-100-hard-061, expanded-100-hard-048, expanded-100-hard-075.

Rolling 7-day windows: mean distinct recipes 54.61, minimum 44; maximum appearances by a single recipe 5.
Rolling 30-day windows: mean distinct recipes 91.04, minimum 82; maximum appearances by a single recipe 17.

Near-identical board pairs (≥6/8 or ≥10/12 shared cards): 27. These pairs are listed in the independent report and are distinct constraints, not equivalent mathematical puzzles.

## Correctness and structural equivalence

The independent Python implementation enumerated 5,600 Medium and 49,500 Hard combinations. It checked all canonical quantities, inventory feasibility, exact stored solutions, card/selection counts, pantry ranges, at least 6/7 families, at most two cards per family, near misses, competitive decoys, forced-card limits, deduction depth, and heuristic scores. Every accepted board passed. There are no duplicate card sets, solution groups, or equivalent constraint structures in either mode.

Recipe and ingredient names are ignored. A bipartite graph preserves ingredient pantry totals and every per-recipe edge quantity. Recipe nodes have no solution label; exact isomorphism is tested after a safe invariant filter.

A changed card order is not considered a new board. All 4,950 board pairs per mode were compared; unequal graph invariants safely excluded impossible matches, and the remaining pairs received exact isomorphism checks.

## Candidate feasibility and runtime

The saved 25-day pool had only 62 distinct Medium solutions, so a larger guided pool was required. The first bounded pass used validated V3 answer caches and yielded 85 Medium / 100 Hard days. A second-level Medium substitution pass reached 94 solution groups; a targeted pass allowing new dishes as competitive decoys as well as correct answers reached 117 groups. This removes an extra search restriction; it does not relax any game or difficulty rule. The earlier 85-board partial result is preserved.

Fresh expanded-pool preparation from existing V3 seed caches: 19.81s. Medium extension: 0.40s. Targeted decoy completion: 0.11s. Final cached scheduling: 0.46s. Independent validation: 0.44s. Sum of generation-command wall times: 23.08s. These figures are not a cold start from an empty cache: rebuilding the original V3 seed caches was not measured. Detailed command and elapsed timings are in `performance-final.json`.

Every generation command had a nine-minute deadline. The total search time was well below the approved 30-minute budget. No canonical recipe or artwork edits were made.

## Readiness decision

The current catalog can supply 100 mathematically distinct, valid boards per mode under the approved constraints. The remaining concern is editorial variety and difficulty distribution, particularly Medium. Compare the measured repetition, coverage, and deduction distributions above before approving integration. Keep V3 as the preferred baseline and retain this expanded dataset for review. The smallest next step is a targeted review of the bottleneck recipes and their compatible decoys, plus player testing of the representative boards; another catalog expansion or unrestricted search is not justified.

Playable samples use the existing Clearline interface and the same inventory and win-condition mechanics. `samples.md` contains complete pantry quantities, every recipe, the correct solution, and nearest alternatives. No production merge or deployment has occurred.

## Selection tradeoff and remaining bottleneck

The first 100-day schedule is retained in `initial-schedule-*.json`. One cached selection refinement preferred the strongest deduction-depth variant for each solution group, with Medium depth at least 3 and Hard at least 5 where the pool permitted 100 distinct groups. This is a stricter selection preference, not a change to game rules or mandatory validation gates.

| Measure | First Medium | Final Medium | First Hard | Final Hard |
|---|---:|---:|---:|---:|
| Distinct recipes | 104 | 103 | 132 | 128 |
| Peak frequency | 33 | 44 | 43 | 47 |
| Near misses | 4.31 | 4.22 | 6.8 | 6.99 |
| Deduction steps | 3.25 | 3.61 | 4.98 | 5.38 |

The final cache has 258 Medium candidates across 117 distinct solutions and 1780 Hard candidates. Even choosing the maximum-depth board for the 100 strongest Medium solution groups only reaches a 3.62 average in this pool, below V3's 3.87. The final 3.61 is near that measured pool ceiling. Stronger variants increase recipe concentration, which the final schedule reports rather than masking it.

Low adjacent overlap is not enough to make these boards fresh: many distant board pairs still share most of their cards, and chicken/rice/tortilla cores dominate. The smallest useful future work is a targeted compatibility review of existing experimental Medium recipes and decoys, especially the absent pizza/flatbread family and sparse noodles, followed by player testing. This experiment does not authorize or apply any canonical changes.

## Rolling-window baseline comparison

| Maximum appearances of one recipe in a window | V3 Medium | Expanded Medium | V3 Hard | Expanded Hard |
|---|---:|---:|---:|---:|
| 7 days | 4 | 4 | 6 | 5 |
| 30 days | 10 | 15 | 17 | 17 |

## Playable review and reproducibility

[Open the ten review samples](http://127.0.0.1:4173/?preview=expansion100). The Content selector retains V3 and the earlier pilot; the new option contains five samples per mode, labeled with their source day. All ten loaded with the correct 8/12 cards, and one Medium and one Hard solution reached the actual win state in browser testing. The existing screen was checked at 375 px and 430 px; labels and quantities remain readable, but a 16-type Hard pantry still needs substantial scrolling. No artwork, layout, or visual design was changed. The preview-only data selector was wired to the new sample files.

The 552 Medium and 866 Hard V3 seed answer groups are bundled as canonical recipe IDs in `seed-answer-groups.json`, so reproduction does not depend on transient `/private/tmp` files. `candidate-pools.json` preserves the complete accepted cache. Cached reproduction: run `node .../run-experiment.mjs`, `python3 .../verify.py`, and `python3 .../analyze.py` from the repository root, then `npm run build` for the preview. A fresh expanded-pool reproduction uses the same bundled seed groups; original V3 seed-search cold-start cost remains unmeasured. The initial startup attempt encountered a reporting-variable error after Medium preparation; it was corrected, its 0.57s is included in the runtime total, and no puzzle was accepted from that failed command.

Measured elapsed time from the first generation start through report/preview completion: 646.1 seconds. Search-command wall time is reported separately from this elapsed review time. All 17 application/asset tests and the preview build pass. The independent report confirms 246 protected files unchanged.
