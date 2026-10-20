# Independent verification — expanded Clearline pilot

The bounded pilot did not meet the requested 25 boards per mode. This verifier enumerates every 3-of-8 or 4-of-12 combination on each completed board, independently of the generator.

| Measure | Medium | Hard |
|---|---:|---:|
| Verified boards | 8 | 11 |
| Recipe coverage | 35 | 34 |
| New-recipe coverage | 4 | 2 |
| Ingredient coverage | 30 | 28 |
| Family coverage | 13 | 11 |
| Maximum recipe frequency | 6 | 6 |
| Average adjacent overlap | 2.29 | 1.3 |
| Average strict near misses | 4.5 | 9.36 |
| Average pantry types | 11.62 | 15.45 |
| Generator-reported deduction steps | 3.5 | 5.73 |

All completed boards have exactly one solution, canonical card quantities, valid pantry inventory, and the required recipe-card and family counts. Deduction depth is the generator's metric; this independent verifier checks exhaustive uniqueness and near-miss counts, not its step heuristic.

V3's 150 recipe definitions are byte-for-byte equivalent as parsed JSON in this candidate catalog.
