# Content decision and preservation status

Quality V3 is Pantry's preferred verified gameplay baseline. Its approved reference datasets remain `../quality-v3/medium-100.json` and `../quality-v3/hard-100.json`, with 100 independently verified puzzles per mode.

The expanded 125-ingredient / 225-recipe catalog remains experimental. Preserve every recipe and ingredient, all custom Clearline artwork and variants, generators, diagnostics, candidate data, playable samples, and comparison reports. The final expanded datasets are `guided-v3-100-day/medium-100.json` and `guided-v3-100-day/hard-100.json`; all 200 puzzles passed independent verification. The complete findings and Option B recommendation are in `guided-v3-100-day/README.md`.

The user approved Option B after reviewing the completed experiment. Content development and content-generation optimization searches are stopped. The preserved generators are research references and must not be run for further optimization without a new request. Candidate pools and canonical seed IDs are deliberately retained because they make the completed experiment reproducible; temporary process files and unrelated design exports are not part of this preservation commit.

No expanded puzzle dataset is approved to replace V3 or live daily content. Nothing in this preservation step changes production puzzles, merges into `main`, or deploys the game. The isolated preview can still display experimental boards for review.

The next priorities are the playable Clearline interface, real gameplay testing, and scalable production infrastructure. They are future work, not part of this content preservation step. Live-game or production-content changes still require the user's approval.
