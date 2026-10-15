import { MODE_RULES, consumption, inventoryState, validateSelection, enumerateSolutions, formatTime } from './game/engine.js';
import { INGREDIENTS } from './data/catalog.js';

const LAUNCH='2026-10-14'; const KEY='pantry-v1';
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const todayUTC=()=>new Date().toISOString().slice(0,10);
const dayFor=date=>Math.floor((Date.parse(date+'T00:00:00Z')-Date.parse(LAUNCH+'T00:00:00Z'))/86400000)+1;
const safeLoad=()=>{try{return JSON.parse(localStorage.getItem(KEY))||{}}catch{return {}}};
let store=safeLoad(); store.settings??={theme:'system',motion:false,timer:true}; store.progress??={}; store.stats??={medium:blankStats(),hard:blankStats()};
let mode=store.preferredMode||'medium', puzzle=null, progress=null, tick=null, undoStack=[];
function blankStats(){return {played:0,solved:0,currentStreak:0,bestStreak:0,totalTime:0,totalHints:0,recent:[],lastSolvedDay:null}}
function save(){localStorage.setItem(KEY,JSON.stringify(store))}
function pkey(){return `${puzzle.id}:${mode}`}
function fresh(){return {selected:[],elapsed:0,hints:0,status:'active',date:todayUTC(),lastTick:Date.now()}}
function applyTheme(){document.documentElement.dataset.theme=store.settings.theme;document.documentElement.classList.toggle('reduce-motion',store.settings.motion);$('#timer').hidden=!store.settings.timer}
function toast(msg){const t=$('#toast');t.textContent=msg;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2200)}

async function loadMode(next){
  mode=next;store.preferredMode=mode;save();stopTimer();undoStack=[];
  $$('.mode-switch button').forEach(b=>{b.setAttribute('aria-selected',b.dataset.mode===mode);b.classList.toggle('active',b.dataset.mode===mode)});
  $('#loading').hidden=false;$('#game').hidden=true;$('#unavailable').hidden=true;
  const day=dayFor(todayUTC()); $('#day-label').textContent=`Pantry #${day} · resets 00:00 UTC`;
  try{const res=await fetch(`/puzzles/${mode}/${day}.json`,{cache:'no-store'});if(!res.ok)throw Error();puzzle=await res.json()}
  catch{$('#loading').hidden=true;$('#unavailable').hidden=false;return}
  progress=store.progress[pkey()]||fresh();store.progress[pkey()]=progress;save();
  $('#loading').hidden=true;$('#game').hidden=false;render();startTimer();updateModeBadges();
}

function render(){
  const rules=MODE_RULES[mode], used=consumption(puzzle.recipes,progress.selected), states=inventoryState(puzzle.pantry,used);
  $('#pick-target').textContent=rules.picks;$('#pick-count').textContent=`${progress.selected.length} / ${rules.picks}`;$('#timer').textContent=formatTime(progress.elapsed);
  $('#pick-dots').innerHTML=Array.from({length:rules.picks},(_,i)=>`<i class="${i<progress.selected.length?'filled':''}"></i>`).join('');
  $('#inventory').innerHTML=Object.entries(states).map(([id,s])=>ingredientRow(id,s)).join('');
  $('#recipes').innerHTML=puzzle.recipes.map((r,i)=>recipeCard(r,i,progress.selected.includes(r.id))).join('');
  $('#hints').innerHTML=puzzle.hints.slice(0,progress.hints).map((h,i)=>`<div class="hint"><b>Hint ${i+1}</b><p>${h}</p></div>`).join('');
  const over=Object.values(states).filter(s=>s.status==='overused').length, complete=Object.values(states).filter(s=>s.status==='complete').length;
  $('#pantry-help').textContent=over?`${over} ingredient${over>1?'s are':' is'} over the limit.`:complete?`${complete} of ${Object.keys(states).length} ingredients perfectly used.`:'Select dishes to see what they use.';
  $('#selection-feedback').textContent=progress.status==='revealed'?'Solution revealed — this result is final.':progress.status==='solved'?'Perfectly balanced. Every ingredient is used.':progress.selected.length===rules.picks?(over?'This menu overuses part of the pantry.':'Close—but something is still left over.'):'Every ingredient must land exactly on its target.';
  const locked=progress.status!=='active'; $$('#recipes button').forEach(b=>b.disabled=locked);$('#hint-btn').disabled=locked||progress.hints>=3;$('#reveal-btn').disabled=locked;$('#reset-btn').disabled=locked||!progress.selected.length;$('#undo-btn').disabled=locked||!undoStack.length;
}
function ingredientRow(id,s){const meta=INGREDIENTS[id]||[id,'•'];const over=s.remaining<0;return `<div class="ingredient ${s.status}"><span class="ingredient-icon">${meta[1]}</span><span class="ingredient-name"><b>${meta[0]}</b><small>${s.status==='unused'?'Not used':s.status==='partial'?`${s.remaining} left`:s.status==='complete'?'Complete':`${Math.abs(s.remaining)} over`}</small></span><div class="meter"><i style="width:${Math.min(100,s.consumed/s.available*100)}%"></i></div><strong>${s.consumed}/${s.available}${over?' !':''}</strong></div>`}
function recipeCard(r,i,selected){return `<button class="recipe ${selected?'selected':''}" data-id="${r.id}" aria-pressed="${selected}"><div class="recipe-art art-${r.category}"><span>${r.name.split(' ').map(x=>x[0]).slice(0,2).join('')}</span><i></i><i></i></div><div class="recipe-copy"><div class="recipe-title"><span class="card-no">${String(i+1).padStart(2,'0')}</span><h3>${r.name}</h3><i class="check">✓</i></div><ul>${Object.entries(r.ingredients).map(([id,q])=>`<li><span>${INGREDIENTS[id]?.[0]||id}</span><b>×${q}</b></li>`).join('')}</ul></div></button>`}

function toggleRecipe(id){
  if(progress.status!=='active')return;const rules=MODE_RULES[mode];undoStack.push([...progress.selected]);
  if(progress.selected.includes(id))progress.selected=progress.selected.filter(x=>x!==id);
  else if(progress.selected.length<rules.picks)progress.selected.push(id);else {undoStack.pop();toast(`Choose only ${rules.picks} dishes. Remove one first.`);return}
  save();render();const result=validateSelection(puzzle,progress.selected);if(result.win)win();
}
function win(){progress.status='solved';progress.completedAt=Date.now();const stats=store.stats[mode];stats.played++;stats.solved++;stats.totalTime+=progress.elapsed;stats.totalHints+=progress.hints;
  const d=puzzle.day;if(stats.lastSolvedDay===d-1)stats.currentStreak++;else if(stats.lastSolvedDay!==d)stats.currentStreak=1;stats.bestStreak=Math.max(stats.bestStreak,stats.currentStreak);stats.lastSolvedDay=d;
  stats.recent.unshift({day:d,status:'solved',time:progress.elapsed,hints:progress.hints});stats.recent=stats.recent.slice(0,10);save();render();updateModeBadges();showResult()}
function reveal(){if(!confirm('Reveal today’s solution? This will finalize the puzzle as revealed and will not count toward your streak.'))return;const solution=enumerateSolutions(puzzle)[0];progress.selected=solution;progress.status='revealed';progress.completedAt=Date.now();const s=store.stats[mode];s.played++;s.recent.unshift({day:puzzle.day,status:'revealed',time:progress.elapsed,hints:progress.hints});s.recent=s.recent.slice(0,10);save();render();updateModeBadges();toast('Solution revealed. Your streak was not changed.')}

function startTimer(){stopTimer();if(progress?.status!=='active')return;progress.lastTick=Date.now();tick=setInterval(()=>{if(!document.hidden){progress.elapsed++;progress.lastTick=Date.now();$('#timer').textContent=formatTime(progress.elapsed);if(progress.elapsed%5===0)save()}},1000)}
function stopTimer(){clearInterval(tick);tick=null;if(progress)save()}
function updateModeBadges(){for(const m of ['medium','hard']){const key=`pantry-${String(dayFor(todayUTC())).padStart(3,'0')}-${m}:${m}`;const s=store.progress[key]?.status;const el=$(`#mode-${m} .mode-status`);el.textContent=s==='solved'?'✓':s==='revealed'?'•':'';el.className=`mode-status ${s||''}`}}

function showResult(){const s=store.stats[mode];$('#result-title').textContent='A perfect menu.';$('#result-copy').textContent=`You used every ingredient with nothing left over in today’s ${mode} pantry.`;$('#result-stats').innerHTML=`<div><b>${formatTime(progress.elapsed)}</b><small>Time</small></div><div><b>${progress.hints}</b><small>Hints</small></div><div><b>${s.currentStreak}</b><small>Day streak</small></div>`;$('#result-dialog').showModal();updateCountdown()}
function updateCountdown(){const now=new Date(),next=new Date(Date.UTC(now.getUTCFullYear(),now.getUTCMonth(),now.getUTCDate()+1));const sec=Math.max(0,Math.floor((next-now)/1000));$('#countdown').textContent=`Next pantry in ${Math.floor(sec/3600)}h ${Math.floor(sec%3600/60)}m`}
function share(){const s=store.stats[mode],icon=mode==='medium'?'M':'H';const text=`Pantry #${puzzle.day} ${icon}\n${mode[0].toUpperCase()+mode.slice(1)}: Solved\n${formatTime(progress.elapsed)} · ${progress.hints} hint${progress.hints===1?'':'s'}\n${s.currentStreak}-day streak\n${location.origin}`;if(navigator.share)navigator.share({title:'Pantry',text}).catch(()=>{});else navigator.clipboard.writeText(text).then(()=>toast('Spoiler-free result copied!'))}
function openStats(statMode=mode){const s=store.stats[statMode];$$('[data-stat-mode]').forEach(b=>b.classList.toggle('active',b.dataset.statMode===statMode));const pct=s.played?Math.round(s.solved/s.played*100):0,avg=s.solved?Math.round(s.totalTime/s.solved):0;$('#stats-grid').innerHTML=[['Played',s.played],['Solved',s.solved],['Complete',pct+'%'],['Current streak',s.currentStreak],['Best streak',s.bestStreak],['Average',formatTime(avg)],['Hints used',s.totalHints]].map(([k,v])=>`<div><b>${v}</b><small>${k}</small></div>`).join('');$('#recent-results').innerHTML='<h3>Recent results</h3>'+(s.recent.length?s.recent.map(r=>`<p><span>Pantry #${r.day}</span><b>${r.status==='solved'?'Solved · '+formatTime(r.time):'Revealed'}</b></p>`).join(''):'<p class="muted">Complete a puzzle to begin your history.</p>');$('#stats-dialog').showModal()}

const tutorialSteps=[
  ['A pantry with a purpose','Your pantry shows exactly what must be used. The counter starts at 0 and the target sits on the right.'],
  ['Build a menu','Tap a recipe card to select it. Ingredient counters update instantly, so you can see what remains.'],
  ['Read every signal','Green means complete, a partial bar means there is more to use, and red explicitly shows when you are over.'],
  ['Use everything. Waste nothing.','Choose the exact number of dishes and land every counter on its target. There are no lives—change your menu as often as you like.']];let tutorialIndex=0;
function openTutorial(){tutorialIndex=0;renderTutorial();$('#tutorial-dialog').showModal()}
function renderTutorial(){const [title,copy]=tutorialSteps[tutorialIndex];$('#tutorial-content').innerHTML=`<div class="tutorial-visual step-${tutorialIndex}"><div class="mini-pantry"><i></i><i></i><i></i></div><div class="mini-card"><span></span><b></b><b></b></div></div><h2>${title}</h2><p>${copy}</p>`;$('#tutorial-dots').innerHTML=tutorialSteps.map((_,i)=>`<i class="${i===tutorialIndex?'active':''}"></i>`).join('');$('#tutorial-next').textContent=tutorialIndex===tutorialSteps.length-1?'Start playing':'Next'}
function nextTutorial(){if(tutorialIndex<tutorialSteps.length-1){tutorialIndex++;renderTutorial()}else{store.tutorialDone=true;save();$('#tutorial-dialog').close()}}

document.addEventListener('click',e=>{const card=e.target.closest('.recipe');if(card)toggleRecipe(card.dataset.id);const m=e.target.closest('[data-mode]');if(m)loadMode(m.dataset.mode);if(e.target.matches('[data-close]'))e.target.closest('dialog').close()});
$('#undo-btn').onclick=()=>{if(undoStack.length){progress.selected=undoStack.pop();save();render()}};$('#reset-btn').onclick=()=>{undoStack.push([...progress.selected]);progress.selected=[];save();render()};
$('#hint-btn').onclick=()=>{if(progress.hints<3){progress.hints++;save();render();toast(`Hint ${progress.hints} revealed`)}};$('#reveal-btn').onclick=reveal;$('#share-btn').onclick=share;
$('#stats-btn').onclick=()=>openStats();$$('[data-stat-mode]').forEach(b=>b.onclick=()=>openStats(b.dataset.statMode));$('#settings-btn').onclick=()=>$('#settings-dialog').showModal();
$('#theme-select').onchange=e=>{store.settings.theme=e.target.value;save();applyTheme()};$('#motion-toggle').onchange=e=>{store.settings.motion=e.target.checked;save();applyTheme()};$('#timer-toggle').onchange=e=>{store.settings.timer=e.target.checked;save();applyTheme()};
$('#tutorial-btn').onclick=openTutorial;$('#tutorial-next').onclick=nextTutorial;$('#skip-tutorial').onclick=()=>{store.tutorialDone=true;save();$('#tutorial-dialog').close()};
document.addEventListener('visibilitychange',()=>{if(document.hidden)stopTimer();else startTimer()});window.addEventListener('beforeunload',stopTimer);
for(const d of $$('dialog'))d.addEventListener('click',e=>{if(e.target===d)d.close()});
$('#theme-select').value=store.settings.theme;$('#motion-toggle').checked=store.settings.motion;$('#timer-toggle').checked=store.settings.timer;applyTheme();loadMode(mode);if(!store.tutorialDone)setTimeout(openTutorial,450);if('serviceWorker'in navigator)navigator.serviceWorker.register('/sw.js').catch(()=>{});
