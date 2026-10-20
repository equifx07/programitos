'use strict';
/* =========================================================
   Programitos — juego de programación secuencial de a dos
   ========================================================= */
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const sleep = ms => new Promise(r => setTimeout(r, ms));
const LEVELS = window.LEVELS;
const DIRS = { u: [0, -1], d: [0, 1], l: [-1, 0], r: [1, 0] };
const ROT = { r: 0, d: 90, l: 180, u: 270 };
const STICKERS = ['🦄', '🐸', '🦖', '🐙', '🦁', '🐼', '🚀', '🌈', '🍦', '🐳', '🦋', '👑'];
const REP_BODY_MAX = 3;

/* ---------- Dibujos ---------- */
function titoSVG() {
  return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <line x1="50" y1="20" x2="50" y2="8" stroke="#1f5fbf" stroke-width="4" stroke-linecap="round"/>
  <circle cx="50" cy="7" r="6" fill="#ffd23f" stroke="#e0a800" stroke-width="2"><animate attributeName="fill" values="#ffd23f;#ff7b54;#ffd23f" dur="1.2s" repeatCount="indefinite"/></circle>
  <rect x="4" y="42" width="14" height="9" rx="4.5" fill="#1f5fbf"/><rect x="82" y="42" width="14" height="9" rx="4.5" fill="#1f5fbf"/>
  <rect x="30" y="72" width="40" height="14" rx="7" fill="#1f5fbf"/>
  <circle cx="35" cy="89" r="7" fill="#33415c"/><circle cx="65" cy="89" r="7" fill="#33415c"/>
  <circle cx="35" cy="89" r="2.5" fill="#9aa6c0"/><circle cx="65" cy="89" r="2.5" fill="#9aa6c0"/>
  <rect x="15" y="19" width="70" height="56" rx="22" fill="#4da3ff" stroke="#1f5fbf" stroke-width="4"/>
  <rect x="25" y="30" width="50" height="31" rx="14" fill="#eaf4ff"/>
  <g><circle cx="40" cy="44" r="6.5" fill="#1d2b45"/><circle cx="60" cy="44" r="6.5" fill="#1d2b45"/>
  <circle cx="42.5" cy="41.5" r="2.4" fill="#fff"/><circle cx="62.5" cy="41.5" r="2.4" fill="#fff"/>
  <animateTransform attributeName="transform" type="scale" values="1 1;1 1;1 0.1;1 1" keyTimes="0;0.9;0.95;1" dur="3.5s" repeatCount="indefinite" additive="sum"/></g>
  <path d="M42 53 Q50 59 58 53" stroke="#1d2b45" stroke-width="3" fill="none" stroke-linecap="round"/>
  <circle cx="30.5" cy="54" r="4" fill="#ff9ec7" opacity=".8"/><circle cx="69.5" cy="54" r="4" fill="#ff9ec7" opacity=".8"/>
</svg>`;
}
function lulaSVG() {
  return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <path d="M74 84 Q96 80 90 60" stroke="#d94f93" stroke-width="7" fill="none" stroke-linecap="round"/>
  <ellipse cx="50" cy="86" rx="22" ry="11" fill="#ff8cc6" stroke="#d94f93" stroke-width="3.5"/>
  <path d="M19 42 L22 9 L44 27 Z" fill="#ff8cc6" stroke="#d94f93" stroke-width="3.5" stroke-linejoin="round"/>
  <path d="M81 42 L78 9 L56 27 Z" fill="#ff8cc6" stroke="#d94f93" stroke-width="3.5" stroke-linejoin="round"/>
  <path d="M25 32 L26 18 L36 27 Z" fill="#ffd6ea"/><path d="M75 32 L74 18 L64 27 Z" fill="#ffd6ea"/>
  <ellipse cx="50" cy="50" rx="35" ry="31" fill="#ff8cc6" stroke="#d94f93" stroke-width="4"/>
  <path d="M68 20 l9 -6 l1 10 z M68 20 l-3 -9 l9 4 z" fill="#ffd23f" stroke="#e0a800" stroke-width="2" stroke-linejoin="round"/>
  <g><ellipse cx="38" cy="46" rx="6" ry="7.5" fill="#2d2a4a"/><ellipse cx="62" cy="46" rx="6" ry="7.5" fill="#2d2a4a"/>
  <circle cx="40" cy="43" r="2.4" fill="#fff"/><circle cx="64" cy="43" r="2.4" fill="#fff"/>
  <animateTransform attributeName="transform" type="scale" values="1 1;1 1;1 0.1;1 1" keyTimes="0;0.92;0.96;1" dur="4s" repeatCount="indefinite" additive="sum"/></g>
  <path d="M47 55 L53 55 L50 59 Z" fill="#c93a82"/>
  <path d="M43 61 Q46.5 65 50 61 Q53.5 65 57 61" stroke="#2d2a4a" stroke-width="2.5" fill="none" stroke-linecap="round"/>
  <g stroke="#c93a82" stroke-width="2" stroke-linecap="round"><line x1="22" y1="55" x2="34" y2="57"/><line x1="22" y1="62" x2="34" y2="60"/><line x1="78" y1="55" x2="66" y2="57"/><line x1="78" y1="62" x2="66" y2="60"/></g>
  <circle cx="28" cy="58" r="4.5" fill="#ff5fa8" opacity=".5"/><circle cx="72" cy="58" r="4.5" fill="#ff5fa8" opacity=".5"/>
</svg>`;
}
function houseSVG(c, dark) {
  return `<svg viewBox="0 0 100 100"><path d="M50 8 L94 46 H81 V90 H19 V46 H6 Z" fill="${c}" stroke="${dark}" stroke-width="5" stroke-linejoin="round"/>
  <rect x="39" y="58" width="22" height="32" rx="5" fill="#fff8e1" stroke="${dark}" stroke-width="4"/>
  <circle cx="56" cy="75" r="2.5" fill="${dark}"/>
  <path d="M50 46 C44 38 34 44 42 50 L50 56 L58 50 C66 44 56 38 50 46 Z" fill="#fff"/></svg>`;
}
function padSVG() {
  return `<svg viewBox="0 0 100 100"><ellipse cx="50" cy="66" rx="42" ry="20" fill="#7a7a8c"/><ellipse cx="50" cy="60" rx="42" ry="20" fill="#a3a3b8"/>
  <g class="cap"><ellipse cx="50" cy="52" rx="28" ry="13" fill="#b5132b"/><ellipse class="cap" cx="50" cy="46" rx="28" ry="13" fill="#e63946"/><ellipse cx="42" cy="42" rx="9" ry="4" fill="#fff" opacity=".5"/></g></svg>`;
}
function gateSVG() {
  return `<svg viewBox="0 0 100 100"><g fill="#c47a3a" stroke="#7a4518" stroke-width="3">
  <rect x="10" y="14" width="14" height="78" rx="4"/><rect x="43" y="14" width="14" height="78" rx="4"/><rect x="76" y="14" width="14" height="78" rx="4"/>
  <rect x="4" y="30" width="92" height="12" rx="4"/><rect x="4" y="64" width="92" height="12" rx="4"/></g>
  <circle cx="50" cy="52" r="15" fill="#ffd23f" stroke="#c99a00" stroke-width="3"/><text x="50" y="60" font-size="20" text-anchor="middle">🔒</text></svg>`;
}
function arrowSVG(dir) {
  return `<svg viewBox="0 0 40 40" style="transform:rotate(${ROT[dir]}deg)"><path d="M5 15h17V7l14 13-14 13v-8H5z" fill="#fff" stroke="rgba(0,0,0,.25)" stroke-width="2" stroke-linejoin="round"/></svg>`;
}

const P = {
  A: { name: 'Tito', color: '#4da3ff', dark: '#1f5fbf', svg: titoSVG, keys: 'W A S D' },
  B: { name: 'Lula', color: '#ff8cc6', dark: '#c93a82', svg: lulaSVG, keys: 'flechas ← ↑ → ↓' }
};

/* ---------- Guardado ---------- */
const SAVE_KEY = 'programitos-v1';
function load() {
  try { const d = JSON.parse(localStorage.getItem(SAVE_KEY)); if (d && d.stars) return d; } catch (e) {}
  return { unlocked: 0, stars: {}, sound: true, voice: true };
}
function save() { try { localStorage.setItem(SAVE_KEY, JSON.stringify(S.save)); } catch (e) {} }

/* ---------- Sonido (sintetizado, sin archivos) ---------- */
const Snd = {
  ctx: null,
  init() {
    if (!this.ctx) { try { this.ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { return; } }
    if (this.ctx.state === 'suspended') this.ctx.resume();
  },
  tone(f, d = .12, type = 'sine', v = .15, delay = 0, to) {
    const c = this.ctx; if (!c) return;
    const t = c.currentTime + delay, o = c.createOscillator(), g = c.createGain();
    o.type = type; o.frequency.setValueAtTime(f, t);
    if (to) o.frequency.exponentialRampToValueAtTime(to, t + d);
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(v, t + .01);
    g.gain.exponentialRampToValueAtTime(.001, t + d);
    o.connect(g).connect(c.destination); o.start(t); o.stop(t + d + .05);
  },
  noise(d = .1, v = .2, delay = 0) {
    const c = this.ctx; if (!c) return;
    const b = c.createBuffer(1, c.sampleRate * d, c.sampleRate), data = b.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
    const s = c.createBufferSource(), g = c.createGain(); s.buffer = b; g.gain.value = v;
    s.connect(g).connect(c.destination); s.start(c.currentTime + delay);
  },
  play(n, arg) {
    if (!S.save.sound) return; this.init(); if (!this.ctx) return;
    const T = this.tone.bind(this);
    switch (n) {
      case 'add': T({ u: 660, d: 440, l: 523, r: 587 }[arg] || 600, .12, 'triangle', .2); break;
      case 'rep': T(523, .1, 'square', .08); T(784, .12, 'square', .08, .08); break;
      case 'del': T(400, .15, 'sine', .15, 0, 200); break;
      case 'full': T(200, .2, 'square', .08); break;
      case 'ready': T(784, .1, 'triangle', .2); T(1046, .15, 'triangle', .2, .1); break;
      case 'step': T(arg === 'A' ? 330 : 392, .08, 'sine', .12); T(arg === 'A' ? 494 : 587, .08, 'sine', .1, .06); break;
      case 'star': [988, 1319, 1568, 2093].forEach((f, i) => T(f, .15, 'triangle', .14, i * .06)); break;
      case 'bump': T(160, .35, 'sawtooth', .15, 0, 60); this.noise(.15, .15); break;
      case 'gate': T(300, .5, 'triangle', .15, 0, 900); [1200, 1500].forEach((f, i) => T(f, .2, 'sine', .08, .4 + i * .1)); break;
      case 'press': T(220, .1, 'square', .1); break;
      case 'home': [523, 659, 784].forEach((f, i) => T(f, .15, 'triangle', .16, i * .08)); break;
      case 'tick': T(880, .12, 'sine', .2); break;
      case 'go': T(1320, .3, 'triangle', .22); break;
      case 'fail': [392, 349, 311, 262].forEach((f, i) => T(f, .25, 'triangle', .14, i * .18)); break;
      case 'win': [523, 659, 784, 1046, 784, 1046, 1319].forEach((f, i) => T(f, .2, 'square', .07, i * .12)); [262, 330, 392].forEach((f, i) => T(f, .9, 'triangle', .1, .36 + i * .01)); break;
      case 'clap': this.noise(.12, .5); this.noise(.1, .35, .06); [1046, 1319, 1568, 2093].forEach((f, i) => T(f, .2, 'triangle', .12, .1 + i * .07)); break;
      case 'join': T(arg === 'A' ? 523 : 659, .2, 'triangle', .2); T(arg === 'A' ? 784 : 988, .25, 'triangle', .18, .1); break;
      case 'click': T(700, .05, 'sine', .1); break;
    }
  }
};

/* ---------- Voz ---------- */
const Voice = {
  v: null,
  pick() {
    if (!window.speechSynthesis) return;
    const vs = speechSynthesis.getVoices();
    this.v = vs.find(v => /es[-_](AR|419|MX|US)/i.test(v.lang)) || vs.find(v => /^es/i.test(v.lang)) || null;
  },
  say(t) {
    if (!S.save.voice || !window.speechSynthesis) return;
    try {
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(t.replace(/[\p{Extended_Pictographic}\u{FE0F}\u{200D}]/gu, ''));
      u.lang = 'es-AR'; if (this.v) u.voice = this.v; u.rate = .95; u.pitch = 1.15;
      speechSynthesis.speak(u);
    } catch (e) {}
  }
};
if (window.speechSynthesis) { Voice.pick(); speechSynthesis.onvoiceschanged = () => Voice.pick(); }

/* ---------- Estado ---------- */
const S = {
  save: load(), idx: 0, L: null, grid: null, cols: 0, rows: 0,
  prog: { A: [], B: [] }, ready: { A: false, B: false }, running: false,
  pos: {}, start: {}, homes: {}, stars: [], pads: [], gates: [], gatesOpen: false,
  got: 0, fails: 0, fast: false, joined: { A: false, B: false }, hf: { A: false, B: false }, overlay: null
};
const maxOf = () => S.L.max;
const countOf = p => S.prog[p].reduce((s, it) => s + (it.t === 'rep' ? 1 + it.body.length : 1), 0);
const stepMs = () => S.fast ? 300 : 520;

/* ---------- Pantallas ---------- */
function show(id) { $$('.screen').forEach(s => s.classList.toggle('active', s.id === id)); }
function overlay(id) {
  $$('.overlay').forEach(o => o.classList.remove('show'));
  S.overlay = id || null;
  if (id) $('#' + id).classList.add('show');
}

/* ---------- Inicio ---------- */
function initStart() {
  $('#start-A').innerHTML = titoSVG(); $('#start-B').innerHTML = lulaSVG();
  $('#map-A').innerHTML = titoSVG(); $('#map-B').innerHTML = lulaSVG();
  $$('[data-join]').forEach(b => b.onclick = () => join(b.dataset.join));
}
function join(p) {
  S.joined[p] = !S.joined[p];
  $('.join-' + p).classList.toggle('on', S.joined[p]);
  if (S.joined[p]) Snd.play('join', p); else Snd.play('del');
  if (S.joined.A && S.joined.B) {
    Snd.play('clap'); confetti(80);
    Voice.say('¡Hola Tito y Lula! ¡A programar juntos!');
    setTimeout(() => { S.joined = { A: false, B: false }; $$('.join').forEach(b => b.classList.remove('on')); openMap(); }, 900);
  } else if (S.joined[p]) {
    Voice.say(p === 'A' ? '¡Hola Tito! Falta Lula.' : '¡Hola Lula! Falta Tito.');
  }
}

/* ---------- Mapa ---------- */
function openMap() {
  overlay(null); show('scr-map'); window.speechSynthesis?.cancel();
  const box = $('#levels'); box.innerHTML = '';
  LEVELS.forEach((L, i) => {
    const b = document.createElement('button');
    const st = S.save.stars[i] || 0, locked = i > S.save.unlocked;
    b.className = 'lv' + (st ? ' done' : '') + (i === S.save.unlocked && !st ? ' current' : '') + (L.tools.includes('rep') ? ' rep' : '');
    b.disabled = locked;
    b.innerHTML = `<span class="n">${i + 1}</span><span class="nm">${L.name}</span><span class="st">${'⭐'.repeat(st)}${'<span style="opacity:.25">⭐</span>'.repeat(3 - st)}</span>${locked ? '<span class="lock">🔒</span>' : ''}`;
    b.onclick = () => { Snd.play('click'); startLevel(i); };
    box.appendChild(b);
  });
}

/* ---------- Paneles ---------- */
function buildPanel(p) {
  const el = $('#panel-' + p), isA = p === 'A';
  const k = isA ? { u: 'W', l: 'A', d: 'S', r: 'D', rep: 'R', back: 'Q', ready: 'E' }
                : { u: '↑', l: '←', d: '↓', r: '→', rep: 'Shift', back: '⌫', ready: 'Enter' };
  el.innerHTML = `
    <div class="p-head"><div class="avatar">${P[p].svg()}</div><div><div class="p-name">${P[p].name}</div><div class="p-keys">⌨️ ${P[p].keys}</div></div><div class="order" id="order-${p}"></div></div>
    <div class="prog" id="prog-${p}"></div>
    <div class="count" id="count-${p}"></div>
    <div class="palette">
      <button class="pal up d-u" data-act="u">${arrowSVG('u')}<span class="key">${k.u}</span></button>
      <button class="pal left d-l" data-act="l">${arrowSVG('l')}<span class="key">${k.l}</span></button>
      <button class="pal down d-d" data-act="d">${arrowSVG('d')}<span class="key">${k.d}</span></button>
      <button class="pal right d-r" data-act="r">${arrowSVG('r')}<span class="key">${k.r}</span></button>
      <button class="pal rp" data-act="rep"><span class="rp-txt">🔁 Repetir</span><span class="key">${k.rep}</span></button>
    </div>
    <div class="p-actions">
      <button class="act" data-act="back" title="Borrar el último">⌫<span class="key">${k.back}</span></button>
      <button class="act" data-act="clear" title="Borrar todo">🗑️</button>
    </div>
    <button class="ready" data-act="ready"><span class="ready-txt">¡LISTO!</span><span class="key">${k.ready}</span></button>`;
  el.onclick = e => {
    const b = e.target.closest('button'); if (!b || S.running || S.overlay) return;
    if (b.dataset.act) return act(p, b.dataset.act);
    if (b.dataset.n !== undefined) return cycleRep(p, +b.dataset.n);
    if (b.dataset.del !== undefined) return delAt(p, +b.dataset.del);
    if (b.dataset.i !== undefined) return delAt(p, +b.dataset.i, b.dataset.j !== undefined ? +b.dataset.j : undefined);
  };
}

function act(p, a) {
  if (S.running || S.overlay) return;
  hideTuto(p);
  const prog = S.prog[p];
  const last = prog[prog.length - 1];
  const openRep = last && last.t === 'rep' && last.open ? last : null;
  if (a === 'ready') return toggleReady(p);
  unready(p);
  if (DIRS[a]) {
    if (!S.L.tools.includes(a)) return;
    if (countOf(p) >= maxOf()) return full(p);
    if (openRep) { openRep.body.push(a); if (openRep.body.length >= REP_BODY_MAX) openRep.open = false; }
    else prog.push({ t: 'm', d: a });
    Snd.play('add', a); pressFx(p, a);
  } else if (a === 'rep') {
    if (!S.L.tools.includes('rep')) return;
    if (openRep) { openRep.open = false; Snd.play('ready'); }
    else { if (countOf(p) >= maxOf()) return full(p); prog.push({ t: 'rep', n: 2, body: [], open: true }); Snd.play('rep'); }
  } else if (a === 'back') {
    if (!last) return;
    if (last.t === 'rep' && last.body.length) { last.body.pop(); last.open = true; }
    else prog.pop();
    Snd.play('del');
  } else if (a === 'clear') {
    if (!prog.length) return;
    S.prog[p] = []; Snd.play('del');
  }
  renderProg(p);
}
function pressFx(p, a) {
  const b = $(`#panel-${p} [data-act="${a}"]`); if (!b) return;
  b.classList.add('press'); setTimeout(() => b.classList.remove('press'), 120);
}
function full(p) {
  Snd.play('full');
  const c = $('#count-' + p); c.classList.remove('full'); void c.offsetWidth; c.classList.add('full');
}
function cycleRep(p, i) {
  const it = S.prog[p][i]; if (!it) return;
  it.n = it.n >= 9 ? 2 : it.n + 1; unready(p);
  Snd.play('add', 'u'); renderProg(p);
}
function delAt(p, i, j) {
  const it = S.prog[p][i]; if (!it) return;
  if (j !== undefined) { it.body.splice(j, 1); }
  else S.prog[p].splice(i, 1);
  unready(p); Snd.play('del'); renderProg(p);
}
function renderProg(p) {
  const prog = S.prog[p], max = maxOf(), n = countOf(p);
  let h = '';
  prog.forEach((it, i) => {
    if (it.t === 'm') h += `<button class="blk d-${it.d}" data-i="${i}">${arrowSVG(it.d)}</button>`;
    else h += `<div class="rep${it.open ? ' open' : ''}" data-ri="${i}"><button class="rep-ico" data-del="${i}" title="Quitar">🔁</button><button class="rep-n" data-n="${i}">×${it.n}</button><div class="rep-body">` +
      it.body.map((d, j) => `<button class="blk sm d-${d}" data-i="${i}" data-j="${j}">${arrowSVG(d)}</button>`).join('') +
      (it.open ? '<span class="slot sm">+</span>' : '') + '</div></div>';
  });
  for (let k = n; k < Math.min(max, 14); k++) h += '<span class="slot"></span>';
  $('#prog-' + p).innerHTML = h;
  $('#count-' + p).textContent = `Bloques: ${n} de ${max}`;
  const last = prog[prog.length - 1], open = last && last.t === 'rep' && last.open;
  const rp = $(`#panel-${p} .pal.rp`);
  rp.classList.toggle('closing', !!open);
  rp.querySelector('.rp-txt').textContent = open ? '✔️ Cerrar repetir' : '🔁 Repetir';
  $(`#panel-${p} .ready`).disabled = n === 0;
}
function setTools() {
  for (const p of ['A', 'B']) {
    ['u', 'd', 'l', 'r'].forEach(d => $(`#panel-${p} [data-act="${d}"]`).classList.toggle('hide', !S.L.tools.includes(d)));
    $(`#panel-${p} .pal.rp`).classList.toggle('hide', !S.L.tools.includes('rep'));
    $(`#panel-${p} .pal.rp`).style.display = S.L.tools.includes('rep') ? '' : 'none';
    const first = (S.L.first || 'A') === p;
    $('#order-' + p).textContent = first ? '1° camina' : '2° camina';
  }
}

/* ---------- Listo ---------- */
function toggleReady(p) {
  if (!countOf(p)) return;
  S.ready[p] = !S.ready[p];
  const b = $(`#panel-${p} .ready`);
  b.classList.toggle('on', S.ready[p]);
  b.querySelector('.ready-txt').textContent = S.ready[p] ? '✔ ¡Listo!' : '¡LISTO!';
  if (S.ready[p]) {
    Snd.play('ready');
    const o = p === 'A' ? 'B' : 'A';
    if (S.ready[o]) run();
    else { setBubble(`¡${P[p].name} está listo! Esperando a ${P[o].name}... ⏳`, true); }
  } else Snd.play('del');
}
function unready(p) {
  if (!S.ready[p]) return;
  S.ready[p] = false;
  const b = $(`#panel-${p} .ready`); b.classList.remove('on'); b.querySelector('.ready-txt').textContent = '¡LISTO!';
}

/* ---------- Nivel ---------- */
function startLevel(i) {
  S.idx = i; S.L = LEVELS[i]; S.fails = 0;
  S.prog = { A: [], B: [] }; S.ready = { A: false, B: false };
  overlay(null); show('scr-game');
  $('#lvl-num').textContent = i + 1; $('#lvl-name').textContent = S.L.name;
  $('#btn-hint').classList.remove('glow');
  setTools(); parseLevel(); renderBoard();
  ['A', 'B'].forEach(p => { unready(p); renderProg(p); });
  setBubble(S.L.text);
  setTimeout(() => Voice.say(S.L.text), 250);
  if (i === 0) showTuto();
}
function setBubble(t, silent) { $('#bubble-text').textContent = t; }
function parseLevel() {
  const m = S.L.map; S.rows = m.length; S.cols = m[0].length;
  S.grid = m.map(r => r.split(''));
  S.stars = []; S.pads = []; S.gates = [];
  S.grid.forEach((row, y) => row.forEach((c, x) => {
    if (c === 'A' || c === 'B') S.start[c] = { x, y };
    if (c === 'a' || c === 'b') S.homes[c.toUpperCase()] = { x, y };
    if (c === '*') S.stars.push({ x, y });
    if (c === 'o') S.pads.push({ x, y });
    if (c === 'D') S.gates.push({ x, y });
  }));
}
function cellAt(x, y) { return (y < 0 || y >= S.rows || x < 0 || x >= S.cols) ? null : S.grid[y][x]; }
function blocked(x, y, gatesOpen) {
  const c = cellAt(x, y);
  if (c === null) return true;
  if ('#R~'.includes(c)) return true;
  if (c === 'D' && !gatesOpen) return true;
  return false;
}
function hash(x, y) { return (x * 7 + y * 13 + S.idx * 3) % 5; }

function renderBoard() {
  const b = $('#board'); b.innerHTML = '';
  S.grid.forEach((row, y) => row.forEach((c, x) => {
    const t = document.createElement('div');
    t.className = 'tile ' + (c === '~' ? 'water' : 'g' + ((x + y) % 2));
    t.style.setProperty('--x', x); t.style.setProperty('--y', y);
    if (c === '#') t.innerHTML = `<span class="deco">${['🌳', '🌲', '🌳', '🌴', '🌳'][hash(x, y)]}</span>`;
    if (c === 'R') t.innerHTML = '<span class="deco">🪨</span>';
    if (c === 'f') t.innerHTML = `<span class="flower">${['🌷', '🌼', '🌸', '🍄', '🌻'][hash(x, y)]}</span>`;
    b.appendChild(t);
  }));
  const ent = (cls, x, y, html) => {
    const e = document.createElement('div'); e.className = 'ent ' + cls;
    e.style.setProperty('--x', x); e.style.setProperty('--y', y); e.innerHTML = html; b.appendChild(e); return e;
  };
  for (const p of ['A', 'B']) S.homes[p].el = ent('home home-' + p, S.homes[p].x, S.homes[p].y, houseSVG(P[p].color, P[p].dark));
  S.pads.forEach(pd => pd.el = ent('pad', pd.x, pd.y, padSVG()));
  S.gates.forEach(g => g.el = ent('gate', g.x, g.y, gateSVG()));
  S.stars.forEach(s => s.el = ent('star', s.x, s.y, '⭐'));
  for (const p of ['A', 'B']) {
    const r = ent('robot r-' + p, 0, 0, `<div class="sprite"><div class="flip">${P[p].svg()}</div></div><div class="fx"></div>`);
    S.pos[p] = { el: r };
  }
  resetRun();
  sizeBoard();
}
function sizeBoard() {
  if (!S.L) return;
  const w = $('#board-wrap'); const pad = 20;
  const cell = Math.max(34, Math.min(120, Math.floor(Math.min((w.clientWidth - pad) / S.cols, (w.clientHeight - pad) / S.rows))));
  const b = $('#board');
  b.style.setProperty('--cell', cell + 'px');
  b.style.width = cell * S.cols + 'px'; b.style.height = cell * S.rows + 'px';
}
window.addEventListener('resize', sizeBoard);

function placeRobot(p, x, y) {
  const r = S.pos[p]; r.x = x; r.y = y;
  r.el.style.setProperty('--x', x); r.el.style.setProperty('--y', y);
}
function resetRun() {
  for (const p of ['A', 'B']) {
    const r = S.pos[p]; r.el.style.transition = 'none';
    placeRobot(p, S.start[p].x, S.start[p].y);
    r.el.className = 'ent robot r-' + p + (S.homes[p].x < S.start[p].x ? ' left' : '');
    void r.el.offsetWidth; r.el.style.transition = '';
    S.homes[p].el.classList.remove('glow');
  }
  S.stars.forEach(s => { s.got = false; s.el.classList.remove('got'); });
  S.pads.forEach(pd => pd.el.classList.remove('on'));
  S.gates.forEach(g => g.el.classList.remove('open'));
  S.gatesOpen = false; S.got = 0;
  $$('.foot').forEach(f => f.remove());
  $$('.panel').forEach(p => p.classList.remove('active', 'locked'));
}

/* ---------- Ejecución ---------- */
function flatten(prog) {
  const out = [];
  prog.forEach((it, i) => {
    if (it.t === 'm') out.push({ d: it.d, i });
    else for (let k = 0; k < it.n; k++) it.body.forEach((d, j) => out.push({ d, i, j, k, n: it.n }));
  });
  return out;
}
function markRun(p, st) {
  $$(`#prog-${p} .run`).forEach(e => e.classList.remove('run'));
  $$(`#prog-${p} .rep`).forEach(e => e.removeAttribute('data-iter'));
  if (!st) return;
  const sel = st.j === undefined ? `#prog-${p} [data-i="${st.i}"]` : `#prog-${p} [data-i="${st.i}"][data-j="${st.j}"]`;
  const el = $(sel); if (el) { el.classList.add('run'); el.scrollIntoView({ block: 'nearest' }); }
  if (st.j !== undefined) {
    const rep = $(`#prog-${p} [data-ri="${st.i}"]`);
    if (rep) { rep.classList.add('run'); rep.dataset.iter = `vuelta ${st.k + 1} de ${st.n}`; }
  }
}
function fx(p, emoji, cls = 'show') {
  const f = S.pos[p].el.querySelector('.fx');
  f.textContent = emoji; f.classList.remove('show'); void f.offsetWidth; f.classList.add(cls);
}

async function run() {
  if (S.running) return;
  S.running = true; window.speechSynthesis?.cancel();
  resetRun();
  $$('.panel').forEach(p => p.classList.add('locked'));
  await countdown();
  const first = S.L.first || 'A', order = first === 'A' ? ['A', 'B'] : ['B', 'A'];
  $('#board').style.setProperty('--step', (stepMs() * .85) / 1000 + 's');
  for (const p of order) {
    $$('.panel').forEach(el => el.classList.toggle('active', el.dataset.p === p));
    setBubble(`¡Ahora camina ${P[p].name}!`);
    const res = await runRobot(p);
    markRun(p, null);
    if (!res.ok) return fail(p, res.reason);
    await sleep(250);
  }
  win();
}
async function countdown() {
  overlay('ov-count'); const n = $('#count-num');
  for (const t of ['3', '2', '1', '¡YA!']) {
    n.textContent = t; n.classList.remove('go'); void n.offsetWidth; n.classList.add('go');
    Snd.play(t === '¡YA!' ? 'go' : 'tick');
    await sleep(t === '¡YA!' ? 500 : 600);
  }
  overlay(null);
}
async function runRobot(p) {
  const r = S.pos[p], steps = flatten(S.prog[p]);
  for (const st of steps) {
    markRun(p, st);
    const [dx, dy] = DIRS[st.d], nx = r.x + dx, ny = r.y + dy;
    if (dx) r.el.classList.toggle('left', dx < 0);
    if (blocked(nx, ny, S.gatesOpen)) {
      r.el.classList.remove('hop'); void r.el.offsetWidth; r.el.classList.add('bump');
      Snd.play('bump'); fx(p, '💫', 'show');
      await sleep(600); r.el.classList.add('dizzy');
      return { ok: false, reason: cellAt(nx, ny) === null ? 'edge' : cellAt(nx, ny) === '~' ? 'water' : cellAt(nx, ny) === 'D' ? 'gate' : 'bump' };
    }
    r.el.classList.remove('hop'); void r.el.offsetWidth; r.el.classList.add('hop');
    placeRobot(p, nx, ny); Snd.play('step', p);
    await sleep(stepMs());
    const star = S.stars.find(s => !s.got && s.x === nx && s.y === ny);
    if (star) { star.got = true; S.got++; star.el.classList.add('got'); Snd.play('star'); }
    const pad = S.pads.find(pd => pd.x === nx && pd.y === ny);
    if (pad && !S.gatesOpen) {
      pad.el.classList.add('on'); Snd.play('press'); S.gatesOpen = true;
      await sleep(150); S.gates.forEach(g => g.el.classList.add('open')); Snd.play('gate'); fx(p, '✨');
      await sleep(400);
    }
  }
  r.el.classList.remove('hop');
  const h = S.homes[p];
  if (r.x !== h.x || r.y !== h.y) { r.el.classList.add('sad'); fx(p, '❓'); return { ok: false, reason: 'nohome' }; }
  h.el.classList.add('glow'); r.el.classList.add('dance'); Snd.play('home'); fx(p, '❤️');
  return { ok: true };
}

/* ---------- Resultado ---------- */
function fail(p, reason) {
  S.running = false; S.fails++;
  const n = P[p].name;
  const msgs = {
    bump: `¡Ups! ${n} se chocó con un árbol. ¡Arreglen el programa y prueben otra vez!`,
    edge: `¡Ups! ${n} se quiso salir del mapa. ¡Miren bien las flechas!`,
    water: `¡Splash! ${n} casi se cae al agua. ¡Busquen otro camino!`,
    gate: `¡La puerta está cerrada! Alguien tiene que pisar el botón rojo primero.`,
    nohome: `¡Casi! ${n} no llegó a su casita. ¡Les faltan o les sobran pasos!`
  };
  const t = msgs[reason] || msgs.bump;
  Snd.play('fail');
  setTimeout(() => {
    $('#fail-face').innerHTML = P[p].svg();
    $('#fail-title').textContent = ['¡Ups!', '¡Uy, uy, uy!', '¡Casi casi!'][S.fails % 3];
    $('#fail-text').textContent = t;
    overlay('ov-fail'); Voice.say(t);
    if (S.fails >= 2) $('#btn-hint').classList.add('glow');
  }, 700);
}
function retry() {
  overlay(null); resetRun();
  ['A', 'B'].forEach(unready);
  setBubble(S.L.text);
}
async function win() {
  S.running = false;
  $$('.panel').forEach(p => p.classList.remove('active'));
  Snd.play('win'); confetti(150);
  const total = S.stars.length, rating = (total === 0 || S.got === total) ? 3 : 2;
  const firstTime = !S.save.stars[S.idx];
  S.save.stars[S.idx] = Math.max(S.save.stars[S.idx] || 0, rating);
  S.save.unlocked = Math.max(S.save.unlocked, Math.min(S.idx + 1, LEVELS.length - 1));
  if (S.idx === LEVELS.length - 1) S.save.done = true;
  save();
  await sleep(900);
  $('#win-title').textContent = ['¡Genial!', '¡Excelente!', '¡Bravo!', '¡Súper!', '¡Increíble!'][Math.floor(Math.random() * 5)];
  $('#win-stars').innerHTML = [0, 1, 2].map(k => `<span class="${k < rating ? '' : 'empty'}" style="animation-delay:${.2 + k * .25}s">⭐</span>`).join('');
  $('#win-A').innerHTML = titoSVG(); $('#win-B').innerHTML = lulaSVG();
  $('#win-sticker').textContent = STICKERS[S.idx];
  $('#win-msg').textContent = rating === 3 ? (firstTime ? '¡Ganaron una figurita nueva para el álbum!' : '¡Perfecto! ¡Todas las estrellas!')
    : `¡Muy bien! Juntaron ${S.got} de ${total} estrellas. ¿Se animan a buscarlas todas?`;
  S.hf = { A: false, B: false };
  $$('.hf').forEach(h => h.classList.remove('on')); $('.hf-btns').classList.remove('clap');
  overlay('ov-win');
  [0, 1, 2].forEach(k => k < rating && setTimeout(() => Snd.play('star'), 200 + k * 250));
  Voice.say(`${$('#win-title').textContent} ¡Lo lograron juntos! ¡Chóquenla!`);
}
function highFive(p) {
  if (S.overlay !== 'ov-win' || S.hf[p]) return;
  S.hf[p] = true; $('.hf-' + p).classList.add('on'); Snd.play('join', p);
  if (S.hf.A && S.hf.B) {
    $('.hf-btns').classList.add('clap'); Snd.play('clap'); confetti(120);
    setTimeout(() => {
      if (S.idx < LEVELS.length - 1) startLevel(S.idx + 1);
      else finale();
    }, 900);
  }
}
function finale() {
  $('#final-A').innerHTML = titoSVG(); $('#final-B').innerHTML = lulaSVG();
  overlay('ov-final'); Snd.play('win'); confetti(300);
  Voice.say('¡Felicitaciones! ¡Son programadores! Terminaron todos los niveles trabajando en equipo.');
}

/* ---------- Pista: huellitas del camino ---------- */
function bfs(from, to, gatesOpen) {
  const key = (x, y) => x + ',' + y, prev = { [key(from.x, from.y)]: null }, q = [from];
  while (q.length) {
    const c = q.shift();
    if (c.x === to.x && c.y === to.y) {
      const path = []; let k = key(c.x, c.y);
      while (k) { const [x, y] = k.split(',').map(Number); path.unshift({ x, y }); k = prev[k]; }
      return path;
    }
    for (const [dx, dy] of Object.values(DIRS)) {
      const nx = c.x + dx, ny = c.y + dy, k = key(nx, ny);
      if (k in prev || blocked(nx, ny, gatesOpen)) continue;
      prev[k] = key(c.x, c.y); q.push({ x: nx, y: ny });
    }
  }
  return [];
}
function hint() {
  if (S.running || S.overlay) return;
  Snd.play('star'); $('#btn-hint').classList.remove('glow');
  $$('.foot').forEach(f => f.remove());
  const first = S.L.first || 'A';
  for (const p of ['A', 'B']) {
    let path;
    if (p === first && S.pads.length) {
      const a = bfs(S.start[p], S.pads[0], false), b = bfs(S.pads[0], S.homes[p], false);
      path = a.concat(b.slice(1));
    } else path = bfs(S.start[p], S.homes[p], true);
    path.slice(1, -1).forEach((c, i) => {
      const f = document.createElement('div'); f.className = 'ent foot f' + p;
      f.style.setProperty('--x', c.x); f.style.setProperty('--y', c.y);
      f.style.animationDelay = (i * .12) + 's'; f.textContent = p === 'A' ? '👣' : '🐾';
      $('#board').appendChild(f);
    });
  }
  setBubble('¡Sigan las huellitas! 👣 Tito y 🐾 Lula. Cuenten los pasos y pongan las flechas.');
  Voice.say('¡Sigan las huellitas! Cuenten los pasos y pongan las flechas.');
  setTimeout(() => $$('.foot').forEach(f => f.remove()), 6000);
}

/* ---------- Tutorial (nivel 1) ---------- */
function showTuto() {
  hideTuto();
  for (const p of ['A', 'B']) {
    const btn = $(`#panel-${p} [data-act="r"]`);
    const h = document.createElement('div'); h.className = 'tuto-hand'; h.dataset.p = p; h.textContent = '👆';
    $('#panel-' + p).appendChild(h);
    const pr = $('#panel-' + p).getBoundingClientRect(), br = btn.getBoundingClientRect();
    h.style.left = (br.left - pr.left + br.width / 2 - 10) + 'px';
    h.style.top = (br.top - pr.top + br.height / 2) + 'px';
  }
}
function hideTuto(p) { $$('.tuto-hand').forEach(h => (!p || h.dataset.p === p) && h.remove()); }

/* ---------- Confeti ---------- */
const cv = $('#confetti'), cx = cv.getContext('2d');
let parts = [], confRAF = null;
function confetti(n) {
  cv.width = innerWidth; cv.height = innerHeight;
  const cols = ['#3b8cff', '#ff5fa8', '#ffd23f', '#2ec27e', '#9b5de5', '#ff9f1c'];
  for (let i = 0; i < n; i++) parts.push({
    x: innerWidth / 2 + (Math.random() - .5) * innerWidth * .6, y: innerHeight * .35,
    vx: (Math.random() - .5) * 16, vy: -Math.random() * 16 - 4, r: Math.random() * 6 + 5,
    c: cols[i % cols.length], a: Math.random() * 6, va: (Math.random() - .5) * .4, life: 160 + Math.random() * 60, sh: i % 3
  });
  if (!confRAF) confRAF = requestAnimationFrame(tickConf);
}
function tickConf() {
  cx.clearRect(0, 0, cv.width, cv.height);
  parts = parts.filter(p => p.life-- > 0 && p.y < cv.height + 20);
  for (const p of parts) {
    p.vy += .35; p.vx *= .99; p.x += p.vx; p.y += p.vy; p.a += p.va;
    cx.save(); cx.translate(p.x, p.y); cx.rotate(p.a); cx.fillStyle = p.c;
    if (p.sh === 0) cx.fillRect(-p.r, -p.r / 2, p.r * 2, p.r);
    else if (p.sh === 1) { cx.beginPath(); cx.arc(0, 0, p.r * .7, 0, 7); cx.fill(); }
    else { cx.font = p.r * 3 + 'px serif'; cx.fillText('⭐', 0, 0); }
    cx.restore();
  }
  confRAF = parts.length ? requestAnimationFrame(tickConf) : (cx.clearRect(0, 0, cv.width, cv.height), null);
}

/* ---------- Álbum y docente ---------- */
function openAlbum() {
  $('#album').innerHTML = STICKERS.map((s, i) => S.save.stars[i] ? `<div>${s}</div>` : `<div class="no">${i + 1}</div>`).join('');
  overlay('ov-album'); Snd.play('click');
}
let tAns = 0;
function openTeacher() {
  const a = 3 + Math.floor(Math.random() * 7), b = 3 + Math.floor(Math.random() * 7); tAns = a * b;
  $('#t-q').textContent = `${a} × ${b}`; $('#t-ans').value = '';
  $('#teacher-lock').hidden = false; $('#teacher-panel').hidden = true;
  overlay('ov-teacher'); setTimeout(() => $('#t-ans').focus(), 100);
}
function checkTeacher() {
  if (+$('#t-ans').value === tAns) {
    $('#teacher-lock').hidden = true; $('#teacher-panel').hidden = false;
    $('#t-levels').innerHTML = LEVELS.map((_, i) => `<button data-go="${i}">${i + 1}</button>`).join('');
  } else { const i = $('#t-ans'); i.classList.remove('bad'); void i.offsetWidth; i.classList.add('bad'); }
}

/* ---------- Teclado (dos jugadores en la misma compu) ---------- */
const KEYS_A = { KeyW: 'u', KeyA: 'l', KeyS: 'd', KeyD: 'r', KeyR: 'rep', KeyQ: 'back', KeyE: 'ready' };
const KEYS_B = { ArrowUp: 'u', ArrowLeft: 'l', ArrowDown: 'd', ArrowRight: 'r', ShiftRight: 'rep', Backspace: 'back', Enter: 'ready', NumpadEnter: 'ready' };
document.addEventListener('keydown', e => {
  if (e.target.tagName === 'INPUT') { if (e.key === 'Enter') checkTeacher(); return; }
  if (e.repeat) return;
  Snd.init();
  const scr = $('.screen.active').id;
  const pA = KEYS_A[e.code], pB = KEYS_B[e.code];
  if (pB) e.preventDefault();
  if (scr === 'scr-start') { if (e.code === 'KeyE') join('A'); if (pB === 'ready') join('B'); return; }
  if (S.overlay === 'ov-win') { if (e.code === 'KeyE') highFive('A'); if (pB === 'ready') highFive('B'); return; }
  if (S.overlay === 'ov-fail') { if (e.code === 'KeyE' || pB === 'ready' || e.code === 'Space') retry(); return; }
  if (S.overlay) { if (e.code === 'Escape') overlay(null); return; }
  if (scr !== 'scr-game' || S.running) return;
  if (pA) act('A', pA); else if (pB) act('B', pB);
});

/* ---------- Arranque ---------- */
function syncToggles() {
  $$('.snd-toggle').forEach(b => { b.textContent = S.save.sound ? '🔊' : '🔇'; b.classList.toggle('off', !S.save.sound); });
  $('#btn-voice').classList.toggle('off', !S.save.voice);
  $('#btn-speed').textContent = S.fast ? '🐇' : '🐢';
}
function init() {
  initStart(); buildPanel('A'); buildPanel('B'); syncToggles();
  document.addEventListener('pointerdown', () => Snd.init(), { once: true });
  $('#map-back').onclick = () => { show('scr-start'); };
  $('#btn-map').onclick = () => { if (!S.running) openMap(); };
  $('#btn-hint').onclick = hint;
  $('#btn-say').onclick = () => Voice.say($('#bubble-text').textContent);
  $('#btn-speed').onclick = () => { S.fast = !S.fast; syncToggles(); Snd.play('click'); };
  $$('.snd-toggle').forEach(b => b.onclick = () => { S.save.sound = !S.save.sound; save(); syncToggles(); Snd.play('click'); });
  $('#btn-voice').onclick = () => { S.save.voice = !S.save.voice; save(); syncToggles(); if (!S.save.voice) window.speechSynthesis?.cancel(); else Voice.say('¡Hola!'); };
  $('#btn-full').onclick = () => { if (!document.fullscreenElement) document.documentElement.requestFullscreen?.().catch(() => {}); else document.exitFullscreen?.(); };
  $('#btn-retry').onclick = retry;
  $$('[data-hf]').forEach(b => b.onclick = () => highFive(b.dataset.hf));
  $('#btn-album').onclick = openAlbum;
  $('#final-album').onclick = openAlbum;
  $('#final-map').onclick = openMap;
  $('#btn-teacher').onclick = openTeacher;
  $('#t-ok').onclick = checkTeacher;
  $('#t-unlock').onclick = () => { S.save.unlocked = LEVELS.length - 1; save(); openMap(); };
  $('#t-reset').onclick = () => { S.save.unlocked = 0; S.save.stars = {}; save(); openMap(); };
  $('#t-levels').onclick = e => { const b = e.target.closest('[data-go]'); if (b) startLevel(+b.dataset.go); };
  $$('[data-close]').forEach(b => b.onclick = () => overlay(null));
  new ResizeObserver(sizeBoard).observe($('#board-wrap'));
}
init();
