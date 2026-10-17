// Bounded Quality V4 Hard pilot using the optimized V3 evaluator and quality gates.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { performance } from 'node:perf_hooks';
const CATALOG = JSON.parse(fs.readFileSync(new URL('./candidate-recipe-catalog.json', import.meta.url)));
const CHANGED = new Set(JSON.parse(fs.readFileSync(new URL('./recipe-changes.json', import.meta.url))).changes.map(x=>x.id));

const ROOT=path.dirname(new URL(import.meta.url).pathname), TARGET=25, POOL_TARGET=Number(process.env.PANTRY_V4_POOL||600);
const START=performance.now(), DEADLINE=START+8*60*1000;
const RULES={
  medium:{cards:8,picks:3,pantryMin:8,pantryMax:12,familyMin:6,nearMin:2,plausibleMin:5,competitiveMin:4,deductionMin:2,forcedMax:2},
  hard:{cards:12,picks:4,pantryMin:12,pantryMax:16,familyMin:7,nearMin:3,plausibleMin:12,competitiveMin:7,deductionMin:3,forcedMax:1}
};
const hash32=s=>Number.parseInt(crypto.createHash('sha256').update(s).digest('hex').slice(0,8),16)>>>0;
const rngFor=s=>{let a=hash32(s);return()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}};
const shuffle=(a,r)=>[...a].map(x=>({x,k:r()})).sort((x,y)=>x.k-y.k).map(x=>x.x);
const sum=cards=>cards.reduce((p,c)=>(Object.entries(c.ingredients).forEach(([i,q])=>p[i]=(p[i]||0)+q),p),{});
const dist=(a,b)=>[...new Set([...Object.keys(a),...Object.keys(b)])].reduce((n,i)=>n+Math.abs((a[i]||0)-(b[i]||0)),0);
const feasible=(c,p)=>Object.entries(c.ingredients).every(([i,q])=>(p[i]||0)>=q);
const overlap=(a,b)=>{const s=new Set(a);return b.filter(x=>s.has(x)).length};
const inc=(m,k,n=1)=>m.set(k,(m.get(k)||0)+n);
function *combos(a,n,s=0,p=[]){if(p.length===n){yield[...p];return}for(let i=s;i<=a.length-(n-p.length);i++){p.push(a[i]);yield*combos(a,n,i+1,p);p.pop()}}
const library=mode=>CATALOG.recipes.map(r=>({id:r.id,name:r.name,family:r.family,icon:r.icon,ingredients:r.variants[mode]}));
const familyCounts=cards=>cards.reduce((m,c)=>(m[c.family]=(m[c.family]||0)+1,m),{});

function signature(cards,pantry,solution,mode){
  const answer=new Set(solution),ingredients=Object.keys(pantry),h=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,20);let labels=new Map();
  for(const i of ingredients)labels.set(`i:${i}`,`I:${pantry[i]}`);for(const c of cards)labels.set(`r:${c.id}`,`R:${answer.has(c.id)?1:0}:${Object.values(c.ingredients).sort((a,b)=>a-b)}`);
  for(let round=0;round<7;round++){const next=new Map();for(const i of ingredients)next.set(`i:${i}`,h(`${labels.get(`i:${i}`)}|${cards.filter(c=>c.ingredients[i]).map(c=>`${c.ingredients[i]}:${labels.get(`r:${c.id}`)}`).sort().join('|')}`));for(const c of cards)next.set(`r:${c.id}`,h(`${labels.get(`r:${c.id}`)}|${Object.entries(c.ingredients).map(([i,q])=>`${q}:${labels.get(`i:${i}`)}`).sort().join('|')}`));labels=next}return h(`${mode}|${[...labels.values()].sort().join('|')}`)
}

function evaluate(cards,pantry,solution,rules){
  const solutionSet=new Set(solution),rows=[...combos(cards,rules.picks)].map(selected=>{const used=sum(selected),ids=selected.map(x=>x.id),distance=dist(used,pantry);return{recipeIds:ids,used,distance,exact:distance===0,solutionOverlap:ids.filter(id=>solutionSet.has(id)).length}});
  const exact=rows.filter(x=>x.exact),near=rows.filter(x=>!x.exact&&x.distance<=4).sort((a,b)=>a.distance-b.distance),plausible=rows.filter(x=>!x.exact&&x.distance<=6),oneSwap=plausible.filter(x=>x.solutionOverlap===rules.picks-1);
  const competitive=cards.filter(c=>!solutionSet.has(c.id)&&plausible.some(row=>row.recipeIds.includes(c.id))).map(c=>c.id),degrees=Object.fromEntries(Object.keys(pantry).map(i=>[i,cards.filter(c=>c.ingredients[i]).length]));
  const forced=solution.filter(id=>Object.keys(cards.find(c=>c.id===id).ingredients).some(i=>degrees[i]===1)),shared=Object.values(degrees).filter(n=>n>=3).length;
  const exactByIngredient=Object.keys(pantry).map(i=>rows.filter(row=>row.used[i]===pantry[i]).length),singleFloor=Math.min(...exactByIngredient);
  let remaining=rows,available=Object.keys(pantry),depth=0;while(remaining.length>1&&available.length){const choices=available.map(i=>({i,rows:remaining.filter(row=>row.used[i]===pantry[i])})).filter(x=>x.rows.some(r=>r.exact)).sort((a,b)=>a.rows.length-b.rows.length);if(!choices[0]||choices[0].rows.length===remaining.length)break;remaining=choices[0].rows;available=available.filter(i=>i!==choices[0].i);depth++}
  let edges=0;for(let i=0;i<cards.length;i++)for(let j=i+1;j<cards.length;j++)if(overlap(Object.keys(cards[i].ingredients),Object.keys(cards[j].ingredients))>=2)edges++;
  const density=edges/(cards.length*(cards.length-1)/2),score=near.length*2+plausible.length+competitive.length*3+oneSwap.length*2+shared*2+density*20+depth*4-forced.length*15;
  return{combinations:rows.length,solutionCount:exact.length,solution:exact[0]?.recipeIds||[],nearMissCount:near.length,nearMisses:near.slice(0,20),plausibleAlternatives:plausible.length,oneSwapNearMisses:oneSwap.length,competitiveDecoyIds:competitive,forcedRecipeIds:forced,sharedIngredientCount:shared,ingredientDegrees:degrees,overlapDensity:+density.toFixed(3),singleIngredientCandidateFloor:singleFloor,deductionSteps:depth,difficultyScore:+score.toFixed(1)};
}
function rejection(m,mode,r){if(m.solutionCount!==1)return m.solutionCount?'multiple_solutions':'no_solution';if(m.nearMissCount<r.nearMin)return'too_few_near_misses';if(m.plausibleAlternatives<r.plausibleMin)return'too_few_plausible_alternatives';if(m.competitiveDecoyIds.length<r.competitiveMin)return'irrelevant_decoys';if(m.forcedRecipeIds.length>r.forcedMax)return'obvious_forced_recipe';if(m.deductionSteps<r.deductionMin)return'shallow_constraint_depth';if(mode==='hard'&&m.singleIngredientCandidateFloor<=1)return'single_ingredient_reveal';if(mode==='hard'&&m.oneSwapNearMisses<2)return'too_few_close_swaps';if(mode==='hard'&&m.sharedIngredientCount<5)return'weak_constraint_network';return null}

function answerPool(mode){
  const lib=library(mode),rules=RULES[mode],cacheKey=crypto.createHash('sha256').update(JSON.stringify({version:1,mode,rules,recipes:lib})).digest('hex').slice(0,16),cachePath=path.join('/private/tmp',`pantry-v4-answer-pool-${cacheKey}.json`);
  if(fs.existsSync(cachePath))return JSON.parse(fs.readFileSync(cachePath));
  const random=rngFor(`v4-answers:${mode}`),byId=new Map(),rejects={},anchorStats={};let attempts=0;
  const reject=x=>rejects[x]=(rejects[x]||0)+1;
  const perAnchor=Number(process.env.PANTRY_V4_ANCHOR_TRIALS||4500);
  for(const anchor of lib){const stat=anchorStats[anchor.id]={attempts:0,qualifying:0,reasonCounts:{}};for(let trial=0;trial<perAnchor;trial++){if(performance.now()>DEADLINE)throw new Error('V4 answer search exceeded eight minutes');attempts++;stat.attempts++;const answer=[anchor],families=new Set([anchor.family]);for(const c of shuffle(lib,random)){if(answer.length===rules.picks)break;if(c.id!==anchor.id&&!families.has(c.family)){answer.push(c);families.add(c.family)}}const key=answer.map(x=>x.id).sort().join('|');if(byId.has(key))continue;const pantry=sum(answer),types=Object.keys(pantry).length;let reason;if(types<rules.pantryMin||types>rules.pantryMax)reason='pantry_range';else{const ids=new Set(answer.map(x=>x.id)),decoys=lib.filter(c=>!ids.has(c.id)&&feasible(c,pantry));if(decoys.length<rules.cards-rules.picks)reason='insufficient_decoys';else if(new Set([...answer,...decoys].map(x=>x.family)).size<rules.familyMin)reason='insufficient_families';else{const ac=familyCounts(answer),dc=Object.groupBy(decoys,c=>c.family),capacity=Object.entries(dc).reduce((n,[f,a])=>n+Math.min(a.length,Math.max(0,2-(ac[f]||0))),0);if(capacity<rules.cards-rules.picks)reason='family_cap_capacity';else{byId.set(key,{answer,pantry,decoys,key});stat.qualifying++;}}}if(reason){reject(reason);stat.reasonCounts[reason]=(stat.reasonCounts[reason]||0)+1}}}
  const result={candidates:[...byId.values()],attempts,rejects,anchorStats};fs.writeFileSync(cachePath,JSON.stringify(result));return result;
}

function chooseDecoys(base,rules,random,candidateUsage){
  const needed=rules.cards-rules.picks,answer=base.answer;
  for(let pass=0;pass<160;pass++){const selected=[],counts=new Map();for(const c of answer)inc(counts,c.family);while(selected.length<needed){const present=new Set([...answer,...selected].map(c=>c.family)),slots=needed-selected.length,newNeeded=Math.max(0,rules.familyMin-present.size);const options=shuffle(base.decoys.filter(c=>!selected.includes(c)&&(counts.get(c.family)||0)<2&&(newNeeded>=slots?!present.has(c.family):true)),random).map(c=>{const overlaps=answer.map(a=>overlap(Object.keys(a.ingredients),Object.keys(c.ingredients))),rarity=candidateUsage.get(c.id)||0;return{c,score:(present.has(c.family)?0:8)+Math.max(...overlaps)*4+overlaps.reduce((a,b)=>a+b,0)-rarity*3+random()*3}}).sort((a,b)=>b.score-a.score).slice(0,24);if(!options.length)break;const pick=options[Math.floor(random()*Math.min(6,options.length))].c;selected.push(pick);inc(counts,pick.family)}if(selected.length===needed&&new Set([...answer,...selected].map(c=>c.family)).size>=rules.familyMin)return selected}return null
}

function candidatePool(mode){
  const started=performance.now(),rules=RULES[mode],answers=answerPool(mode),random=rngFor(`v4-boards:${mode}`),boards=[],structures=new Set(),candidateUsage=new Map(),rejects={};let attempts=0;
  const reject=x=>rejects[x]=(rejects[x]||0)+1,ordered=shuffle(answers.candidates,random).sort((a,b)=>a.answer.reduce((n,c)=>n+(answers.anchorStats[c.id]?.qualifying?0:10),0)-b.answer.reduce((n,c)=>n+(answers.anchorStats[c.id]?.qualifying?0:10),0));
  let rounds=0;while(boards.length<POOL_TARGET&&rounds<28){rounds++;for(const base of shuffle(ordered,random)){if(performance.now()>DEADLINE)throw new Error('V4 board search exceeded eight minutes');if(boards.length>=POOL_TARGET)break;attempts++;const decoys=chooseDecoys(base,rules,random,candidateUsage);if(!decoys){reject('decoy_selection');continue}const cards=shuffle([...base.answer,...decoys],random);if(!cards.some(c=>CHANGED.has(c.id))){reject('no_adjusted_recipe');continue}const metrics=evaluate(cards,base.pantry,base.answer.map(x=>x.id),rules),why=rejection(metrics,mode,rules);if(why){reject(why);continue}const sig=signature(cards,base.pantry,metrics.solution,mode);if(structures.has(sig)){reject('duplicate_structure');continue}structures.add(sig);const families=familyCounts(cards),board={mode,pantry:base.pantry,cards,solution:metrics.solution,solutionKey:[...metrics.solution].sort().join('|'),structuralSignature:sig,metrics:{...metrics,ingredientTypes:Object.keys(base.pantry).length,distinctFamilies:Object.keys(families).length,maxRecipesPerFamily:Math.max(...Object.values(families))}};boards.push(board);for(const c of cards)inc(candidateUsage,c.id)} }
  return{boards,answerPool:answers,attempts,rejects,runtimeMs:+(performance.now()-started).toFixed(1)};
}

function schedule(mode,pool){
  const random=rngFor(`v4-schedule:${mode}`),selected=[],used=new Set(),solutionKeys=new Set(),recipeFreq=new Map(),familyFreq=new Map(),ingredientFreq=new Map();
  const recent=(days,n)=>days.slice(-n).flatMap(p=>p.cards.map(c=>c.id));
  for(let day=0;day<TARGET;day++){
    const available=pool.boards.filter(p=>!used.has(p.structuralSignature)),freshSolutions=available.filter(p=>!solutionKeys.has(p.solutionKey)),choicePool=freshSolutions.length?freshSolutions:available,underCap=choicePool.filter(p=>p.cards.every(c=>(recipeFreq.get(c.id)||0)<25));
    const candidates=shuffle(underCap.length?underCap:choicePool,random).map(p=>{const ids=p.cards.map(c=>c.id),previous=selected.at(-1)?.cards.map(c=>c.id)||[],overlapPrev=overlap(ids,previous),week=recent(selected,6),fortnight=recent(selected,13),month=recent(selected,29);let score=0;for(const c of p.cards){const f=recipeFreq.get(c.id)||0;score+=(f===0?900:0)+Math.max(0,18-f)*18;score-=week.filter(x=>x===c.id).length*120+fortnight.filter(x=>x===c.id).length*28+month.filter(x=>x===c.id).length*8;if(f>=18)score-=(f-17)*700;score-=((familyFreq.get(c.family)||0)/Math.max(1,day))*8}for(const i of Object.keys(p.pantry))score+=Math.max(0,8-(ingredientFreq.get(i)||0));score-=overlapPrev*220;score+=p.metrics.deductionSteps*5+p.metrics.competitiveDecoyIds.length*2;return{p,score,overlapPrev}}).sort((a,b)=>b.score-a.score);
    if(!candidates[0])throw new Error(`${mode}: schedule exhausted at day ${day+1}`);const chosen=candidates[0].p;selected.push(chosen);used.add(chosen.structuralSignature);solutionKeys.add(chosen.solutionKey);for(const c of chosen.cards){inc(recipeFreq,c.id);inc(familyFreq,c.family)}for(const i of Object.keys(chosen.pantry))inc(ingredientFreq,i);
  }
  // Deterministic local reordering minimizes adjacent overlap and streaks without changing the chosen set.
  const ordered=[],remaining=[...selected];while(remaining.length){const previous=ordered.at(-1),last7=ordered.slice(-6).flatMap(p=>p.cards.map(c=>c.id));const ranked=remaining.map((p,index)=>({p,index,score:(previous?overlap(p.cards.map(c=>c.id),previous.cards.map(c=>c.id)):0)*100+overlap(p.cards.map(c=>c.id),last7)*12-random()})).sort((a,b)=>a.score-b.score);ordered.push(ranked[0].p);remaining.splice(ranked[0].index,1)}
  return ordered.map((p,index)=>{const previous=ordered[index-1],next=ordered[index+1],previousOverlap=previous?overlap(p.cards.map(c=>c.id),previous.cards.map(c=>c.id)):0,nextOverlap=next?overlap(p.cards.map(c=>c.id),next.cards.map(c=>c.id)):0;return{...p,id:`quality-v4-hard-${String(index+1).padStart(3,'0')}`,contentVersion:'experimental-quality-v4',day:index+1,seed:`quality-v4:hard:${index+1}`,metrics:{...p.metrics,adjustedRecipeIds:p.cards.filter(c=>CHANGED.has(c.id)).map(c=>c.id),difficultyLabel:p.metrics.difficultyScore>=120?'expert':'hard',difficultyExplanation:`${p.metrics.deductionSteps} interacting constraint steps, ${p.metrics.plausibleAlternatives} plausible alternatives, ${p.metrics.competitiveDecoyIds.length} competitive decoys, and ${p.metrics.oneSwapNearMisses} close one-card swaps.`,nearbyDifference:`Shares ${previousOverlap} recipes with the previous pilot board and ${nextOverlap} with the next.`}}});
}

function diversity(puzzles){
  const recipes=new Map(),families=new Map(),ingredients=new Map(),solutions=new Set(),structures=new Set();
  for(const p of puzzles){solutions.add(p.solutionKey);structures.add(p.structuralSignature);for(const c of p.cards){inc(recipes,c.id);inc(families,c.family)}for(const i of Object.keys(p.pantry))inc(ingredients,i)}
  const ids=puzzles.map(p=>new Set(p.cards.map(c=>c.id)));
  const adjacent=ids.slice(1).map((set,index)=>[...set].filter(id=>ids[index].has(id)).length);
  const streaks={};
  for(const id of recipes.keys()){let best=0,run=0;for(const day of ids){run=day.has(id)?run+1:0;best=Math.max(best,run)}streaks[id]=best}
  const windows={};
  for(const size of [7,14,30]){
    let max=0,worst=null;
    for(let start=0;start<=puzzles.length-size;start++){
      const counts=new Map();for(const p of puzzles.slice(start,start+size))for(const card of p.cards)inc(counts,card.id);
      const local=Math.max(...counts.values());if(local>max){max=local;worst={startDay:start+1,endDay:start+size,recipeIds:[...counts].filter(([,n])=>n===local).map(([id])=>id)}}
    }
    windows[size]={maximumAppearances:max,worstWindow:worst};
  }
  const sorted=map=>[...map.entries()].sort((a,b)=>b[1]-a[1]||a[0].localeCompare(b[0])),near=puzzles.map(p=>p.metrics.nearMissCount),depth=puzzles.map(p=>p.metrics.deductionSteps);
  return {recipeCoverage:recipes.size,familyCoverage:families.size,ingredientCoverage:ingredients.size,uniqueSolutions:solutions.size,uniqueStructures:structures.size,recipeFrequency:Object.fromEntries(sorted(recipes)),familyFrequency:Object.fromEntries(sorted(families)),ingredientFrequency:Object.fromEntries(sorted(ingredients)),maximumRecipeFrequency:Math.max(...recipes.values()),adjacentOverlap:{average:+(adjacent.reduce((a,b)=>a+b,0)/adjacent.length).toFixed(2),median:adjacent.toSorted((a,b)=>a-b)[Math.floor(adjacent.length/2)],maximum:Math.max(...adjacent),transitionsAtLeastHalf:adjacent.filter(n=>n>=puzzles[0].cards.length/2).length,values:adjacent},longestRecipeStreak:Math.max(...Object.values(streaks)),recipeStreaks:streaks,rollingWindows:windows,nearMiss:{min:Math.min(...near),average:+(near.reduce((a,b)=>a+b,0)/near.length).toFixed(2),max:Math.max(...near)},deductionDepth:{min:Math.min(...depth),average:+(depth.reduce((a,b)=>a+b,0)/depth.length).toFixed(2),max:Math.max(...depth)}};
}

function graphAnalysis(mode,pool,schedule){
  const lib=library(mode),scheduled=new Map();for(const p of schedule)for(const c of p.cards)inc(scheduled,c.id);
  return lib.map(recipe=>{const peers=lib.filter(other=>other.id!==recipe.id&&overlap(Object.keys(recipe.ingredients),Object.keys(other.ingredients))>0),familyConnections=new Set(peers.map(x=>x.family)),answerRows=pool.answerPool.candidates.filter(x=>x.answer.some(c=>c.id===recipe.id)),decoyRows=pool.answerPool.candidates.filter(x=>x.decoys.some(c=>c.id===recipe.id));return{id:recipe.id,name:recipe.name,family:recipe.family,sharedIngredientPeers:peers.length,connectedFamilies:familyConnections.size,qualifyingAnswerPools:answerRows.length,feasibleDecoyPools:decoyRows.length,validCandidateBoards:pool.boards.filter(p=>p.cards.some(c=>c.id===recipe.id)).length,scheduledAppearances:scheduled.get(recipe.id)||0,primaryExclusionReason:(scheduled.get(recipe.id)||0)?null:answerRows.length===0?'no_qualifying_answer_pool':decoyRows.length===0?'never_feasible_as_decoy':pool.boards.every(p=>!p.cards.some(c=>c.id===recipe.id))?'fails_board_quality_gates':'global_schedule_tradeoff'}}).sort((a,b)=>a.scheduledAppearances-b.scheduledAppearances||a.validCandidateBoards-b.validCandidateBoards);
}

function samples(puzzles){const chosen=[],used=new Set();while(chosen.length<5){const row=puzzles.filter(p=>!chosen.includes(p)).map(p=>({p,score:p.metrics.difficultyScore+p.metrics.distinctFamilies*10-p.cards.filter(c=>used.has(c.id)).length*30})).sort((a,b)=>b.score-a.score)[0];chosen.push(row.p);for(const c of row.p.cards)used.add(c.id)}return chosen}

const pool=candidatePool('hard');
if(pool.boards.length<TARGET)throw new Error(`Only ${pool.boards.length} quality-passing pilot candidates; required ${TARGET}`);
const puzzles=schedule('hard',pool),stats=diversity(puzzles);
const benchmark={status:'experimental_quality_v4',generatedAt:new Date().toISOString(),seedScheme:'SHA-256 labels + Mulberry32',catalog:{recipes:CATALOG.recipes.length,adjustedRecipes:CHANGED.size},rules:RULES.hard,poolTarget:POOL_TARGET,totalRuntimeMs:+(performance.now()-START).toFixed(1),answerPool:{attempts:pool.answerPool.attempts,candidates:pool.answerPool.candidates.length,rejectionReasons:pool.answerPool.rejects},boardPool:{attempts:pool.attempts,validCandidates:pool.boards.length,rejectionReasons:pool.rejects,runtimeMs:pool.runtimeMs},pilot:stats};
fs.writeFileSync(path.join(ROOT,'hard-pilot.json'),JSON.stringify(puzzles,null,2));
fs.writeFileSync(path.join(ROOT,'benchmark.json'),JSON.stringify(benchmark,null,2));
console.log(JSON.stringify({runtimeMs:benchmark.totalRuntimeMs,answerPools:benchmark.answerPool.candidates,validBoards:benchmark.boardPool.validCandidates,pilot:{recipeCoverage:stats.recipeCoverage,familyCoverage:stats.familyCoverage,ingredientCoverage:stats.ingredientCoverage,maximumRecipeFrequency:stats.maximumRecipeFrequency,adjacentOverlap:stats.adjacentOverlap.average,nearMiss:stats.nearMiss,deductionDepth:stats.deductionDepth}},null,2));
