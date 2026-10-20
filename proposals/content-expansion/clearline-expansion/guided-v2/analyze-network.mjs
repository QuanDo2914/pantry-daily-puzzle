import fs from 'node:fs';
import {performance} from 'node:perf_hooks';
import {catalog,configs,libFor,substitutionAnswers,answerEligibility,newIds,overlap} from '../guided-core.mjs';

const here=new URL('./',import.meta.url),cache=JSON.parse(fs.readFileSync(new URL('candidate-pools.json',here)));
const baseline=JSON.parse(fs.readFileSync(new URL('../baseline-recipe-diagnostics.json',here)));
const schedules=Object.fromEntries(['medium','hard'].map(mode=>[mode,JSON.parse(fs.readFileSync(new URL(`${mode}-25.json`,here)))]));
const focus=['miso_paste','orzo','halloumi','edamame','cauliflower','farro','bulgur','tempeh','gnocchi','feta','ricotta','bok_choy','scallions','tahini'];
const output={status:'measured_network_and_feasibility_unchanged_catalog',edgeDefinition:'at least two shared scored ingredients with at least one equal per-card quantity',modes:{}};

for(const mode of ['medium','hard']){
 const lib=libFor(mode),byId=new Map(lib.map(row=>[row.id,row])),config=configs[`${mode}_a`],substitutions=substitutionAnswers(mode,{deadline:performance.now()+8*60*1000}).answers;
 const eligible=substitutions.filter(base=>!answerEligibility(base,config)),candidates=cache.modes[mode].boards,scheduled=schedules[mode],edges=new Map(lib.map(row=>[row.id,[]]));
 const peerRows=[];
 for(let i=0;i<lib.length;i++)for(let j=i+1;j<lib.length;j++){
  const a=lib[i],b=lib[j],common=Object.keys(a.ingredients).filter(id=>id in b.ingredients),same=common.filter(id=>a.ingredients[id]===b.ingredients[id]);
  if(common.length>=2&&same.length>=1){edges.get(a.id).push(b.id);edges.get(b.id).push(a.id);peerRows.push({a:a.id,b:b.id,shared:common.length,matching: same.length,crossFamily:a.family!==b.family})}
 }
 const seen=new Set(),components=[];
 for(const recipe of lib){if(seen.has(recipe.id))continue;const queue=[recipe.id],group=[];seen.add(recipe.id);while(queue.length){const id=queue.pop();group.push(id);for(const other of edges.get(id))if(!seen.has(other)){seen.add(other);queue.push(other)}}components.push(group)}components.sort((a,b)=>b.length-a.length);
 const perRecipe=lib.map(recipe=>{
  const peers=edges.get(recipe.id).map(id=>byId.get(id)),sameFamily=peers.filter(other=>other.family===recipe.family).length;
  const thisSubstitutions=substitutions.filter(base=>base.newId===recipe.id),thisEligible=eligible.filter(base=>base.newId===recipe.id);
  const answerPools=eligible.filter(base=>base.answer.some(card=>card.id===recipe.id));
  const decoyPools=eligible.filter(base=>base.decoys.some(card=>card.id===recipe.id));
  const boardCandidates=candidates.filter(board=>board.cards.some(card=>card.id===recipe.id));
  const puzzleBoards=scheduled.filter(board=>board.cards.some(card=>card.id===recipe.id));
  const solutionBoards=scheduled.filter(board=>board.solution.includes(recipe.id));
  const rejectionCounts={};for(const base of thisSubstitutions){const reason=answerEligibility(base,config)||'eligible';rejectionCounts[reason]=(rejectionCounts[reason]||0)+1}
  const matchingQuantityEdges=peerRows.filter(row=>row.a===recipe.id||row.b===recipe.id).reduce((n,row)=>n+row.matching,0);
  const prior=baseline.modes[mode].recipes.find(row=>row.id===recipe.id);
  return{id:recipe.id,name:recipe.name,family:recipe.family,isNew:recipe.new,ingredientCount:Object.keys(recipe.ingredients).length,compatibleRecipes:peers.length,crossFamilyCompatible:peers.length-sameFamily,connectedFamilies:new Set(peers.map(other=>other.family)).size,overlapStrength:matchingQuantityEdges,
    substitutionAnswerSets:thisSubstitutions.length,eligibleSubstitutionAnswers:thisEligible.length,substitutionPantryTypeMean:+(thisSubstitutions.reduce((n,base)=>n+base.pantryTypes,0)/Math.max(1,thisSubstitutions.length)).toFixed(2),substitutionRejections:rejectionCounts,
    meanFeasibleDecoysWhenAnswer:+(answerPools.reduce((n,base)=>n+base.decoys.length,0)/Math.max(1,answerPools.length)).toFixed(2),quantityMismatchPeers:prior?.quantityMismatchPeers??null,lowDegreeIngredients:prior?.lowDegreeIngredients??[],baselineAnchorRejections:prior?.anchorRejectionReasons??null,
    qualifyingAnswerPools:answerPools.length,feasibleDecoyPools:decoyPools.length,qualityCandidateBoards:boardCandidates.length,appearedInValidPuzzle:puzzleBoards.length>0,validPuzzleAppearances:puzzleBoards.length,appearedInCorrectSolution:solutionBoards.length>0,correctSolutionAppearances:solutionBoards.length,
    primaryRemainingLimitation:thisEligible.length===0?'no_eligible_answer_set':boardCandidates.length===0?'board_quality_or_decoy_construction':puzzleBoards.length===0?'25_day_schedule_capacity':'represented'};
 });
 const clusters=focus.map(id=>{
  const members=lib.filter(recipe=>id in recipe.ingredients),memberIds=new Set(members.map(row=>row.id));
  return{ingredient:id,recipes:members.map(row=>row.id),families:[...new Set(members.map(row=>row.family))],compatiblePairs:peerRows.filter(row=>memberIds.has(row.a)&&memberIds.has(row.b)).length,crossFamilyCompatiblePairs:peerRows.filter(row=>memberIds.has(row.a)&&memberIds.has(row.b)&&row.crossFamily).length,eligibleAnswerSets:eligible.filter(base=>base.answer.some(card=>memberIds.has(card.id))).length,qualityCandidateBoards:candidates.filter(board=>board.cards.some(card=>memberIds.has(card.id))).length,scheduledBoards:scheduled.filter(board=>board.cards.some(card=>memberIds.has(card.id))).length};
 });
 output.modes[mode]={recipes:lib.length,edges:peerRows.length,crossFamilyEdges:peerRows.filter(row=>row.crossFamily).length,componentSizes:components.map(group=>group.length),smallComponents:components.filter(group=>group.length<=3),strongestRecipes:perRecipe.toSorted((a,b)=>b.compatibleRecipes-a.compatibleRecipes).slice(0,12).map(row=>({id:row.id,compatibleRecipes:row.compatibleRecipes})),weakestNewRecipes:perRecipe.filter(row=>row.isNew).toSorted((a,b)=>a.compatibleRecipes-b.compatibleRecipes).slice(0,15).map(row=>({id:row.id,compatibleRecipes:row.compatibleRecipes,eligibleAnswers:row.eligibleSubstitutionAnswers})),clusters,perRecipe};
}
fs.writeFileSync(new URL('network-and-recipe-feasibility.json',here),JSON.stringify(output,null,2));
const mediumById=new Map(output.modes.medium.perRecipe.map(row=>[row.id,row]));
const lines=['# Per-recipe feasibility — all 75 additions','','Measured on the unchanged candidate catalog. “Eligible” means a V3-answer substitution passed the approved pantry, decoy, and family-capacity filters. “Quality” means it appeared in a candidate board passing every generator gate. “Solution” counts appearances in the final 25-board schedule. Full per-recipe rejection counts and pantry measurements are in `network-and-recipe-feasibility.json`.','','| New recipe | Compatible peers M/H | Eligible answers M/H | Feasible decoy pools M/H | Quality boards M/H | Final solution M/H | Hard remaining limit |','|---|---:|---:|---:|---:|---:|---|'];
for(const hard of output.modes.hard.perRecipe.filter(row=>row.isNew)){const medium=mediumById.get(hard.id);lines.push(`| ${hard.name} | ${medium.compatibleRecipes}/${hard.compatibleRecipes} | ${medium.eligibleSubstitutionAnswers}/${hard.eligibleSubstitutionAnswers} | ${medium.feasibleDecoyPools}/${hard.feasibleDecoyPools} | ${medium.qualityCandidateBoards}/${hard.qualityCandidateBoards} | ${medium.correctSolutionAppearances}/${hard.correctSolutionAppearances} | ${hard.primaryRemainingLimitation.replaceAll('_',' ')} |`)}
fs.writeFileSync(new URL('recipe-feasibility.md',here),lines.join('\n')+'\n');
console.log(JSON.stringify({medium:{components:output.modes.medium.componentSizes.slice(0,8),edges:output.modes.medium.edges},hard:{components:output.modes.hard.componentSizes.slice(0,8),edges:output.modes.hard.edges},newHardRepresented:output.modes.hard.perRecipe.filter(row=>row.isNew&&row.appearedInValidPuzzle).length}));
