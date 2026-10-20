import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {performance} from 'node:perf_hooks';
import {catalog,configs,libFor,vectorIndex,sum,answerEligibility,chooseDecoys,evaluate,qualityFailure,rngFor,shuffle,signature,newIds,overlap} from '../guided-core.mjs';

const out=new URL('./',import.meta.url),start=performance.now(),startedAt=new Date().toISOString(),deadline=start+9*60*1000;
const hash=value=>crypto.createHash('sha256').update(value).digest('hex');
const catalogHash=hash(JSON.stringify(catalog));
const protectedPaths=['src/visuals','public/puzzles','proposals/content-expansion/quality-v3','proposals/content-expansion/clearline-expansion/candidate-recipe-catalog.json','proposals/content-expansion/clearline-expansion/ingredient-catalog.json','proposals/content-expansion/clearline-expansion/guided-v2'];
function snapshot(){const files={};function visit(name){if(fs.statSync(name).isDirectory())for(const child of fs.readdirSync(name).sort())visit(path.join(name,child));else files[name]=hash(fs.readFileSync(name))}for(const name of protectedPaths)visit(name);return files}
const before=snapshot();
if(!fs.existsSync(new URL('preservation-before.json',out)))fs.writeFileSync(new URL('preservation-before.json',out),JSON.stringify(before,null,2));
const seedFiles={medium:'/private/tmp/pantry-v3-answer-pool-fdbba3ed01553689.json',hard:'/private/tmp/pantry-v3-answer-pool-29ea7236dc2cc968.json'};

function prepare(mode){
 const began=performance.now(),lib=libFor(mode),byId=new Map(lib.map(card=>[card.id,card])),index=vectorIndex(lib),config=configs[`${mode}_a`];
 const bundled=new URL('seed-answer-groups.json',out),seedPath=fs.existsSync(bundled)?bundled:seedFiles[mode];
 const seeds=fs.existsSync(bundled)?JSON.parse(fs.readFileSync(bundled)).modes[mode].groups.map(ids=>({answer:ids.map(id=>byId.get(id))})):JSON.parse(fs.readFileSync(seedPath)).candidates;
 for(const seed of seeds)for(const card of seed.answer){if(JSON.stringify(card.ingredients)!==JSON.stringify(byId.get(card.id)?.ingredients))throw Error(`Invalid cached seed ${card.id}`)}
 const seen=new Set(),fittingCache=new Map(),eligible=[],rejections={},additions=lib.filter(card=>card.new);let attempts=0,deadlineReached=false;
 outer:for(const seed of seeds)for(const added of additions)for(let slot=0;slot<seed.answer.length;slot++){
  if(performance.now()>deadline){deadlineReached=true;break outer}attempts++;
  const answer=seed.answer.map((card,i)=>i===slot?added:byId.get(card.id)),key=answer.map(card=>card.id).sort().join('|');
  if(seen.has(key))continue;seen.add(key);const pantry=sum(answer),pantryTypes=Object.keys(pantry).length;
  if(pantryTypes<config.min||pantryTypes>config.max){rejections.pantry_range=(rejections.pantry_range||0)+1;continue}
  const pantryKey=Object.entries(pantry).sort(([a],[b])=>a.localeCompare(b)).map(([id,q])=>`${id}:${q}`).join('|');
  let fitting=fittingCache.get(pantryKey);if(!fitting){const vector=index.pantryVector(pantry);fitting=lib.filter(card=>index.canFit(card,vector));fittingCache.set(pantryKey,fitting)}
  const ids=new Set(answer.map(card=>card.id)),decoys=fitting.filter(card=>!ids.has(card.id)),base={answer,pantry,pantryTypes,decoys,key,newId:added.id};
  const reason=answerEligibility(base,config);if(reason){rejections[reason]=(rejections[reason]||0)+1;continue}eligible.push(base);
 }
 return{eligible,report:{seedPath,seedFileSHA256:hash(fs.readFileSync(seedPath)),seedGroups:seeds.length,seedCanonicalValidation:true,attempts,uniqueSubstitutions:seen.size,eligibleAnswerSets:eligible.length,eligibleNewRecipes:new Set(eligible.map(base=>base.newId)).size,pantryCacheEntries:fittingCache.size,rejections,runtimeMs:+(performance.now()-began).toFixed(1),deadlineReached}};
}

function buildPool(mode){
 const began=performance.now(),prepared=prepare(mode),config=configs[`${mode}_a`],random=rngFor(`expanded-100-pool-v1:${mode}`),groups=Object.groupBy(prepared.eligible,base=>base.newId);
 const ids=shuffle(Object.keys(groups),random),bases=[];for(const rows of Object.values(groups))rows.sort((a,b)=>a.key.localeCompare(b.key));
 for(let round=0;round<Math.max(0,...Object.values(groups).map(rows=>rows.length));round++)for(const id of ids)if(groups[id][round])bases.push(groups[id][round]);
 const boards=[],structures=new Set(),cardSets=new Set(),usage=new Map(),evalCache=new Map(),rejects={},limit=mode==='medium'?1600:2600;let attempts=0;
 outer:for(const base of bases)for(let trial=0;trial<4;trial++){
  if(performance.now()>deadline||boards.length>=limit)break outer;attempts++;
  const decoys=chooseDecoys(base,config,random,usage);if(!decoys){rejects.decoy_selection=(rejects.decoy_selection||0)+1;continue}
  const cards=shuffle([...base.answer,...decoys],random),cardKey=cards.map(card=>card.id).sort().join('|'),key=`${base.key}|${cardKey}`;
  let metrics=evalCache.get(key);if(!metrics){metrics=evaluate(cards,base.pantry,base.answer,mode);evalCache.set(key,metrics)}
  const reason=qualityFailure(metrics,mode);if(reason){rejects[reason]=(rejects[reason]||0)+1;continue}
  if(cardSets.has(cardKey)){rejects.duplicate_card_set=(rejects.duplicate_card_set||0)+1;continue}
  const sig=signature(cards,base.pantry,metrics.solution,mode);if(structures.has(sig)){rejects.duplicate_structure=(rejects.duplicate_structure||0)+1;continue}
  cardSets.add(cardKey);structures.add(sig);const families=new Map();for(const card of cards)families.set(card.family,(families.get(card.family)||0)+1);
  boards.push({mode,pantry:base.pantry,cards:cards.map(({id,name,family,ingredients})=>({id,name,family,ingredients})),solution:metrics.solution,solutionKey:[...metrics.solution].sort().join('|'),structuralSignature:sig,metrics:{...metrics,ingredientTypes:base.pantryTypes,distinctFamilies:families.size,maxRecipesPerFamily:Math.max(...families.values())}});
  for(const card of cards)usage.set(card.id,(usage.get(card.id)||0)+1);
 }
 return{boards,report:{preparation:prepared.report,boardAttempts:attempts,validCandidates:boards.length,uniqueSolutionGroups:new Set(boards.map(board=>board.solutionKey)).size,cachedDifficultyEvaluations:evalCache.size,rejections:rejects,runtimeMs:+(performance.now()-began).toFixed(1),deadlineReached:performance.now()>deadline}};
}

const poolFile=new URL('candidate-pools.json',out);let cache=null;
if(fs.existsSync(poolFile)){const saved=JSON.parse(fs.readFileSync(poolFile));if(saved.catalogHash===catalogHash&&saved.version===1)cache=saved}
const cached=!!cache;
if(!cache){cache={version:1,catalogHash,modes:{},startedAt};for(const mode of ['medium','hard']){cache.modes[mode]=buildPool(mode);console.log(JSON.stringify({mode,...cache.modes[mode].report}));}cache.poolPreparationMs=+(performance.now()-start).toFixed(1);fs.writeFileSync(poolFile,JSON.stringify(cache));}

function selectSchedule(mode,pool){
 const bestDepth=new Map();for(const board of pool)bestDepth.set(board.solutionKey,Math.max(bestDepth.get(board.solutionKey)||0,board.metrics.deductionSteps));
 const preferred=pool.filter(board=>board.metrics.deductionSteps===bestDepth.get(board.solutionKey)&&board.metrics.deductionSteps>=(mode==='medium'?3:5));
 // Stronger variants take precedence over variety when enough unique groups exist.
 if(new Set(preferred.map(board=>board.solutionKey)).size>=100)pool=preferred;
 const random=rngFor(`expanded-100-schedule-v1:${mode}`),chosen=[],solutions=new Set(),structures=new Set(),cardSets=new Set(),frequency=new Map(),families=new Map();
 for(let day=0;day<100;day++){
  const ranked=pool.filter(board=>!solutions.has(board.solutionKey)&&!structures.has(board.structuralSignature)&&!cardSets.has(board.cards.map(card=>card.id).sort().join('|'))).map(board=>{
   const ids=board.cards.map(card=>card.id),last=chosen.at(-1)?.cards.map(card=>card.id)||[],week=chosen.slice(-6).flatMap(board=>board.cards.map(card=>card.id));let score=0;
   for(const card of board.cards){const count=frequency.get(card.id)||0;score+=(count===0?(newIds.has(card.id)?600:350):0)-count*55-Math.max(0,count-18)**2*15-week.filter(id=>id===card.id).length*55;score-=(families.get(card.family)||0)/Math.max(1,day)*4}
   score-=overlap(ids,last)*190;score+=board.metrics.deductionSteps*5+board.metrics.nearMissCount*2+random()*3;return{board,score};
  }).sort((a,b)=>b.score-a.score);
  if(!ranked.length)break;const pick=ranked[0].board;chosen.push(pick);solutions.add(pick.solutionKey);structures.add(pick.structuralSignature);cardSets.add(pick.cards.map(card=>card.id).sort().join('|'));
  for(const card of pick.cards){frequency.set(card.id,(frequency.get(card.id)||0)+1);families.set(card.family,(families.get(card.family)||0)+1)}
 }
 // Whole-set deterministic ordering, followed by bounded route improvements.
 const ordered=[],remaining=[...chosen];while(remaining.length){const prev=ordered.at(-1),recent=ordered.slice(-6).flatMap(board=>board.cards.map(card=>card.id));const ranked=remaining.map((board,index)=>({board,index,score:(prev?overlap(board.cards.map(card=>card.id),prev.cards.map(card=>card.id)):0)*200+overlap(board.cards.map(card=>card.id),recent)*15+random()})).sort((a,b)=>a.score-b.score);ordered.push(ranked[0].board);remaining.splice(ranked[0].index,1)}
 const edge=(a,b)=>a&&b?overlap(a.cards.map(card=>card.id),b.cards.map(card=>card.id)):0;
 for(let pass=0;pass<4;pass++){let improved=false;for(let i=0;i<ordered.length-2;i++)for(let j=i+2;j<ordered.length;j++){const before=edge(ordered[i-1],ordered[i])+edge(ordered[j],ordered[j+1]),after=edge(ordered[i-1],ordered[j])+edge(ordered[i],ordered[j+1]);if(after<before){ordered.splice(i,j-i+1,...ordered.slice(i,j+1).reverse());improved=true}}if(!improved)break}
 return ordered.map((board,index)=>({...board,id:`expanded-100-${mode}-${String(index+1).padStart(3,'0')}`,contentVersion:'experimental-guided-v3-100-day',day:index+1,seed:`expanded-100-v1:${mode}:${index+1}`,metrics:{...board.metrics,newRecipeIds:board.cards.filter(card=>newIds.has(card.id)).map(card=>card.id),difficultyLabel:mode==='hard'?'hard':'balanced',difficultyExplanation:`${board.metrics.deductionSteps} constraint steps, ${board.metrics.nearMissCount} strict near misses, ${board.metrics.competitiveDecoyIds.length} competitive decoys.`}}));
}
const scheduleStart=performance.now(),summary={};
if(cached&&fs.existsSync(new URL('coverage-and-variety.json',out))&&!fs.existsSync(new URL('initial-schedule-summary.json',out))){
 fs.writeFileSync(new URL('initial-schedule-summary.json',out),fs.readFileSync(new URL('coverage-and-variety.json',out)));
 for(const mode of ['medium','hard'])fs.writeFileSync(new URL(`initial-schedule-${mode}.json`,out),fs.readFileSync(new URL(`${mode}-100.json`,out)));
 fs.writeFileSync(new URL('initial-schedule-performance.json',out),fs.readFileSync(new URL('performance-cached.json',out)));
}
for(const mode of ['medium','hard']){const boards=selectSchedule(mode,cache.modes[mode].boards);fs.writeFileSync(new URL(`${mode}-100.json`,out),JSON.stringify(boards,null,2));summary[mode]={generated:boards.length,uniqueSolutions:new Set(boards.map(board=>board.solutionKey)).size};}
const after=snapshot();if(JSON.stringify(before)!==JSON.stringify(after))throw Error('Protected content changed during experiment');
const performanceReport={startedAt,finishedAt:new Date().toISOString(),cacheHit:cached,selectionPolicy:'Prefer maximum deduction-depth variant per solution group; Medium depth>=3 and Hard>=5 where at least 100 distinct groups permit',priorV3SeedCachesReused:true,trueColdStartWithoutSeedCaches:'not measured',freshExpandedPoolPreparationMs:cached?null:cache.poolPreparationMs,savedPoolPreparationMs:cache.poolPreparationMs,schedulingMs:+(performance.now()-scheduleStart).toFixed(1),generationCommandWallMs:+(performance.now()-start).toFixed(1),generationDeadlineMs:9*60*1000,protectedFilesUnchanged:true,protectedFileCount:Object.keys(before).length,modes:summary};
fs.writeFileSync(new URL(cached?'performance-cached.json':'performance.json',out),JSON.stringify(performanceReport,null,2));console.log(JSON.stringify(performanceReport));
