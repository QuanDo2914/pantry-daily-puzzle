# Preferred Quality V3 reference

These are the unchanged V3 reference records from preserved commit `a0ba4f0e7cb9961c5e956a7abe34a3dab6c1140b`:

- `medium-100.json`: 100 verified Medium boards, eight cards and three selections.
- `hard-100.json`: 100 verified Hard boards, twelve cards and four selections.
- `proposed-recipe-catalog.json`: the original 150 canonical V3 recipe identities and quantities. The historical filename is retained for provenance.
- `independent-verification.json` and `.md`: the completed independent audit, copied without regeneration.

V3 remains the preferred gameplay baseline. These reference files are not copied to `dist/`, imported by the live game, or substituted for `public/puzzles`. Production activation is a separate approval decision. Solutions and QA metrics stay in this offline reference directory.

The baseline has 100 distinct solution groups per mode. Medium has 97 distinct card sets: three pairs reuse recipe cards with different pantry inventories and solutions. Hard has 100 distinct card sets. Each board remains uniquely solvable. The preservation test explicitly records this existing Medium property; this PR does not change it or start another generation search.

SHA-256 provenance is recorded in `docs/main-review/provenance.json`. Tests validate each board's canonical quantities, pantry range, family bounds, and exhaustive solution. Expanded 225-recipe experiments and V4 content are excluded from this main-targeted PR and remain intact on their development branches.
