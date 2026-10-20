import fs from 'node:fs';
import crypto from 'node:crypto';
import {catalog} from '../guided-core.mjs';
const here=new URL('./',import.meta.url),byId=new Map(catalog.map(recipe=>[recipe.id,recipe]));
const paths={medium:'/private/tmp/pantry-v3-answer-pool-fdbba3ed01553689.json',hard:'/private/tmp/pantry-v3-answer-pool-29ea7236dc2cc968.json'};
const bundle={note:'Only canonical recipe IDs are needed to reproduce guided preparation; original expensive V3 search is not rerun.',modes:{}};
for(const [mode,file] of Object.entries(paths)){const bytes=fs.readFileSync(file),rows=JSON.parse(bytes).candidates;for(const row of rows)for(const card of row.answer)if(JSON.stringify(card.ingredients)!==JSON.stringify(byId.get(card.id)?.variants[mode]))throw Error('Seed definition mismatch');bundle.modes[mode]={originalCacheSHA256:crypto.createHash('sha256').update(bytes).digest('hex'),groups:rows.map(row=>row.answer.map(card=>card.id))};}
fs.writeFileSync(new URL('seed-answer-groups.json',here),JSON.stringify(bundle));console.log(Object.fromEntries(Object.entries(bundle.modes).map(([mode,row])=>[mode,row.groups.length])));
