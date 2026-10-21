import { MODE_RULES, validateSelection, enumerateSolutions, formatTime } from './game/engine.js';
import { utcDate, dateMillis, DAY, countdown, blankProgress, progressKey, loadStore, saveStore, statistics, shareText } from './game/daily.js';

const $ = s => document.querySelector(s);
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const ingredientName = id => id.split('_').map(s => s === 'bbq' ? 'BBQ' : s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
const ingredientArt = (id, name) => `<img class="ingredient-art" src="${board.art.ingredients[id]}" alt="${esc(name)}" width="48" height="48" decoding="async">`;
const recipeArt = recipe => `<img class="dish-art" src="${board.art.recipes[recipe.id]}" alt="${esc(recipe.name)} prepared dish" width="112" height="90" decoding="async">`;
let mode = 'medium', board, store, storage, readOnly = false, progress, loaded = false, previewDay = null, offset = 0, loading = false, request = 0, lastTick = Date.now(), creditedDate;
let activeVisible = !document.hidden;
const now = () => Date.now() + offset;
const say = message => { $('#message').textContent = message; };
function warn(text) { $('#warning').hidden = !text; $('#warning').textContent = text || ''; }
function persist() {
  if (!store || readOnly) return;
  if (!saveStore(storage, store)) warn('Browser saving is unavailable. Keep this tab open to retain your progress.');
}
function event(name, details = {}) {
  // Optional, consented aggregate adapter only. No per-selection telemetry or identifiers.
  if (store?.preferences.analytics === true && typeof window.pantryAnalytics === 'function') {
    try { window.pantryAnalytics(name, { mode, date: board?.date, ...details }); } catch { /* analytics must never interrupt play */ }
  }
}
function initStorage(preview) {
  const prefix = preview ? 'preview/' : '';
  storage = { getItem: key => localStorage.getItem(prefix + key), setItem: (key, value) => localStorage.setItem(prefix + key, value) };
  const restored = loadStore(storage); store = restored.store; readOnly = restored.readOnly; warn(restored.warning);
  document.body.classList.toggle('reduce-motion', store.preferences.motion === 'reduce');
  // Leave legacy pantry-v1 data untouched; its board IDs/content are not V3.
}
function tick(checkDate = true) {
  const time = Date.now();
  if (loaded && progress?.started && progress.status === 'playing' && activeVisible && !$('#dialog').open) {
    progress.seconds += Math.max(0, Math.min(5, (time - lastTick) / 1000));
    if ($('#timer')) $('#timer').textContent = formatTime(Math.floor(progress.seconds));
  }
  lastTick = time;
  for (const el of document.querySelectorAll('[data-countdown]')) el.textContent = countdown(now());
  if (checkDate && loaded && utcDate(now()) !== creditedDate && !loading) {
    persist(); say('A new UTC day has arrived. Your previous result is saved.');
    previewDay = board.preview ? Math.floor((dateMillis(utcDate(now())) - dateMillis(board.launch)) / DAY) + 1 : null;
    loadBoard();
  }
}
async function loadBoard() {
  tickBeforeSwitch();
  const token = ++request; loading = true; loaded = false;
  $('#game').setAttribute('aria-busy', 'true');
  $('#game').innerHTML = '<p class="loading">Setting the table…</p>';
  try {
    const url = `/api/daily?mode=${mode}${previewDay ? `&day=${previewDay}` : ''}`;
    const response = await fetch(url, { cache: 'no-store' });
    const payload = await response.json();
    if (token !== request) return;
    if (!response.ok) throw Error(payload.error || 'Today’s pantry could not be loaded.');
    if (!payload.preview && payload.date !== utcDate()) throw Error('The daily response is out of date. Refresh to try again.');
    board = { ...payload, mode }; creditedDate = payload.date;
    if (!store) initStorage(payload.preview);
    if (payload.preview) { offset = dateMillis(payload.date) - dateMillis(utcDate()); setupPreview(); }
    const key = progressKey(board.date, mode);
    progress = store.progress[key] ||= blankProgress();
    const known = new Set(board.recipes.map(r => r.id));
    progress.selected = [...new Set(progress.selected)].filter(id => known.has(id)).slice(0, MODE_RULES[mode].picks);
    progress.hinted = progress.hinted.filter(id => known.has(id));
    if (progress.status === 'solved' && !validateSelection(board, progress.selected).win) {
      progress.status = 'playing'; warn('Saved selections did not match this board. The result was not credited.');
    }
    loaded = true; lastTick = Date.now(); persist(); render();
    if (!store.tutorialSeen) showDialog('help');
  } catch (error) {
    if (token !== request) return;
    $('#game').innerHTML = `<section class="pantry"><h2>We’re keeping the pantry safe.</h2><p>${esc(error.message)}</p><p>No substitute or unverified puzzle will be served.</p><button data-action="retry">Try again</button></section>`;
    event('client_error', { category: 'daily_load' });
  } finally { if (token === request) { loading = false; $('#game').setAttribute('aria-busy', 'false'); } }
}
function tickBeforeSwitch() { if (loaded) { tick(false); persist(); } }
function render() {
  const result = validateSelection(board, progress.selected), terminal = progress.status !== 'playing';
  const picks = MODE_RULES[mode].picks;
  $('#date-label').textContent = `${board.preview ? 'PREVIEW · ' : ''}PANTRY #${String(board.number).padStart(3, '0')} · ${board.date} UTC`;
  for (const el of document.querySelectorAll('[data-mode]')) {
    const m = el.dataset.mode, saved = store.progress[progressKey(board.date, m)];
    el.setAttribute('aria-pressed', String(m === mode)); el.textContent = `${m === 'hard' ? 'Hard' : 'Medium'}${saved?.status === 'solved' ? ' ✓' : saved?.status === 'revealed' ? ' · Revealed' : ''}`;
  }
  const statusLabel = { unused: 'Unused', partial: 'In progress', complete: '✓ Exact', overused: 'Overused' };
  $('#game').innerHTML = `${terminal ? `<section class="results" aria-label="Daily result"><p class="eyebrow">${progress.status === 'solved' ? 'A PERFECTLY EMPTY PANTRY' : 'SOLUTION REVEALED'}</p><h2>${progress.status === 'solved' ? 'Beautifully put together.' : 'A little help from the kitchen.'}</h2><p>${progress.status === 'solved' ? `You solved ${mode} in ${formatTime(Math.floor(progress.seconds))} with ${progress.hints} hint${progress.hints === 1 ? '' : 's'}.` : 'This day is marked revealed, not solved. It won’t add to your winning streak.'}</p><p class="countdown">Next Pantry in <span data-countdown>${countdown(now())}</span></p><div class="results-actions"><button class="primary" data-action="share">Copy result</button>${navigator.share ? '<button data-action="native-share">Share</button>' : ''}<button data-dialog="stats">View statistics</button></div></section>` : ''}
  <section class="pantry" aria-labelledby="pantry-heading"><div class="section-heading"><h2 id="pantry-heading">Today’s pantry <span class="meta">· ${Object.keys(board.pantry).length} ingredients</span></h2><span class="timer" aria-label="Active playing time"><span id="timer">${formatTime(Math.floor(progress.seconds))}</span></span></div><div class="pantry-grid">${Object.entries(result.state).map(([id, s]) => `<div class="ingredient ${s.status}" aria-label="${esc(ingredientName(id))}: ${s.consumed} used of ${s.available}, ${s.remaining} remaining. ${statusLabel[s.status]}">${ingredientArt(id, ingredientName(id))}<span class="ingredient-name">${esc(ingredientName(id))}</span><span class="qty">${s.consumed}<span aria-hidden="true"> / </span>${s.available}</span><small>${statusLabel[s.status]} · ${s.remaining} left</small></div>`).join('')}</div></section>
  <section aria-labelledby="recipe-heading"><div class="section-heading"><h2 id="recipe-heading">Choose ${picks} dishes</h2><span class="meta">Use everything. Leave nothing.</span></div><div class="recipe-grid">${board.recipes.map((r, i) => `<button class="recipe" data-recipe="${esc(r.id)}" aria-pressed="${progress.selected.includes(r.id)}" ${terminal ? 'disabled' : ''}><span class="recipe-number">${String(i + 1).padStart(2, '0')}</span><span class="check" aria-hidden="true">${progress.selected.includes(r.id) ? '✓' : ''}</span>${recipeArt(r)}<span class="recipe-name">${esc(r.name)}</span><span class="requirements">${Object.entries(r.ingredients).map(([id, q]) => `<span class="requirement">${ingredientArt(id, ingredientName(id), true)}<span class="label">${esc(ingredientName(id))}</span><b>×${q}</b></span>`).join('')}</span></button>`).join('')}</div></section>
  <div class="controls"><span class="selection-label">${progress.selected.length} of ${picks} selected${terminal ? ` · ${progress.status}` : ''}</span><div class="controls-group"><button data-action="undo" ${terminal || !progress.history.length ? 'disabled' : ''}>Undo</button><button data-action="reset" ${terminal || !progress.selected.length ? 'disabled' : ''}>Reset</button><button data-action="hint" ${terminal ? 'disabled' : ''}>Hint</button><button data-action="reveal" ${terminal ? 'disabled' : ''}>Reveal</button></div></div>`;
}
function start() { if (!progress.started) { progress.started = true; event('puzzle_start'); } lastTick = Date.now(); }
function choose(id) {
  if (!loaded || progress.status !== 'playing') return;
  tick(); start();
  const selected = progress.selected.includes(id);
  if (!selected && progress.selected.length === MODE_RULES[mode].picks) return say('Deselect a dish before adding another. There’s no guess limit.');
  progress.history.push([...progress.selected]);
  progress.selected = selected ? progress.selected.filter(x => x !== id) : [...progress.selected, id];
  if (validateSelection(board, progress.selected).win) { progress.status = 'solved'; event('puzzle_solved', { seconds: Math.floor(progress.seconds), hints: progress.hints }); say('Perfect! Every ingredient is used exactly.'); }
  else { const result = validateSelection(board, progress.selected); say(Object.values(result.state).some(s => s.remaining < 0) ? 'An ingredient is overused. Try a different combination.' : `${progress.selected.length} dishes selected. Look for ingredients that connect your dishes.`); }
  persist(); render();
  if (progress.status === 'solved') { $('.results').setAttribute('tabindex', '-1'); $('.results').focus(); $('.results').scrollIntoView({ behavior: 'auto', block: 'center' }); }
  else document.querySelector(`[data-recipe="${CSS.escape(id)}"]`)?.focus({ preventScroll: true });
}
function showDialog(type) {
  if (!store) return;
  tick();
  const dialog = $('#dialog'), title = $('#dialog-title'), content = $('#dialog-body');
  const stats = statistics(store, mode, utcDate(now()));
  const titles = { help: 'A pantry. A little possibility.', stats: `${mode === 'hard' ? 'Hard' : 'Medium'} statistics`, settings: 'Make yourself comfortable', about: 'A little food for thought', reveal: 'Reveal today’s solution?', reset: 'Clear your selections?', inspect: 'Preview saved progress' };
  title.textContent = titles[type];
  if (type === 'help') content.innerHTML = `<div class="dialog-content"><p>Choose the dishes that empty the pantry <strong>exactly</strong>.</p><ol><li>Each dish uses the ingredient quantities shown.</li><li>Pick exactly <strong>3 on Medium</strong> or <strong>4 on Hard</strong>.</li><li>No leftovers. No overuse. Only one combination works.</li></ol><div class="tutorial-demo"><strong>Try a tiny pantry</strong><p>2 tomatoes, 1 bread. Choose both dishes.</p><button data-demo="toast" aria-pressed="false">Tomato toast · 1 tomato + 1 bread</button><button data-demo="salad" aria-pressed="false">Tomato salad · 1 tomato</button><p id="demo-status" role="status">0 / 2 tomatoes · 0 / 1 bread</p></div><p>The numbers in your pantry show <strong>used / available</strong>. An “Exact” label means that ingredient is perfectly used.</p><button class="primary" data-action="start">Let’s play</button></div>`;
  if (type === 'stats') {
    const pairs = [['Played', stats.played], ['Solved', stats.solved], ['Win rate', `${stats.winRate}%`], ['Current streak', stats.current], ['Longest streak', stats.longest], ['Average solve', stats.average === null ? '—' : formatTime(stats.average)], ['Best solve', stats.best === null ? '—' : formatTime(Math.floor(stats.best))], ['Hints used', stats.hints]];
    content.innerHTML = `<div class="dialog-content"><p>Saved on this browser · ${board.preview ? 'preview results only' : 'daily results'}. Reveals are not wins.</p><div class="stat-grid">${pairs.map(([label, value]) => `<div class="stat"><b>${value}</b>${label}</div>`).join('')}</div><h3>Recent days</h3><ul class="history">${Object.entries(store.progress).filter(([key, p]) => key.endsWith(`/${mode}`) && p.started).sort(([a], [b]) => b.localeCompare(a)).slice(0, 10).map(([key, p]) => `<li><span>${esc(key.slice(0, 10))}</span><span>${p.status === 'playing' ? 'In progress' : p.status === 'solved' ? 'Solved' : 'Revealed'}</span></li>`).join('') || '<li>Your first day starts here.</li>'}</ul></div>`;
  }
  if (type === 'settings') content.innerHTML = `<div class="dialog-content"><p>No account needed. Progress stays in this browser. No sounds or trackers are enabled by default.</p><label class="setting">Reduce visual motion<input id="motion" type="checkbox" ${store.preferences.motion === 'reduce' ? 'checked' : ''}></label><p>Your device’s reduced-motion setting is always respected.</p><button data-action="export">Export saved progress</button><p>Old Pantry saves are retained separately and included in exports; legacy boards cannot be credited as V3 wins.</p></div>`;
  if (type === 'about') content.innerHTML = '<div class="dialog-content"><p>Pantry is a daily puzzle about making a little go a long way. Find the one set of dishes that uses every ingredient exactly.</p><p>Two independent modes. Fresh puzzles at 00:00 UTC. Custom Clearline illustrations and the verified Quality V3 recipe baseline.</p><p>No account, no guess limits, no ingredient substitutions. Take your time.</p></div>';
  if (type === 'reveal') content.innerHTML = '<div class="dialog-content"><p>This cannot be undone. Today’s mode will be marked <strong>revealed, not solved</strong>, and won’t increase your winning streak.</p><button class="primary" data-action="confirm-reveal">Reveal solution</button></div>';
  if (type === 'reset') content.innerHTML = '<div class="dialog-content"><p>This clears selected dishes, but keeps your time and hint count.</p><button class="primary" data-action="confirm-reset">Clear selections</button></div>';
  if (type === 'inspect') { content.replaceChildren(); const pre = document.createElement('pre'); pre.style.cssText = 'white-space:pre-wrap;overflow-wrap:anywhere;font-size:11px'; pre.textContent = JSON.stringify(store, null, 2); content.append(pre); }
  if (!dialog.open) dialog.showModal();
}
function setupPreview() {
  const tools = $('#preview-tools'); tools.hidden = false; tools.className = 'preview-tools';
  tools.innerHTML = `<strong>Local playtest · V3 only</strong><label>Test board <select id="preview-day">${[1, 2, 3, 4, 5, 20, 50, 100, 101].map(n => `<option value="${n}" ${n === board.number ? 'selected' : ''}>Day ${n}${n === 101 ? ' · missing content' : ''}</option>`).join('')}</select></label><button data-action="next-day">Next UTC day</button><button data-action="inspect">Inspect save</button>`;
}
document.addEventListener('click', async e => {
  const button = e.target.closest('button'); if (!button) return;
  if (button.dataset.mode && !loading) { tickBeforeSwitch(); mode = button.dataset.mode; say(''); await loadBoard(); return; }
  if (button.dataset.recipe) return choose(button.dataset.recipe);
  if (button.dataset.dialog) return showDialog(button.dataset.dialog);
  if (button.dataset.demo) {
    button.setAttribute('aria-pressed', button.getAttribute('aria-pressed') !== 'true');
    const n = document.querySelectorAll('[data-demo][aria-pressed=true]').length;
    $('#demo-status').textContent = n === 2 ? 'Perfect! 2 / 2 tomatoes · 1 / 1 bread. Nothing left.' : `${n} / 2 tomatoes · ${document.querySelector('[data-demo=toast]').getAttribute('aria-pressed') === 'true' ? 1 : 0} / 1 bread`;
  }
  const action = button.dataset.action;
  if (action === 'retry') return loadBoard();
  if (!store) return;
  if (action === 'start') { store.tutorialSeen = true; persist(); $('#dialog').close(); lastTick = Date.now(); }
  if (action === 'inspect') showDialog('inspect');
  if (action === 'next-day' && board.preview) { tickBeforeSwitch(); previewDay = board.number + 1; await loadBoard(); }
  if (action === 'reset' || action === 'reveal') showDialog(action);
  if (action === 'confirm-reset' && progress.status === 'playing') { tick(); progress.history.push([...progress.selected]); progress.selected = []; persist(); render(); $('#dialog').close(); say('Selections cleared. Time and hints are preserved.'); }
  if (action === 'undo' && progress.status === 'playing' && progress.history.length) { tick(); progress.selected = progress.history.pop(); persist(); render(); say('Last change undone.'); }
  if (action === 'hint' && progress.status === 'playing') {
    tick(); start(); const solution = enumerateSolutions(board)[0];
    const id = solution.find(id => !progress.selected.includes(id) && !progress.hinted.includes(id));
    if (!id) return say('You’ve seen all dish hints. Compare the pantry quantities and remove any extra dishes.');
    progress.hints++; progress.hinted.push(id); persist(); event('hint'); say(`One dish belongs in the solution: ${board.recipes.find(r => r.id === id).name}.`);
  }
  if (action === 'confirm-reveal' && progress.status === 'playing') { tick(); start(); progress.selected = enumerateSolutions(board)[0]; progress.status = 'revealed'; progress.history = []; persist(); event('puzzle_revealed'); $('#dialog').close(); render(); $('.results').scrollIntoView({ block: 'center' }); say('Solution revealed. This is not credited as a win.'); }
  if (action === 'share' || action === 'native-share') {
    const text = shareText(board, progress, statistics(store, mode, board.date), board.publicOrigin || location.origin);
    try { if (action === 'native-share' && navigator.share) await navigator.share({ text }); else await navigator.clipboard.writeText(text); say(action === 'share' ? 'Spoiler-free result copied.' : 'Result shared.'); }
    catch (error) { if (error.name !== 'AbortError') { showDialog('about'); $('#dialog-title').textContent = 'Copy your result'; $('#dialog-body').replaceChildren(); const field = document.createElement('textarea'); field.value = text; field.style.cssText = 'width:100%;height:180px;font:inherit'; field.setAttribute('aria-label', 'Spoiler-free result'); $('#dialog-body').append(field); field.select(); } }
  }
  if (action === 'export') {
    const data = { current: store };
    try { data.legacy = localStorage.getItem('pantry-v1'); } catch { /* unavailable */ }
    const link = document.createElement('a'), url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })); link.href = url; link.download = 'pantry-progress.json'; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
});
document.addEventListener('change', e => {
  if (e.target.id === 'motion') { store.preferences.motion = e.target.checked ? 'reduce' : 'system'; document.body.classList.toggle('reduce-motion', e.target.checked); persist(); }
  if (e.target.id === 'preview-day' && board.preview) { previewDay = Number(e.target.value); loadBoard(); }
});
$('#close-dialog').onclick = () => { if (store) { store.tutorialSeen = true; persist(); } $('#dialog').close(); lastTick = Date.now(); };
$('#dialog').addEventListener('cancel', () => { if (store) { store.tutorialSeen = true; persist(); } lastTick = Date.now(); });
document.addEventListener('visibilitychange', () => { tick(); activeVisible = !document.hidden; persist(); lastTick = Date.now(); });
window.addEventListener('pagehide', () => { tick(); persist(); });
window.addEventListener('storage', e => { if (e.key?.endsWith('pantry-daily-v2') && !readOnly) { const restored = loadStore(storage); if (!restored.warning) { store = restored.store; if (board) { progress = store.progress[progressKey(board.date, mode)] ||= blankProgress(); render(); } } } });
window.addEventListener('error', () => event('client_error', { category: 'runtime' }));
setInterval(tick, 1000); setInterval(persist, 5000);
// Updating the old worker removes its stale HTML/API caches, without adding new ones.
if ('serviceWorker' in navigator) navigator.serviceWorker.getRegistration().then(r => r?.update()).catch(() => {});
loadBoard();
