// Six bounded configurations; the four non-baseline ranges are diagnostics only.
import fs from 'node:fs';
import {performance} from 'node:perf_hooks';
import {root,configs,substitutionAnswers,answerEligibility,chooseDecoys,evaluate,qualityFailure,rngFor,shuffle,newIds} from './guided-core.mjs';
const started=performance.now(),deadline=started+8*60*1000;
const pools={medium:substitutionAnswers('medium',{deadline}),hard:substitutionAnswers('hard',{deadline})};
const report={status:'substitution_quality_sweep_unchanged_catalog',runtimeMs:0,modes:Object.fromEntries(Object.entries(pools).map(([mode,pool])=>[mode,pool.stats])),configs:{}};
for(const [name,config] of Object.entries(configs)){
 const answers=pools[config.mode].answers,eligible=answers.filter(base=>!answerEligibility(base,config)),random=rngFor(`substitution-quality:${name}`),usage=new Map(),rejections={},valid=[];
 // Uniform across new recipe IDs: never let common anchors dominate the diagnostic.
 const groups=Object.groupBy(eligible,base=>base.newId),order=shuffle(Object.keys(groups),random),sample=[];
 for(let round=0;sample.length<Math.min(150,eligible.length)&&round<50;round++)for(const id of order){const candidate=groups[id]?.[round];if(candidate)sample.push(candidate);if(sample.length>=150)break}
 for(const base of sample){if(performance.now()>deadline)break;const decoys=chooseDecoys(base,config,random,usage);if(!decoys){rejections.decoy_selection=(rejections.decoy_selection||0)+1;continue}
  const cards=shuffle([...base.answer,...decoys],random),metrics=evaluate(cards,base.pantry,base.answer,config.mode),reason=qualityFailure(metrics,config.mode);rejections[reason||'accepted']=(rejections[reason||'accepted']||0)+1;
  if(!reason){valid.push({cards,pantry:base.pantry,solution:metrics.solution,metrics});for(const card of cards)usage.set(card.id,(usage.get(card.id)||0)+1)}
 }
 const avg=(key)=>+(valid.reduce((n,row)=>n+row.metrics[key],0)/Math.max(1,valid.length)).toFixed(2);
 report.configs[name]={rules:config,eligibleAnswerSets:eligible.length,answerAcceptanceRate:+(eligible.length/answers.length).toFixed(4),eligibleNewRecipeCoverage:new Set(eligible.map(base=>base.newId)).size,feasibleDecoyMean:+(eligible.reduce((n,base)=>n+base.decoys.length,0)/Math.max(1,eligible.length)).toFixed(2),boardAttempts:sample.length,boardRejections:rejections,validQualityBoards:valid.length,qualityAcceptanceRate:+(valid.length/Math.max(1,sample.length)).toFixed(4),recipeCoverage:new Set(valid.flatMap(row=>row.cards.map(card=>card.id))).size,newRecipeCoverage:new Set(valid.flatMap(row=>row.cards.filter(card=>newIds.has(card.id)).map(card=>card.id))).size,familyCoverage:new Set(valid.flatMap(row=>row.cards.map(card=>card.family))).size,averagePantryTypes:+(valid.reduce((n,row)=>n+Object.keys(row.pantry).length,0)/Math.max(1,valid.length)).toFixed(2),averageNearMisses:avg('nearMissCount'),averageDeductionSteps:avg('deductionSteps'),uniquenessRate:+(valid.filter(row=>row.metrics.solutionCount===1).length/Math.max(1,valid.length)).toFixed(3)};
}
report.runtimeMs=+(performance.now()-started).toFixed(1);
fs.writeFileSync(new URL('substitution-quality-sweep.json',root),JSON.stringify(report,null,2));
console.log(JSON.stringify({runtimeMs:report.runtimeMs,configs:Object.fromEntries(Object.entries(report.configs).map(([name,row])=>[name,{eligible:row.eligibleAnswerSets,valid:row.validQualityBoards,newRecipes:row.newRecipeCoverage}]))}));
