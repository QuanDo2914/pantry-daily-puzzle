import fs from 'node:fs'; import path from 'node:path';
const dist=path.resolve('dist'); fs.rmSync(dist,{recursive:true,force:true}); fs.mkdirSync(dist,{recursive:true});
for(const file of ['index.html','styles.css','app.js','sw.js','manifest.webmanifest']) fs.copyFileSync(path.resolve('src',file),path.join(dist,file));
fs.cpSync('src/game',path.join(dist,'game'),{recursive:true}); fs.cpSync('src/data',path.join(dist,'data'),{recursive:true});
fs.cpSync('public/puzzles',path.join(dist,'puzzles'),{recursive:true});
fs.writeFileSync(path.join(dist,'404.html'),fs.readFileSync(path.join(dist,'index.html')));
console.log(`Built ${dist}`);
