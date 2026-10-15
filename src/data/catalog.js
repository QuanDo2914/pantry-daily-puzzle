export const INGREDIENTS = {
  chicken:['Chicken','CH'], beef:['Beef','BF'], tofu:['Tofu','TF'], egg:['Egg','EG'], rice:['Rice','RC'], pasta:['Pasta','PA'],
  tomato:['Tomato','TO'], onion:['Onion','ON'], garlic:['Garlic','GA'], cheese:['Cheese','CH'], mushroom:['Mushroom','MU'], spinach:['Spinach','SP'],
  pepper:['Pepper','PE'], beans:['Beans','BE'], corn:['Corn','CO'], peas:['Peas','PS'], potato:['Potato','PO'], carrot:['Carrot','CA'], broccoli:['Broccoli','BR'],
  coconut:['Coconut','CN'], lemon:['Lemon','LE'], herbs:['Herbs','HE'], tortilla:['Tortilla','TR']
};

const R = (id, name, category, ingredients) => ({ id, name, category, ingredients });
export const RECIPES = [
 R('chicken_fried_rice','Chicken Fried Rice','rice',{chicken:2,rice:2,onion:1,egg:1,garlic:1}),
 R('veggie_fried_rice','Garden Fried Rice','rice',{rice:2,egg:1,carrot:1,peas:1,onion:1}),
 R('mushroom_risotto','Mushroom Risotto','rice',{rice:2,mushroom:2,onion:1,garlic:1,cheese:1}),
 R('tomato_risotto','Tomato Risotto','rice',{rice:2,tomato:2,onion:1,garlic:1,cheese:1}),
 R('beef_rice_bowl','Beef Rice Bowl','rice',{beef:2,rice:2,onion:1,carrot:1,garlic:1}),
 R('tofu_rice_bowl','Tofu Rice Bowl','rice',{tofu:2,rice:2,broccoli:1,carrot:1,garlic:1}),
 R('chicken_pasta','Chicken Tomato Pasta','pasta',{chicken:2,pasta:2,tomato:2,garlic:1,herbs:1}),
 R('mushroom_pasta','Creamy Mushroom Pasta','pasta',{pasta:2,mushroom:2,cheese:1,garlic:1,herbs:1}),
 R('spinach_pasta','Spinach Garlic Pasta','pasta',{pasta:2,spinach:2,garlic:2,cheese:1,lemon:1}),
 R('beef_pasta','Beef Ragu','pasta',{beef:2,pasta:2,tomato:2,onion:1,garlic:1}),
 R('tomato_pasta','Tomato Basil Pasta','pasta',{pasta:2,tomato:2,garlic:1,herbs:2,cheese:1}),
 R('broccoli_pasta','Broccoli Lemon Pasta','pasta',{pasta:2,broccoli:2,lemon:1,garlic:1,cheese:1}),
 R('cheesy_bake','Cheesy Chicken Bake','bake',{chicken:2,cheese:2,tomato:1,onion:1,mushroom:1}),
 R('potato_bake','Loaded Potato Bake','bake',{potato:3,cheese:2,onion:1,spinach:1,pepper:1}),
 R('veggie_bake','Garden Vegetable Bake','bake',{potato:2,tomato:1,broccoli:2,cheese:1,onion:1}),
 R('bean_bake','Cheesy Bean Bake','bake',{beans:2,tomato:2,cheese:2,corn:1,onion:1}),
 R('omelet','Garden Omelet','breakfast',{egg:3,cheese:1,spinach:1,mushroom:1,onion:1}),
 R('potato_hash','Sunrise Potato Hash','breakfast',{potato:3,egg:2,onion:1,pepper:1,cheese:1}),
 R('shakshuka','Tomato Egg Skillet','breakfast',{egg:3,tomato:3,onion:1,pepper:1,garlic:1}),
 R('breakfast_tacos','Breakfast Tacos','breakfast',{tortilla:2,egg:2,cheese:1,tomato:1,onion:1}),
 R('chicken_tacos','Chicken Tacos','taco',{tortilla:3,chicken:2,tomato:1,onion:1,cheese:1}),
 R('beef_tacos','Beef Tacos','taco',{tortilla:3,beef:2,tomato:1,onion:1,cheese:1}),
 R('bean_tacos','Black Bean Tacos','taco',{tortilla:3,beans:2,corn:1,tomato:1,onion:1}),
 R('tofu_tacos','Crispy Tofu Tacos','taco',{tortilla:3,tofu:2,pepper:1,onion:1,lemon:1}),
 R('chicken_curry','Coconut Chicken Curry','curry',{chicken:2,coconut:2,rice:2,onion:1,garlic:1}),
 R('tofu_curry','Coconut Tofu Curry','curry',{tofu:2,coconut:2,rice:2,broccoli:1,garlic:1}),
 R('bean_curry','Tomato Bean Curry','curry',{beans:2,tomato:2,rice:2,onion:1,garlic:1}),
 R('beef_curry','Beef Pepper Curry','curry',{beef:2,coconut:1,rice:2,pepper:2,onion:1}),
 R('chicken_soup','Chicken Vegetable Soup','soup',{chicken:2,potato:1,carrot:2,onion:1,herbs:1}),
 R('tomato_soup','Tomato Herb Soup','soup',{tomato:3,onion:1,garlic:1,herbs:2,cheese:1}),
 R('mushroom_soup','Mushroom Soup','soup',{mushroom:3,potato:1,onion:1,garlic:1,herbs:1}),
 R('bean_soup','Hearty Bean Soup','soup',{beans:2,tomato:2,carrot:1,onion:1,herbs:1}),
 R('chicken_salad','Lemon Chicken Salad','salad',{chicken:2,spinach:2,tomato:1,lemon:1,herbs:1}),
 R('tofu_salad','Crispy Tofu Salad','salad',{tofu:2,spinach:2,carrot:1,lemon:1,herbs:1}),
 R('bean_salad','Southwest Bean Salad','salad',{beans:2,corn:2,tomato:1,pepper:1,lemon:1}),
 R('egg_salad','Herbed Egg Salad','salad',{egg:3,spinach:1,onion:1,lemon:1,herbs:1}),
 R('stuffed_peppers','Stuffed Peppers','bake',{pepper:3,rice:2,beans:1,tomato:1,cheese:1}),
 R('chicken_stirfry','Chicken Stir-Fry','stirfry',{chicken:2,broccoli:2,pepper:1,carrot:1,garlic:1}),
 R('beef_stirfry','Beef Stir-Fry','stirfry',{beef:2,broccoli:1,pepper:2,onion:1,garlic:1}),
 R('tofu_stirfry','Tofu Stir-Fry','stirfry',{tofu:2,broccoli:2,mushroom:1,carrot:1,garlic:1}),
 R('mushroom_toast','Mushroom Potato Cakes','snack',{mushroom:2,potato:2,egg:1,onion:1,herbs:1}),
 R('corn_fritters','Corn Fritters','snack',{corn:3,egg:2,onion:1,pepper:1,herbs:1}),
 R('broccoli_frittata','Broccoli Frittata','breakfast',{broccoli:2,egg:3,cheese:1,onion:1,herbs:1}),
 R('spinach_frittata','Spinach Frittata','breakfast',{spinach:2,egg:3,cheese:1,onion:1,herbs:1})
];

// Explicitly named portion variants give the generator realistic quantity-level
// alternatives without inventing strange ingredient combinations.
export const RECIPE_LIBRARY = RECIPES.flatMap((recipe, index) => {
  const entries=Object.entries(recipe.ingredients);
  const bump=(at,label,suffix)=>({ ...recipe,id:`${recipe.id}_${suffix}`,name:`${label} ${recipe.name}`,
    ingredients:Object.fromEntries(entries.map(([k,v],i)=>[k,i===at?Math.min(4,v+1):v])) });
  return [recipe,bump(index%entries.length,'Hearty','hearty'),bump((index+2)%entries.length,'Family-Style','family')];
});
