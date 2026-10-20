import fs from 'node:fs'; import path from 'node:path';
const dist=path.resolve('dist'); fs.rmSync(dist,{recursive:true,force:true}); fs.mkdirSync(dist,{recursive:true});
for(const file of ['index.html','styles.css','clearline.css','app.js','sw.js','manifest.webmanifest']) fs.copyFileSync(path.resolve('src',file),path.join(dist,file));
fs.cpSync('src/game',path.join(dist,'game'),{recursive:true}); fs.cpSync('src/data',path.join(dist,'data'),{recursive:true});
fs.cpSync('src/visuals',path.join(dist,'visuals'),{recursive:true});
fs.cpSync('src/clearline-preview',path.join(dist,'clearline-preview'),{recursive:true});
fs.cpSync('src/clearline-expansion',path.join(dist,'clearline-expansion'),{recursive:true});
fs.cpSync('public/puzzles',path.join(dist,'puzzles'),{recursive:true});
const v3=path.resolve('proposals/content-expansion/quality-v3');
const previewData=path.join(dist,'clearline-data');fs.mkdirSync(previewData,{recursive:true});
for(const file of ['medium-100.json','hard-100.json','proposed-recipe-catalog.json'])fs.copyFileSync(path.join(v3,file),path.join(previewData,file));
const {INGREDIENTS,PROPOSED_ADDITIONS}=await import('../proposals/content-expansion/data.mjs');
fs.writeFileSync(path.join(previewData,'ingredients.json'),JSON.stringify([...INGREDIENTS,...PROPOSED_ADDITIONS].map(({id,name,category})=>({id,name,category}))));
const expansion=path.resolve('proposals/content-expansion/clearline-expansion');
const expansionData=path.join(dist,'clearline-expansion-data');fs.mkdirSync(expansionData,{recursive:true});
for(const file of ['candidate-recipe-catalog.json','ingredient-catalog.json','medium-25.json','hard-25.json']){
 const source=path.join(expansion,file);if(fs.existsSync(source))fs.copyFileSync(source,path.join(expansionData,file));
}
const hundredData=path.join(dist,'clearline-100-data');fs.mkdirSync(hundredData,{recursive:true});
for(const mode of ['medium','hard'])fs.copyFileSync(path.join(expansion,'guided-v3-100-day',`samples-${mode}.json`),path.join(hundredData,`samples-${mode}.json`));
fs.writeFileSync(path.join(dist,'404.html'),fs.readFileSync(path.join(dist,'index.html')));
console.log(`Built ${dist}`);
