// Bounded, deterministic, constraint-guided expansion experiment.
// Uses only approved pantry configuration A; alternative configurations are diagnostics.
import fs from 'node:fs';
import crypto from 'node:crypto';
import {performance} from 'node:perf_hooks';
import {root,catalog,configs,substitutionAnswers,answerEligibility,chooseDecoys,evaluate,qualityFailure,rngFor,shuffle,signature,newIds,overlap} from './guided-core.mjs';

const target=Number(process.argv[2]||10);
if(![10,25].includes(target))throw Error('Only bounded 10 or 25 board targets are allowed');
const newRecipeBonus=Number(process.env.PANTRY_NEW_RECIPE_BONUS||100);
const out=new URL('guided-v2/',root);fs.mkdirSync(out,{recursive:true});
const started=performance.now(),deadline=started+8*60*1000;
const hash=crypto.createHash('sha256').update(JSON.stringify(catalog)).digest('hex').slice(0,20);
const cachePath=new URL('candidate-pools.json',out);
let cache=fs.existsSync(cachePath)?JSON.parse(fs.readFileSync(cachePath)):null;
if(cache?.catalogHash!==hash||cache?.algorithmVersion!==2)cache=null;

function buildPool(mode){
 const config=configs[`${mode}_a`],random=rngFor(`guided-v2-pool:${mode}`),answerSets=substitutionAnswers(mode,{deadline}),eligible=answerSets.answers.filter(base=>!answerEligibility(base,config));
 const groups=Object.groupBy(eligible,base=>base.newId),order=shuffle(Object.keys(groups),random),bases=[];
 for(let round=0;round<Math.max(...Object.values(groups).map(rows=>rows.length));round++)for(const id of order)if(groups[id][round])bases.push(groups[id][round]);
 const boards=[],structures=new Set(),usage=new Map(),evaluationCache=new Map(),rejects={},maxBoards=mode==='medium'?350:500;
 for(const base of bases){if(performance.now()>deadline||boards.length>=maxBoards)break;
  for(let trial=0;trial<3;trial++){
   const decoys=chooseDecoys(base,config,random,usage);if(!decoys){rejects.decoy_selection=(rejects.decoy_selection||0)+1;continue}
   const cards=shuffle([...base.answer,...decoys],random),evaluationKey=`${base.key}|${cards.map(card=>card.id).sort().join('|')}`;
   let metrics=evaluationCache.get(evaluationKey);if(!metrics){metrics=evaluate(cards,base.pantry,base.answer,mode);evaluationCache.set(evaluationKey,metrics)}
   const why=qualityFailure(metrics,mode);
   if(why){rejects[why]=(rejects[why]||0)+1;continue}
   const structuralSignature=signature(cards,base.pantry,metrics.solution,mode);
   if(structures.has(structuralSignature)){rejects.duplicate_structure=(rejects.duplicate_structure||0)+1;continue}
   structures.add(structuralSignature);
   const familyCount=new Map();for(const card of cards)familyCount.set(card.family,(familyCount.get(card.family)||0)+1);
   boards.push({mode,pantry:base.pantry,cards:cards.map(({id,name,family,ingredients})=>({id,name,family,ingredients})),solution:metrics.solution,solutionKey:[...metrics.solution].sort().join('|'),structuralSignature,metrics:{...metrics,ingredientTypes:base.pantryTypes,distinctFamilies:familyCount.size,maxRecipesPerFamily:Math.max(...familyCount.values())}});
   for(const card of cards)usage.set(card.id,(usage.get(card.id)||0)+1);
  }
 }
 return{boards,diagnostics:{answerAttempts:answerSets.stats.attempts,uniqueSubstitutions:answerSets.answers.length,eligibleAnswerSets:eligible.length,boardAttempts:Object.values(rejects).reduce((a,b)=>a+b,0)+boards.length,validCandidateBoards:boards.length,cachedDifficultyEvaluations:evaluationCache.size,rejectionReasons:rejects,deadlineReached:performance.now()>deadline}};
}
if(!cache){cache={catalogHash:hash,algorithmVersion:2,status:'experimental_candidate_cache',modes:{}};for(const mode of ['medium','hard'])cache.modes[mode]=buildPool(mode);cache.runtimeMs=+(performance.now()-started).toFixed(1);fs.writeFileSync(cachePath,JSON.stringify(cache));}

function schedule(mode,count){
 const random=rngFor(`guided-v2-schedule:${mode}`),pool=cache.modes[mode].boards,selected=[],usedStructures=new Set(),usedSolutions=new Set(),frequency=new Map(),ingredientFrequency=new Map(),familyFrequency=new Map();
 for(let day=0;day<count;day++){
  const candidates=pool.filter(board=>!usedStructures.has(board.structuralSignature)&&!usedSolutions.has(board.solutionKey)).map(board=>{
   const ids=board.cards.map(card=>card.id),last=selected.at(-1)?.cards.map(card=>card.id)||[],adjacent=overlap(ids,last),recent=selected.slice(-6).flatMap(row=>row.cards.map(card=>card.id));
   const newRecipes=ids.filter(id=>newIds.has(id)),newUnseen=newRecipes.filter(id=>!frequency.has(id)).length,unseen=ids.filter(id=>!frequency.has(id)).length;
   let score=newUnseen*newRecipeBonus+unseen*28-adjacent*100;
   for(const id of ids)score-=(frequency.get(id)||0)*35+recent.filter(other=>other===id).length*30;
   for(const id of Object.keys(board.pantry))score+=Math.max(0,5-(ingredientFrequency.get(id)||0));
   for(const card of board.cards)score-=((familyFrequency.get(card.family)||0)/Math.max(1,day))*3;
   score+=board.metrics.nearMissCount*2+board.metrics.deductionSteps*5+random()*4;
   return{board,score,adjacent};
  }).sort((a,b)=>b.score-a.score);
  if(!candidates.length)break;
  const pick=candidates[0].board;selected.push(pick);usedStructures.add(pick.structuralSignature);usedSolutions.add(pick.solutionKey);
  for(const card of pick.cards){frequency.set(card.id,(frequency.get(card.id)||0)+1);familyFrequency.set(card.family,(familyFrequency.get(card.family)||0)+1)}for(const id of Object.keys(pick.pantry))ingredientFrequency.set(id,(ingredientFrequency.get(id)||0)+1);
 }
 return selected.map((board,index)=>({...board,id:`guided-expansion-${mode}-${String(index+1).padStart(3,'0')}`,contentVersion:'experimental-guided-expansion-v2',day:index+1,seed:`guided-v2:${mode}:${index+1}`,metrics:{...board.metrics,newRecipeIds:board.cards.filter(card=>newIds.has(card.id)).map(card=>card.id),difficultyLabel:board.metrics.difficultyScore>=120?'expert':mode==='hard'?'hard':'balanced',difficultyExplanation:`${board.metrics.deductionSteps} constraint steps, ${board.metrics.plausibleAlternatives} plausible alternatives, ${board.metrics.competitiveDecoyIds.length} competitive decoys, and ${board.metrics.oneSwapNearMisses} close one-card swaps.`}}));
}

const report={status:'guided_v2_experimental',target,catalogHash:hash,newRecipeBonus,cacheRuntimeMs:cache.runtimeMs,schedulingRuntimeMs:0,modes:{}};
for(const mode of ['medium','hard']){
 const boards=schedule(mode,target);fs.writeFileSync(new URL(`${mode}-${target}.json`,out),JSON.stringify(boards,null,2));
 const recipes=new Map(),ingredients=new Set(),families=new Set(),newRecipes=new Set(),overlaps=[];
 for(const [index,board] of boards.entries()){for(const card of board.cards){recipes.set(card.id,(recipes.get(card.id)||0)+1);families.add(card.family);if(newIds.has(card.id))newRecipes.add(card.id)}for(const id of Object.keys(board.pantry))ingredients.add(id);if(index)overlaps.push(overlap(board.cards.map(card=>card.id),boards[index-1].cards.map(card=>card.id)))}
 const avg=values=>+(values.reduce((a,b)=>a+b,0)/Math.max(1,values.length)).toFixed(2);
 report.modes[mode]={requested:target,generated:boards.length,complete:boards.length===target,candidatePool:cache.modes[mode].diagnostics,recipeCoverage:recipes.size,newRecipeCoverage:newRecipes.size,ingredientCoverage:ingredients.size,familyCoverage:families.size,maximumRecipeFrequency:Math.max(...recipes.values()),adjacentOverlap:avg(overlaps),averageNearMisses:avg(boards.map(board=>board.metrics.nearMissCount)),averageDeductionSteps:avg(boards.map(board=>board.metrics.deductionSteps)),averagePantryTypes:avg(boards.map(board=>Object.keys(board.pantry).length)),uniqueSolutions:new Set(boards.map(board=>board.solutionKey)).size,uniqueStructures:new Set(boards.map(board=>board.structuralSignature)).size};
}
report.schedulingRuntimeMs=+(performance.now()-started).toFixed(1);
fs.writeFileSync(new URL(`benchmark-${target}.json`,out),JSON.stringify(report,null,2));
console.log(JSON.stringify({runtimeMs:report.schedulingRuntimeMs,cacheRuntimeMs:report.cacheRuntimeMs,modes:Object.fromEntries(Object.entries(report.modes).map(([mode,row])=>[mode,{generated:row.generated,recipeCoverage:row.recipeCoverage,newRecipeCoverage:row.newRecipeCoverage,overlap:row.adjacentOverlap,near:row.averageNearMisses,depth:row.averageDeductionSteps}]))}));
