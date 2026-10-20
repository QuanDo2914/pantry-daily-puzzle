// Diagnostic: substitute each new recipe into already-verified V3 answer groups.
// This is a guided search seed, not reuse of old puzzles or proof of a new board.
import fs from 'node:fs';
import {performance} from 'node:perf_hooks';
import {root,configs,libFor,newIds,sum,feasible,answerEligibility} from './guided-core.mjs';
const started=performance.now(),report={status:'v3_answer_substitution_diagnostic',runtimeMs:0,modes:{}};
for(const mode of ['medium','hard']){
 const lib=libFor(mode),byId=new Map(lib.map(row=>[row.id,row])),v3=JSON.parse(fs.readFileSync(new URL(`../quality-v3/${mode}-100.json`,root))),seen=new Set(),answers=[],reasons={};
 for(const board of v3){const old=board.solution.map(id=>byId.get(id));for(const added of lib.filter(row=>newIds.has(row.id)))for(let slot=0;slot<old.length;slot++){
  const answer=old.map((row,index)=>index===slot?added:row),key=answer.map(row=>row.id).sort().join('|');if(seen.has(key))continue;seen.add(key);
  const pantry=sum(answer),pantryTypes=Object.keys(pantry).length;
  if(pantryTypes>(mode==='hard'?18:13)||pantryTypes<(mode==='hard'?12:8)){reasons.pantry_range=(reasons.pantry_range||0)+1;continue}
  const answerIds=new Set(answer.map(row=>row.id)),decoys=lib.filter(row=>!answerIds.has(row.id)&&feasible(row,pantry));
  answers.push({answer,pantry,pantryTypes,decoys,key});
 }}
 const configsForMode=Object.entries(configs).filter(([,config])=>config.mode===mode),rows={};
 for(const [name,config] of configsForMode){const eligible=answers.filter(base=>!answerEligibility(base,config));rows[name]={eligible:eligible.length,newAnswerRecipeCoverage:new Set(eligible.flatMap(base=>base.answer.filter(row=>row.new).map(row=>row.id))).size,meanDecoys:+(eligible.reduce((s,base)=>s+base.decoys.length,0)/Math.max(1,eligible.length)).toFixed(2)};}
 report.modes[mode]={uniqueSubstitutions:seen.size,withinLoosePantryRange:answers.length,rejections:reasons,configs:rows};
}
report.runtimeMs=+(performance.now()-started).toFixed(1);
fs.writeFileSync(new URL('substitution-stage1.json',root),JSON.stringify(report,null,2));
console.log(JSON.stringify(report));
