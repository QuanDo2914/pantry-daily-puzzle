"""Independent exhaustive quantity solver, metrics audit, and exact graph checks."""
import itertools
import json
import time
import hashlib
import sys
from collections import Counter
from pathlib import Path
import networkx as nx

HERE = Path(__file__).resolve().parent
ROOT = HERE.parent
START = time.perf_counter()
CATALOG = json.loads((ROOT / 'candidate-recipe-catalog.json').read_text())['recipes']
BY_ID = {row['id']: row for row in CATALOG}
INGREDIENT_IDS = {row['id'] for row in json.loads((ROOT / 'ingredient-catalog.json').read_text())['ingredients']}
assert len(BY_ID) == 225 and len(INGREDIENT_IDS) == 125
assert CATALOG[:150] == json.loads((ROOT / '../quality-v3/proposed-recipe-catalog.json').read_text())['recipes']


def consumption(cards):
    used = Counter()
    for card in cards:
        used.update(card['ingredients'])
    return dict(used)


def verify_board(board, mode):
    count, picks, bounds, family_min = (8, 3, (8, 12), 6) if mode == 'medium' else (12, 4, (12, 16), 7)
    cards, pantry = board['cards'], board['pantry']
    assert board['mode'] == mode
    assert len(cards) == count and len({card['id'] for card in cards}) == count
    assert len(board['solution']) == picks and len(set(board['solution'])) == picks
    solution = set(board['solution'])
    assert solution <= {card['id'] for card in cards}
    assert board['solutionKey'] == '|'.join(sorted(solution))
    families = Counter(card['family'] for card in cards)
    assert len(families) >= family_min and max(families.values()) <= 2
    assert bounds[0] <= len(pantry) <= bounds[1]
    assert all(key in INGREDIENT_IDS and type(qty) is int and qty > 0 for key, qty in pantry.items())
    for card in cards:
        canonical = BY_ID[card['id']]
        assert card['ingredients'] == canonical['variants'][mode]
        assert card['name'] == canonical['name'] and card['family'] == canonical['family']
        assert (3 <= len(card['ingredients']) <= 4) if mode == 'medium' else (4 <= len(card['ingredients']) <= 6)
        assert all(key in INGREDIENT_IDS and type(qty) is int and 1 <= qty <= 4 for key, qty in card['ingredients'].items())
        assert all(pantry.get(key, 0) >= qty for key, qty in card['ingredients'].items())
    assert consumption([card for card in cards if card['id'] in solution]) == pantry
    rows = []
    for combination in itertools.combinations(cards, picks):
        used = consumption(combination)
        distance = sum(abs(used.get(key, 0) - pantry.get(key, 0)) for key in pantry.keys() | used.keys())
        rows.append({'ids': {card['id'] for card in combination}, 'used': used, 'distance': distance})
    assert len(rows) == (56 if mode == 'medium' else 495)
    exact = [row['ids'] for row in rows if row['distance'] == 0]
    assert exact == [solution], (board['id'], exact)
    near = [row for row in rows if 0 < row['distance'] <= 4]
    plausible = [row for row in rows if 0 < row['distance'] <= 6]
    swaps = sum(len(row['ids'] & solution) == picks - 1 for row in plausible)
    competitive = {card['id'] for card in cards if card['id'] not in solution and any(card['id'] in row['ids'] for row in plausible)}
    degrees = {key: sum(key in card['ingredients'] for card in cards) for key in pantry}
    forced = {card['id'] for card in cards if card['id'] in solution and any(degrees[key] == 1 for key in card['ingredients'])}
    shared = sum(degree >= 3 for degree in degrees.values())
    floor = min(sum(row['used'].get(key, 0) == pantry[key] for row in rows) for key in pantry)
    remaining, available, depth = rows[:], list(pantry), 0
    while len(remaining) > 1 and available:
        options = [(key, [row for row in remaining if row['used'].get(key, 0) == pantry[key]]) for key in available]
        options = [option for option in options if any(row['distance'] == 0 for row in option[1])]
        options.sort(key=lambda option: len(option[1]))
        if not options or len(options[0][1]) == len(remaining):
            break
        key, remaining = options[0]
        available.remove(key)
        depth += 1
    edges = sum(len(a['ingredients'].keys() & b['ingredients'].keys()) >= 2 for a, b in itertools.combinations(cards, 2))
    density = edges / (count * (count - 1) / 2)
    score = round(len(near) * 2 + len(plausible) + len(competitive) * 3 + swaps * 2 + shared * 2 + density * 20 + depth * 4 - len(forced) * 15, 1)
    metrics = board['metrics']
    expected = {'combinations': len(rows), 'solutionCount': 1, 'nearMissCount': len(near), 'plausibleAlternatives': len(plausible), 'oneSwapNearMisses': swaps, 'sharedIngredientCount': shared, 'singleIngredientCandidateFloor': floor, 'deductionSteps': depth, 'difficultyScore': score, 'ingredientTypes': len(pantry), 'distinctFamilies': len(families), 'maxRecipesPerFamily': max(families.values())}
    for key, value in expected.items():
        assert metrics[key] == value, (board['id'], key, metrics[key], value)
    assert metrics['ingredientDegrees'] == degrees and abs(metrics['overlapDensity'] - density) <= 0.00051
    assert set(metrics['competitiveDecoyIds']) == competitive and set(metrics['forcedRecipeIds']) == forced
    assert len(near) >= (2 if mode == 'medium' else 3)
    assert len(plausible) >= (5 if mode == 'medium' else 12)
    assert len(competitive) >= (4 if mode == 'medium' else 7)
    assert len(forced) <= (2 if mode == 'medium' else 1)
    assert depth >= (2 if mode == 'medium' else 3)
    if mode == 'hard':
        assert swaps >= 2 and shared >= 5 and floor > 1
    near_rows = []
    for row in sorted(near, key=lambda row: (row['distance'], sorted(row['ids']))):
        near_rows.append({'recipeIds': sorted(row['ids']), 'distance': row['distance'], 'difference': {key: row['used'].get(key, 0) - pantry.get(key, 0) for key in pantry if row['used'].get(key, 0) != pantry[key]}})
    return {'id': board['id'], 'nearMisses': len(near), 'deductionSteps': depth, 'difficultyScore': score, 'pantryTypes': len(pantry), 'families': len(families), 'competitiveDecoys': len(competitive), 'nearMissExamples': near_rows}


def graph(board):
    result = nx.Graph()
    for ingredient, qty in board['pantry'].items():
        result.add_node('i:' + ingredient, kind='ingredient', quantity=qty)
    for card in board['cards']:
        result.add_node('r:' + card['id'], kind='recipe', quantity=0)
        for ingredient, qty in card['ingredients'].items():
            result.add_edge('r:' + card['id'], 'i:' + ingredient, quantity=qty)
    return result


def verify_mode(mode):
    boards = json.loads((HERE / f'{mode}-100.json').read_text())
    assert len(boards) <= 100
    audits = [verify_board(board, mode) for board in boards]
    card_sets = [tuple(sorted(card['id'] for card in board['cards'])) for board in boards]
    solutions = [tuple(sorted(board['solution'])) for board in boards]
    assert len(set(card_sets)) == len(boards) and len(set(solutions)) == len(boards)
    graphs = [graph(board) for board in boards]
    # Safe invariant prefilter: unequal node-label/degree multisets cannot be isomorphic.
    invariants = [sorted((data['kind'], data['quantity'], g.degree(node)) for node, data in g.nodes(data=True)) for g in graphs]
    exact_checks = 0
    for left, right in itertools.combinations(range(len(graphs)), 2):
        if invariants[left] != invariants[right]:
            continue
        exact_checks += 1
        assert not nx.is_isomorphic(graphs[left], graphs[right], node_match=lambda a, b: a['kind'] == b['kind'] and a['quantity'] == b['quantity'], edge_match=lambda a, b: a['quantity'] == b['quantity']), (boards[left]['id'], boards[right]['id'])
    pair_overlaps = [{'a': boards[a]['id'], 'b': boards[b]['id'], 'sharedCards': len(set(card_sets[a]) & set(card_sets[b]))} for a, b in itertools.combinations(range(len(boards)), 2)]
    near_identical = sorted([row for row in pair_overlaps if row['sharedCards'] >= (6 if mode == 'medium' else 10)], key=lambda row: -row['sharedCards'])
    return {'verified': len(boards), 'complete': len(boards) == 100, 'combinationsEnumerated': len(boards) * (56 if mode == 'medium' else 495), 'duplicateCardSets': 0, 'duplicateSolutionGroups': 0, 'equivalentStructures': 0, 'graphPairsCompared': len(boards) * (len(boards) - 1) // 2, 'exactGraphChecksAfterInvariantFilter': exact_checks, 'nearIdenticalDefinition': 'at least 6/8 or 10/12 identical recipe IDs; diagnostic, not a mandatory rejection rule', 'nearIdenticalPairs': near_identical, 'audits': audits}


report = {'status': 'independently_verified_100_day_experiment', 'structureEquivalence': 'Recipe and ingredient names are ignored. A bipartite graph preserves ingredient pantry totals and every per-recipe edge quantity. Recipe nodes have no solution label; exact isomorphism is tested after a safe invariant filter.', 'modes': {mode: verify_mode(mode) for mode in ('medium', 'hard')}}
preserved = json.loads((HERE / 'preservation-before.json').read_text())
assert all(hashlib.sha256(Path(name).read_bytes()).hexdigest() == digest for name, digest in preserved.items())
report['protectedFilesUnchanged'] = True
report['protectedFileCount'] = len(preserved)
report['validationRuntimeMs'] = round((time.perf_counter() - START) * 1000, 1)
if '--check' not in sys.argv:
    (HERE / 'independent-verification.json').write_text(json.dumps(report, indent=2) + '\n')
print(json.dumps({'runtimeMs': report['validationRuntimeMs'], 'modes': {mode: {key: report['modes'][mode][key] for key in ('verified', 'equivalentStructures', 'exactGraphChecksAfterInvariantFilter')} for mode in ('medium', 'hard')}}))
