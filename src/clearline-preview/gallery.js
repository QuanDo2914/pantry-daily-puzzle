import {ingredientArt,recipeArt} from '../visuals/clearline.js';
const $=s=>document.querySelector(s);
const [ingredients,catalog]=await Promise.all([fetch('/clearline-data/ingredients.json').then(r=>r.json()),fetch('/clearline-data/proposed-recipe-catalog.json').then(r=>r.json())]);
const recipes=catalog.recipes;
$('#ingredient-total').textContent=ingredients.length;$('#recipe-total').textContent=recipes.length;
for(const family of [...new Set(recipes.map(r=>r.family))])$('#family').insertAdjacentHTML('beforeend',`<option value="${family}">${family.replaceAll('_',' ')}</option>`);
function draw(){const q=$('#search').value.toLowerCase().trim(),variant=$('#variant').value,family=$('#family').value;
 $('#ingredients-section').hidden=family!=='all';
 $('#ingredients').innerHTML=ingredients.filter(x=>!q||x.name.toLowerCase().includes(q)||x.id.includes(q)).map(x=>`<article class="tile">${ingredientArt(x.id,x.name)}<strong>${x.name}</strong><small>${x.id}</small></article>`).join('');
 $('#recipes').innerHTML=recipes.filter(x=>(family==='all'||x.family===family)&&(!q||x.name.toLowerCase().includes(q)||x.id.includes(q))).map(x=>`<article class="tile">${recipeArt({...x,ingredients:x.variants[variant]})}<strong>${x.name}</strong><small>${x.family.replaceAll('_',' ')} · ${Object.keys(x.variants[variant]).length} ingredients</small></article>`).join('');
}
for(const id of ['search','variant','family'])$('#'+id).addEventListener(id==='search'?'input':'change',draw);
draw();
