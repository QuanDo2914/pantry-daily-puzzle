// Bounded diagnostic on the unchanged expansion catalog. No puzzle files are replaced.
import fs from 'node:fs';
import {performance} from 'node:perf_hooks';
import {root,configs,quality,constructAnswers,answerEligibility,chooseDecoys,evaluate,qualityFailure,rngFor,shuffle,newIds} from './guided-core.mjs';

const started=performance.now(),deadline=started+8*60*1000,answerSets={};
for(const mode of ['medium','hard'])answerSets[mode]=constructAnswers(mode,{trialsPerAnchor:32,deadline});
const report={status:'guided_stage1_unchanged_catalog',runtimeMs:0,answerConstruction:Object.fromEntries(Object.entries(answerSets).map(([mode,result])=>[mode,{attempts:result.stats.attempts,uniqueAnswerSets:result.answers.length,deadlineReached:result.stats.deadlineReached}])),configs:{}};
for(const [name,config] of Object.entries(configs)){
 const {answers}=answerSets[config.mode],counts={},eligible=[];
 for(const base of answers){const reason=answerEligibility(base,config);counts[reason||'eligible']=(counts[reason||'eligible']||0)+1;if(!reason)eligible.push(base)}
 const random=rngFor(`guided-stage1:${name}`),usage=new Map(),qualityCounts={},valid=[],sample=shuffle(eligible,random).slice(0,Math.min(120,eligible.length));
 for(const base of sample){if(performance.now()>deadline)break;const decoys=chooseDecoys(base,config,random,usage);if(!decoys){qualityCounts.decoy_selection=(qualityCounts.decoy_selection||0)+1;continue}
  const cards=shuffle([...base.answer,...decoys],random),metrics=evaluate(cards,base.pantry,base.answer,config.mode),reason=qualityFailure(metrics,config.mode);
  qualityCounts[reason||'accepted']=(qualityCounts[reason||'accepted']||0)+1;
  if(!reason){valid.push({cards,pantry:base.pantry,solution:metrics.solution,metrics});for(const card of cards)usage.set(card.id,(usage.get(card.id)||0)+1)}
 }
 const unique=(rows,key)=>new Set(rows.flatMap(row=>row[key])).size;
 report.configs[name]={rules:config,answerSetsExamined:answers.length,answerRejections:counts,answerAcceptanceRate:+((eligible.length/answers.length)||0).toFixed(4),eligibleAnswerSets:eligible.length,eligibleAnswerRecipeCoverage:unique(eligible.map(base=>({cards:base.answer})).map(row=>({ids:row.cards.map(card=>card.id)})),'ids'),
  feasibleDecoyMean:+(eligible.reduce((sum,base)=>sum+base.decoys.length,0)/Math.max(1,eligible.length)).toFixed(2),boardAttempts:sample.length,boardRejections:qualityCounts,qualityBoards:valid.length,
  qualityRecipeCoverage:unique(valid.map(row=>({ids:row.cards.map(card=>card.id)})),'ids'),qualityNewRecipeCoverage:new Set(valid.flatMap(row=>row.cards.filter(card=>newIds.has(card.id)).map(card=>card.id))).size,
  familyCoverage:new Set(valid.flatMap(row=>row.cards.map(card=>card.family))).size,
  averagePantryTypes:+(valid.reduce((sum,row)=>sum+Object.keys(row.pantry).length,0)/Math.max(1,valid.length)).toFixed(2),
  uniqueSolutionRate:+(sample.filter(base=>base).length?valid.length/sample.length:0).toFixed(4),
  averageNearMisses:+(valid.reduce((sum,row)=>sum+row.metrics.nearMissCount,0)/Math.max(1,valid.length)).toFixed(2),
  averageDeductionSteps:+(valid.reduce((sum,row)=>sum+row.metrics.deductionSteps,0)/Math.max(1,valid.length)).toFixed(2)};
}
report.runtimeMs=+(performance.now()-started).toFixed(1);
fs.writeFileSync(new URL('guided-stage1.json',root),JSON.stringify(report,null,2));
console.log(JSON.stringify({runtimeMs:report.runtimeMs,answers:report.answerConstruction,configs:Object.fromEntries(Object.entries(report.configs).map(([name,row])=>[name,{eligible:row.eligibleAnswerSets,qualityBoards:row.qualityBoards,newRecipes:row.qualityNewRecipeCoverage}]))}));
