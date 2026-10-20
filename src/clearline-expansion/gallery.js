import {ingredientArt,recipeArt} from '../visuals/clearline.js';
const $=selector=>document.querySelector(selector);
const [ingredientData,catalog]=await Promise.all([
 fetch('/clearline-expansion-data/ingredient-catalog.json').then(response=>response.json()),
 fetch('/clearline-expansion-data/candidate-recipe-catalog.json').then(response=>response.json())
]);
const ingredients=ingredientData.ingredients,recipes=catalog.recipes;
const baselineIngredientIds=new Set(ingredients.slice(0,90).map(item=>item.id));
const baselineRecipeIds=new Set(recipes.slice(0,150).map(item=>item.id));
const escapeHtml=value=>String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const title=value=>value.replaceAll('_',' ').replace(/\b\w/g,char=>char.toUpperCase());
$('#ingredient-total').textContent=ingredients.length;
$('#recipe-total').textContent=recipes.length;
$('#new-count').textContent=ingredients.length-90+recipes.length-150;
for(const family of [...new Set(recipes.map(recipe=>recipe.family))])$('#family').insertAdjacentHTML('beforeend',`<option value="${family}">${title(family)}</option>`);
function group(items,key,card){
 const groups=Map.groupBy(items,item=>item[key]);
 return [...groups].map(([heading,rows])=>`<section class="gallery-group"><h3>${title(heading)} <small>${rows.length}</small></h3><div class="grid ${key==='category'?'ingredients':'recipes'}">${rows.map(card).join('')}</div></section>`).join('');
}
function draw(){
 const query=$('#search').value.toLowerCase().trim(),variant=$('#variant').value,family=$('#family').value,newOnly=$('#scope').value==='new';
 const matches=item=>!query||item.name.toLowerCase().includes(query)||item.id.includes(query);
 const shownIngredients=ingredients.filter(item=>matches(item)&&(!newOnly||!baselineIngredientIds.has(item.id)));
 const shownRecipes=recipes.filter(item=>matches(item)&&(family==='all'||item.family===family)&&(!newOnly||!baselineRecipeIds.has(item.id)));
 $('#ingredients-section').hidden=family!=='all';
 $('#ingredient-groups').innerHTML=group(shownIngredients,'category',item=>`<article class="tile">${ingredientArt(item.id,item.name)}<strong>${escapeHtml(item.name)}</strong><small>${escapeHtml(item.id)}${baselineIngredientIds.has(item.id)?'':' · NEW'}</small></article>`);
 $('#recipe-groups').innerHTML=group(shownRecipes,'family',item=>{
  const drawMode=mode=>recipeArt({...item,ingredients:item.variants[mode]});
  const art=variant==='compare'?`<div class="variant-compare"><figure>${drawMode('medium')}<figcaption>Medium</figcaption></figure><figure>${drawMode('hard')}<figcaption>Hard</figcaption></figure></div>`:drawMode(variant);
  return `<article class="tile">${art}<strong>${escapeHtml(item.name)}</strong><small>${escapeHtml(item.id)} · ${Object.keys(item.variants[variant==='compare'?'hard':variant]).length} ingredients${baselineRecipeIds.has(item.id)?'':' · NEW'}</small></article>`;
 });
}
for(const id of ['search','variant','family','scope'])$('#'+id).addEventListener(id==='search'?'input':'change',draw);
draw();
