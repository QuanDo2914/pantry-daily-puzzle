// Build an isolated 225-recipe candidate. The approved V3 files are read only.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {INGREDIENTS,PROPOSED_ADDITIONS} from '../data.mjs';

const dir=path.dirname(fileURLToPath(import.meta.url));
const source=JSON.parse(fs.readFileSync(path.join(dir,'source-proposal.json'),'utf8'));
const v3=JSON.parse(fs.readFileSync(path.join(dir,'../quality-v3/proposed-recipe-catalog.json'),'utf8'));
const existing=[...INGREDIENTS,...PROPOSED_ADDITIONS];
const ingredients=[...existing,...source.newIngredients];
const ingredientIds=new Set(ingredients.map(x=>x.id));
const recipeIds=new Set(v3.recipes.map(x=>x.id));
const families=new Set(v3.recipes.map(x=>x.family));
const duplicates=values=>values.filter((value,index)=>values.indexOf(value)!==index);
if(existing.length!==90||source.newIngredients.length!==35||source.newRecipes.length!==75||v3.recipes.length!==150)throw Error('Unexpected source-library size');
if(duplicates(ingredients.map(x=>x.id)).length)throw Error('Duplicate ingredient ID');

// These four-item Medium choices retain the named dish's central components.
// Most are the proposal's first four core ingredients. Exceptions put an
// identity-defining topping or preparation ingredient back into scoring.
const mediumOverrides={
 breakfast_tostadas:['eggs','tortilla','black_beans','salsa'],
 chorizo_breakfast_burrito:['chorizo','eggs','tortilla','potato'],
 shrimp_fajita_bowl:['shrimp','rice','bell_pepper','onion'],
 spicy_peanut_noodles:['noodles','peanut_butter','soy_sauce','hot_sauce'],
 cold_sesame_noodle_salad:['noodles','cucumber','sesame_seeds','rice_vinegar'],
 crab_salad_sandwich:['crab','bread','mayonnaise','celery'],
 mediterranean_pita_pocket:['pita_bread','chickpeas','feta','tahini'],
 shakshuka:['eggs','tomato_sauce','bell_pepper','onion'],
 warm_farro_lentil_salad:['farro','lentils','spinach','lemon'],
 mediterranean_orzo_salad:['orzo','cucumber','feta','olives'],
 bulgur_chickpea_salad:['bulgur','chickpeas','cucumber','tahini'],
 arugula_parmesan_pizza:['pizza_dough','arugula','parmesan','tomato_sauce'],
 lamb_chickpea_bowl:['lamb','chickpeas','pita_bread','yogurt'],
 warm_farro_vegetable_bowl:['farro','butternut_squash','kale','chickpeas']
};

const doublePrimary=new Set(['lamb','tempeh','crab','chorizo','halloumi','ricotta','feta','cauliflower','eggplant','kale','butternut_squash','bok_choy','edamame','orzo','gnocchi','bulgur','farro','cornmeal','chicken','beef','salmon','shrimp','tofu','white_fish','mushroom','rice','pasta','noodles','rice_noodles','potato','black_beans','kidney_beans','chickpeas']);
const doubleServing=new Set(['bread','tortilla','pita_bread']);
function quantity(recipe,id,index){
 if(index===0&&doublePrimary.has(id))return 2;
 if(doubleServing.has(id)&&/taco|tostada|burrito|sandwich|burger|sub|pita|wrap|panini|club/.test(recipe.id))return 2;
 if(id==='rice'&&index<3&&/bowl|rice|curry/.test(recipe.id))return 2;
 if(id==='potato'&&index<2&&/hash|chowder|bake/.test(recipe.id))return 2;
 return 1;
}
const scored=(recipe,ids)=>Object.fromEntries(ids.map(id=>[id,quantity(recipe,id,recipe.suggestedCoreIngredientIds.indexOf(id))]));
const additions=source.newRecipes.map(recipe=>{
 if(recipeIds.has(recipe.id))throw Error(`Duplicate recipe ID: ${recipe.id}`);
 recipeIds.add(recipe.id);
 if(!families.has(recipe.family))throw Error(`Unknown family: ${recipe.family}`);
 const core=recipe.suggestedCoreIngredientIds;
 if(duplicates(core).length||core.some(id=>!ingredientIds.has(id)))throw Error(`Bad ingredient list: ${recipe.id}`);
 const medium=mediumOverrides[recipe.id]||core.slice(0,4);
 if(medium.some(id=>!core.includes(id)))throw Error(`Medium ingredient not in proposal: ${recipe.id}`);
 if(medium.length<3||medium.length>4||core.length<4||core.length>6)throw Error(`Bad ingredient count: ${recipe.id}`);
 return {id:recipe.id,name:recipe.name,family:recipe.family,variants:{medium:scored(recipe,medium),hard:scored(recipe,core)},sourceCoreIngredientIds:core};
});
if(recipeIds.size!==225)throw Error('Expanded catalog does not have 225 unique recipes');
const catalog={status:'experimental_only',baseline:'Quality V3 (150 recipes unchanged)',source:'source-proposal.json',recipes:[...v3.recipes,...additions]};
const output=path.join(dir,'candidate-recipe-catalog.json');
fs.writeFileSync(output,JSON.stringify(catalog,null,2)+'\n');
fs.writeFileSync(path.join(dir,'ingredient-catalog.json'),JSON.stringify({status:'experimental_only',ingredients},null,2)+'\n');
const distribution=items=>items.reduce((counts,item)=>(counts[Object.keys(item).length]=(counts[Object.keys(item).length]||0)+1,counts),{});
console.log(JSON.stringify({ingredients:ingredients.length,recipes:catalog.recipes.length,newRecipeMedium:distribution(additions.map(x=>x.variants.medium)),newRecipeHard:distribution(additions.map(x=>x.variants.hard)),output},null,2));
