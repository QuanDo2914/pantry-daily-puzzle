import fs from 'node:fs';
import crypto from 'node:crypto';
import {performance} from 'node:perf_hooks';

export const root=new URL('./',import.meta.url);
export const catalog=JSON.parse(fs.readFileSync(new URL('candidate-recipe-catalog.json',root))).recipes;
export const source=JSON.parse(fs.readFileSync(new URL('source-proposal.json',root)));
export const newIds=new Set(source.newRecipes.map(row=>row.id));
export const configs={
 medium_a:{mode:'medium',min:8,max:12,familyMin:6},
 medium_b:{mode:'medium',min:9,max:13,familyMin:6},
 hard_a:{mode:'hard',min:12,max:16,familyMin:7},
 hard_b:{mode:'hard',min:12,max:16,familyMin:8},
 hard_c:{mode:'hard',min:12,max:18,familyMin:7},
 hard_d:{mode:'hard',min:12,max:18,familyMin:8}
};
export const quality={medium:{cards:8,picks:3,near:2,plausible:5,competitive:4,depth:2,forced:2},hard:{cards:12,picks:4,near:3,plausible:12,competitive:7,depth:3,forced:1}};
const sha=x=>crypto.createHash('sha256').update(x).digest('hex');
export const rngFor=label=>{let a=Number.parseInt(sha(label).slice(0,8),16);return()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}};
export const shuffle=(rows,random)=>[...rows].map(row=>({row,key:random()})).sort((a,b)=>a.key-b.key).map(x=>x.row);
export const libFor=mode=>catalog.map((recipe,index)=>({id:recipe.id,name:recipe.name,family:recipe.family,ingredients:recipe.variants[mode],index,new:newIds.has(recipe.id)}));
export const sum=cards=>cards.reduce((out,card)=>(Object.entries(card.ingredients).forEach(([id,q])=>out[id]=(out[id]||0)+q),out),{});
export const feasible=(card,pantry)=>Object.entries(card.ingredients).every(([id,q])=>(pantry[id]||0)>=q);
export function vectorIndex(lib){
 const ingredientIds=[...new Set(lib.flatMap(card=>Object.keys(card.ingredients)))].sort(),positions=new Map(ingredientIds.map((id,index)=>[id,index]));
 const sparse=new Map(lib.map(card=>[card.id,Object.entries(card.ingredients).map(([id,qty])=>[positions.get(id),qty])]));
 const pantryVector=pantry=>{const vector=new Uint16Array(ingredientIds.length);for(const [id,qty] of Object.entries(pantry))vector[positions.get(id)]=qty;return vector};
 const canFit=(card,vector)=>sparse.get(card.id).every(([index,qty])=>vector[index]>=qty);
 return{ingredientIds,sparse,pantryVector,canFit};
}
export const familyCount=cards=>cards.reduce((map,card)=>(map.set(card.family,(map.get(card.family)||0)+1),map),new Map());
export const overlap=(a,b)=>{const set=new Set(a);return b.filter(id=>set.has(id)).length};
export const signature=(cards,pantry,solution,mode)=>{const answer=new Set(solution),ingredients=Object.keys(pantry);let labels=new Map();for(const id of ingredients)labels.set(`i:${id}`,`I:${pantry[id]}`);for(const card of cards)labels.set(`r:${card.id}`,`R:${answer.has(card.id)?1:0}:${Object.values(card.ingredients).sort((a,b)=>a-b)}`);for(let round=0;round<7;round++){const next=new Map();for(const id of ingredients)next.set(`i:${id}`,sha(`${labels.get(`i:${id}`)}|${cards.filter(card=>card.ingredients[id]).map(card=>`${card.ingredients[id]}:${labels.get(`r:${card.id}`)}`).sort().join('|')}`).slice(0,20));for(const card of cards)next.set(`r:${card.id}`,sha(`${labels.get(`r:${card.id}`)}|${Object.entries(card.ingredients).map(([id,q])=>`${q}:${labels.get(`i:${id}`)}`).sort().join('|')}`).slice(0,20));labels=next}return sha(`${mode}|${[...labels.values()].sort().join('|')}`).slice(0,20)};

// One seeded, compatibility-biased answer-set pass, shared by all pantry configurations.
export function constructAnswers(mode,{trialsPerAnchor=32,deadline=performance.now()+8*60*1000}={}){
 const lib=libFor(mode),rules=quality[mode],random=rngFor(`guided-expansion-v1:${mode}`),seen=new Set(),answers=[],stats={attempts:0,duplicate:0,anchorAppearances:{}};
 const common=(a,b)=>Object.keys(a.ingredients).filter(id=>id in b.ingredients);
 const ranked=new Map(lib.map(a=>[a.id,lib.filter(b=>a.id!==b.id&&a.family!==b.family).map(b=>{const shared=common(a,b),same=shared.filter(id=>a.ingredients[id]===b.ingredients[id]).length;return{card:b,score:shared.length*5+same*3-(Object.keys(b.ingredients).length-shared.length)*3}}).sort((x,y)=>y.score-x.score)]));
 for(const anchor of shuffle(lib,random))for(let trial=0;trial<trialsPerAnchor;trial++){
  if(performance.now()>deadline)return{answers,stats:{...stats,deadlineReached:true}};
  stats.attempts++;const chosen=[anchor],families=new Set([anchor.family]),ingredients=new Set(Object.keys(anchor.ingredients));
  while(chosen.length<rules.picks){
   const candidateIds=new Set();for(const card of chosen)for(const row of ranked.get(card.id).slice(0,55))candidateIds.add(row.card.id);
   const options=lib.filter(card=>candidateIds.has(card.id)&&!families.has(card.family)&&!chosen.includes(card)).map(card=>{
    const own=Object.keys(card.ingredients),shared=own.filter(id=>ingredients.has(id)).length,added=own.length-shared,matching=chosen.reduce((n,selected)=>n+own.filter(id=>selected.ingredients[id]===card.ingredients[id]).length,0);
    const variety=card.new?1:0;
    return{card,score:shared*5+matching*2-added*5+variety+random()*8};
   }).sort((a,b)=>b.score-a.score);
   if(!options.length)break;
   const window=Math.min(options.length,trial%4===0?35:trial%3===0?20:10),pick=options[Math.floor(random()*window)].card;
   chosen.push(pick);families.add(pick.family);for(const id of Object.keys(pick.ingredients))ingredients.add(id);
  }
  if(chosen.length!==rules.picks)continue;
  const key=chosen.map(card=>card.id).sort().join('|');if(seen.has(key)){stats.duplicate++;continue}seen.add(key);
  const pantry=sum(chosen),decoys=lib.filter(card=>!chosen.includes(card)&&feasible(card,pantry));
  answers.push({answer:chosen,pantry,decoys,key,pantryTypes:Object.keys(pantry).length,decoyFamilies:new Set(decoys.map(card=>card.family)).size});
  for(const card of chosen)stats.anchorAppearances[card.id]=(stats.anchorAppearances[card.id]||0)+1;
 }
 return{answers,stats:{...stats,deadlineReached:false}};
}

// A successful V3 answer set is a strong compatibility prior. Replacing one
// member with a new dish is far cheaper than random catalog-wide sampling,
// while every resulting pantry and board is rebuilt and independently tested.
export function substitutionAnswers(mode,{deadline=performance.now()+8*60*1000}={}){
 const lib=libFor(mode),byId=new Map(lib.map(card=>[card.id,card])),index=vectorIndex(lib),decoyCache=new Map();
 const baseline=JSON.parse(fs.readFileSync(new URL(`../quality-v3/${mode}-100.json`,root)));
 const additions=lib.filter(card=>card.new),seen=new Set(),answers=[],stats={attempts:0,duplicates:0,loosePantryRejected:0};
 for(const board of baseline){const old=board.solution.map(id=>byId.get(id));for(const added of additions)for(let slot=0;slot<old.length;slot++){
  if(performance.now()>deadline)return{answers,stats:{...stats,deadlineReached:true}};
  stats.attempts++;const answer=old.map((card,index)=>index===slot?added:card),key=answer.map(card=>card.id).sort().join('|');
  if(seen.has(key)){stats.duplicates++;continue}seen.add(key);
  const pantry=sum(answer),pantryTypes=Object.keys(pantry).length;
  if(pantryTypes<(mode==='hard'?12:8)||pantryTypes>(mode==='hard'?18:13)){stats.loosePantryRejected++;continue}
  const ids=new Set(answer.map(card=>card.id)),pantryKey=Object.entries(pantry).sort(([a],[b])=>a.localeCompare(b)).map(([id,qty])=>`${id}:${qty}`).join('|');
  let fitting=decoyCache.get(pantryKey);if(!fitting){const vector=index.pantryVector(pantry);fitting=lib.filter(card=>index.canFit(card,vector));decoyCache.set(pantryKey,fitting)}
  const decoys=fitting.filter(card=>!ids.has(card.id));
  answers.push({answer,pantry,pantryTypes,decoys,key,newId:added.id});
 }}
 return{answers,stats:{...stats,deadlineReached:false}};
}

export function answerEligibility(base,config){const rules=quality[config.mode],needed=rules.cards-rules.picks;
 if(base.pantryTypes<config.min||base.pantryTypes>config.max)return'pantry_range';
 if(base.decoys.length<needed)return'insufficient_decoys';
 const counts=familyCount(base.answer),capacity=new Map();for(const card of base.decoys){const room=Math.max(0,2-(counts.get(card.family)||0));if(room)capacity.set(card.family,Math.min(room,(capacity.get(card.family)||0)+1))}
 if([...capacity.values()].reduce((a,b)=>a+b,0)<needed)return'family_cap_capacity';
 if(new Set([...base.answer,...base.decoys].map(card=>card.family)).size<config.familyMin)return'insufficient_families';
 return null;
}

const combinations=(n,k)=>{const out=[];function visit(start,current){if(current.length===k){out.push([...current]);return}for(let index=start;index<=n-(k-current.length);index++){current.push(index);visit(index+1,current);current.pop()}}visit(0,[]);return out};
const comboCache={medium:combinations(8,3),hard:combinations(12,4)};
export function evaluate(cards,pantry,answer,mode){
 const rules=quality[mode],solutionSet=new Set(answer.map(card=>card.id)),pantryIds=Object.keys(pantry),rows=[];
 for(const indices of comboCache[mode]){const picked=indices.map(index=>cards[index]),used=sum(picked),distance=pantryIds.reduce((n,id)=>n+Math.abs((used[id]||0)-pantry[id]),0)+Object.keys(used).filter(id=>!(id in pantry)).reduce((n,id)=>n+used[id],0);rows.push({indices,recipeIds:picked.map(card=>card.id),used,distance,exact:distance===0,solutionOverlap:picked.filter(card=>solutionSet.has(card.id)).length})}
 const exact=rows.filter(row=>row.exact),near=rows.filter(row=>!row.exact&&row.distance<=4),plausible=rows.filter(row=>!row.exact&&row.distance<=6),oneSwap=plausible.filter(row=>row.solutionOverlap===rules.picks-1);
 const competitive=cards.filter(card=>!solutionSet.has(card.id)&&plausible.some(row=>row.recipeIds.includes(card.id))).map(card=>card.id),degrees=Object.fromEntries(pantryIds.map(id=>[id,cards.filter(card=>card.ingredients[id]).length]));
 const forced=answer.filter(card=>Object.keys(card.ingredients).some(id=>degrees[id]===1)).map(card=>card.id),shared=Object.values(degrees).filter(n=>n>=3).length;
 const singleFloor=Math.min(...pantryIds.map(id=>rows.filter(row=>row.used[id]===pantry[id]).length));
 let remaining=rows,available=[...pantryIds],depth=0;while(remaining.length>1&&available.length){const choices=available.map(id=>({id,subset:remaining.filter(row=>row.used[id]===pantry[id])})).filter(choice=>choice.subset.some(row=>row.exact)).sort((a,b)=>a.subset.length-b.subset.length);if(!choices[0]||choices[0].subset.length===remaining.length)break;remaining=choices[0].subset;available=available.filter(id=>id!==choices[0].id);depth++}
 let edges=0;for(let i=0;i<cards.length;i++)for(let j=i+1;j<cards.length;j++)if(overlap(Object.keys(cards[i].ingredients),Object.keys(cards[j].ingredients))>=2)edges++;
 const density=edges/(cards.length*(cards.length-1)/2),score=near.length*2+plausible.length+competitive.length*3+oneSwap.length*2+shared*2+density*20+depth*4-forced.length*15;
 return{combinations:rows.length,solutionCount:exact.length,solution:exact[0]?.recipeIds||[],nearMissCount:near.length,plausibleAlternatives:plausible.length,oneSwapNearMisses:oneSwap.length,competitiveDecoyIds:competitive,forcedRecipeIds:forced,sharedIngredientCount:shared,ingredientDegrees:degrees,overlapDensity:+density.toFixed(3),singleIngredientCandidateFloor:singleFloor,deductionSteps:depth,difficultyScore:+score.toFixed(1)};
}
export function qualityFailure(metrics,mode){const rules=quality[mode];if(metrics.solutionCount!==1)return metrics.solutionCount?'multiple_solutions':'no_solution';if(metrics.nearMissCount<rules.near)return'too_few_near_misses';if(metrics.plausibleAlternatives<rules.plausible)return'too_few_plausible_alternatives';if(metrics.competitiveDecoyIds.length<rules.competitive)return'irrelevant_decoys';if(metrics.forcedRecipeIds.length>rules.forced)return'obvious_forced_recipe';if(metrics.deductionSteps<rules.depth)return'shallow_constraint_depth';if(mode==='hard'&&metrics.singleIngredientCandidateFloor<=1)return'single_ingredient_reveal';if(mode==='hard'&&metrics.oneSwapNearMisses<2)return'too_few_close_swaps';if(mode==='hard'&&metrics.sharedIngredientCount<5)return'weak_constraint_network';return null}

export function chooseDecoys(base,config,random,usage){const needed=quality[config.mode].cards-quality[config.mode].picks,answer=base.answer;
 for(let attempt=0;attempt<80;attempt++){
  const chosen=[],counts=familyCount(answer);
  while(chosen.length<needed){const current=[...answer,...chosen],families=new Set(current.map(card=>card.family)),slots=needed-chosen.length,missing=Math.max(0,config.familyMin-families.size);
   const options=base.decoys.filter(card=>!chosen.includes(card)&&(counts.get(card.family)||0)<2&&(missing>=slots?!families.has(card.family):true)).map(card=>{
    const links=answer.map(other=>overlap(Object.keys(card.ingredients),Object.keys(other.ingredients)));
    return{card,score:(families.has(card.family)?0:9)+Math.max(...links)*3+links.reduce((a,b)=>a+b,0)*2-(usage.get(card.id)||0)*3+random()*7};
   }).sort((a,b)=>b.score-a.score);
   if(!options.length)break;
   const pick=options[Math.floor(random()*Math.min(8,options.length))].card;chosen.push(pick);counts.set(pick.family,(counts.get(pick.family)||0)+1);
  }
  if(chosen.length===needed&&new Set([...answer,...chosen].map(card=>card.family)).size>=config.familyMin)return chosen;
 }
 return null;
}
