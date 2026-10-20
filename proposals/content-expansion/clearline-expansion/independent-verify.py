"""Independent exact-combination audit of the bounded expanded-catalog pilot."""
from __future__ import annotations

import itertools
import json
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parent
CATALOG = json.loads((ROOT / "candidate-recipe-catalog.json").read_text())
INGREDIENTS = json.loads((ROOT / "ingredient-catalog.json").read_text())["ingredients"]
SOURCE = json.loads((ROOT / "source-proposal.json").read_text())
BY_RECIPE = {recipe["id"]: recipe for recipe in CATALOG["recipes"]}
INGREDIENT_IDS = {item["id"] for item in INGREDIENTS}
NEW_IDS = {item["id"] for item in SOURCE["newRecipes"]}


def used_by(cards):
    used = Counter()
    for card in cards:
        used.update(card["ingredients"])
    return used


def distance(used, pantry):
    return sum(abs(used.get(key, 0) - pantry.get(key, 0)) for key in used.keys() | pantry.keys())


def verify_board(board, mode):
    picks, card_count, pantry_range, family_min = (3, 8, (8, 12), 6) if mode == "medium" else (4, 12, (12, 16), 7)
    cards, pantry, solution = board["cards"], board["pantry"], set(board["solution"])
    assert board["mode"] == mode
    assert len(cards) == card_count and len({card["id"] for card in cards}) == card_count
    assert len(solution) == picks and solution <= {card["id"] for card in cards}
    assert pantry_range[0] <= len(pantry) <= pantry_range[1]
    assert len({card["family"] for card in cards}) >= family_min
    assert all(key in INGREDIENT_IDS and isinstance(value, int) and value > 0 for key, value in pantry.items())
    for card in cards:
        canonical = BY_RECIPE[card["id"]]
        assert card["name"] == canonical["name"] and card["family"] == canonical["family"]
        assert card["ingredients"] == canonical["variants"][mode]
        assert all(key in INGREDIENT_IDS and isinstance(value, int) and 1 <= value <= 4 for key, value in card["ingredients"].items())
        assert (3 <= len(card["ingredients"]) <= 4) if mode == "medium" else (4 <= len(card["ingredients"]) <= 6)
    rows = []
    for combo in itertools.combinations(cards, picks):
        ids = {card["id"] for card in combo}
        rows.append((ids, distance(used_by(combo), pantry)))
    expected = 56 if mode == "medium" else 495
    assert len(rows) == expected
    exact = [ids for ids, delta in rows if delta == 0]
    assert exact == [solution], (board["id"], exact, solution)
    near = sum(0 < delta <= 4 for _, delta in rows)
    plausible = sum(0 < delta <= 6 for _, delta in rows)
    assert near == board["metrics"]["nearMissCount"]
    assert plausible == board["metrics"]["plausibleAlternatives"]
    return {"id": board["id"], "combinations": expected, "strictNearMisses": near, "plausibleAlternatives": plausible, "deductionStepsReported": board["metrics"]["deductionSteps"], "pantryTypes": len(pantry), "recipeFamilies": len({card["family"] for card in cards}), "newRecipeIds": [card["id"] for card in cards if card["id"] in NEW_IDS]}


def summarize(mode):
    path = ROOT / f"{mode}-25.json"
    if not path.exists():
        return {"requested": 25, "verified": 0, "status": "not_generated"}
    boards = json.loads(path.read_text())
    checked = [verify_board(board, mode) for board in boards]
    recipes = Counter(card["id"] for board in boards for card in board["cards"])
    ingredients = {key for board in boards for key in board["pantry"]}
    families = {card["family"] for board in boards for card in board["cards"]}
    overlaps = [len({card["id"] for card in before["cards"]} & {card["id"] for card in after["cards"]}) for before, after in itertools.pairwise(boards)]
    avg = lambda values: round(sum(values) / len(values), 2) if values else None
    return {"requested": 25, "verified": len(checked), "status": "complete" if len(checked) == 25 else "partial", "allUniqueSolutions": True, "recipeCoverage": len(recipes), "newRecipeCoverage": len({rid for rid in recipes if rid in NEW_IDS}), "ingredientCoverage": len(ingredients), "familyCoverage": len(families), "maxRecipeFrequency": max(recipes.values(), default=0), "averageAdjacentOverlap": avg(overlaps), "averageStrictNearMisses": avg([item["strictNearMisses"] for item in checked]), "averageDeductionStepsReported": avg([item["deductionStepsReported"] for item in checked]), "averagePantryTypes": avg([item["pantryTypes"] for item in checked]), "boards": checked}


assert len(INGREDIENTS) == 125 and len(INGREDIENT_IDS) == 125
assert len(CATALOG["recipes"]) == 225 and len(BY_RECIPE) == 225
assert CATALOG["recipes"][:150] == json.loads((ROOT / "../quality-v3/proposed-recipe-catalog.json").read_text())["recipes"]
report = {"status": "independent_partial_pilot", "catalog": {"ingredients": 125, "recipes": 225, "newRecipes": 75, "v3DefinitionsUnchanged": True}, "modes": {mode: summarize(mode) for mode in ("medium", "hard")}}
(ROOT / "independent-verification.json").write_text(json.dumps(report, indent=2) + "\n")
lines = ["# Independent verification — expanded Clearline pilot", "", "The bounded pilot did not meet the requested 25 boards per mode. This verifier enumerates every 3-of-8 or 4-of-12 combination on each completed board, independently of the generator.", "", "| Measure | Medium | Hard |", "|---|---:|---:|"]
for label, key in [("Verified boards", "verified"), ("Recipe coverage", "recipeCoverage"), ("New-recipe coverage", "newRecipeCoverage"), ("Ingredient coverage", "ingredientCoverage"), ("Family coverage", "familyCoverage"), ("Maximum recipe frequency", "maxRecipeFrequency"), ("Average adjacent overlap", "averageAdjacentOverlap"), ("Average strict near misses", "averageStrictNearMisses"), ("Average pantry types", "averagePantryTypes"), ("Generator-reported deduction steps", "averageDeductionStepsReported")]:
    lines.append(f"| {label} | {report['modes']['medium'].get(key, 'n/a')} | {report['modes']['hard'].get(key, 'n/a')} |")
lines += ["", "All completed boards have exactly one solution, canonical card quantities, valid pantry inventory, and the required recipe-card and family counts. Deduction depth is the generator's metric; this independent verifier checks exhaustive uniqueness and near-miss counts, not its step heuristic.", "", "V3's 150 recipe definitions are byte-for-byte equivalent as parsed JSON in this candidate catalog."]
(ROOT / "independent-verification.md").write_text("\n".join(lines) + "\n")
print({mode: {key: report["modes"][mode][key] for key in ("verified", "recipeCoverage", "newRecipeCoverage")} for mode in ("medium", "hard")})
