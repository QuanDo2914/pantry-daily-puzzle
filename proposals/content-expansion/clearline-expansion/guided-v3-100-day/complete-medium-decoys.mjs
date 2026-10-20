// Targeted completion: new dishes may be competitive decoys as well as answers.
// Requiring a new recipe in every correct answer was an extra search restriction,
// not a gameplay rule. All quality gates and canonical definitions stay unchanged.
import fs from 'node:fs';
import {performance} from 'node:perf_hooks';
import {libFor,vectorIndex,sum,configs,answerEligibility,chooseDecoys,evaluate,qualityFailure,signature,rngFor,shuffle} from '../guided-core.mjs';
const out=new URL('./',import.meta.url),start=performance.now(),deadline=start+9*60*1000,cache=JSON.parse(fs.readFileSync(new URL('candidate-pools.json',out)));
if(cache.mediumDecoyCompletion)throw Error('Targeted completion already performed');
const lib=libFor('medium'),byId=new Map(lib.map(card=>[card.id,card])),index=vectorIndex(lib),config=configs.medium_a,random=rngFor('expanded100-medium-new-decoys-v1');
const seeds=JSON.parse(fs.readFileSync(new URL('seed-answer-groups.json',out))).modes.medium.groups.map(ids=>({answer:ids.map(id=>byId.get(id))}));
const boards=cache.modes.medium.boards,initial=boards.length,cardSets=new Set(boards.map(board=>board.cards.map(card=>card.id).sort().join('|'))),structures=new Set(boards.map(board=>board.structuralSignature)),v3=JSON.parse(fs.readFileSync(new URL('../../quality-v3/medium-100.json',out))),oldCardSets=new Set(v3.map(board=>board.cards.map(card=>card.id).sort().join('|'))),usage=new Map(),rejects={};let qualifying=0,attempts=0;
for(const seed of seeds){if(performance.now()>deadline)break;const answer=seed.answer.map(card=>byId.get(card.id)),pantry=sum(answer),vector=index.pantryVector(pantry),ids=new Set(answer.map(card=>card.id)),decoys=lib.filter(card=>!ids.has(card.id)&&index.canFit(card,vector)),base={answer,pantry,pantryTypes:Object.keys(pantry).length,decoys,key:answer.map(card=>card.id).sort().join('|')};
 if(!decoys.some(card=>card.new)||answerEligibility(base,config))continue;qualifying++;
 for(let trial=0;trial<12;trial++){attempts++;const selected=chooseDecoys(base,config,random,usage);if(!selected||!selected.some(card=>card.new)){rejects.no_new_decoy=(rejects.no_new_decoy||0)+1;continue}
  const cards=shuffle([...answer,...selected],random),key=cards.map(card=>card.id).sort().join('|'),metrics=evaluate(cards,pantry,answer,'medium'),reason=qualityFailure(metrics,'medium');if(reason){rejects[reason]=(rejects[reason]||0)+1;continue}
  const sig=signature(cards,pantry,metrics.solution,'medium');if(cardSets.has(key)||oldCardSets.has(key)||structures.has(sig)){rejects.duplicate=(rejects.duplicate||0)+1;continue}cardSets.add(key);structures.add(sig);const families=new Map();for(const card of cards)families.set(card.family,(families.get(card.family)||0)+1);
  boards.push({mode:'medium',pantry,cards:cards.map(({id,name,family,ingredients})=>({id,name,family,ingredients})),solution:metrics.solution,solutionKey:[...metrics.solution].sort().join('|'),structuralSignature:sig,metrics:{...metrics,ingredientTypes:base.pantryTypes,distinctFamilies:families.size,maxRecipesPerFamily:Math.max(...families.values())}});for(const card of cards)usage.set(card.id,(usage.get(card.id)||0)+1);
 }
}
cache.mediumDecoyCompletion={qualifyingAnswerGroups:qualifying,attempts,rejections:rejects,addedCandidates:boards.length-initial,totalCandidates:boards.length,uniqueSolutionGroups:new Set(boards.map(board=>board.solutionKey)).size,runtimeMs:+(performance.now()-start).toFixed(1)};
fs.writeFileSync(new URL('candidate-pools.json',out),JSON.stringify(cache));fs.writeFileSync(new URL('medium-decoy-completion.json',out),JSON.stringify(cache.mediumDecoyCompletion,null,2));console.log(JSON.stringify(cache.mediumDecoyCompletion));
