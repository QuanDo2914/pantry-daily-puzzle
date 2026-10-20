import {execFileSync} from 'node:child_process';
import fs from 'node:fs';
import {pathToFileURL} from 'node:url';

// 1f73627 is the approved refined-library foundation for this isolated branch.
const priorSource=execFileSync('git',['show','1f73627:src/visuals/clearline.js'],{encoding:'utf8'});
const prior=await import(`data:text/javascript;base64,${Buffer.from(priorSource).toString('base64')}`);
const current=await import(pathToFileURL('src/visuals/clearline.js').href);
const catalog=JSON.parse(fs.readFileSync('proposals/content-expansion/quality-v3/proposed-recipe-catalog.json','utf8'));
const ids=['beef_burrito','bean_burrito','breakfast_burrito','chicken_wrap','veggie_wrap','cheese_quesadilla'];
const rows=ids.map(id=>{
  const definition=catalog.recipes.find(recipe=>recipe.id===id);
  if(!definition)throw Error(`Missing comparison recipe: ${id}`);
  const recipe={...definition,ingredients:definition.variants.medium};
  return{id,name:recipe.name,before:prior.recipeArt(recipe),after:current.recipeArt(recipe)};
});
fs.writeFileSync('src/clearline-expansion/before-after.json',JSON.stringify(rows));
console.log(`Saved ${rows.length} approved-foundation versus final-correction comparisons`);
