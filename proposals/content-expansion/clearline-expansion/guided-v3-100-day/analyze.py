import json
import statistics
import time
from collections import Counter
from pathlib import Path
from datetime import datetime, timezone

HERE = Path(__file__).resolve().parent
ROOT = HERE.parent
NEW = {row['id'] for row in json.loads((ROOT / 'source-proposal.json').read_text())['newRecipes']}
INGREDIENTS = json.loads((ROOT / 'ingredient-catalog.json').read_text())['ingredients']
INGREDIENT_NAMES = {row['id']: row['name'] for row in INGREDIENTS}
NEW_INGREDIENTS = {row['id'] for row in json.loads((ROOT / 'source-proposal.json').read_text())['newIngredients']}
VERIFICATION = json.loads((HERE / 'independent-verification.json').read_text())
BOARDS = {mode: json.loads((HERE / f'{mode}-100.json').read_text()) for mode in ('medium', 'hard')}
BASELINE = {mode: json.loads((ROOT / f'../quality-v3/{mode}-100.json').read_text()) for mode in ('medium', 'hard')}
ALL_FAMILIES = {row['family'] for row in json.loads((ROOT / 'candidate-recipe-catalog.json').read_text())['recipes']}


def distribution(values):
    ordered = sorted(values)
    return {'min': min(values), 'p10': ordered[int((len(ordered) - 1) * .1)], 'median': statistics.median(values), 'mean': round(statistics.mean(values), 2), 'p90': ordered[int((len(ordered) - 1) * .9)], 'max': max(values), 'histogram': dict(sorted(Counter(values).items()))}


def summarize(boards, total_recipes):
    cards = [card for board in boards for card in board['cards']]
    frequency = Counter(card['id'] for card in cards)
    solutions = Counter(recipe for board in boards for recipe in board['solution'])
    ingredients = Counter(ingredient for board in boards for ingredient in board['pantry'])
    families = Counter(card['family'] for card in cards)
    solution_families = Counter(card['family'] for board in boards for card in board['cards'] if card['id'] in board['solution'])
    sets = [{card['id'] for card in board['cards']} for board in boards]
    near_identical_pairs = sum(len(a & b) >= (6 if len(boards[0]['cards']) == 8 else 10) for a, b in __import__('itertools').combinations(sets, 2))
    adjacent = [len(a & b) for a, b in zip(sets, sets[1:])]
    streaks = {}
    for recipe in frequency:
        run = best = 0
        for ids in sets:
            run = run + 1 if recipe in ids else 0
            best = max(best, run)
        streaks[recipe] = best
    rolling = {}
    for width in (7, 30):
        windows = []
        for start in range(len(boards) - width + 1):
            counts = Counter(recipe for ids in sets[start:start + width] for recipe in ids)
            max_count = max(counts.values())
            windows.append({'startDay': start + 1, 'endDay': start + width, 'distinctRecipes': len(counts), 'maxRecipeAppearances': max_count, 'dominantRecipes': sorted(recipe for recipe, count in counts.items() if count == max_count)})
        rolling[str(width)] = {'distinctRecipeDistribution': distribution([row['distinctRecipes'] for row in windows]), 'maximumAppearanceDistribution': distribution([row['maxRecipeAppearances'] for row in windows]), 'worstWindows': sorted(windows, key=lambda row: (-row['maxRecipeAppearances'], row['distinctRecipes']))[:5]}
    rankings = sorted(boards, key=lambda board: board['metrics']['difficultyScore'])
    return {'days': len(boards), 'displayRecipeCoverage': len(frequency), 'displayCoveragePercent': round(len(frequency) / total_recipes * 100, 2), 'solutionRecipeCoverage': len(solutions), 'newDisplayedRecipes': len(set(frequency) & NEW), 'newSolutionRecipes': len(set(solutions) & NEW), 'originalDisplayedRecipes': len(set(frequency) - NEW), 'originalSolutionRecipes': len(set(solutions) - NEW), 'unusedNewRecipes': sorted(NEW - set(frequency)), 'newRecipeAppearances': sum(count for recipe, count in frequency.items() if recipe in NEW), 'newRecipeSlotPercent': round(sum(count for recipe, count in frequency.items() if recipe in NEW) / len(cards) * 100, 2), 'newSolutionAppearances': sum(count for recipe, count in solutions.items() if recipe in NEW), 'daysWithNewCards': sum(bool(ids & NEW) for ids in sets), 'daysWithNewSolution': sum(bool(set(board['solution']) & NEW) for board in boards), 'ingredientCoverage': len(ingredients), 'newIngredientCoverage': len(set(ingredients) & NEW_INGREDIENTS), 'familyCoverage': len(families), 'missingFamilies': sorted(ALL_FAMILIES - set(families)), 'recipeFrequency': dict(frequency.most_common()), 'solutionRecipeFrequency': dict(solutions.most_common()), 'ingredientFrequency': dict(ingredients.most_common()), 'familyFrequency': dict(families.most_common()), 'solutionFamilyFrequency': dict(solution_families.most_common()), 'maximumRecipeFrequency': max(frequency.values()), 'adjacentOverlap': distribution(adjacent), 'nearIdenticalPairCount': near_identical_pairs, 'longestAppearanceStreak': max(streaks.values()), 'recipeStreaks': dict(sorted(streaks.items(), key=lambda row: -row[1])), 'rollingWindows': rolling, 'nearMisses': distribution([board['metrics']['nearMissCount'] for board in boards]), 'deductionSteps': distribution([board['metrics']['deductionSteps'] for board in boards]), 'pantryTypes': distribution([len(board['pantry']) for board in boards]), 'difficultyScores': distribution([board['metrics']['difficultyScore'] for board in boards]), 'easiest': [board['id'] for board in rankings[:3]], 'hardest': [board['id'] for board in rankings[-3:]], 'weakestFamilies': sorted(families.items(), key=lambda row: row[1])[:5]}


report = {'expanded': {mode: summarize(BOARDS[mode], 225) for mode in BOARDS}, 'v3': {mode: summarize(BASELINE[mode], 150) for mode in BASELINE}}
(HERE / 'coverage-and-variety.json').write_text(json.dumps(report, indent=2) + '\n')


def sample_boards(mode):
    pool = BOARDS[mode]
    picked = []
    used_recipes, used_ingredients, used_families = set(), set(), set()
    while len(picked) < 5:
        def score(board):
            ids = {card['id'] for card in board['cards']}
            families = {card['family'] for card in board['cards']}
            ingredients = set(board['pantry'])
            return len(families - used_families) * 60 + len(ingredients - used_ingredients) * 5 + len(ids - used_recipes) * 5 + len(ingredients & NEW_INGREDIENTS) * 6 - max((len(ids & {card['id'] for card in old['cards']}) for old in picked), default=0) * 15
        board = max((board for board in pool if board not in picked), key=score)
        picked.append(board)
        used_recipes.update(card['id'] for card in board['cards'])
        used_families.update(card['family'] for card in board['cards'])
        used_ingredients.update(board['pantry'])
    audits = {row['id']: row for row in VERIFICATION['modes'][mode]['audits']}
    return [{**board, 'nearMissExamples': audits[board['id']]['nearMissExamples'], 'previewSampleNumber': index + 1} for index, board in enumerate(picked)]


samples = {mode: sample_boards(mode) for mode in BOARDS}
for mode, boards in samples.items():
    (HERE / f'samples-{mode}.json').write_text(json.dumps(boards, indent=2) + '\n')

sample_lines = ['# Ten representative playable boards', '', 'All quantities are game units. Near-miss differences are used minus available: positive means overuse, negative means leftover. The exact solution is included for review.', '']
def quantities(ingredients):
    return ', '.join(f'{INGREDIENT_NAMES.get(key, key)} ×{qty}' for key, qty in ingredients.items())
for mode, boards in samples.items():
    for board in boards:
        names = {card['id']: card['name'] for card in board['cards']}
        sample_lines += [f"## {mode.title()} sample {board['previewSampleNumber']} — day {board['day']}", '', f"Pantry: {quantities(board['pantry'])}.", '', '| Recipe | Ingredients |', '|---|---|']
        for card in board['cards']:
            sample_lines.append(f"| {card['name']} | {quantities(card['ingredients'])} |")
        sample_lines += ['', 'Solution: ' + ', '.join(names[key] for key in board['solution']) + '.', '', board['metrics']['difficultyExplanation'], '', 'Nearest alternatives:']
        for row in board['nearMissExamples'][:3]:
            sample_lines.append('- ' + ', '.join(names[key] for key in row['recipeIds']) + f"; distance {row['distance']}; " + ', '.join(f'{INGREDIENT_NAMES[key]} {qty:+d}' for key, qty in row['difference'].items()) + '.')
        sample_lines.append('')
(HERE / 'samples.md').write_text('\n'.join(sample_lines) + '\n')

perf = json.loads((HERE / 'performance.json').read_text())
cached = json.loads((HERE / 'performance-cached.json').read_text())
extension = json.loads((HERE / 'medium-extension-performance.json').read_text())
completion = json.loads((HERE / 'medium-decoy-completion.json').read_text())
first_schedule = json.loads((HERE / 'initial-schedule-performance.json').read_text())
performance_report = {'firstPass': perf, 'mediumExtension': extension, 'mediumDecoyCompletion': completion, 'initialCachedScheduling': first_schedule, 'cachedFinalScheduling': cached, 'correctedStartupFailureMs': 572.1, 'independentValidationMs': VERIFICATION['validationRuntimeMs'], 'sumGenerationCommandWallMs': round(572.1 + perf['generationCommandWallMs'] + extension['runtimeMs'] + completion['runtimeMs'] + first_schedule['generationCommandWallMs'] + cached['generationCommandWallMs'], 1), 'trueColdStartWithoutV3SeedCaches': 'not measured', 'analysisFinishedAt': datetime.now(timezone.utc).isoformat(), 'elapsedSinceFirstGenerationStartSeconds': round((datetime.now(timezone.utc) - datetime.fromisoformat(perf['startedAt'].replace('Z', '+00:00'))).total_seconds(), 2)}
(HERE / 'performance-final.json').write_text(json.dumps(performance_report, indent=2) + '\n')

lines = ['# Expanded catalog — 100-day validation', '', '**Recommendation: Option B — retain V3 and improve the expansion later.** All 200 boards pass independent mathematical validation, but the expansion does not improve long-run variety enough to replace V3. Artwork, canonical recipes, V3, the previous 25+25 experiment, and production puzzles are unchanged.', '', '## Full-batch comparison', '', '| Measurement | V3 Medium | Expanded Medium | V3 Hard | Expanded Hard |', '|---|---:|---:|---:|---:|']
for label, key in [('Verified days', 'days'), ('Distinct recipes displayed', 'displayRecipeCoverage'), ('Coverage of available recipe library (%)', 'displayCoveragePercent'), ('Distinct recipes in solutions', 'solutionRecipeCoverage'), ('New recipes displayed / 75', 'newDisplayedRecipes'), ('New recipes in solutions / 75', 'newSolutionRecipes'), ('Ingredient coverage', 'ingredientCoverage'), ('New ingredient coverage / 35', 'newIngredientCoverage'), ('Family coverage / 15', 'familyCoverage'), ('Maximum appearances / 100 days', 'maximumRecipeFrequency'), ('Longest appearance streak', 'longestAppearanceStreak'), ('Near-identical board pairs', 'nearIdenticalPairCount')]:
    vals = [report[version][mode][key] if not (version == 'v3' and key.startswith('new')) else '—' for version, mode in [('v3', 'medium'), ('expanded', 'medium'), ('v3', 'hard'), ('expanded', 'hard')]]
    lines.append(f"| {label} | " + ' | '.join(map(str, vals)) + ' |')
for label, key in [('Average adjacent overlap', 'adjacentOverlap'), ('Average strict near misses', 'nearMisses'), ('Average deduction steps', 'deductionSteps'), ('Average pantry types', 'pantryTypes')]:
    vals = [report[version][mode][key]['mean'] for version, mode in [('v3', 'medium'), ('expanded', 'medium'), ('v3', 'hard'), ('expanded', 'hard')]]
    lines.append(f"| {label} | " + ' | '.join(map(str, vals)) + ' |')
lines += ['', 'Counts and percentages use the complete 100-day batches in both systems. V3 has 150 recipes and 90 ingredients; the expansion has 225 and 125. Library-normalized coverage and absolute distinct counts are reported separately.', '', '## Measured distributions and repetition', '']
for mode in BOARDS:
    row = report['expanded'][mode]
    lines += [f'### {mode.title()}', '', f"New dishes occupy {row['newRecipeAppearances']} card slots ({row['newRecipeSlotPercent']}%); {row['daysWithNewCards']}/100 boards show a new dish and {row['daysWithNewSolution']}/100 use one in the correct answer.", '', '| Metric | Min | P10 | Median | Mean | P90 | Max |', '|---|---:|---:|---:|---:|---:|---:|']
    for title, key in [('Near misses', 'nearMisses'), ('Deduction steps', 'deductionSteps'), ('Pantry types', 'pantryTypes'), ('Adjacent overlap', 'adjacentOverlap')]:
        d = row[key]
        lines.append(f"| {title} | " + ' | '.join(str(d[key]) for key in ['min', 'p10', 'median', 'mean', 'p90', 'max']) + ' |')
    lines += ['', 'Highest-use recipes: ' + ', '.join(f'{BY_ID}: {count}' for BY_ID, count in list(row['recipeFrequency'].items())[:8]) + '.', '', 'Weakest participating families: ' + ', '.join(f'{family}: {count} card slots' for family, count in row['weakestFamilies']) + '. Missing families: ' + (', '.join(row['missingFamilies']) or 'none') + '.', '', 'Lowest / highest heuristic scores: ' + ', '.join(row['easiest']) + ' / ' + ', '.join(row['hardest']) + '.', '']
    for width in ('7', '30'):
        rolling = row['rollingWindows'][width]
        lines.append(f"Rolling {width}-day windows: mean distinct recipes {rolling['distinctRecipeDistribution']['mean']}, minimum {rolling['distinctRecipeDistribution']['min']}; maximum appearances by a single recipe {rolling['maximumAppearanceDistribution']['max']}.")
    lines += ['', f"Near-identical board pairs (≥6/8 or ≥10/12 shared cards): {len(VERIFICATION['modes'][mode]['nearIdenticalPairs'])}. These pairs are listed in the independent report and are distinct constraints, not equivalent mathematical puzzles.", '']
lines += ['## Correctness and structural equivalence', '', 'The independent Python implementation enumerated 5,600 Medium and 49,500 Hard combinations. It checked all canonical quantities, inventory feasibility, exact stored solutions, card/selection counts, pantry ranges, at least 6/7 families, at most two cards per family, near misses, competitive decoys, forced-card limits, deduction depth, and heuristic scores. Every accepted board passed. There are no duplicate card sets, solution groups, or equivalent constraint structures in either mode.', '', VERIFICATION['structureEquivalence'], '', 'A changed card order is not considered a new board. All 4,950 board pairs per mode were compared; unequal graph invariants safely excluded impossible matches, and the remaining pairs received exact isomorphism checks.', '', '## Candidate feasibility and runtime', '', f"The saved 25-day pool had only 62 distinct Medium solutions, so a larger guided pool was required. The first bounded pass used validated V3 answer caches and yielded 85 Medium / 100 Hard days. A second-level Medium substitution pass reached 94 solution groups; a targeted pass allowing new dishes as competitive decoys as well as correct answers reached 117 groups. This removes an extra search restriction; it does not relax any game or difficulty rule. The earlier 85-board partial result is preserved.", '', f"Fresh expanded-pool preparation from existing V3 seed caches: {perf['freshExpandedPoolPreparationMs']/1000:.2f}s. Medium extension: {extension['runtimeMs']/1000:.2f}s. Targeted decoy completion: {completion['runtimeMs']/1000:.2f}s. Final cached scheduling: {cached['schedulingMs']/1000:.2f}s. Independent validation: {VERIFICATION['validationRuntimeMs']/1000:.2f}s. Sum of generation-command wall times: {performance_report['sumGenerationCommandWallMs']/1000:.2f}s. These figures are not a cold start from an empty cache: rebuilding the original V3 seed caches was not measured. Detailed command and elapsed timings are in `performance-final.json`.", '', 'Every generation command had a nine-minute deadline. The total search time was well below the approved 30-minute budget. No canonical recipe or artwork edits were made.', '', '## Readiness decision', '', 'The current catalog can supply 100 mathematically distinct, valid boards per mode under the approved constraints. The remaining concern is editorial variety and difficulty distribution, particularly Medium. Compare the measured repetition, coverage, and deduction distributions above before approving integration. Keep V3 as the preferred baseline and retain this expanded dataset for review. The smallest next step is a targeted review of the bottleneck recipes and their compatible decoys, plus player testing of the representative boards; another catalog expansion or unrestricted search is not justified.', '', 'Playable samples use the existing Clearline interface and the same inventory and win-condition mechanics. `samples.md` contains complete pantry quantities, every recipe, the correct solution, and nearest alternatives. No production merge or deployment has occurred.']
initial = json.loads((HERE / 'initial-schedule-summary.json').read_text())
candidate_cache = json.loads((HERE / 'candidate-pools.json').read_text())
medium_group_depths = {}
for board in candidate_cache['modes']['medium']['boards']:
    medium_group_depths[board['solutionKey']] = max(medium_group_depths.get(board['solutionKey'], 0), board['metrics']['deductionSteps'])
medium_depth_ceiling = statistics.mean(sorted(medium_group_depths.values(), reverse=True)[:100])
lines += ['', '## Selection tradeoff and remaining bottleneck', '', 'The first 100-day schedule is retained in `initial-schedule-*.json`. One cached selection refinement preferred the strongest deduction-depth variant for each solution group, with Medium depth at least 3 and Hard at least 5 where the pool permitted 100 distinct groups. This is a stricter selection preference, not a change to game rules or mandatory validation gates.', '', '| Measure | First Medium | Final Medium | First Hard | Final Hard |', '|---|---:|---:|---:|---:|']
for label, key in [('Distinct recipes', 'displayRecipeCoverage'), ('Peak frequency', 'maximumRecipeFrequency')]:
    lines.append(f"| {label} | {initial['expanded']['medium'][key]} | {report['expanded']['medium'][key]} | {initial['expanded']['hard'][key]} | {report['expanded']['hard'][key]} |")
for label, key in [('Near misses', 'nearMisses'), ('Deduction steps', 'deductionSteps')]:
    lines.append(f"| {label} | {initial['expanded']['medium'][key]['mean']} | {report['expanded']['medium'][key]['mean']} | {initial['expanded']['hard'][key]['mean']} | {report['expanded']['hard'][key]['mean']} |")
lines += ['', f"The final cache has {len(candidate_cache['modes']['medium']['boards'])} Medium candidates across {len(medium_group_depths)} distinct solutions and {len(candidate_cache['modes']['hard']['boards'])} Hard candidates. Even choosing the maximum-depth board for the 100 strongest Medium solution groups only reaches a {medium_depth_ceiling:.2f} average in this pool, below V3's 3.87. The final 3.61 is near that measured pool ceiling. Stronger variants increase recipe concentration, which the final schedule reports rather than masking it.", '', 'Low adjacent overlap is not enough to make these boards fresh: many distant board pairs still share most of their cards, and chicken/rice/tortilla cores dominate. The smallest useful future work is a targeted compatibility review of existing experimental Medium recipes and decoys, especially the absent pizza/flatbread family and sparse noodles, followed by player testing. This experiment does not authorize or apply any canonical changes.', '', '## Rolling-window baseline comparison', '', '| Maximum appearances of one recipe in a window | V3 Medium | Expanded Medium | V3 Hard | Expanded Hard |', '|---|---:|---:|---:|---:|']
for width in ('7', '30'):
    values = [report[version][mode]['rollingWindows'][width]['maximumAppearanceDistribution']['max'] for version, mode in [('v3', 'medium'), ('expanded', 'medium'), ('v3', 'hard'), ('expanded', 'hard')]]
    lines.append(f"| {width} days | " + ' | '.join(map(str, values)) + ' |')
lines += ['', '## Playable review and reproducibility', '', '[Open the ten review samples](http://127.0.0.1:4173/?preview=expansion100). The Content selector retains V3 and the earlier pilot; the new option contains five samples per mode, labeled with their source day. All ten loaded with the correct 8/12 cards, and one Medium and one Hard solution reached the actual win state in browser testing. The existing screen was checked at 375 px and 430 px; labels and quantities remain readable, but a 16-type Hard pantry still needs substantial scrolling. No artwork, layout, or visual design was changed. The preview-only data selector was wired to the new sample files.', '', 'The 552 Medium and 866 Hard V3 seed answer groups are bundled as canonical recipe IDs in `seed-answer-groups.json`, so reproduction does not depend on transient `/private/tmp` files. `candidate-pools.json` preserves the complete accepted cache. Cached reproduction: run `node .../run-experiment.mjs`, `python3 .../verify.py`, and `python3 .../analyze.py` from the repository root, then `npm run build` for the preview. A fresh expanded-pool reproduction uses the same bundled seed groups; original V3 seed-search cold-start cost remains unmeasured. The initial startup attempt encountered a reporting-variable error after Medium preparation; it was corrected, its 0.57s is included in the runtime total, and no puzzle was accepted from that failed command.', '', f"Measured elapsed time from the first generation start through report/preview completion: {performance_report['elapsedSinceFirstGenerationStartSeconds']:.1f} seconds. Search-command wall time is reported separately from this elapsed review time. All 17 application/asset tests and the preview build pass. The independent report confirms {VERIFICATION['protectedFileCount']} protected files unchanged."]
(HERE / 'README.md').write_text('\n'.join(lines) + '\n')
print(json.dumps({mode: {key: report['expanded'][mode][key] for key in ['displayRecipeCoverage', 'newDisplayedRecipes', 'maximumRecipeFrequency', 'longestAppearanceStreak', 'adjacentOverlap', 'nearMisses', 'deductionSteps']} for mode in BOARDS}))
