// One bounded second-level substitution pass, using the first pass's validated groups.
import fs from 'node:fs';
import {performance} from 'node:perf_hooks';
import {libFor,vectorIndex,sum,configs,answerEligibility,chooseDecoys,evaluate,qualityFailure,signature,rngFor,shuffle} from '../guided-core.mjs';
const out=new URL('./',import.meta.url),start=performance.now(),deadline=start+9*60*1000,mode='medium',config=configs.medium_a;
const cache=JSON.parse(fs.readFileSync(new URL('candidate-pools.json',out)));
if(cache.mediumExtension)throw Error('A bounded Medium extension already exists; do not repeat it');
fs.writeFileSync(new URL('first-pass-medium-85.json',out),fs.readFileSync(new URL('medium-100.json',out)));
const lib=libFor(mode),byId=new Map(lib.map(card=>[card.id,card])),index=vectorIndex(lib),random=rngFor('expanded-100-medium-extension-v1');
const seeds=[...new Map(cache.modes.medium.boards.map(board=>[board.solutionKey,board.solution.map(id=>byId.get(id))])).values()];
const seen=new Set(),eligible=[],fittingCache=new Map(),rejects={};let attempts=0;
outer:for(const seed of seeds)for(const replacement of lib)for(let slot=0;slot<3;slot++){
 if(performance.now()>deadline)break outer;attempts++;
 const answer=seed.map((card,i)=>i===slot?replacement:card);if(new Set(answer.map(card=>card.id)).size!==3||!answer.some(card=>card.new))continue;
 const key=answer.map(card=>card.id).sort().join('|');if(seen.has(key))continue;seen.add(key);
 const pantry=sum(answer),pantryTypes=Object.keys(pantry).length;if(pantryTypes<8||pantryTypes>12){rejects.pantry_range=(rejects.pantry_range||0)+1;continue}
 const pantryKey=Object.entries(pantry).sort(([a],[b])=>a.localeCompare(b)).map(([id,q])=>`${id}:${q}`).join('|');
 let fitting=fittingCache.get(pantryKey);if(!fitting){const vector=index.pantryVector(pantry);fitting=lib.filter(card=>index.canFit(card,vector));fittingCache.set(pantryKey,fitting)}
 const ids=new Set(answer.map(card=>card.id)),base={answer,pantry,pantryTypes,decoys:fitting.filter(card=>!ids.has(card.id)),key};const reason=answerEligibility(base,config);if(reason){rejects[reason]=(rejects[reason]||0)+1;continue}eligible.push(base);
}
const preparationMs=performance.now()-start,boards=cache.modes.medium.boards,initialCount=boards.length,structures=new Set(boards.map(board=>board.structuralSignature)),cardSets=new Set(boards.map(board=>board.cards.map(card=>card.id).sort().join('|'))),usage=new Map(),boardRejections={},evalCache=new Map();let boardAttempts=0;
for(const board of boards)for(const card of board.cards)usage.set(card.id,(usage.get(card.id)||0)+1);
outer:for(const base of shuffle(eligible,random))for(let trial=0;trial<4;trial++){
 if(performance.now()>deadline||boards.length>=1200)break outer;boardAttempts++;
 const decoys=chooseDecoys(base,config,random,usage);if(!decoys){boardRejections.decoy_selection=(boardRejections.decoy_selection||0)+1;continue}
 const cards=shuffle([...base.answer,...decoys],random),cardKey=cards.map(card=>card.id).sort().join('|'),key=`${base.key}|${cardKey}`;let metrics=evalCache.get(key);if(!metrics){metrics=evaluate(cards,base.pantry,base.answer,mode);evalCache.set(key,metrics)}
 const reason=qualityFailure(metrics,mode);if(reason){boardRejections[reason]=(boardRejections[reason]||0)+1;continue}
 if(cardSets.has(cardKey)){boardRejections.duplicate_card_set=(boardRejections.duplicate_card_set||0)+1;continue}const sig=signature(cards,base.pantry,metrics.solution,mode);if(structures.has(sig)){boardRejections.duplicate_structure=(boardRejections.duplicate_structure||0)+1;continue}
 cardSets.add(cardKey);structures.add(sig);const families=new Map();for(const card of cards)families.set(card.family,(families.get(card.family)||0)+1);
 boards.push({mode,pantry:base.pantry,cards:cards.map(({id,name,family,ingredients})=>({id,name,family,ingredients})),solution:metrics.solution,solutionKey:[...metrics.solution].sort().join('|'),structuralSignature:sig,metrics:{...metrics,ingredientTypes:base.pantryTypes,distinctFamilies:families.size,maxRecipesPerFamily:Math.max(...families.values())}});for(const card of cards)usage.set(card.id,(usage.get(card.id)||0)+1);
}
cache.mediumExtension={seedGroups:seeds.length,attempts,uniqueSubstitutions:seen.size,eligibleAnswerSets:eligible.length,preparationMs:+preparationMs.toFixed(1),answerRejections:rejects,boardAttempts,boardRejections,addedCandidates:boards.length-initialCount,totalCandidates:boards.length,uniqueSolutionGroups:new Set(boards.map(board=>board.solutionKey)).size,runtimeMs:+(performance.now()-start).toFixed(1),deadlineReached:performance.now()>deadline};
fs.writeFileSync(new URL('candidate-pools.json',out),JSON.stringify(cache));fs.writeFileSync(new URL('medium-extension-performance.json',out),JSON.stringify(cache.mediumExtension,null,2));console.log(JSON.stringify(cache.mediumExtension));
