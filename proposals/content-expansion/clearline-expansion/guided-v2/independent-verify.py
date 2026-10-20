"""Independent exhaustive solver and quality audit of guided expansion boards."""
from __future__ import annotations

import itertools
import json
import sys
from collections import Counter
from pathlib import Path
import networkx as nx

HERE = Path(__file__).resolve().parent
ROOT = HERE.parent
TARGET = int(sys.argv[1]) if len(sys.argv) > 1 else 10
assert TARGET in (10, 25)
CATALOG = json.loads((ROOT / "candidate-recipe-catalog.json").read_text())["recipes"]
V3 = json.loads((ROOT / "../quality-v3/proposed-recipe-catalog.json").read_text())["recipes"]
INGREDIENTS = json.loads((ROOT / "ingredient-catalog.json").read_text())["ingredients"]
NEW = {row["id"] for row in json.loads((ROOT / "source-proposal.json").read_text())["newRecipes"]}
BY_ID = {row["id"]: row for row in CATALOG}
INGREDIENT_IDS = {row["id"] for row in INGREDIENTS}
assert len(CATALOG) == 225 and len(BY_ID) == 225 and len(INGREDIENTS) == 125
assert CATALOG[:150] == V3


def sum_cards(cards):
    result = Counter()
    for card in cards:
        result.update(card["ingredients"])
    return dict(result)


def distance(used, pantry):
    return sum(abs(used.get(key, 0) - pantry.get(key, 0)) for key in used.keys() | pantry.keys())


def independent_depth(rows, pantry):
    remaining = rows[:]
    available = list(pantry)
    steps = 0
    while len(remaining) > 1 and available:
        choices = []
        for ingredient in available:
            subset = [row for row in remaining if row["used"].get(ingredient, 0) == pantry[ingredient]]
            if any(row["exact"] for row in subset):
                choices.append((len(subset), ingredient, subset))
        choices.sort(key=lambda item: item[0])
        if not choices or choices[0][0] == len(remaining):
            break
        _, chosen, remaining = choices[0]
        available.remove(chosen)
        steps += 1
    return steps


def verify(board, mode):
    picks, count, bounds, family_min = (3, 8, (8, 12), 6) if mode == "medium" else (4, 12, (12, 16), 7)
    cards, pantry, solution = board["cards"], board["pantry"], set(board["solution"])
    assert board["mode"] == mode and len(cards) == count and len({card["id"] for card in cards}) == count
    assert len(solution) == picks and solution <= {card["id"] for card in cards}
    assert bounds[0] <= len(pantry) <= bounds[1]
    assert len({card["family"] for card in cards}) >= family_min
    assert all(key in INGREDIENT_IDS and isinstance(qty, int) and qty > 0 for key, qty in pantry.items())
    for card in cards:
        canonical = BY_ID[card["id"]]
        assert card["name"] == canonical["name"] and card["family"] == canonical["family"]
        assert card["ingredients"] == canonical["variants"][mode]
        assert (3 <= len(card["ingredients"]) <= 4) if mode == "medium" else (4 <= len(card["ingredients"]) <= 6)
        assert all(key in INGREDIENT_IDS and isinstance(qty, int) and 1 <= qty <= 4 for key, qty in card["ingredients"].items())
        assert all(pantry.get(key, 0) >= qty for key, qty in card["ingredients"].items()), f"Infeasible card: {card['id']}"
    assert sum_cards([card for card in cards if card["id"] in solution]) == pantry
    rows = []
    for combination in itertools.combinations(cards, picks):
        used = sum_cards(combination)
        ids = {card["id"] for card in combination}
        delta = distance(used, pantry)
        rows.append({"ids": ids, "used": used, "delta": delta, "exact": delta == 0})
    assert len(rows) == (56 if mode == "medium" else 495)
    exact = [row["ids"] for row in rows if row["exact"]]
    assert exact == [solution], (board["id"], exact)
    near = sum(0 < row["delta"] <= 4 for row in rows)
    plausible = [row for row in rows if 0 < row["delta"] <= 6]
    competitive = {card["id"] for card in cards if card["id"] not in solution and any(card["id"] in row["ids"] for row in plausible)}
    one_swap = sum(len(row["ids"] & solution) == picks - 1 for row in plausible)
    degrees = {ingredient: sum(ingredient in card["ingredients"] for card in cards) for ingredient in pantry}
    forced = {card["id"] for card in cards if card["id"] in solution and any(degrees[ingredient] == 1 for ingredient in card["ingredients"])}
    depth = independent_depth(rows, pantry)
    metrics = board["metrics"]
    assert metrics["combinations"] == len(rows) and metrics["solutionCount"] == 1
    assert metrics["nearMissCount"] == near and metrics["plausibleAlternatives"] == len(plausible)
    assert metrics["oneSwapNearMisses"] == one_swap
    assert set(metrics["competitiveDecoyIds"]) == competitive
    assert set(metrics["forcedRecipeIds"]) == forced
    assert metrics["deductionSteps"] == depth
    assert near >= (2 if mode == "medium" else 3)
    assert len(plausible) >= (5 if mode == "medium" else 12)
    assert len(competitive) >= (4 if mode == "medium" else 7)
    assert len(forced) <= (2 if mode == "medium" else 1)
    assert depth >= (2 if mode == "medium" else 3)
    if mode == "hard":
        assert one_swap >= 2
        assert sum(value >= 3 for value in degrees.values()) >= 5
        assert all(sum(row["used"].get(ingredient, 0) == pantry[ingredient] for row in rows) > 1 for ingredient in pantry)
    return {"id": board["id"], "combinations": len(rows), "nearMisses": near, "deductionSteps": depth, "pantryTypes": len(pantry), "families": len({card["family"] for card in cards}), "newRecipes": [card["id"] for card in cards if card["id"] in NEW]}


def mathematical_graph(board):
    graph = nx.Graph()
    solution = set(board["solution"])
    for ingredient, pantry_qty in board["pantry"].items():
        graph.add_node(f"i:{ingredient}", kind="ingredient", label=pantry_qty)
    for card in board["cards"]:
        card_node = f"r:{card['id']}"
        graph.add_node(card_node, kind="recipe", label=card["id"] in solution)
        for ingredient, recipe_qty in card["ingredients"].items():
            graph.add_edge(card_node, f"i:{ingredient}", quantity=recipe_qty)
    return graph


def mode_report(mode):
    boards = json.loads((HERE / f"{mode}-{TARGET}.json").read_text())
    checked = [verify(board, mode) for board in boards]
    assert len({board["solutionKey"] for board in boards}) == len(boards)
    assert len({board["structuralSignature"] for board in boards}) == len(boards)
    graphs = [mathematical_graph(board) for board in boards]
    for left, right in itertools.combinations(range(len(graphs)), 2):
        same = nx.is_isomorphic(
            graphs[left], graphs[right],
            node_match=lambda a, b: a["kind"] == b["kind"] and a["label"] == b["label"],
            edge_match=lambda a, b: a["quantity"] == b["quantity"],
        )
        assert not same, f"Isomorphic mathematical structures: {boards[left]['id']} and {boards[right]['id']}"
    frequencies = Counter(card["id"] for board in boards for card in board["cards"])
    overlaps = [len({card["id"] for card in a["cards"]} & {card["id"] for card in b["cards"]}) for a, b in itertools.pairwise(boards)]
    avg = lambda values: round(sum(values) / len(values), 2) if values else 0
    return {"requested": TARGET, "verified": len(boards), "complete": len(boards) == TARGET, "allUniqueSolutions": True, "allUniqueStructures": True, "recipeCoverage": len(frequencies), "newRecipeCoverage": len(set(frequencies) & NEW), "ingredientCoverage": len({key for board in boards for key in board["pantry"]}), "familyCoverage": len({card["family"] for board in boards for card in board["cards"]}), "maxRecipeFrequency": max(frequencies.values(), default=0), "averageAdjacentOverlap": avg(overlaps), "averageNearMisses": avg([row["nearMisses"] for row in checked]), "averageDeductionSteps": avg([row["deductionSteps"] for row in checked]), "averagePantryTypes": avg([row["pantryTypes"] for row in checked]), "boards": checked}


report = {"status": "independently_verified_guided_expansion", "target": TARGET, "catalog": {"ingredients": 125, "recipes": 225, "originalV3DefinitionsUnchanged": True}, "modes": {mode: mode_report(mode) for mode in ("medium", "hard")}}
(HERE / f"verification-{TARGET}.json").write_text(json.dumps(report, indent=2) + "\n")
print({mode: {key: report["modes"][mode][key] for key in ("verified", "recipeCoverage", "newRecipeCoverage", "averageAdjacentOverlap", "averageNearMisses", "averageDeductionSteps")} for mode in ("medium", "hard")})
