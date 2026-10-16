# Pantry Quality V3 — final content review

**Scope:** Read-only review of the preserved Quality V3 catalog, 100 Medium boards, and 100 Hard boards. No recipe definition or puzzle JSON was changed for this review. The 25 changes below are proposals, not verified puzzle content.

## Verified findings

- The V3 Hard catalog has **150 four-ingredient recipes, zero five-ingredient recipes, and zero six-ingredient recipes**. The earlier “149 of 150” figure counted changed definitions relative to the original proposal; the one unchanged recipe also has four ingredients. The original Hard proposal had 1 four-ingredient, 29 five-ingredient, and 120 six-ingredient definitions.
- The independent validator passed **200/200** existing V3 boards: exactly one solution each, no duplicate structures, and no duplicate solution groups. Medium covers 120/150 recipes; Hard covers 116/150. Hard's maximum recipe appearance count is 41/100 days, average adjacent overlap is 0.30 of 12 cards, and longest appearance streak is four days.
- Hard's average strict near misses are 7.48 and average heuristic deduction depth is 5.32. These measure combinatorial challenge, not observed player completion time.
- All 15 families appear in the Hard batch, but not evenly: pizza/flatbreads have 14 card appearances, seafood 26, noodles 31, and pasta 36, compared with tacos/Mexican at 157 and curries/bowls at 154.
- Chicken, rice, and cheese appear in the pantry on 96, 97, and 99 Hard days respectively. The current four-ingredient model gives many boards the same visible staples even when the cards change.
- The Hard overlap graph lists 34 recipes absent from the 100-day schedule: four have no qualifying answer pool, 26 were never feasible as decoys in the sampled pools, one failed the board quality gates, and three were available but lost in scheduling. This explains why simple rescheduling cannot ensure full catalog coverage.

## Culinary audit

Four ingredients are sufficient for dishes with a clear identity, such as Mushroom Pizza (dough, tomato sauce, mozzarella, mushroom) or Shrimp Tacos (shrimp, tortilla, cabbage, lime). The uniform four-ingredient rule becomes a problem for dishes whose defining sauce or preparation disappears. Beef and Vegetable Lo Mein lack scored soy sauce; Pad Thai lacks lime and sauce; Chicken Ramen has no broth-like flavor cue; the Greek and Shawarma bowls are reduced to common chicken/rice/lettuce combinations. Breakfast recipes lose characteristic butter or fillings. The issue is therefore selective, rather than an across-the-board need to restore all sixth ingredients.

The current scored set also makes some card pairs too similar: Turkey Burger and Turkey Sandwich share turkey, bread, and lettuce and differ only by tomato versus cheese; Shrimp Curry, Chicken Curry, and Beef Curry differ mainly by protein; Salmon Rice Bowl is missing its soy/ginger dressing. Similar cards can create useful decoys, but too many generic identities make the menu feel repetitive. Generic `cheese` is also not a precise substitute for cheddar in Broccoli Cheddar Soup or feta-style cheese in a Greek bowl; that is a naming/content review item, not a reason to invent a new ingredient in this review.

## Targeted adjustment proposal

Quantities are shown as `ingredient×quantity`. Every proposed ingredient already exists in the 90-item proposal catalog. The base four ingredients stay scored except for the two bowls, where lettuce is replaced with cucumber to restore the dish's identity. A fifth or sixth ingredient should be scored only if players can recognize it as a meaningful ingredient; routine oil, salt, and garnish can remain unscored.

| Recipe · Hard appearances | Current scored ingredients | Proposed scored ingredients | Culinary and puzzle reason |
| --- | --- | --- | --- |
| Spinach Flatbread · 0 | dough×1, spinach×2, mozzarella×1, garlic×1 | dough×1, spinach×2, mozzarella×1, garlic×1, tomato×1 | Tomato connects the flatbread to vegetable and pizza cards; check feasibility before adoption. |
| Tomato Garlic Flatbread · 0 | dough×1, tomato×2, garlic×2, mozzarella×1 | dough×1, tomato×2, garlic×2, mozzarella×1, basil×1 | Basil separates it from generic tomato pizza without scoring oil. |
| Mushroom Pizza · 3 | dough×1, tomato sauce×2, mozzarella×2, mushroom×2 | dough×1, tomato sauce×2, mozzarella×2, mushroom×2, garlic×1 | Garlic connects mushroom pasta, risotto, and flatbread cards. |
| Breakfast Pizza · 3 | dough×1, eggs×2, cheese×2, bacon×1 | dough×1, eggs×2, cheese×2, bacon×1, spinach×1 | Spinach provides a credible bridge to frittata and egg muffin cards. |
| Lemon Salmon · 0 | salmon×2, lemon×2, rice×1, spinach×1 | salmon×2, lemon×2, rice×1, spinach×1, garlic×1, butter×1 | Restores a recognizable lemon-garlic butter preparation; both additions may restrict decoys. |
| Salmon Rice Bowl · 1 | salmon×2, rice×2, cucumber×1, avocado×1 | salmon×2, rice×2, cucumber×1, avocado×1, soy sauce×1 | The dressing connects rice bowls and stir-fries. |
| Garlic Fish Pasta · 0 | white fish×2, pasta×2, garlic×2, butter×1 | white fish×2, pasta×2, garlic×2, butter×1, lemon×1 | Lemon is natural for fish pasta and may connect seafood cards. |
| Shrimp Tacos · 3 | shrimp×2, tortilla×2, cabbage×1, lime×1 | shrimp×2, tortilla×2, cabbage×1, lime×1, avocado×1 | Avocado links tacos, salads, and bowls. |
| Pad Thai · 0 | rice noodles×2, shrimp×2, eggs×1, peanuts×1 | rice noodles×2, shrimp×2, eggs×1, peanuts×1, lime×1, soy sauce×1 | Acid and sauce are defining features; may create more Asian-food overlap. |
| Sesame Noodles · 0 | noodles×2, sesame oil×1, soy sauce×1, peanuts×1 | noodles×2, sesame oil×1, soy sauce×1, peanuts×1, ginger×1 | Ginger differentiates it from plain soy noodles. |
| Chicken Ramen · 1 | chicken×2, noodles×2, eggs×1, spinach×1 | chicken×2, noodles×2, eggs×1, spinach×1, mushroom×1 | Mushroom adds a plausible broth/vegetable cue and connects soups. |
| Beef Lo Mein · 13 | beef×2, noodles×2, cabbage×1, carrot×1 | beef×2, noodles×2, cabbage×1, carrot×1, soy sauce×1 | Sauce distinguishes lo mein from plain beef noodles. |
| Vegetable Lo Mein · 2 | noodles×2, cabbage×1, carrot×1, mushroom×1 | noodles×2, cabbage×1, carrot×1, mushroom×1, soy sauce×1 | Parallel sauce requirement makes the lo mein pair coherent. |
| Minestrone · 0 | kidney beans×1, pasta×1, tomato×2, carrot×1 | kidney beans×1, pasta×1, tomato×2, carrot×1, celery×1, zucchini×1 | The vegetables make this recognizably minestrone and connect other soups. |
| Chicken Noodle Soup · 1 | chicken×2, noodles×1, carrot×1, celery×1 | chicken×2, noodles×1, carrot×1, celery×1, onion×1 | Onion reinforces a soup base and overlaps with vegetable dishes. |
| Lentil Soup · 1 | lentils×2, carrot×1, tomato×1, onion×1 | lentils×2, carrot×1, tomato×1, onion×1, garlic×1 | Garlic links lentil, tomato, and vegetable dishes. |
| Pancakes · 0 | flour×2, milk×1, eggs×1, sugar×1 | flour×2, milk×1, eggs×1, sugar×1, butter×1 | Butter restores preparation identity and overlaps French Toast. |
| French Toast · 1 | bread×2, eggs×2, milk×1, sugar×1 | bread×2, eggs×2, milk×1, sugar×1, butter×1 | Butter makes the breakfast cluster internally consistent. |
| Oatmeal Bowl · 0 | oats×2, milk×1, banana×1, honey×1 | oats×2, milk×1, banana×1, honey×1, blueberry×1 | A fruit topping adds visual identity; avoid scoring both berries and nuts automatically. |
| Breakfast Burrito · 11 | tortilla×1, eggs×2, potato×1, cheese×1 | tortilla×1, eggs×2, potato×1, cheese×1, sausage×1 | Sausage differentiates it from a generic egg-potato wrap. |
| Chicken Shawarma Bowl · 41 | chicken×2, rice×2, lettuce×1, tomato×1 | chicken×2, rice×2, cucumber×1, tomato×1, yogurt×1, cumin×1 | Replaces generic lettuce with cucumber and restores the yogurt/spice identity. This may reduce its excessive decoy role. |
| Greek Chicken Bowl · 41 | chicken×2, rice×2, lettuce×1, cheese×1 | chicken×2, rice×2, cucumber×1, cheese×1, tomato×1, lemon×1 | Restores Greek-style fresh produce and separates it from Shawarma; the cheese label still needs culinary review. |
| Chicken Casserole · 41 | chicken×2, rice×1, broccoli×1, cheese×1 | chicken×2, rice×1, broccoli×1, cheese×1, cream×1 | Cream differentiates a casserole from a chicken-rice bowl and may reduce universal decoy use. |
| Tuna Casserole · 0 | tuna×2, pasta×2, peas×1, cream×1 | tuna×2, pasta×2, peas×1, cream×1, breadcrumbs×1 | A baked topping distinguishes it from creamy tuna pasta. |
| Tomato Basil Pasta · 0 | pasta×2, tomato×2, basil×1, parmesan×1 | pasta×2, tomato×2, basil×1, parmesan×1, garlic×1 | Garlic links tomato soup, baked pasta, and flatbread cards. |

This 25-recipe pilot would yield **125 four-ingredient, 20 five-ingredient, and 5 six-ingredient** Hard definitions. It is a modest correction to the all-four baseline, not a claim that this is the ideal final mix. A larger shift toward roughly 90 four-, 45 five-, and 15 six-ingredient definitions would require 60 carefully reviewed changes and is outside this focused review.

**Predicted impact, not measured:** Adding sauce, citrus, herbs, and vegetables can improve recognizable recipe identity and create overlap among underused families. It can also reduce individual decoy feasibility, increase pantry size, eliminate near misses, or create multiple solutions. Tightening the three 41-use cards may lower repetition, but could leave too few valid Hard boards. There is no measured basis to promise 120-recipe coverage or a 25-use maximum from these changes. If approved for a future revision, edit a separate catalog and rerun independent exhaustive validation before using any regenerated board.

## Pantry size and mobile use

The preserved Medium rule is 8–12 pantry types. The preserved Hard rule is 12–16. In the actual Hard batch, 2 boards have 12 types, 7 have 13, 21 have 14, 49 have 15, and 21 have 16. Thus **70 of 100 Hard boards show 15 or 16 pantry types** alongside 12 recipe cards. At phone width this likely requires a compact, scrollable pantry and clear grouping; screen comfort and solve time have not been tested with players.

**Recommendation:** Keep Medium **8–12** for the proposed integration trial. Keep Hard **12–16 as a provisional ceiling**, with a design preference for 12–14 when a board of equal quality exists. Do not tighten the cap or restore the original 9–13/8-family rule based on this review alone: the existing feasibility screen found very few qualifying candidates under that combination, and no full 100-day schedule was tested there. Any change to the range or seven-family floor still needs explicit approval. A phone playtest should determine whether 15–16 tiles and 12 cards are comfortable; the current numbers alone cannot establish this.

## Five existing Hard boards

The [existing V3 Hard sample file](samples.md#hard) contains the **complete pantry quantities, all 12 cards and their ingredient quantities, exact four-recipe solution, and close alternatives** for each board below. These are preserved boards, not regenerated examples.

| Existing board | Pantry types | Independently verified solution | Why it challenges the player | Definition to review |
| --- | ---: | --- | --- | --- |
| `quality-v3-hard-001` | 13 | Egg Salad Sandwich + Broccoli Cheddar Soup + Chicken Burger + Burrito Bowl | 16 near misses, 46 plausible alternatives, six deduction steps; broccoli and bean swaps differ by small quantities. | “Cheddar” uses generic cheese; Chicken Burger and Chicken Sandwich differ weakly. |
| `quality-v3-hard-013` | 16 | Vegetable Rice Bowl + Spinach Frittata + Thai Red Curry + Mushroom Pizza | 14 near misses, 37 plausible alternatives; pizza, egg, curry, and rice requirements interact. | Thai Red Curry's four scored ingredients omit its rice and basil; retained as a plausible bowl but merits naming review. |
| `quality-v3-hard-004` | 16 | Sausage Pasta Bake + Falafel Bowl + Mushroom Quesadilla + Beef Lo Mein | 12 near misses and six deduction steps; noodles, pasta, couscous, and tortillas offer competing starch allocations. | Beef and Vegetable Lo Mein currently omit scored soy sauce; Falafel Bowl is represented by chickpeas rather than a prepared falafel ingredient. |
| `quality-v3-hard-063` | 14 | Chicken Tacos + Rice and Beans + Turkey Sandwich + Mushroom Pasta | 10 near misses, 39 plausible alternatives; turkey, bean, mushroom, and chicken substitutes remain feasible. | Turkey Burger and Turkey Sandwich share bread, turkey, lettuce and differ only by tomato/cheese; burger bun is represented by generic bread. |
| `quality-v3-hard-007` | 16 | Shepherd's Pie + Shrimp Salad + Chicken Curry + Tuna Melt | 6 near misses, seven deduction steps; protein and curry swaps require checking several ingredients together. | Chicken, Beef, and Shrimp Curry differ mainly by protein in the four-scored-ingredient model. |

## Assessment

V3 is a sound **playtest baseline**. It should **not be integrated unchanged as an approved content catalog** while all Hard recipes have four scored ingredients and 149 changed definitions await review. The next decision is whether to approve a limited, separate content revision for the 25 listed recipes and a mobile playtest of the preserved V3 rules. This review itself changes no content and makes no statistical claim about an ungenerated revision.
