import {ingredientArt,recipeArt} from '../visuals/clearline.js';
import {ingredientArt as oldIngredientArt,recipeArt as oldRecipeArt} from '../visuals/clearline-v1.js';
const $=s=>document.querySelector(s);
const [ingredients,catalog]=await Promise.all([fetch('/clearline-data/ingredients.json').then(r=>r.json()),fetch('/clearline-data/proposed-recipe-catalog.json').then(r=>r.json())]);
const recipes=catalog.recipes;
for(const family of [...new Set(recipes.map(r=>r.family))])$('#family').insertAdjacentHTML('beforeend',`<option value="${family}">${family.replaceAll('_',' ')}</option>`);
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const pair=(oldArt,newArt)=>`<div class="compare-pair"><figure>${oldArt}<figcaption>Previous</figcaption></figure><figure>${newArt}<figcaption>Refined</figcaption></figure></div>`;
function draw(){const q=$('#search').value.toLowerCase().trim(),variant=$('#variant').value,family=$('#family').value;
 document.documentElement.style.setProperty('--art-size',`${$('#size').value}px`);
 $('#ingredient-section').hidden=family!=='all';
 $('#ingredients').innerHTML=ingredients.filter(x=>!q||x.name.toLowerCase().includes(q)||x.id.includes(q)).map(x=>`<article class="compare-tile"><strong>${esc(x.name)}</strong><small>${esc(x.id)}</small>${pair(oldIngredientArt(x.id,x.name,true),ingredientArt(x.id,x.name,true))}</article>`).join('');
 $('#recipes').innerHTML=recipes.filter(x=>(family==='all'||x.family===family)&&(!q||x.name.toLowerCase().includes(q)||x.id.includes(q))).map(x=>{const data={...x,ingredients:x.variants[variant]};return `<article class="compare-tile ${['ham_and_cheese','burrito_bowl','meatball_sub'].includes(x.id)?'priority':''}"><strong>${esc(x.name)}</strong><small>${esc(x.family.replaceAll('_',' '))} · ${Object.keys(data.ingredients).length} ingredients</small>${pair(oldRecipeArt(data),recipeArt(data))}</article>`}).join('');
}
for(const id of ['search','size','variant','family'])$('#'+id).addEventListener(id==='search'?'input':'change',draw);
draw();
