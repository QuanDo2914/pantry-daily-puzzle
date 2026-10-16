// Phase 1 proposal data only. Nothing in src/ imports this file.
const I = (id, name, category, icon, aliases = []) => ({ id, name, category, icon, aliases });

export const INGREDIENTS = [
  I('chicken','Chicken','protein','🍗'), I('beef','Beef','protein','🥩'), I('pork','Pork','protein','🥩'),
  I('bacon','Bacon','protein','🥓'), I('ham','Ham','protein','🍖'), I('turkey','Turkey','protein','🦃'),
  I('salmon','Salmon','protein','🐟'), I('tuna','Tuna','protein','🐟'), I('shrimp','Shrimp','protein','🍤'),
  I('eggs','Eggs','protein','🥚',['egg']), I('tofu','Tofu','protein','◻️'), I('sausage','Sausage','protein','🌭'),
  I('tomato','Tomato','vegetable','🍅',['tomatoes']), I('onion','Onion','vegetable','🧅'),
  I('garlic','Garlic','vegetable','🧄'), I('broccoli','Broccoli','vegetable','🥦'),
  I('carrot','Carrot','vegetable','🥕',['carrots']), I('bell_pepper','Bell pepper','vegetable','🫑',['pepper','bell peppers']),
  I('mushroom','Mushroom','vegetable','🍄',['mushrooms']), I('spinach','Spinach','vegetable','🌿'),
  I('lettuce','Lettuce','vegetable','🥬'), I('cucumber','Cucumber','vegetable','🥒'),
  I('potato','Potato','vegetable','🥔',['potatoes']), I('sweet_potato','Sweet potato','vegetable','🍠',['sweet potatoes']),
  I('zucchini','Zucchini','vegetable','🥒'), I('cabbage','Cabbage','vegetable','🥬'),
  I('peas','Peas','vegetable','🫛'), I('corn','Corn','vegetable','🌽'), I('green_beans','Green beans','vegetable','🫛'),
  I('celery','Celery','vegetable','🌱'),
  I('rice','Rice','grain_starch','🍚'), I('pasta','Pasta','grain_starch','🍝'),
  I('noodles','Noodles','grain_starch','🍜'), I('bread','Bread','grain_starch','🍞'),
  I('tortilla','Tortilla','grain_starch','🫓',['tortillas']), I('flour','Flour','grain_starch','🌾'),
  I('oats','Oats','grain_starch','🥣'), I('quinoa','Quinoa','grain_starch','🌾'),
  I('couscous','Couscous','grain_starch','🌾'), I('breadcrumbs','Breadcrumbs','grain_starch','🍞'),
  I('pizza_dough','Pizza dough','grain_starch','🍕',['dough']), I('rice_noodles','Rice noodles','grain_starch','🍜'),
  I('cheese','Cheese','dairy','🧀'), I('mozzarella','Mozzarella','dairy','🧀'),
  I('parmesan','Parmesan','dairy','🧀'), I('milk','Milk','dairy','🥛'), I('cream','Cream','dairy','🥛'),
  I('butter','Butter','dairy','🧈'), I('yogurt','Yogurt','dairy','🥣'),
  I('cream_cheese','Cream cheese','dairy','🧀'), I('sour_cream','Sour cream','dairy','🥣'),
  I('black_beans','Black beans','legume_nut','🫘'), I('kidney_beans','Kidney beans','legume_nut','🫘'),
  I('chickpeas','Chickpeas','legume_nut','🫘',['garbanzo beans']), I('lentils','Lentils','legume_nut','🫘'),
  I('peanut_butter','Peanut butter','legume_nut','🥜'), I('peanuts','Peanuts','legume_nut','🥜'),
  I('almonds','Almonds','legume_nut','🌰'),
  I('apple','Apple','fruit','🍎'), I('banana','Banana','fruit','🍌'), I('strawberry','Strawberry','fruit','🍓'),
  I('blueberry','Blueberry','fruit','🫐'), I('lemon','Lemon','fruit','🍋'), I('lime','Lime','fruit','🍋‍🟩'),
  I('avocado','Avocado','fruit','🥑'), I('pineapple','Pineapple','fruit','🍍'), I('mango','Mango','fruit','🥭'),
  I('orange','Orange','fruit','🍊'),
  I('olive_oil','Olive oil','pantry','🫒',['oil','cooking oil']), I('soy_sauce','Soy sauce','pantry','🥢'),
  I('tomato_sauce','Tomato sauce','pantry','🥫'), I('coconut_milk','Coconut milk','pantry','🥥'),
  I('honey','Honey','pantry','🍯'), I('sugar','Sugar','pantry','🍬'), I('salt','Salt','pantry','🧂'),
  I('black_pepper','Black pepper','pantry','⚫',['peppercorn']), I('chili_powder','Chili powder','pantry','🌶️'),
  I('cumin','Cumin','pantry','🟤'), I('paprika','Paprika','pantry','🔴'), I('basil','Basil','pantry','🌿'),
  I('cilantro','Cilantro','pantry','🌿',['coriander leaf']), I('ginger','Ginger','pantry','🫚'),
  I('curry_paste','Curry paste','pantry','🍛')
];

// These additions are deliberately separate and require approval before integration.
export const PROPOSED_ADDITIONS = [
  I('pepperoni','Pepperoni','protein','🍕'),
  I('white_fish','White fish','protein','🐟',['fish']),
  I('cashews','Cashews','legume_nut','🥜'),
  I('pesto','Pesto','pantry','🌿'),
  I('mayonnaise','Mayonnaise','pantry','🥚',['mayo']),
  I('sesame_oil','Sesame oil','pantry','🫙',['sesame']),
  I('bbq_sauce','BBQ sauce','pantry','🫙',['barbecue sauce'])
];

const V = entries => Object.fromEntries(entries);
const R = (id, name, family, icon, medium, hard, optionalSeasonings = []) => ({
  id, name, family, icon, variants: { medium: V(medium), hard: V(hard) }, optionalSeasonings
});

export const RECIPES = [
  // 1. Tacos & Mexican-Style
  R('beef_tacos','Beef Tacos','tacos_mexican','🌮',[['beef',2],['tortilla',2],['tomato',1],['cheese',1]],[['beef',2],['tortilla',2],['tomato',1],['cheese',1],['onion',1],['cilantro',1]],['lime','chili_powder']),
  R('chicken_tacos','Chicken Tacos','tacos_mexican','🌮',[['chicken',2],['tortilla',2],['lettuce',1],['cheese',1]],[['chicken',2],['tortilla',2],['lettuce',1],['cheese',1],['tomato',1],['lime',1]],['cumin']),
  R('black_bean_tacos','Black Bean Tacos','tacos_mexican','🌮',[['black_beans',2],['tortilla',2],['corn',1],['tomato',1]],[['black_beans',2],['tortilla',2],['corn',1],['tomato',1],['avocado',1],['lime',1]],['cilantro','cumin']),
  R('chicken_quesadilla','Chicken Quesadilla','tacos_mexican','🫓',[['chicken',2],['tortilla',2],['cheese',2]],[['chicken',2],['tortilla',2],['cheese',2],['bell_pepper',1],['onion',1]],['chili_powder']),
  R('cheese_quesadilla','Cheese Quesadilla','tacos_mexican','🫓',[['tortilla',2],['cheese',2],['tomato',1]],[['tortilla',2],['cheese',2],['tomato',1],['onion',1],['avocado',1]],['cilantro','sour_cream']),
  R('beef_burrito','Beef Burrito','tacos_mexican','🌯',[['beef',2],['tortilla',1],['rice',1],['black_beans',1]],[['beef',2],['tortilla',1],['rice',1],['black_beans',1],['cheese',1],['tomato',1]],['cumin']),
  R('bean_burrito','Bean Burrito','tacos_mexican','🌯',[['black_beans',2],['tortilla',1],['rice',1],['cheese',1]],[['black_beans',2],['tortilla',1],['rice',1],['cheese',1],['tomato',1],['onion',1]],['cumin']),
  R('chicken_fajitas','Chicken Fajitas','tacos_mexican','🫑',[['chicken',2],['tortilla',2],['bell_pepper',2],['onion',1]],[['chicken',2],['tortilla',2],['bell_pepper',2],['onion',1],['lime',1]],['chili_powder']),
  R('nachos','Nachos','tacos_mexican','🧀',[['tortilla',2],['cheese',2],['black_beans',1],['tomato',1]],[['tortilla',2],['cheese',2],['black_beans',1],['tomato',1],['corn',1],['avocado',1]],['chili_powder','sour_cream']),
  R('burrito_bowl','Burrito Bowl','tacos_mexican','🥗',[['rice',2],['black_beans',2],['corn',1],['tomato',1]],[['rice',2],['black_beans',2],['corn',1],['tomato',1],['avocado',1],['lime',1]],['cilantro']),

  // 2. Pasta
  R('spaghetti_bolognese','Spaghetti Bolognese','pasta','🍝',[['pasta',2],['beef',2],['tomato_sauce',2],['onion',1]],[['pasta',2],['beef',2],['tomato_sauce',2],['onion',1],['garlic',1]],['basil']),
  R('chicken_alfredo','Chicken Alfredo','pasta','🍝',[['pasta',2],['chicken',2],['cream',1],['parmesan',1]],[['pasta',2],['chicken',2],['cream',1],['parmesan',1],['garlic',1],['butter',1]],['black_pepper']),
  R('mac_and_cheese','Mac and Cheese','pasta','🧀',[['pasta',2],['cheese',2],['milk',1]],[['pasta',2],['cheese',2],['milk',1],['butter',1],['breadcrumbs',1]],['black_pepper']),
  R('pesto_pasta','Pesto Pasta','pasta','🌿',[['pasta',2],['pesto',2],['parmesan',1]],[['pasta',2],['pesto',2],['parmesan',1],['tomato',1],['garlic',1]]),
  R('tomato_basil_pasta','Tomato Basil Pasta','pasta','🍅',[['pasta',2],['tomato',2],['basil',1],['parmesan',1]],[['pasta',2],['tomato',2],['basil',1],['parmesan',1],['garlic',1],['olive_oil',1]]),
  R('mushroom_pasta','Mushroom Pasta','pasta','🍄',[['pasta',2],['mushroom',2],['cream',1],['parmesan',1]],[['pasta',2],['mushroom',2],['cream',1],['parmesan',1],['garlic',1]],['black_pepper']),
  R('shrimp_scampi','Shrimp Scampi','pasta','🍤',[['pasta',2],['shrimp',2],['garlic',1],['butter',1]],[['pasta',2],['shrimp',2],['garlic',1],['butter',1],['lemon',1],['olive_oil',1]]),
  R('baked_ziti','Baked Ziti','pasta','🥘',[['pasta',2],['tomato_sauce',2],['mozzarella',2],['parmesan',1]],[['pasta',2],['tomato_sauce',2],['mozzarella',2],['parmesan',1],['garlic',1]],['basil']),
  R('creamy_spinach_pasta','Creamy Spinach Pasta','pasta','🌿',[['pasta',2],['spinach',2],['cream',1],['parmesan',1]],[['pasta',2],['spinach',2],['cream',1],['parmesan',1],['garlic',1]]),
  R('pasta_primavera','Pasta Primavera','pasta','🥦',[['pasta',2],['broccoli',1],['zucchini',1],['tomato',1]],[['pasta',2],['broccoli',1],['zucchini',1],['tomato',1],['bell_pepper',1],['parmesan',1]],['olive_oil']),

  // 3. Rice Dishes
  R('chicken_fried_rice','Chicken Fried Rice','rice_dishes','🍚',[['chicken',2],['rice',2],['eggs',1],['peas',1]],[['chicken',2],['rice',2],['eggs',1],['peas',1],['onion',1],['soy_sauce',1]]),
  R('egg_fried_rice','Egg Fried Rice','rice_dishes','🍳',[['eggs',2],['rice',2],['peas',1],['carrot',1]],[['eggs',2],['rice',2],['peas',1],['carrot',1],['onion',1],['soy_sauce',1]]),
  R('shrimp_fried_rice','Shrimp Fried Rice','rice_dishes','🍤',[['shrimp',2],['rice',2],['eggs',1],['peas',1]],[['shrimp',2],['rice',2],['eggs',1],['peas',1],['carrot',1],['soy_sauce',1]]),
  R('beef_rice_bowl','Beef Rice Bowl','rice_dishes','🍚',[['beef',2],['rice',2],['broccoli',1],['carrot',1]],[['beef',2],['rice',2],['broccoli',1],['carrot',1],['onion',1],['soy_sauce',1]]),
  R('teriyaki_chicken_rice','Teriyaki Chicken Rice','rice_dishes','🍗',[['chicken',2],['rice',2],['soy_sauce',1],['honey',1]],[['chicken',2],['rice',2],['soy_sauce',1],['honey',1],['broccoli',1],['ginger',1]]),
  R('mushroom_risotto','Mushroom Risotto','rice_dishes','🍄',[['rice',2],['mushroom',2],['parmesan',1],['onion',1]],[['rice',2],['mushroom',2],['parmesan',1],['onion',1],['butter',1],['garlic',1]]),
  R('vegetable_rice_bowl','Vegetable Rice Bowl','rice_dishes','🥗',[['rice',2],['broccoli',1],['carrot',1],['peas',1]],[['rice',2],['broccoli',1],['carrot',1],['peas',1],['tofu',1],['soy_sauce',1]]),
  R('chicken_biryani','Chicken Biryani','rice_dishes','🍛',[['chicken',2],['rice',2],['onion',1],['yogurt',1]],[['chicken',2],['rice',2],['onion',1],['yogurt',1],['ginger',1],['garlic',1]],['cumin','paprika']),
  R('pineapple_fried_rice','Pineapple Fried Rice','rice_dishes','🍍',[['rice',2],['pineapple',2],['eggs',1],['peas',1]],[['rice',2],['pineapple',2],['eggs',1],['peas',1],['bell_pepper',1],['soy_sauce',1]]),
  R('rice_and_beans','Rice and Beans','rice_dishes','🫘',[['rice',2],['kidney_beans',2],['tomato',1],['onion',1]],[['rice',2],['black_beans',2],['tomato',1],['onion',1],['bell_pepper',1],['lime',1]],['cilantro','cumin']),

  // 4. Noodles
  R('chicken_ramen','Chicken Ramen','noodles','🍜',[['chicken',2],['noodles',2],['eggs',1],['spinach',1]],[['chicken',2],['noodles',2],['eggs',1],['spinach',1],['mushroom',1],['soy_sauce',1]]),
  R('beef_ramen','Beef Ramen','noodles','🍜',[['beef',2],['noodles',2],['eggs',1],['mushroom',1]],[['beef',2],['noodles',2],['eggs',1],['mushroom',1],['spinach',1],['soy_sauce',1]]),
  R('pad_thai','Pad Thai','noodles','🍜',[['rice_noodles',2],['shrimp',2],['eggs',1],['peanuts',1]],[['rice_noodles',2],['shrimp',2],['eggs',1],['peanuts',1],['lime',1],['soy_sauce',1]]),
  R('beef_lo_mein','Beef Lo Mein','noodles','🥢',[['beef',2],['noodles',2],['cabbage',1],['carrot',1]],[['beef',2],['noodles',2],['cabbage',1],['carrot',1],['onion',1],['soy_sauce',1]]),
  R('vegetable_lo_mein','Vegetable Lo Mein','noodles','🥢',[['noodles',2],['cabbage',1],['carrot',1],['mushroom',1]],[['noodles',2],['cabbage',1],['carrot',1],['mushroom',1],['bell_pepper',1],['soy_sauce',1]]),
  R('chicken_chow_mein','Chicken Chow Mein','noodles','🥢',[['chicken',2],['noodles',2],['cabbage',1],['carrot',1]],[['chicken',2],['noodles',2],['cabbage',1],['carrot',1],['onion',1],['soy_sauce',1]]),
  R('garlic_noodles','Garlic Noodles','noodles','🧄',[['noodles',2],['garlic',2],['butter',1]],[['noodles',2],['garlic',2],['butter',1],['parmesan',1],['soy_sauce',1]]),
  R('sesame_noodles','Sesame Noodles','noodles','🥢',[['noodles',2],['sesame_oil',1],['soy_sauce',1],['peanuts',1]],[['noodles',2],['sesame_oil',1],['soy_sauce',1],['peanuts',1],['cucumber',1],['ginger',1]]),
  R('singapore_noodles','Singapore Noodles','noodles','🍜',[['rice_noodles',2],['shrimp',1],['eggs',1],['bell_pepper',1]],[['rice_noodles',2],['shrimp',1],['eggs',1],['bell_pepper',1],['cabbage',1],['curry_paste',1]]),
  R('shrimp_noodle_bowl','Shrimp Noodle Bowl','noodles','🍤',[['shrimp',2],['rice_noodles',2],['cucumber',1],['carrot',1]],[['shrimp',2],['rice_noodles',2],['cucumber',1],['carrot',1],['lime',1],['cilantro',1]]),

  // 5. Soups & Stews
  R('tomato_soup','Tomato Soup','soups_stews','🥣',[['tomato',3],['onion',1],['cream',1]],[['tomato',3],['onion',1],['cream',1],['garlic',1],['basil',1]]),
  R('chicken_noodle_soup','Chicken Noodle Soup','soups_stews','🍲',[['chicken',2],['noodles',1],['carrot',1],['celery',1]],[['chicken',2],['noodles',1],['carrot',1],['celery',1],['onion',1],['garlic',1]]),
  R('beef_stew','Beef Stew','soups_stews','🍲',[['beef',2],['potato',2],['carrot',2],['onion',1]],[['beef',2],['potato',2],['carrot',2],['onion',1],['celery',1]]),
  R('vegetable_soup','Vegetable Soup','soups_stews','🥣',[['potato',1],['carrot',1],['green_beans',1],['tomato',1]],[['potato',1],['carrot',1],['green_beans',1],['tomato',1],['celery',1],['onion',1]]),
  R('broccoli_cheddar_soup','Broccoli Cheddar Soup','soups_stews','🥦',[['broccoli',2],['cheese',2],['milk',1],['onion',1]],[['broccoli',2],['cheese',2],['milk',1],['onion',1],['butter',1],['flour',1]]),
  R('lentil_soup','Lentil Soup','soups_stews','🥣',[['lentils',2],['carrot',1],['tomato',1],['onion',1]],[['lentils',2],['carrot',1],['tomato',1],['onion',1],['celery',1],['garlic',1]],['cumin']),
  R('mushroom_soup','Mushroom Soup','soups_stews','🍄',[['mushroom',3],['cream',1],['onion',1]],[['mushroom',3],['cream',1],['onion',1],['garlic',1],['butter',1]]),
  R('chicken_curry_soup','Chicken Curry Soup','soups_stews','🍛',[['chicken',2],['coconut_milk',2],['carrot',1],['curry_paste',1]],[['chicken',2],['coconut_milk',2],['carrot',1],['curry_paste',1],['onion',1],['ginger',1]]),
  R('potato_soup','Potato Soup','soups_stews','🥔',[['potato',3],['milk',1],['onion',1],['bacon',1]],[['potato',3],['milk',1],['onion',1],['bacon',1],['cheese',1],['celery',1]]),
  R('minestrone','Minestrone','soups_stews','🍲',[['kidney_beans',1],['pasta',1],['tomato',2],['carrot',1]],[['kidney_beans',1],['pasta',1],['tomato',2],['carrot',1],['celery',1],['zucchini',1]]),

  // 6. Stir-Fries
  R('beef_broccoli_stir_fry','Beef Broccoli Stir-Fry','stir_fries','🥦',[['beef',2],['broccoli',2],['soy_sauce',1],['garlic',1]],[['beef',2],['broccoli',2],['soy_sauce',1],['garlic',1],['ginger',1],['rice',1]]),
  R('chicken_vegetable_stir_fry','Chicken Vegetable Stir-Fry','stir_fries','🥘',[['chicken',2],['broccoli',1],['carrot',1],['bell_pepper',1]],[['chicken',2],['broccoli',1],['carrot',1],['bell_pepper',1],['soy_sauce',1],['garlic',1]]),
  R('garlic_shrimp_stir_fry','Garlic Shrimp Stir-Fry','stir_fries','🍤',[['shrimp',2],['garlic',2],['broccoli',1],['bell_pepper',1]],[['shrimp',2],['garlic',2],['broccoli',1],['bell_pepper',1],['soy_sauce',1],['rice',1]]),
  R('tofu_stir_fry','Tofu Stir-Fry','stir_fries','🥘',[['tofu',2],['broccoli',1],['mushroom',1],['carrot',1]],[['tofu',2],['broccoli',1],['mushroom',1],['carrot',1],['soy_sauce',1],['ginger',1]]),
  R('mushroom_beef_stir_fry','Mushroom Beef Stir-Fry','stir_fries','🍄',[['beef',2],['mushroom',2],['onion',1],['soy_sauce',1]],[['beef',2],['mushroom',2],['onion',1],['soy_sauce',1],['bell_pepper',1],['garlic',1]]),
  R('sweet_chili_chicken','Sweet Chili Chicken','stir_fries','🍗',[['chicken',2],['bell_pepper',1],['honey',1],['chili_powder',1]],[['chicken',2],['bell_pepper',1],['honey',1],['chili_powder',1],['garlic',1],['rice',1]]),
  R('ginger_pork_stir_fry','Ginger Pork Stir-Fry','stir_fries','🫚',[['pork',2],['ginger',1],['cabbage',1],['carrot',1]],[['pork',2],['ginger',1],['cabbage',1],['carrot',1],['soy_sauce',1],['garlic',1]]),
  R('teriyaki_salmon','Teriyaki Salmon','stir_fries','🐟',[['salmon',2],['soy_sauce',1],['honey',1],['rice',1]],[['salmon',2],['soy_sauce',1],['honey',1],['rice',1],['broccoli',1],['ginger',1]]),
  R('pepper_beef_stir_fry','Pepper Beef Stir-Fry','stir_fries','🫑',[['beef',2],['bell_pepper',2],['onion',1],['soy_sauce',1]],[['beef',2],['bell_pepper',2],['onion',1],['soy_sauce',1],['garlic',1],['rice',1]]),
  R('cashew_chicken','Cashew Chicken','stir_fries','🥜',[['chicken',2],['cashews',1],['bell_pepper',1],['soy_sauce',1]],[['chicken',2],['cashews',1],['bell_pepper',1],['soy_sauce',1],['onion',1],['ginger',1]]),

  // 7. Sandwiches & Wraps
  R('grilled_cheese','Grilled Cheese','sandwiches_wraps','🥪',[['bread',2],['cheese',2],['butter',1]],[['bread',2],['cheese',2],['butter',1],['tomato',1]]),
  R('blt_sandwich','BLT Sandwich','sandwiches_wraps','🥪',[['bread',2],['bacon',2],['lettuce',1],['tomato',1]],[['bread',2],['bacon',2],['lettuce',1],['tomato',1],['mayonnaise',1]]),
  R('turkey_sandwich','Turkey Sandwich','sandwiches_wraps','🥪',[['bread',2],['turkey',2],['lettuce',1],['cheese',1]],[['bread',2],['turkey',2],['lettuce',1],['cheese',1],['tomato',1],['mayonnaise',1]]),
  R('ham_and_cheese','Ham and Cheese','sandwiches_wraps','🥪',[['bread',2],['ham',2],['cheese',2]],[['bread',2],['ham',2],['cheese',2],['tomato',1],['mayonnaise',1]]),
  R('chicken_sandwich','Chicken Sandwich','sandwiches_wraps','🥪',[['bread',2],['chicken',2],['lettuce',1],['mayonnaise',1]],[['bread',2],['chicken',2],['lettuce',1],['mayonnaise',1],['tomato',1],['cucumber',1]]),
  R('tuna_melt','Tuna Melt','sandwiches_wraps','🥪',[['bread',2],['tuna',2],['cheese',1],['mayonnaise',1]],[['bread',2],['tuna',2],['cheese',1],['mayonnaise',1],['tomato',1],['onion',1]]),
  R('egg_salad_sandwich','Egg Salad Sandwich','sandwiches_wraps','🥪',[['bread',2],['eggs',2],['mayonnaise',1],['lettuce',1]],[['bread',2],['eggs',2],['mayonnaise',1],['lettuce',1],['celery',1],['onion',1]]),
  R('chicken_wrap','Chicken Wrap','sandwiches_wraps','🌯',[['tortilla',1],['chicken',2],['lettuce',1],['tomato',1]],[['tortilla',1],['chicken',2],['lettuce',1],['tomato',1],['cheese',1],['avocado',1]]),
  R('veggie_wrap','Veggie Wrap','sandwiches_wraps','🌯',[['tortilla',1],['lettuce',1],['cucumber',1],['tomato',1]],[['tortilla',1],['lettuce',1],['corn',1],['tomato',1],['avocado',1],['cheese',1]]),
  R('breakfast_sandwich','Breakfast Sandwich','sandwiches_wraps','🥪',[['bread',2],['eggs',2],['cheese',1],['bacon',1]],[['bread',2],['eggs',2],['cheese',1],['bacon',1],['tomato',1]]),

  // 8. Breakfast & Eggs
  R('cheese_omelet','Cheese Omelet','breakfast_eggs','🍳',[['eggs',3],['cheese',1],['milk',1]],[['eggs',3],['cheese',1],['milk',1],['onion',1],['butter',1]]),
  R('mushroom_omelet','Mushroom Omelet','breakfast_eggs','🍳',[['eggs',3],['mushroom',2],['cheese',1]],[['eggs',3],['mushroom',2],['cheese',1],['spinach',1],['butter',1]]),
  R('scrambled_eggs','Scrambled Eggs','breakfast_eggs','🍳',[['eggs',3],['milk',1],['butter',1]],[['eggs',3],['milk',1],['butter',1],['cheese',1],['black_pepper',1]]),
  R('breakfast_burrito','Breakfast Burrito','breakfast_eggs','🌯',[['tortilla',1],['eggs',2],['potato',1],['cheese',1]],[['tortilla',1],['eggs',2],['potato',1],['cheese',1],['sausage',1],['tomato',1]]),
  R('pancakes','Pancakes','breakfast_eggs','🥞',[['flour',2],['milk',1],['eggs',1],['sugar',1]],[['flour',2],['milk',1],['eggs',1],['sugar',1],['butter',1],['strawberry',1]]),
  R('french_toast','French Toast','breakfast_eggs','🍞',[['bread',2],['eggs',2],['milk',1],['sugar',1]],[['bread',2],['eggs',2],['milk',1],['sugar',1],['butter',1],['banana',1]]),
  R('oatmeal_bowl','Oatmeal Bowl','breakfast_eggs','🥣',[['oats',2],['milk',1],['banana',1],['honey',1]],[['oats',2],['milk',1],['banana',1],['honey',1],['blueberry',1],['almonds',1]]),
  R('breakfast_hash','Breakfast Hash','breakfast_eggs','🥔',[['potato',2],['sausage',2],['onion',1],['bell_pepper',1]],[['potato',2],['sausage',2],['onion',1],['bell_pepper',1],['eggs',1],['cheese',1]]),
  R('egg_muffins','Egg Muffins','breakfast_eggs','🧁',[['eggs',3],['cheese',1],['spinach',1],['bell_pepper',1]],[['eggs',3],['cheese',1],['spinach',1],['bell_pepper',1],['milk',1],['onion',1]]),
  R('avocado_toast','Avocado Toast','breakfast_eggs','🥑',[['bread',2],['avocado',2],['eggs',1]],[['bread',2],['avocado',2],['eggs',1],['tomato',1],['lemon',1]]),

  // 9. Salads
  R('caesar_salad','Caesar Salad','salads','🥗',[['lettuce',2],['parmesan',1],['breadcrumbs',1],['mayonnaise',1]],[['lettuce',2],['parmesan',1],['breadcrumbs',1],['mayonnaise',1],['lemon',1],['garlic',1]]),
  R('greek_salad','Greek Salad','salads','🥗',[['tomato',2],['cucumber',2],['cheese',1],['onion',1]],[['tomato',2],['cucumber',2],['cheese',1],['onion',1],['olive_oil',1]]),
  R('chicken_salad','Chicken Salad','salads','🥗',[['chicken',2],['lettuce',2],['tomato',1],['cucumber',1]],[['chicken',2],['lettuce',2],['tomato',1],['avocado',1],['onion',1],['lime',1]]),
  R('tuna_salad','Tuna Salad','salads','🥗',[['tuna',2],['lettuce',2],['cucumber',1],['tomato',1]],[['tuna',2],['lettuce',2],['cucumber',1],['tomato',1],['mayonnaise',1],['lemon',1]]),
  R('quinoa_salad','Quinoa Salad','salads','🥗',[['quinoa',2],['cucumber',1],['tomato',1],['chickpeas',1]],[['quinoa',2],['cucumber',1],['tomato',1],['chickpeas',1],['lemon',1],['cilantro',1]]),
  R('chickpea_salad','Chickpea Salad','salads','🥗',[['chickpeas',2],['cucumber',1],['tomato',1],['onion',1]],[['chickpeas',2],['cucumber',1],['tomato',1],['onion',1],['lemon',1],['olive_oil',1]]),
  R('pasta_salad','Pasta Salad','salads','🥗',[['pasta',2],['cucumber',1],['tomato',1],['cheese',1]],[['pasta',2],['cucumber',1],['tomato',1],['cheese',1],['bell_pepper',1],['olive_oil',1]]),
  R('cucumber_tomato_salad','Cucumber Tomato Salad','salads','🥒',[['cucumber',2],['tomato',2],['onion',1]],[['cucumber',2],['tomato',2],['onion',1],['lime',1],['cheese',1]],['olive_oil']),
  R('spinach_salad','Spinach Salad','salads','🌿',[['spinach',2],['strawberry',1],['almonds',1],['cheese',1]],[['spinach',2],['strawberry',1],['almonds',1],['cheese',1],['cucumber',1],['olive_oil',1]]),
  R('southwest_salad','Southwest Salad','salads','🌽',[['lettuce',2],['black_beans',1],['corn',1],['tomato',1]],[['lettuce',2],['black_beans',1],['corn',1],['tomato',1],['avocado',1],['lime',1]]),

  // 10. Bakes & Casseroles
  R('chicken_casserole','Chicken Casserole','bakes_casseroles','🥘',[['chicken',2],['rice',1],['broccoli',1],['cheese',1]],[['chicken',2],['rice',1],['broccoli',1],['cheese',1],['cream',1],['breadcrumbs',1]]),
  R('cheesy_bean_bake','Cheesy Bean Bake','bakes_casseroles','🥘',[['black_beans',2],['tomato_sauce',1],['cheese',2],['corn',1]],[['black_beans',2],['tomato',2],['cheese',2],['corn',1],['onion',1],['bell_pepper',1]]),
  R('lasagna','Lasagna','bakes_casseroles','🍝',[['pasta',2],['beef',2],['tomato_sauce',2],['mozzarella',1]],[['pasta',2],['beef',2],['tomato_sauce',2],['mozzarella',1],['parmesan',1],['onion',1]]),
  R('tuna_casserole','Tuna Casserole','bakes_casseroles','🥘',[['tuna',2],['pasta',2],['peas',1],['cream',1]],[['tuna',2],['pasta',2],['peas',1],['cream',1],['cheese',1],['breadcrumbs',1]]),
  R('potato_gratin','Potato Gratin','bakes_casseroles','🥔',[['potato',3],['cream',1],['cheese',2],['butter',1]],[['potato',3],['cream',1],['cheese',2],['butter',1],['garlic',1],['onion',1]]),
  R('broccoli_cheese_bake','Broccoli Cheese Bake','bakes_casseroles','🥦',[['broccoli',2],['cheese',2],['rice',1],['milk',1]],[['broccoli',2],['cheese',2],['rice',1],['milk',1],['breadcrumbs',1],['onion',1]]),
  R('shepherds_pie',"Shepherd's Pie",'bakes_casseroles','🥧',[['beef',2],['potato',3],['carrot',1],['peas',1]],[['beef',2],['potato',3],['carrot',1],['peas',1],['onion',1],['butter',1]]),
  R('baked_mac_and_cheese','Baked Mac and Cheese','bakes_casseroles','🧀',[['pasta',2],['cheese',2],['milk',1],['breadcrumbs',1]],[['pasta',2],['cheese',2],['milk',1],['breadcrumbs',1],['butter',1],['parmesan',1]]),
  R('sausage_pasta_bake','Sausage Pasta Bake','bakes_casseroles','🥘',[['sausage',2],['pasta',2],['tomato_sauce',2],['mozzarella',1]],[['sausage',2],['pasta',2],['tomato_sauce',2],['mozzarella',1],['bell_pepper',1],['onion',1]]),
  R('vegetable_lasagna','Vegetable Lasagna','bakes_casseroles','🥘',[['pasta',2],['zucchini',1],['spinach',1],['tomato_sauce',2]],[['pasta',2],['zucchini',1],['spinach',1],['tomato_sauce',2],['mushroom',1],['mozzarella',1]]),

  // 11. Pizza & Flatbreads
  R('margherita_pizza','Margherita Pizza','pizza_flatbreads','🍕',[['pizza_dough',1],['tomato_sauce',2],['mozzarella',2],['basil',1]],[['pizza_dough',1],['tomato_sauce',2],['mozzarella',2],['basil',1],['olive_oil',1]]),
  R('pepperoni_pizza','Pepperoni Pizza','pizza_flatbreads','🍕',[['pizza_dough',1],['tomato_sauce',2],['mozzarella',2],['pepperoni',2]],[['pizza_dough',1],['tomato_sauce',2],['mozzarella',2],['pepperoni',2],['onion',1]]),
  R('chicken_pizza','Chicken Pizza','pizza_flatbreads','🍕',[['pizza_dough',1],['tomato_sauce',2],['mozzarella',2],['chicken',2]],[['pizza_dough',1],['tomato_sauce',2],['mozzarella',2],['chicken',2],['bell_pepper',1],['onion',1]]),
  R('veggie_pizza','Veggie Pizza','pizza_flatbreads','🍕',[['pizza_dough',1],['tomato_sauce',2],['mozzarella',2],['bell_pepper',1]],[['pizza_dough',1],['tomato_sauce',2],['mozzarella',2],['bell_pepper',1],['mushroom',1],['onion',1]]),
  R('mushroom_pizza','Mushroom Pizza','pizza_flatbreads','🍕',[['pizza_dough',1],['tomato_sauce',2],['mozzarella',2],['mushroom',2]],[['pizza_dough',1],['tomato_sauce',2],['mozzarella',2],['mushroom',2],['garlic',1]]),
  R('bbq_chicken_pizza','BBQ Chicken Pizza','pizza_flatbreads','🍕',[['pizza_dough',1],['bbq_sauce',2],['mozzarella',2],['chicken',2]],[['pizza_dough',1],['bbq_sauce',2],['mozzarella',2],['chicken',2],['onion',1],['bell_pepper',1]]),
  R('spinach_flatbread','Spinach Flatbread','pizza_flatbreads','🫓',[['pizza_dough',1],['spinach',2],['mozzarella',1],['garlic',1]],[['pizza_dough',1],['spinach',2],['mozzarella',1],['garlic',1],['tomato',1]]),
  R('cheese_flatbread','Cheese Flatbread','pizza_flatbreads','🫓',[['pizza_dough',1],['mozzarella',2],['parmesan',1]],[['pizza_dough',1],['mozzarella',2],['parmesan',1],['garlic',1],['basil',1]]),
  R('breakfast_pizza','Breakfast Pizza','pizza_flatbreads','🍕',[['pizza_dough',1],['eggs',2],['cheese',2],['bacon',1]],[['pizza_dough',1],['eggs',2],['cheese',2],['bacon',1],['tomato',1],['spinach',1]]),
  R('tomato_garlic_flatbread','Tomato Garlic Flatbread','pizza_flatbreads','🫓',[['pizza_dough',1],['tomato',2],['garlic',2],['mozzarella',1]],[['pizza_dough',1],['tomato',2],['garlic',2],['mozzarella',1],['basil',1],['olive_oil',1]]),

  // 12. Burgers & Comfort Food
  R('beef_burger','Beef Burger','burgers_comfort','🍔',[['beef',2],['bread',2],['lettuce',1],['tomato',1]],[['beef',2],['bread',2],['lettuce',1],['tomato',1],['onion',1],['mayonnaise',1]]),
  R('cheeseburger','Cheeseburger','burgers_comfort','🍔',[['beef',2],['bread',2],['cheese',1],['tomato',1]],[['beef',2],['bread',2],['cheese',1],['tomato',1],['lettuce',1],['onion',1]]),
  R('chicken_burger','Chicken Burger','burgers_comfort','🍔',[['chicken',2],['bread',2],['lettuce',1],['tomato',1]],[['chicken',2],['bread',2],['lettuce',1],['tomato',1],['cheese',1],['onion',1]],['mayonnaise']),
  R('turkey_burger','Turkey Burger','burgers_comfort','🍔',[['turkey',2],['bread',2],['lettuce',1],['tomato',1]],[['turkey',2],['bread',2],['lettuce',1],['tomato',1],['onion',1],['cheese',1]]),
  R('veggie_burger','Veggie Burger','burgers_comfort','🍔',[['black_beans',2],['bread',2],['lettuce',1],['tomato',1]],[['black_beans',2],['bread',2],['lettuce',1],['tomato',1],['onion',1],['avocado',1]]),
  R('sloppy_joe','Sloppy Joe','burgers_comfort','🥪',[['beef',2],['bread',2],['tomato_sauce',2],['onion',1]],[['beef',2],['bread',2],['tomato_sauce',2],['onion',1],['bell_pepper',1],['garlic',1]]),
  R('loaded_baked_potato','Loaded Baked Potato','burgers_comfort','🥔',[['potato',3],['cheese',2],['bacon',1],['sour_cream',1]],[['potato',3],['cheese',2],['bacon',1],['sour_cream',1],['onion',1]]),
  R('chili_cheese_potato','Chili Cheese Potato','burgers_comfort','🥔',[['potato',3],['kidney_beans',1],['tomato_sauce',1],['cheese',2]],[['potato',3],['kidney_beans',1],['tomato_sauce',1],['cheese',2],['beef',1],['onion',1]],['chili_powder']),
  R('sausage_and_peppers','Sausage and Peppers','burgers_comfort','🌭',[['sausage',2],['bell_pepper',2],['onion',1],['tomato_sauce',1]],[['sausage',2],['bell_pepper',2],['onion',1],['tomato_sauce',1],['bread',1],['garlic',1]]),
  R('meatball_sub','Meatball Sub','burgers_comfort','🥖',[['beef',2],['bread',2],['tomato_sauce',2],['mozzarella',1]],[['beef',2],['bread',2],['tomato_sauce',2],['mozzarella',1],['breadcrumbs',1],['garlic',1]]),

  // 13. Seafood
  R('garlic_butter_shrimp','Garlic Butter Shrimp','seafood','🍤',[['shrimp',3],['garlic',2],['butter',1],['lemon',1]],[['shrimp',3],['garlic',2],['butter',1],['lemon',1],['rice',1]]),
  R('baked_salmon','Baked Salmon','seafood','🐟',[['salmon',2],['potato',2],['broccoli',1],['butter',1]],[['salmon',2],['potato',2],['broccoli',1],['butter',1],['garlic',1],['lemon',1]]),
  R('lemon_salmon','Lemon Salmon','seafood','🍋',[['salmon',2],['lemon',2],['rice',1],['spinach',1]],[['salmon',2],['lemon',2],['rice',1],['spinach',1],['garlic',1],['butter',1]]),
  R('tuna_patties','Tuna Patties','seafood','🐟',[['tuna',2],['eggs',1],['breadcrumbs',1],['onion',1]],[['tuna',2],['eggs',1],['breadcrumbs',1],['onion',1],['lemon',1],['mayonnaise',1]]),
  R('shrimp_tacos','Shrimp Tacos','seafood','🌮',[['shrimp',2],['tortilla',2],['cabbage',1],['lime',1]],[['shrimp',2],['tortilla',2],['cabbage',1],['lime',1],['avocado',1],['cilantro',1]]),
  R('salmon_rice_bowl','Salmon Rice Bowl','seafood','🍚',[['salmon',2],['rice',2],['cucumber',1],['avocado',1]],[['salmon',2],['rice',2],['cucumber',1],['avocado',1],['soy_sauce',1],['ginger',1]]),
  R('shrimp_curry','Shrimp Curry','seafood','🍛',[['shrimp',2],['coconut_milk',2],['curry_paste',1],['rice',1]],[['shrimp',2],['coconut_milk',2],['curry_paste',1],['rice',1],['bell_pepper',1],['onion',1]]),
  R('garlic_fish_pasta','Garlic Fish Pasta','seafood','🍝',[['white_fish',2],['pasta',2],['garlic',2],['butter',1]],[['white_fish',2],['pasta',2],['garlic',2],['butter',1],['lemon',1],['spinach',1]]),
  R('salmon_potato_skillet','Salmon Potato Skillet','seafood','🥘',[['salmon',2],['potato',2],['onion',1],['spinach',1]],[['salmon',2],['potato',2],['onion',1],['spinach',1],['garlic',1],['lemon',1]]),
  R('shrimp_salad','Shrimp Salad','seafood','🥗',[['shrimp',2],['lettuce',2],['cucumber',1],['tomato',1]],[['shrimp',2],['lettuce',2],['cucumber',1],['tomato',1],['avocado',1],['lemon',1]]),

  // 14. Curries & Global Bowls
  R('chicken_curry','Chicken Curry','curries_bowls','🍛',[['chicken',2],['coconut_milk',2],['curry_paste',1],['rice',1]],[['chicken',2],['coconut_milk',2],['curry_paste',1],['rice',1],['onion',1],['garlic',1]]),
  R('beef_curry','Beef Curry','curries_bowls','🍛',[['beef',2],['coconut_milk',2],['curry_paste',1],['rice',1]],[['beef',2],['coconut_milk',2],['curry_paste',1],['rice',1],['onion',1],['potato',1]]),
  R('chickpea_curry','Chickpea Curry','curries_bowls','🍛',[['chickpeas',2],['tomato',2],['curry_paste',1],['rice',1]],[['chickpeas',2],['tomato',2],['curry_paste',1],['rice',1],['onion',1],['spinach',1]]),
  R('coconut_tofu_curry','Coconut Tofu Curry','curries_bowls','🍛',[['tofu',2],['coconut_milk',2],['curry_paste',1],['rice',1]],[['tofu',2],['coconut_milk',2],['curry_paste',1],['rice',1],['broccoli',1],['bell_pepper',1]]),
  R('lentil_curry','Lentil Curry','curries_bowls','🍛',[['lentils',2],['tomato',2],['curry_paste',1],['rice',1]],[['lentils',2],['tomato',2],['curry_paste',1],['rice',1],['onion',1],['ginger',1]]),
  R('thai_red_curry','Thai Red Curry','curries_bowls','🍛',[['chicken',2],['coconut_milk',2],['curry_paste',1],['bell_pepper',1]],[['chicken',2],['coconut_milk',2],['curry_paste',1],['bell_pepper',1],['basil',1],['rice',1]]),
  R('chicken_shawarma_bowl','Chicken Shawarma Bowl','curries_bowls','🥙',[['chicken',2],['rice',2],['cucumber',1],['tomato',1]],[['chicken',2],['rice',2],['lettuce',1],['tomato',1],['onion',1],['lime',1]],['yogurt','cumin','paprika']),
  R('falafel_bowl','Falafel Bowl','curries_bowls','🧆',[['chickpeas',2],['couscous',2],['cucumber',1],['tomato',1]],[['chickpeas',2],['couscous',2],['cucumber',1],['tomato',1],['yogurt',1],['lemon',1]]),
  R('greek_chicken_bowl','Greek Chicken Bowl','curries_bowls','🥗',[['chicken',2],['rice',2],['cucumber',1],['cheese',1]],[['chicken',2],['rice',2],['lettuce',1],['cheese',1],['tomato',1],['lime',1]]),
  R('mediterranean_grain_bowl','Mediterranean Grain Bowl','curries_bowls','🥗',[['couscous',2],['chickpeas',1],['cucumber',1],['tomato',1]],[['couscous',2],['chickpeas',1],['cucumber',1],['tomato',1],['cheese',1],['lemon',1]]),

  // 15. Vegetarian & Vegetable Mains
  R('stuffed_peppers','Stuffed Peppers','vegetarian_mains','🫑',[['bell_pepper',3],['rice',2],['black_beans',1],['cheese',1]],[['bell_pepper',3],['rice',2],['black_beans',1],['cheese',1],['tomato',1],['onion',1]]),
  R('mushroom_quesadilla','Mushroom Quesadilla','vegetarian_mains','🫓',[['mushroom',2],['tortilla',2],['cheese',2],['onion',1]],[['mushroom',2],['tortilla',2],['cheese',2],['onion',1],['spinach',1],['garlic',1]]),
  R('chickpea_stir_fry','Chickpea Stir-Fry','vegetarian_mains','🥘',[['chickpeas',2],['broccoli',1],['carrot',1],['bell_pepper',1]],[['chickpeas',2],['broccoli',1],['carrot',1],['bell_pepper',1],['soy_sauce',1],['ginger',1]]),
  R('potato_and_egg_skillet','Potato and Egg Skillet','vegetarian_mains','🍳',[['potato',2],['eggs',2],['onion',1],['bell_pepper',1]],[['potato',2],['eggs',2],['onion',1],['bell_pepper',1],['cheese',1],['spinach',1]]),
  R('sweet_potato_bowl','Sweet Potato Bowl','vegetarian_mains','🍠',[['sweet_potato',2],['quinoa',1],['black_beans',1],['avocado',1]],[['sweet_potato',2],['quinoa',1],['black_beans',1],['avocado',1],['corn',1],['lime',1]]),
  R('zucchini_fritters','Zucchini Fritters','vegetarian_mains','🥒',[['zucchini',2],['eggs',1],['flour',1],['cheese',1]],[['zucchini',2],['eggs',1],['flour',1],['cheese',1],['breadcrumbs',1],['yogurt',1]]),
  R('spinach_frittata','Spinach Frittata','vegetarian_mains','🍳',[['spinach',2],['eggs',3],['cheese',1],['onion',1]],[['spinach',2],['eggs',3],['cheese',1],['onion',1],['milk',1],['tomato',1]]),
  R('vegetable_curry','Vegetable Curry','vegetarian_mains','🍛',[['potato',1],['carrot',1],['peas',1],['coconut_milk',2]],[['potato',1],['carrot',1],['peas',1],['coconut_milk',2],['curry_paste',1],['onion',1]]),
  R('broccoli_rice_skillet','Broccoli Rice Skillet','vegetarian_mains','🥦',[['broccoli',2],['rice',2],['cheese',1],['onion',1]],[['broccoli',2],['rice',2],['cheese',1],['onion',1],['mushroom',1],['garlic',1]]),
  R('stuffed_sweet_potato','Stuffed Sweet Potato','vegetarian_mains','🍠',[['sweet_potato',2],['black_beans',1],['corn',1],['cheese',1]],[['sweet_potato',2],['black_beans',1],['corn',1],['cheese',1],['avocado',1],['lime',1]])
];

export const FAMILY_LABELS = {
  tacos_mexican:'Tacos & Mexican-Style', pasta:'Pasta', rice_dishes:'Rice Dishes', noodles:'Noodles',
  soups_stews:'Soups & Stews', stir_fries:'Stir-Fries', sandwiches_wraps:'Sandwiches & Wraps',
  breakfast_eggs:'Breakfast & Eggs', salads:'Salads', bakes_casseroles:'Bakes & Casseroles',
  pizza_flatbreads:'Pizza & Flatbreads', burgers_comfort:'Burgers & Comfort Food', seafood:'Seafood',
  curries_bowls:'Curries & Global Bowls', vegetarian_mains:'Vegetarian & Vegetable Mains'
};

export const BACKGROUND_SEASONINGS = ['salt','black_pepper','olive_oil'];
