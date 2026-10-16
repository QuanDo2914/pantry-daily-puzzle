# Clearline artwork refinement — complete V3 audit

This review is limited to the existing 90 ingredients and 150 V3 recipe identities. It changes only artwork and preview tooling; catalog quantities, puzzle data, mechanics, and live deployment remain unchanged.

## Coverage and outcomes

- Ingredient IDs checked: **90/90**; redrawn: **21**; retained after audit: **69**.
- Recipe IDs checked: **150/150** in both Medium and Hard; artwork changed: **118**; intentionally retained: **32**.
- Serving-shape classification changed: **50**. All 150 now have explicit presentation assignments; no approved recipe uses the name-based fallback.
- Every SVG is custom code-native vector art; no emoji or missing-ID fallback. All drawings are framed larger in the game, including those whose geometry was retained. The preserved v1 renderer remains at `src/visuals/clearline-v1.js`.
- The comparison preview provides 40, 48, and 64 px controls. At 40 px, silhouettes and the strongest toppings carry recognition; subtle garnish details still require labels. This is an icon system, not photorealistic food rendering.

## Highest-priority corrections

| Recipe | Correction |
|---|---|
| Ham and Cheese | Bowl fallback → sliced ham-and-cheese sandwich |
| Burrito Bowl | Folded tortilla → open rice, bean, vegetable bowl |
| Meatball Sub | Triangular wedges → long roll with visible meatballs and sauce |
| Broccoli Rice Skillet | Rice bowl → skillet |
| Tuna Patties | Fish fillet → two browned patties |

## Family-level differentiation

- Soups: broth color and dominant contents distinguish tomato, mushroom, broccoli cheddar, chicken noodle, beef stew, lentil, potato, curry, vegetable, and minestrone. Steam is part of the drawing; no perpetual animation.
- Pizzas: basil/mozzarella, pepperoni discs, chicken pieces, vegetables, mushroom caps, BBQ drizzle, egg, and an oval flatbread edge are visible preparation features.
- Burgers: patty colors and silhouettes, cheese, vegetable patty flecks, chicken/turkey layers, and Sloppy Joe sauce overflow distinguish variants.
- Rice, noodle, curry, and grain bowls: rice grains, noodles/egg, curry sauce, separated toppings, falafel, shawarma strips, and pineapple sections distinguish the preparations.
- Pasta, casseroles, and bakes: noodle plate, baking dish, layered lasagna slice, gratin slices, broccoli florets, beans, mac curls, and shepherd’s pie topping differ in both container and food shape.
- Salads and seafood: salad-specific large produce/protein forms; salmon fillet versus tuna patties, shrimp curves, and lemon wedge.

## Ingredient-by-ingredient audit

| ID | Name | Result |
|---|---|---|
| chicken | Chicken | Retained; recognizable in Clearline set |
| beef | Beef | Retained; recognizable in Clearline set |
| pork | Pork | Retained; recognizable in Clearline set |
| bacon | Bacon | Retained; recognizable in Clearline set |
| ham | Ham | Retained; recognizable in Clearline set |
| turkey | Turkey | Retained; recognizable in Clearline set |
| salmon | Salmon | Retained; recognizable in Clearline set |
| tuna | Tuna | Retained; recognizable in Clearline set |
| shrimp | Shrimp | Retained; recognizable in Clearline set |
| eggs | Eggs | Retained; recognizable in Clearline set |
| tofu | Tofu | Retained; recognizable in Clearline set |
| sausage | Sausage | Retained; recognizable in Clearline set |
| tomato | Tomato | Retained; recognizable in Clearline set |
| onion | Onion | Retained; recognizable in Clearline set |
| garlic | Garlic | Retained; recognizable in Clearline set |
| broccoli | Broccoli | Refined silhouette, texture, or packaging |
| carrot | Carrot | Retained; recognizable in Clearline set |
| bell_pepper | Bell pepper | Retained; recognizable in Clearline set |
| mushroom | Mushroom | Retained; recognizable in Clearline set |
| spinach | Spinach | Refined silhouette, texture, or packaging |
| lettuce | Lettuce | Refined silhouette, texture, or packaging |
| cucumber | Cucumber | Retained; recognizable in Clearline set |
| potato | Potato | Retained; recognizable in Clearline set |
| sweet_potato | Sweet potato | Retained; recognizable in Clearline set |
| zucchini | Zucchini | Refined silhouette, texture, or packaging |
| cabbage | Cabbage | Refined silhouette, texture, or packaging |
| peas | Peas | Retained; recognizable in Clearline set |
| corn | Corn | Retained; recognizable in Clearline set |
| green_beans | Green beans | Retained; recognizable in Clearline set |
| celery | Celery | Retained; recognizable in Clearline set |
| rice | Rice | Refined silhouette, texture, or packaging |
| pasta | Pasta | Retained; recognizable in Clearline set |
| noodles | Noodles | Retained; recognizable in Clearline set |
| bread | Bread | Retained; recognizable in Clearline set |
| tortilla | Tortilla | Retained; recognizable in Clearline set |
| flour | Flour | Retained; recognizable in Clearline set |
| oats | Oats | Retained; recognizable in Clearline set |
| quinoa | Quinoa | Refined silhouette, texture, or packaging |
| couscous | Couscous | Refined silhouette, texture, or packaging |
| breadcrumbs | Breadcrumbs | Retained; recognizable in Clearline set |
| pizza_dough | Pizza dough | Retained; recognizable in Clearline set |
| rice_noodles | Rice noodles | Retained; recognizable in Clearline set |
| cheese | Cheese | Refined silhouette, texture, or packaging |
| mozzarella | Mozzarella | Refined silhouette, texture, or packaging |
| parmesan | Parmesan | Refined silhouette, texture, or packaging |
| milk | Milk | Refined silhouette, texture, or packaging |
| cream | Cream | Refined silhouette, texture, or packaging |
| butter | Butter | Retained; recognizable in Clearline set |
| yogurt | Yogurt | Retained; recognizable in Clearline set |
| cream_cheese | Cream cheese | Retained; recognizable in Clearline set |
| sour_cream | Sour cream | Retained; recognizable in Clearline set |
| black_beans | Black beans | Refined silhouette, texture, or packaging |
| kidney_beans | Kidney beans | Refined silhouette, texture, or packaging |
| chickpeas | Chickpeas | Refined silhouette, texture, or packaging |
| lentils | Lentils | Refined silhouette, texture, or packaging |
| peanut_butter | Peanut butter | Retained; recognizable in Clearline set |
| peanuts | Peanuts | Retained; recognizable in Clearline set |
| almonds | Almonds | Retained; recognizable in Clearline set |
| apple | Apple | Retained; recognizable in Clearline set |
| banana | Banana | Retained; recognizable in Clearline set |
| strawberry | Strawberry | Retained; recognizable in Clearline set |
| blueberry | Blueberry | Retained; recognizable in Clearline set |
| lemon | Lemon | Retained; recognizable in Clearline set |
| lime | Lime | Retained; recognizable in Clearline set |
| avocado | Avocado | Retained; recognizable in Clearline set |
| pineapple | Pineapple | Retained; recognizable in Clearline set |
| mango | Mango | Retained; recognizable in Clearline set |
| orange | Orange | Retained; recognizable in Clearline set |
| olive_oil | Olive oil | Retained; recognizable in Clearline set |
| soy_sauce | Soy sauce | Retained; recognizable in Clearline set |
| tomato_sauce | Tomato sauce | Refined silhouette, texture, or packaging |
| coconut_milk | Coconut milk | Retained; recognizable in Clearline set |
| honey | Honey | Retained; recognizable in Clearline set |
| sugar | Sugar | Retained; recognizable in Clearline set |
| salt | Salt | Retained; recognizable in Clearline set |
| black_pepper | Black pepper | Retained; recognizable in Clearline set |
| chili_powder | Chili powder | Retained; recognizable in Clearline set |
| cumin | Cumin | Retained; recognizable in Clearline set |
| paprika | Paprika | Retained; recognizable in Clearline set |
| basil | Basil | Retained; recognizable in Clearline set |
| cilantro | Cilantro | Retained; recognizable in Clearline set |
| ginger | Ginger | Retained; recognizable in Clearline set |
| curry_paste | Curry paste | Refined silhouette, texture, or packaging |
| pepperoni | Pepperoni | Retained; recognizable in Clearline set |
| white_fish | White fish | Retained; recognizable in Clearline set |
| cashews | Cashews | Retained; recognizable in Clearline set |
| pesto | Pesto | Refined silhouette, texture, or packaging |
| mayonnaise | Mayonnaise | Retained; recognizable in Clearline set |
| sesame_oil | Sesame oil | Retained; recognizable in Clearline set |
| bbq_sauce | BBQ sauce | Refined silhouette, texture, or packaging |

## Recipe-by-recipe audit

| ID | Name | Previous → refined presentation | Result |
|---|---|---|---|
| beef_tacos | Beef Tacos | taco → taco | Retained after visual audit |
| chicken_tacos | Chicken Tacos | taco → taco | Retained after visual audit |
| black_bean_tacos | Black Bean Tacos | taco → taco | Retained after visual audit |
| chicken_quesadilla | Chicken Quesadilla | quesadilla → quesadilla | Retained after visual audit |
| cheese_quesadilla | Cheese Quesadilla | quesadilla → quesadilla | Retained after visual audit |
| beef_burrito | Beef Burrito | wrap → wrap | Dish-specific detail or food rendering refined |
| bean_burrito | Bean Burrito | wrap → wrap | Dish-specific detail or food rendering refined |
| chicken_fajitas | Chicken Fajitas | skillet → fajitas | Serving shape corrected |
| nachos | Nachos | nachos → nachos | Retained after visual audit |
| burrito_bowl | Burrito Bowl | wrap → burrito_bowl | Folded tortilla → open rice, bean, vegetable bowl |
| spaghetti_bolognese | Spaghetti Bolognese | pasta → pasta | Dish-specific detail or food rendering refined |
| chicken_alfredo | Chicken Alfredo | bowl → pasta | Serving shape corrected |
| mac_and_cheese | Mac and Cheese | pasta → pasta | Dish-specific detail or food rendering refined |
| pesto_pasta | Pesto Pasta | pasta → pasta | Dish-specific detail or food rendering refined |
| tomato_basil_pasta | Tomato Basil Pasta | pasta → pasta | Dish-specific detail or food rendering refined |
| mushroom_pasta | Mushroom Pasta | pasta → pasta | Dish-specific detail or food rendering refined |
| shrimp_scampi | Shrimp Scampi | pasta → pasta | Dish-specific detail or food rendering refined |
| baked_ziti | Baked Ziti | bake → bake | Dish-specific detail or food rendering refined |
| creamy_spinach_pasta | Creamy Spinach Pasta | pasta → pasta | Dish-specific detail or food rendering refined |
| pasta_primavera | Pasta Primavera | pasta → pasta | Dish-specific detail or food rendering refined |
| chicken_fried_rice | Chicken Fried Rice | bowl → rice | Serving shape corrected |
| egg_fried_rice | Egg Fried Rice | bowl → rice | Serving shape corrected |
| shrimp_fried_rice | Shrimp Fried Rice | bowl → rice | Serving shape corrected |
| beef_rice_bowl | Beef Rice Bowl | bowl → rice | Serving shape corrected |
| teriyaki_chicken_rice | Teriyaki Chicken Rice | bowl → rice | Serving shape corrected |
| mushroom_risotto | Mushroom Risotto | bowl → rice | Serving shape corrected |
| vegetable_rice_bowl | Vegetable Rice Bowl | bowl → rice | Serving shape corrected |
| chicken_biryani | Chicken Biryani | bowl → rice | Serving shape corrected |
| pineapple_fried_rice | Pineapple Fried Rice | bowl → rice | Serving shape corrected |
| rice_and_beans | Rice and Beans | bowl → rice | Serving shape corrected |
| chicken_ramen | Chicken Ramen | soup → ramen | Serving shape corrected |
| beef_ramen | Beef Ramen | soup → ramen | Serving shape corrected |
| pad_thai | Pad Thai | pasta → noodles | Serving shape corrected |
| beef_lo_mein | Beef Lo Mein | pasta → noodles | Serving shape corrected |
| vegetable_lo_mein | Vegetable Lo Mein | pasta → noodles | Serving shape corrected |
| chicken_chow_mein | Chicken Chow Mein | pasta → noodles | Serving shape corrected |
| garlic_noodles | Garlic Noodles | pasta → noodles | Serving shape corrected |
| sesame_noodles | Sesame Noodles | pasta → noodles | Serving shape corrected |
| singapore_noodles | Singapore Noodles | pasta → noodles | Serving shape corrected |
| shrimp_noodle_bowl | Shrimp Noodle Bowl | pasta → ramen | Serving shape corrected |
| tomato_soup | Tomato Soup | soup → soup | Dish-specific detail or food rendering refined |
| chicken_noodle_soup | Chicken Noodle Soup | soup → soup | Dish-specific detail or food rendering refined |
| beef_stew | Beef Stew | soup → soup | Dish-specific detail or food rendering refined |
| vegetable_soup | Vegetable Soup | soup → soup | Dish-specific detail or food rendering refined |
| broccoli_cheddar_soup | Broccoli Cheddar Soup | soup → soup | Dish-specific detail or food rendering refined |
| lentil_soup | Lentil Soup | soup → soup | Dish-specific detail or food rendering refined |
| mushroom_soup | Mushroom Soup | soup → soup | Dish-specific detail or food rendering refined |
| chicken_curry_soup | Chicken Curry Soup | soup → soup | Dish-specific detail or food rendering refined |
| potato_soup | Potato Soup | soup → soup | Dish-specific detail or food rendering refined |
| minestrone | Minestrone | bowl → soup | Serving shape corrected |
| beef_broccoli_stir_fry | Beef Broccoli Stir-Fry | skillet → skillet | Retained after visual audit |
| chicken_vegetable_stir_fry | Chicken Vegetable Stir-Fry | skillet → skillet | Retained after visual audit |
| garlic_shrimp_stir_fry | Garlic Shrimp Stir-Fry | skillet → skillet | Dish-specific detail or food rendering refined |
| tofu_stir_fry | Tofu Stir-Fry | skillet → skillet | Dish-specific detail or food rendering refined |
| mushroom_beef_stir_fry | Mushroom Beef Stir-Fry | skillet → skillet | Retained after visual audit |
| sweet_chili_chicken | Sweet Chili Chicken | soup → skillet | Serving shape corrected |
| ginger_pork_stir_fry | Ginger Pork Stir-Fry | skillet → skillet | Retained after visual audit |
| teriyaki_salmon | Teriyaki Salmon | bowl → fish | Serving shape corrected |
| pepper_beef_stir_fry | Pepper Beef Stir-Fry | skillet → skillet | Retained after visual audit |
| cashew_chicken | Cashew Chicken | bowl → skillet | Serving shape corrected |
| grilled_cheese | Grilled Cheese | sandwich → sandwich | Dish-specific detail or food rendering refined |
| blt_sandwich | BLT Sandwich | sandwich → sandwich | Dish-specific detail or food rendering refined |
| turkey_sandwich | Turkey Sandwich | sandwich → sandwich | Dish-specific detail or food rendering refined |
| ham_and_cheese | Ham and Cheese | bowl → sandwich | Bowl fallback → sliced ham-and-cheese sandwich |
| chicken_sandwich | Chicken Sandwich | sandwich → sandwich | Dish-specific detail or food rendering refined |
| tuna_melt | Tuna Melt | sandwich → sandwich | Dish-specific detail or food rendering refined |
| egg_salad_sandwich | Egg Salad Sandwich | sandwich → sandwich | Dish-specific detail or food rendering refined |
| chicken_wrap | Chicken Wrap | wrap → wrap | Retained after visual audit |
| veggie_wrap | Veggie Wrap | wrap → wrap | Retained after visual audit |
| breakfast_sandwich | Breakfast Sandwich | sandwich → sandwich | Dish-specific detail or food rendering refined |
| cheese_omelet | Cheese Omelet | omelet → omelet | Retained after visual audit |
| mushroom_omelet | Mushroom Omelet | omelet → omelet | Retained after visual audit |
| scrambled_eggs | Scrambled Eggs | scramble → scramble | Retained after visual audit |
| breakfast_burrito | Breakfast Burrito | wrap → wrap | Retained after visual audit |
| pancakes | Pancakes | pancake → pancake | Retained after visual audit |
| french_toast | French Toast | french_toast → french_toast | Retained after visual audit |
| oatmeal_bowl | Oatmeal Bowl | oatmeal → oatmeal | Dish-specific detail or food rendering refined |
| breakfast_hash | Breakfast Hash | skillet → skillet | Dish-specific detail or food rendering refined |
| egg_muffins | Egg Muffins | muffin → muffin | Retained after visual audit |
| avocado_toast | Avocado Toast | toast → toast | Retained after visual audit |
| caesar_salad | Caesar Salad | salad → salad | Retained after visual audit |
| greek_salad | Greek Salad | salad → salad | Dish-specific detail or food rendering refined |
| chicken_salad | Chicken Salad | salad → salad | Retained after visual audit |
| tuna_salad | Tuna Salad | salad → salad | Dish-specific detail or food rendering refined |
| quinoa_salad | Quinoa Salad | salad → salad | Dish-specific detail or food rendering refined |
| chickpea_salad | Chickpea Salad | salad → salad | Dish-specific detail or food rendering refined |
| pasta_salad | Pasta Salad | salad → salad | Dish-specific detail or food rendering refined |
| cucumber_tomato_salad | Cucumber Tomato Salad | salad → salad | Dish-specific detail or food rendering refined |
| spinach_salad | Spinach Salad | salad → salad | Dish-specific detail or food rendering refined |
| southwest_salad | Southwest Salad | salad → salad | Retained after visual audit |
| chicken_casserole | Chicken Casserole | bake → bake | Dish-specific detail or food rendering refined |
| cheesy_bean_bake | Cheesy Bean Bake | bake → bake | Dish-specific detail or food rendering refined |
| lasagna | Lasagna | bake → lasagna | Serving shape corrected |
| tuna_casserole | Tuna Casserole | bake → bake | Dish-specific detail or food rendering refined |
| potato_gratin | Potato Gratin | bake → bake | Dish-specific detail or food rendering refined |
| broccoli_cheese_bake | Broccoli Cheese Bake | bake → bake | Dish-specific detail or food rendering refined |
| shepherds_pie | Shepherd's Pie | bake → bake | Dish-specific detail or food rendering refined |
| baked_mac_and_cheese | Baked Mac and Cheese | bake → bake | Dish-specific detail or food rendering refined |
| sausage_pasta_bake | Sausage Pasta Bake | bake → bake | Dish-specific detail or food rendering refined |
| vegetable_lasagna | Vegetable Lasagna | bake → lasagna | Serving shape corrected |
| margherita_pizza | Margherita Pizza | pizza → pizza | Dish-specific detail or food rendering refined |
| pepperoni_pizza | Pepperoni Pizza | pizza → pizza | Dish-specific detail or food rendering refined |
| chicken_pizza | Chicken Pizza | pizza → pizza | Dish-specific detail or food rendering refined |
| veggie_pizza | Veggie Pizza | pizza → pizza | Dish-specific detail or food rendering refined |
| mushroom_pizza | Mushroom Pizza | pizza → pizza | Dish-specific detail or food rendering refined |
| bbq_chicken_pizza | BBQ Chicken Pizza | pizza → pizza | Dish-specific detail or food rendering refined |
| spinach_flatbread | Spinach Flatbread | pizza → pizza | Dish-specific detail or food rendering refined |
| cheese_flatbread | Cheese Flatbread | pizza → pizza | Dish-specific detail or food rendering refined |
| breakfast_pizza | Breakfast Pizza | pizza → pizza | Dish-specific detail or food rendering refined |
| tomato_garlic_flatbread | Tomato Garlic Flatbread | pizza → pizza | Dish-specific detail or food rendering refined |
| beef_burger | Beef Burger | burger → burger | Retained after visual audit |
| cheeseburger | Cheeseburger | burger → burger | Retained after visual audit |
| chicken_burger | Chicken Burger | burger → burger | Dish-specific detail or food rendering refined |
| turkey_burger | Turkey Burger | burger → burger | Dish-specific detail or food rendering refined |
| veggie_burger | Veggie Burger | burger → burger | Dish-specific detail or food rendering refined |
| sloppy_joe | Sloppy Joe | burger → burger | Dish-specific detail or food rendering refined |
| loaded_baked_potato | Loaded Baked Potato | potato → potato | Dish-specific detail or food rendering refined |
| chili_cheese_potato | Chili Cheese Potato | potato → potato | Retained after visual audit |
| sausage_and_peppers | Sausage and Peppers | skillet → skillet | Dish-specific detail or food rendering refined |
| meatball_sub | Meatball Sub | sandwich → sub | Triangular wedges → long roll with visible meatballs and sauce |
| garlic_butter_shrimp | Garlic Butter Shrimp | plate → skillet | Serving shape corrected |
| baked_salmon | Baked Salmon | plate → fish | Serving shape corrected |
| lemon_salmon | Lemon Salmon | plate → fish | Serving shape corrected |
| tuna_patties | Tuna Patties | plate → patties | Fish fillet → two browned patties |
| shrimp_tacos | Shrimp Tacos | taco → taco | Dish-specific detail or food rendering refined |
| salmon_rice_bowl | Salmon Rice Bowl | bowl → rice | Serving shape corrected |
| shrimp_curry | Shrimp Curry | bowl → curry | Serving shape corrected |
| garlic_fish_pasta | Garlic Fish Pasta | pasta → pasta | Dish-specific detail or food rendering refined |
| salmon_potato_skillet | Salmon Potato Skillet | skillet → skillet | Dish-specific detail or food rendering refined |
| shrimp_salad | Shrimp Salad | salad → salad | Dish-specific detail or food rendering refined |
| chicken_curry | Chicken Curry | bowl → curry | Serving shape corrected |
| beef_curry | Beef Curry | bowl → curry | Serving shape corrected |
| chickpea_curry | Chickpea Curry | bowl → curry | Serving shape corrected |
| coconut_tofu_curry | Coconut Tofu Curry | bowl → curry | Serving shape corrected |
| lentil_curry | Lentil Curry | bowl → curry | Serving shape corrected |
| thai_red_curry | Thai Red Curry | bowl → curry | Serving shape corrected |
| chicken_shawarma_bowl | Chicken Shawarma Bowl | bowl → grain_bowl | Serving shape corrected |
| falafel_bowl | Falafel Bowl | bowl → grain_bowl | Serving shape corrected |
| greek_chicken_bowl | Greek Chicken Bowl | bowl → grain_bowl | Serving shape corrected |
| mediterranean_grain_bowl | Mediterranean Grain Bowl | bowl → grain_bowl | Serving shape corrected |
| stuffed_peppers | Stuffed Peppers | stuffed → stuffed | Dish-specific detail or food rendering refined |
| mushroom_quesadilla | Mushroom Quesadilla | quesadilla → quesadilla | Retained after visual audit |
| chickpea_stir_fry | Chickpea Stir-Fry | skillet → skillet | Retained after visual audit |
| potato_and_egg_skillet | Potato and Egg Skillet | skillet → skillet | Retained after visual audit |
| sweet_potato_bowl | Sweet Potato Bowl | potato → grain_bowl | Serving shape corrected |
| zucchini_fritters | Zucchini Fritters | skillet → fritters | Serving shape corrected |
| spinach_frittata | Spinach Frittata | omelet → omelet | Retained after visual audit |
| vegetable_curry | Vegetable Curry | bowl → curry | Serving shape corrected |
| broccoli_rice_skillet | Broccoli Rice Skillet | skillet → skillet | Rice bowl → skillet |
| stuffed_sweet_potato | Stuffed Sweet Potato | potato → potato | Retained after visual audit |

## Validation boundary

Automated tests assert 90/90 ingredient art IDs, 150/150 explicit recipe presentations, 300 Medium/Hard renderings, zero emoji fallbacks, and all 200 V3 preview boards retaining one exact-quantity solution. Visual inspection of the full gallery and size-controlled comparison remains a human design approval step; automated SVG uniqueness does not prove that every pair is effortlessly distinguishable at 40 px.
