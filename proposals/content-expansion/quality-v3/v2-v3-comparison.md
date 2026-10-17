# Quality V2 vs Quality V3

| Metric | V2 Medium | V3 Medium | V2 Hard | V3 Hard |
| --- | ---: | ---: | ---: | ---: |
| Recipes represented | 89 | 120 | 92 | 116 |
| Maximum recipe frequency | 53 | 23 | 94 | 41 |
| Median adjacent overlap | 1 | 0 | 7 | 0 |
| Average adjacent overlap | 1.58 | 0.03 | 7.32 | 0.3 |
| Longest recipe streak | 9 | 2 | 37 | 4 |
| Unique solutions | 100 | 100 | 100 | 100 |
| Structural duplicates | 0 | 0 | 0 | 0 |
| Average strict near misses | 4.59 | 4.53 | 4.4 | 7.48 |
| Average deduction depth | 3.55 | 3.87 | 4.78 | 5.32 |

Measured warm/offline generator runtime: V2 2069 ms; V3 56437.7 ms. V3 excludes cached answer-pool discovery time, which is separately reproducible and reported as answer-pool attempts.