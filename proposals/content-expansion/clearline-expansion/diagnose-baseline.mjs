import fs from 'node:fs';
import path from 'node:path';

const root=path.dirname(new URL(import.meta.url).pathname);
const catalog=JSON.parse(fs.readFileSync(path.join(root,'candidate-recipe-catalog.json'))).recipes;
const benchmark=JSON.parse(fs.readFileSync(path.join(root,'benchmark.json')));
const files=fs.readdirSync('/private/tmp').filter(name=>name.startsWith('pantry-expansion-answer-pool-')&&name.endsWith('.json'));
const pools=Object.fromEntries(files.map(name=>{const pool=JSON.parse(fs.readFileSync(`/private/tmp/${name}`));return[pool.candidates[0].answer.length===3?'medium':'hard',pool]}));
const output={baseline:'first bounded expansion pilot, unchanged catalog',generatedAt:new Date().toISOString(),modes:{}};

for(const mode of ['medium','hard']){
  const pool=pools[mode],boards=JSON.parse(fs.readFileSync(path.join(root,`${mode}-25.json`)));
  const lib=catalog.map(recipe=>({...recipe,ingredients:recipe.variants[mode]}));
  const ingredientDegree=new Map();for(const recipe of lib)for(const id of Object.keys(recipe.ingredients))ingredientDegree.set(id,(ingredientDegree.get(id)||0)+1);
  const rows=[];
  for(const recipe of lib.slice(150)){
    const own=recipe.ingredients,peers=lib.filter(other=>other.id!==recipe.id).map(other=>{
      const common=Object.keys(own).filter(id=>id in other.ingredients),same=common.filter(id=>own[id]===other.ingredients[id]);
      return{other,common,same};
    });
    const boardAppearances=boards.filter(board=>board.cards.some(card=>card.id===recipe.id));
    const stat=pool.anchorStats[recipe.id];
    const answerPools=pool.candidates.filter(candidate=>candidate.answer.some(card=>card.id===recipe.id));
    const decoyPools=pool.candidates.filter(candidate=>candidate.decoys.some(card=>card.id===recipe.id));
    const pantryFailureRate=+(stat.reasonCounts.pantry_range/stat.attempts||0).toFixed(3);
    rows.push({id:recipe.id,name:recipe.name,family:recipe.family,ingredientCount:Object.keys(own).length,
      appearedInValidPuzzle:boardAppearances.length>0,validPuzzleAppearances:boardAppearances.length,
      appearedInCorrectSolution:boards.some(board=>board.solution.includes(recipe.id)),
      compatibleRecipes:peers.filter(peer=>peer.common.length>=2&&peer.same.length>=1).length,
      compatibleOtherFamilies:new Set(peers.filter(peer=>peer.common.length>=2&&peer.same.length>=1).map(peer=>peer.other.family)).size,
      feasibleDecoyPools:decoyPools.length,qualifyingAnswerPools:answerPools.length,
      overlapStrength:+(peers.reduce((sum,peer)=>sum+peer.same.length,0)/peers.length).toFixed(2),
      sharedTwoOrMore:peers.filter(peer=>peer.common.length>=2).length,
      quantityMismatchPeers:peers.filter(peer=>peer.common.length>=2&&peer.same.length===0).length,
      lowDegreeIngredients:Object.keys(own).filter(id=>(ingredientDegree.get(id)||0)<=3),
      pantryFailureRate,anchorRejectionReasons:stat.reasonCounts,
      primaryLimitation:answerPools.length===0?(pantryFailureRate>=0.5?'pantry_range':'insufficient_feasible_decoys'):decoyPools.length===0?'decoy_incompatibility':boardAppearances.length===0?'board_quality_or_scheduling':'represented'});
  }
  output.modes[mode]={candidateAnswerPools:pool.candidates.length,attempts:pool.attempts,rejectionReasons:pool.rejects,boardRejectionReasons:benchmark.modes[mode].boardPool.rejectionReasons,recipes:rows};
}
fs.writeFileSync(path.join(root,'baseline-recipe-diagnostics.json'),JSON.stringify(output,null,2));
console.log(JSON.stringify({medium:output.modes.medium.recipes.filter(row=>row.appearedInValidPuzzle).length,hard:output.modes.hard.recipes.filter(row=>row.appearedInValidPuzzle).length,output:'baseline-recipe-diagnostics.json'}));
