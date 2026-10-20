'use strict';
/* =========================================================
   Programitos — juego de programación secuencial de a dos
   ========================================================= */
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const sleep = ms => new Promise(r => setTimeout(r, ms));
const LEVELS = window.LEVELS, WORLDS = window.WORLDS, PER_WORLD = 6;
const DIRS = { u: [0, -1], d: [0, 1], l: [-1, 0], r: [1, 0] };
const ROT = { r: 0, d: 90, l: 180, u: 270 };
const TURN = ['r', 'd', 'l', 'u'];
const REP_BODY_MAX = 3;
const STICKERS = ['🦄', '🐸', '🦖', '🐙', '🦁', '🐼', '🐢', '🦀', '🐬', '🌴', '🍉', '🐳',
  '🐧', '⛄', '🦊', '🦉', '🦌', '🎿', '🚀', '👽', '🪐', '🛸', '🌟', '👑'];
const FRUITS = { A: ['🍎', '🍌', '🍇'], B: ['🍓', '🍊', '🍉'] };
const THEMES = [
  { trees: ['🌳', '🌲', '🌳', '🌳', '🌲'], deco: ['🌷', '🌼', '🌸', '🍄', '🌻'] },
  { trees: ['🌴', '🌴', '🌵', '🌴', '🪨'], deco: ['🐚', '🦀', '🐚', '⛱️', '🐚'] },
  { trees: ['🌲', '🎄', '🌲', '⛄', '🌲'], deco: ['❄️', '🐧', '❄️', '⛄', '❄️'] },
  { trees: ['🪐', '☄️', '🌑', '🪐', '🛰️'], deco: ['✨', '🛸', '✨', '👽', '✨'] }
];
// Manito guía: qué señalar en cada nivel que presenta algo nuevo
const TUTO = { 0: ['r', 'ready'], 4: ['pick', 'ready'], 5: ['blk', 'ready'], 18: ['rep', 'r', 'repn', 'ready'] };

/* ---------- Dibujos (SVG estáticos, sin animaciones internas) ---------- */
function titoSVG() {
  return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <line x1="50" y1="20" x2="50" y2="8" stroke="#1f5fbf" stroke-width="4" stroke-linecap="round"/>
  <circle cx="50" cy="7" r="6" fill="#ffd23f" stroke="#e0a800" stroke-width="2"/>
  <rect x="4" y="42" width="14" height="9" rx="4.5" fill="#1f5fbf"/><rect x="82" y="42" width="14" height="9" rx="4.5" fill="#1f5fbf"/>
  <rect x="30" y="72" width="40" height="14" rx="7" fill="#1f5fbf"/>
  <circle cx="35" cy="89" r="7" fill="#33415c"/><circle cx="65" cy="89" r="7" fill="#33415c"/>
  <rect x="15" y="19" width="70" height="56" rx="22" fill="#4da3ff" stroke="#1f5fbf" stroke-width="4"/>
  <rect x="25" y="30" width="50" height="31" rx="14" fill="#eaf4ff"/>
  <circle cx="40" cy="44" r="6.5" fill="#1d2b45"/><circle cx="60" cy="44" r="6.5" fill="#1d2b45"/>
  <circle cx="42.5" cy="41.5" r="2.4" fill="#fff"/><circle cx="62.5" cy="41.5" r="2.4" fill="#fff"/>
  <path d="M42 53 Q50 59 58 53" stroke="#1d2b45" stroke-width="3" fill="none" stroke-linecap="round"/>
  <circle cx="30.5" cy="54" r="4" fill="#ff9ec7"/><circle cx="69.5" cy="54" r="4" fill="#ff9ec7"/>
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
  <ellipse cx="38" cy="46" rx="6" ry="7.5" fill="#2d2a4a"/><ellipse cx="62" cy="46" rx="6" ry="7.5" fill="#2d2a4a"/>
  <circle cx="40" cy="43" r="2.4" fill="#fff"/><circle cx="64" cy="43" r="2.4" fill="#fff"/>
  <path d="M47 55 L53 55 L50 59 Z" fill="#c93a82"/>
  <path d="M43 61 Q46.5 65 50 61 Q53.5 65 57 61" stroke="#2d2a4a" stroke-width="2.5" fill="none" stroke-linecap="round"/>
  <g stroke="#c93a82" stroke-width="2" stroke-linecap="round"><line x1="22" y1="55" x2="34" y2="57"/><line x1="22" y1="62" x2="34" y2="60"/><line x1="78" y1="55" x2="66" y2="57"/><line x1="78" y1="62" x2="66" y2="60"/></g>
  <circle cx="28" cy="58" r="4.5" fill="#ffb3d6"/><circle cx="72" cy="58" r="4.5" fill="#ffb3d6"/>
</svg>`;
}
function houseSVG(c, dark) {
  return `<svg viewBox="0 0 100 100"><path d="M50 8 L94 46 H81 V90 H19 V46 H6 Z" fill="${c}" stroke="${dark}" stroke-width="5" stroke-linejoin="round"/>
  <rect x="39" y="58" width="22" height="32" rx="5" fill="#fff8e1" stroke="${dark}" stroke-width="4"/>
  <path d="M50 46 C44 38 34 44 42 50 L50 56 L58 50 C66 44 56 38 50 46 Z" fill="#fff"/></svg>`;
}
function padSVG() {
  return `<svg viewBox="0 0 100 100"><ellipse cx="50" cy="66" rx="42" ry="20" fill="#7a7a8c"/><ellipse cx="50" cy="60" rx="42" ry="20" fill="#a3a3b8"/>
  <g class="cap"><ellipse cx="50" cy="52" rx="28" ry="13" fill="#b5132b"/><ellipse class="top" cx="50" cy="46" rx="28" ry="13" fill="#e63946"/></g></svg>`;
}
function gateSVG() {
  return `<svg viewBox="0 0 100 100"><g fill="#c47a3a" stroke="#7a4518" stroke-width="3">
  <rect x="10" y="14" width="14" height="78" rx="4"/><rect x="43" y="14" width="14" height="78" rx="4"/><rect x="76" y="14" width="14" height="78" rx="4"/>
  <rect x="4" y="30" width="92" height="12" rx="4"/><rect x="4" y="64" width="92" height="12" rx="4"/></g>
  <circle cx="50" cy="52" r="14" fill="#ffd23f" stroke="#c99a00" stroke-width="3"/><rect x="45" y="50" width="10" height="9" rx="2" fill="#7a4518"/><path d="M46 50 v-4 a4 4 0 0 1 8 0 v4" stroke="#7a4518" stroke-width="2.5" fill="none"/></svg>`;
}
function arrowSVG(dir) {
  return `<svg viewBox="0 0 40 40" style="transform:rotate(${ROT[dir]}deg)"><path d="M5 15h17V7l14 13-14 13v-8H5z" fill="#fff" stroke="rgba(0,0,0,.25)" stroke-width="2" stroke-linejoin="round"/></svg>`;
}

const P = {
  A: { name: 'Tito', color: '#4da3ff', dark: '#1f5fbf', svg: titoSVG },
  B: { name: 'Lula', color: '#ff8cc6', dark: '#c93a82', svg: lulaSVG }
};

/* ---------- Guardado ---------- */
const SAVE_KEY = 'programitos-v2';
function load() {
  try { const d = JSON.parse(localStorage.getItem(SAVE_KEY)); if (d && d.stars) return d; } catch (e) {}
  return { unlocked: 0, stars: {}, sound: true, voice: true, custom: null };
}
function save() { try { localStorage.setItem(SAVE_KEY, JSON.stringify(S.save)); } catch (e) {} }

/* ---------- Sonido (sintetizado) ---------- */
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
      case 'win': [523, 659, 784, 1046, 784, 1046, 1319].forEach((f, i) => T(f, .2, 'square', .07, i * .12)); [262, 330, 392].forEach(f => T(f, .9, 'triangle', .1, .36)); break;
      case 'clap': this.noise(.12, .5); this.noise(.1, .35, .06); [1046, 1319, 1568, 2093].forEach((f, i) => T(f, .2, 'triangle', .12, .1 + i * .07)); break;
      case 'join': T(arg === 'A' ? 523 : 659, .2, 'triangle', .2); T(arg === 'A' ? 784 : 988, .25, 'triangle', .18, .1); break;
      case 'paint': T(500 + Math.random() * 300, .06, 'triangle', .1); break;
      case 'click': T(700, .05, 'sine', .1); break;
    }
  }
};

/* ---------- Voz: reemplaza la lectura ---------- */
const Voice = {
  v: null,
  pick() {
    if (!window.speechSynthesis) return;
    const vs = speechSynthesis.getVoices();
    this.v = vs.find(v => /es[-_](AR|419|MX|US)/i.test(v.lang)) || vs.find(v => /^es/i.test(v.lang)) || null;
  },
  say(t) {
    if (!S.save.voice || !window.speechSynthesis || !t) return;
    try {
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(t.replace(/[\p{Extended_Pictographic}\u{FE0F}\u{200D}]/gu, ''));
      u.lang = 'es-AR'; if (this.v) u.voice = this.v; u.rate = .95; u.pitch = 1.15;
      speechSynthesis.speak(u);
    } catch (e) {}
  },
  stop() { try { window.speechSynthesis?.cancel(); } catch (e) {} }
};
if (window.speechSynthesis) { Voice.pick(); speechSynthesis.onvoiceschanged = () => Voice.pick(); }

/* ---------- Estado ---------- */
const S = {
  save: load(), idx: 0, L: null, custom: false, grid: null, cols: 0, rows: 0,
  prog: { A: [], B: [] }, ready: { A: false, B: false }, pick: { A: null, B: null }, running: false,
  pos: {}, start: {}, homes: {}, stars: [], pads: [], gates: [], fruits: [], gatesOpen: false,
  got: 0, fails: 0, fast: false, joined: { A: false, B: false }, hf: { A: false, B: false }, sw: { A: false, B: false },
  overlay: null, tuto: null
};
const isPredict = () => S.L.mode === 'predict';
const countOf = p => S.prog[p].reduce((s, it) => s + (it.t === 'rep' ? 1 + it.body.length : 1), 0);
const stepMs = () => S.fast ? 300 : 520;
const worldOf = i => Math.floor(i / PER_WORLD);
const workshopOpen = () => S.save.unlocked >= 2 * PER_WORLD;

function parseProg(s) {
  const out = []; let i = 0;
  while (s && i < s.length) {
    const c = s[i];
    if (/\d/.test(c)) { const j = s.indexOf(')', i); out.push({ t: 'rep', n: +c, body: s.slice(i + 2, j).split(''), open: false }); i = j + 1; }
    else { out.push({ t: 'm', d: c }); i++; }
  }
  return out;
}

/* ---------- Pantallas ---------- */
function show(id) { $$('.screen').forEach(s => s.classList.toggle('active', s.id === id)); }
function overlay(id) {
  $$('.overlay').forEach(o => o.classList.remove('show'));
  S.overlay = id || null;
  if (id) $('#' + id).classList.add('show');
}
function setWorld(w) { document.body.className = 'w' + w; }

/* ---------- Inicio: los dos tocan su personaje ---------- */
function initStart() {
  $('.join-A').insertAdjacentHTML('afterbegin', titoSVG());
  $('.join-B').insertAdjacentHTML('afterbegin', lulaSVG());
  $$('[data-join]').forEach(b => b.onclick = () => join(b.dataset.join));
}
function join(p) {
  if (S.joined.A && S.joined.B) return;
  S.joined[p] = !S.joined[p];
  $('.join-' + p).classList.toggle('on', S.joined[p]);
  if (S.joined[p]) Snd.play('join', p); else Snd.play('del');
  if (S.joined.A && S.joined.B) {
    Snd.play('clap'); confetti(60);
    Voice.say('¡Hola Tito y Lula! ¡A programar juntos!');
    setTimeout(() => { S.joined = { A: false, B: false }; $$('.join').forEach(b => b.classList.remove('on')); openMap(); }, 900);
  } else if (S.joined[p]) Voice.say(p === 'A' ? '¡Hola Tito! ¿Y Lula?' : '¡Hola Lula! ¿Y Tito?');
}

/* ---------- Mapa ---------- */
function openMap() {
  overlay(null); show('scr-map'); Voice.stop(); setWorld(Math.min(3, worldOf(S.save.unlocked)));
  const box = $('#levels'); box.innerHTML = '';
  WORLDS.forEach((W, w) => {
    const row = document.createElement('div');
    const wLocked = w * PER_WORLD > S.save.unlocked;
    row.className = 'world' + (wLocked ? ' locked' : '');
    row.innerHTML = `<div class="w-ico" title="${W.name}">${W.emoji}</div><div class="w-levels"></div>`;
    for (let i = w * PER_WORLD; i < (w + 1) * PER_WORLD && i < LEVELS.length; i++) {
      const L = LEVELS[i], b = document.createElement('button');
      const st = S.save.stars[i] || 0, locked = i > S.save.unlocked;
      b.className = 'lv' + (st ? ' done' : '') + (i === S.save.unlocked && !st ? ' current' : '');
      b.disabled = locked;
      const tag = L.mode === 'predict' ? '🤔' : L.pre ? '🐛' : '';
      b.innerHTML = locked ? '<span class="lock">🔒</span>' :
        `<span class="n">${i + 1}</span><span class="st">${'⭐'.repeat(st)}<i>${'⭐'.repeat(3 - st)}</i></span>${tag ? `<span class="tag">${tag}</span>` : ''}`;
      b.onclick = () => { Snd.play('click'); startLevel(i); };
      row.querySelector('.w-levels').appendChild(b);
    }
    box.appendChild(row);
  });
  $('#btn-workshop').classList.toggle('locked', !workshopOpen());
}

/* ---------- Paneles ---------- */
function buildPanel(p) {
  const el = $('#panel-' + p), isA = p === 'A';
  const k = isA ? { u: 'W', l: 'A', d: 'S', r: 'D', rep: 'R', back: 'Q', ready: 'E' }
                : { u: '↑', l: '←', d: '↓', r: '→', rep: 'Shift', back: '⌫', ready: 'Enter' };
  el.innerHTML = `
    <div class="p-head"><div class="avatar">${P[p].svg()}</div><div class="order" id="order-${p}"></div></div>
    <div class="prog" id="prog-${p}"></div>
    <div class="palette">
      <button class="pal up d-u" data-act="u">${arrowSVG('u')}<span class="key">${k.u}</span></button>
      <button class="pal left d-l" data-act="l">${arrowSVG('l')}<span class="key">${k.l}</span></button>
      <button class="pal down d-d" data-act="d">${arrowSVG('d')}<span class="key">${k.d}</span></button>
      <button class="pal right d-r" data-act="r">${arrowSVG('r')}<span class="key">${k.r}</span></button>
      <button class="pal rp" data-act="rep"><span class="rp-txt">🔁</span><span class="key">${k.rep}</span></button>
    </div>
    <div class="predict">${FRUITS[p].map((f, i) => `<button class="pick-btn" data-pick="${i}">${f}</button>`).join('')}</div>
    <div class="p-actions">
      <button class="act" data-act="back" title="Borrar el último">⌫<span class="key">${k.back}</span></button>
      <button class="act" data-act="clear" title="Borrar todo">🗑️</button>
    </div>
    <button class="ready" data-act="ready"><span class="ready-txt">▶</span><span class="key">${k.ready}</span></button>`;
  el.onclick = e => {
    const b = e.target.closest('button'); if (!b || S.running || S.overlay) return;
    if (b.dataset.act) return act(p, b.dataset.act);
    if (b.dataset.pick !== undefined) return pick(p, +b.dataset.pick);
    if (isPredict()) return;
    if (b.dataset.n !== undefined) return cycleRep(p, +b.dataset.n);
    if (b.dataset.i !== undefined) return rotateAt(p, +b.dataset.i, b.dataset.j !== undefined ? +b.dataset.j : undefined);
  };
}

function act(p, a) {
  if (S.running || S.overlay) return;
  if (a === 'ready') return toggleReady(p);
  if (isPredict()) return;
  const prog = S.prog[p], last = prog[prog.length - 1];
  const openRep = last && last.t === 'rep' && last.open ? last : null;
  unready(p);
  if (DIRS[a]) {
    if (!S.L.tools.includes(a)) return;
    if (countOf(p) >= S.L.max) return full(p);
    if (openRep) { openRep.body.push(a); if (openRep.body.length >= REP_BODY_MAX) openRep.open = false; }
    else prog.push({ t: 'm', d: a });
    Snd.play('add', a); pressFx(p, a);
  } else if (a === 'rep') {
    if (!S.L.tools.includes('rep')) return;
    if (openRep) { openRep.open = false; Snd.play('ready'); }
    else { if (countOf(p) >= S.L.max) return full(p); prog.push({ t: 'rep', n: 2, body: [], open: true }); Snd.play('rep'); }
  } else if (a === 'back') {
    if (!last) return;
    if (last.t === 'rep' && last.body.length) { last.body.pop(); last.open = true; }
    else prog.pop();
    Snd.play('del');
  } else if (a === 'clear') {
    if (!prog.length) return;
    S.prog[p] = []; Snd.play('del');
  }
  tutoDone(p, a);
  renderProg(p);
}
function pressFx(p, a) {
  const b = $(`#panel-${p} [data-act="${a}"]`); if (!b) return;
  b.classList.add('press'); setTimeout(() => b.classList.remove('press'), 120);
}
function full(p) {
  Snd.play('full');
  const pr = $('#prog-' + p); pr.style.borderColor = '#e63946'; setTimeout(() => pr.style.borderColor = '', 400);
}
function cycleRep(p, i) {
  const it = S.prog[p][i]; if (!it) return;
  it.n = it.n >= 9 ? 2 : it.n + 1; unready(p);
  Snd.play('add', 'u'); tutoDone(p, 'repn'); renderProg(p);
}
// Tocar una flecha del programa la gira (sirve para arreglar "bichitos")
function rotateAt(p, i, j) {
  const it = S.prog[p][i]; if (!it) return;
  const dirs = TURN.filter(d => S.L.tools.includes(d)); if (dirs.length < 2) return;
  const next = d => dirs[(dirs.indexOf(d) + 1) % dirs.length];
  if (j !== undefined) it.body[j] = next(it.body[j]); else if (it.t === 'm') it.d = next(it.d); else return;
  unready(p); Snd.play('add', j !== undefined ? it.body[j] : it.d); tutoDone(p, 'blk'); renderProg(p);
}
function pick(p, i) {
  if (!isPredict()) return;
  S.pick[p] = i; unready(p); Snd.play('add', 'r');
  $$(`#panel-${p} .pick-btn`).forEach((b, k) => b.classList.toggle('on', k === i));
  S.fruits.filter(f => f.p === p).forEach(f => { f.el.classList.toggle('pick', f.i === i); f.el.classList.toggle('dim', f.i !== i); });
  tutoDone(p, 'pick'); renderProg(p);
}
function renderProg(p) {
  const prog = S.prog[p], max = S.L.max, n = countOf(p), ro = isPredict() ? ' ro' : '';
  // Estilo code.org: bloque de inicio arriba y bloques encastrados en columna
  const dots = isPredict() ? '' : `<span class="dots">${'●'.repeat(Math.min(n, 14))}<i>${'●'.repeat(Math.max(0, Math.min(max, 14) - n))}</i></span>`;
  let h = `<div class="hat"><span class="hat-go">▶</span>${dots}</div>`;
  prog.forEach((it, i) => {
    if (it.t === 'm') h += `<button class="blk d-${it.d}${ro}" data-i="${i}">${arrowSVG(it.d)}</button>`;
    else h += `<div class="rep${it.open ? ' open' : ''}" data-ri="${i}"><div class="rep-head"><span class="rep-ico">🔁</span><button class="rep-n" data-n="${i}">×${it.n}</button></div><div class="rep-body">` +
      it.body.map((d, j) => `<button class="blk d-${d}${ro}" data-i="${i}" data-j="${j}">${arrowSVG(d)}</button>`).join('') +
      (it.open ? '<span class="slot">+</span>' : '') + '</div><div class="rep-foot"></div></div>';
  });
  const last0 = prog[prog.length - 1];
  if (!isPredict() && n < max && !(last0 && last0.t === 'rep' && last0.open)) h += '<span class="slot"></span>';
  $('#prog-' + p).innerHTML = h;
  const last = prog[prog.length - 1], open = last && last.t === 'rep' && last.open;
  const rp = $(`#panel-${p} .pal.rp`);
  rp.classList.toggle('closing', !!open);
  rp.querySelector('.rp-txt').textContent = open ? '✔️' : '🔁';
  $(`#panel-${p} .ready`).disabled = isPredict() ? S.pick[p] === null : n === 0;
  placeTuto(p);
}
function setTools() {
  for (const p of ['A', 'B']) {
    ['u', 'd', 'l', 'r'].forEach(d => $(`#panel-${p} [data-act="${d}"]`).classList.toggle('hide', !S.L.tools.includes(d)));
    $(`#panel-${p} .pal.rp`).style.display = S.L.tools.includes('rep') ? '' : 'none';
    $('#panel-' + p).classList.toggle('mode-predict', isPredict());
    $$(`#panel-${p} .pick-btn`).forEach(b => b.classList.remove('on'));
    const first = (S.L.first || 'A') === p, coop = S.L.map.some(r => r.includes('o'));
    $('#order-' + p).textContent = coop ? (first ? '1️⃣' : '2️⃣') : '';
  }
}

/* ---------- Manito guía ---------- */
function tutoTarget(p, step) {
  const panel = '#panel-' + p;
  return { r: `${panel} [data-act="r"]`, ready: `${panel} .ready`, pick: `${panel} .pick-btn`, rep: `${panel} .pal.rp`,
    repn: `${panel} .rep-n`, blk: `${panel} .prog .blk` }[step];
}
function placeTuto(p) {
  $$(`.tuto-hand[data-p="${p}"]`).forEach(h => h.remove());
  if (!S.tuto || S.running) return;
  const step = S.tuto[p][0]; if (!step) return;
  const t = $(tutoTarget(p, step)); if (!t) return;
  const panel = $('#panel-' + p), pr = panel.getBoundingClientRect(), br = t.getBoundingClientRect();
  if (!br.width) return;
  const h = document.createElement('div'); h.className = 'tuto-hand'; h.dataset.p = p; h.textContent = '👆';
  h.style.left = (br.left - pr.left + br.width / 2) + 'px'; h.style.top = (br.top - pr.top + br.height * .55) + 'px';
  panel.appendChild(h);
}
function tutoDone(p, step) {
  if (!S.tuto || S.tuto[p][0] !== step) return;
  S.tuto[p].shift(); placeTuto(p);
}

/* ---------- Listo (los dos tienen que apretar) ---------- */
function toggleReady(p) {
  if (isPredict() ? S.pick[p] === null : !countOf(p)) return;
  S.ready[p] = !S.ready[p];
  const b = $(`#panel-${p} .ready`);
  b.classList.toggle('on', S.ready[p]);
  b.querySelector('.ready-txt').textContent = S.ready[p] ? '✅' : '▶';
  if (S.ready[p]) {
    Snd.play('ready'); tutoDone(p, 'ready');
    const o = p === 'A' ? 'B' : 'A';
    if (S.ready[o]) run();
    else { setBubble(`✅ ⏳ ${o === 'A' ? '🤖' : '🐱'}`); Voice.say(`¡Esperando a ${P[o].name}!`); }
  } else Snd.play('del');
}
function unready(p) {
  S.ready[p] = false;
  const b = $(`#panel-${p} .ready`); b.classList.remove('on'); b.querySelector('.ready-txt').textContent = '▶';
}

/* ---------- Nivel ---------- */
function startLevel(i, customL) {
  S.custom = !!customL; S.idx = i; S.L = customL || LEVELS[i]; S.fails = 0;
  S.prog = { A: parseProg(S.L.pre?.A), B: parseProg(S.L.pre?.B) };
  S.ready = { A: false, B: false }; S.pick = { A: null, B: null };
  S.tuto = !S.custom && TUTO[i] ? { A: [...TUTO[i]], B: [...TUTO[i]] } : null;
  overlay(null); show('scr-game'); setWorld(S.custom ? 0 : worldOf(i));
  $('#lvl-num').textContent = S.custom ? '🛠️' : i + 1;
  $('#lvl-world').textContent = S.custom ? '' : WORLDS[worldOf(i)].emoji;
  $('#btn-hint').classList.remove('glow');
  setTools(); parseLevel(); renderBoard();
  ['A', 'B'].forEach(p => { unready(p); renderProg(p); });
  setBubble(S.L.text);
  setTimeout(() => { Voice.say(S.L.say || S.L.text); ['A', 'B'].forEach(placeTuto); }, 250);
}
function setBubble(t) { $('#bubble-text').textContent = t; }
function parseLevel() {
  const m = S.L.map; S.rows = m.length; S.cols = m[0].length;
  S.grid = m.map(r => r.split(''));
  S.stars = []; S.pads = []; S.gates = []; S.homes = {}; S.start = {};
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
  return c === null || c === '#' || c === 'R' || c === '~' || (c === 'D' && !gatesOpen);
}
function hash(x, y) { return (x * 7 + y * 13 + S.idx * 3) % 5; }

function renderBoard() {
  const b = $('#board'), th = THEMES[S.custom ? 0 : worldOf(S.idx)];
  let html = '';
  S.grid.forEach((row, y) => row.forEach((c, x) => {
    const inner = c === '#' ? th.trees[hash(x, y)] : c === 'R' ? '🪨' : c === 'f' ? `<span class="flower">${th.deco[hash(x, y)]}</span>` : '';
    html += `<div class="tile ${c === '~' ? 'water' : 'g' + ((x + y) % 2)}" style="--x:${x};--y:${y}">${inner}</div>`;
  }));
  b.innerHTML = html;
  const ent = (cls, x, y, inner) => {
    const e = document.createElement('div'); e.className = 'ent ' + cls;
    e.style.setProperty('--x', x); e.style.setProperty('--y', y); e.innerHTML = inner; b.appendChild(e); return e;
  };
  for (const p of ['A', 'B']) if (S.homes[p]) S.homes[p].el = ent('home', S.homes[p].x, S.homes[p].y, houseSVG(P[p].color, P[p].dark));
  S.pads.forEach(pd => pd.el = ent('pad', pd.x, pd.y, padSVG()));
  S.gates.forEach(g => g.el = ent('gate', g.x, g.y, gateSVG()));
  S.stars.forEach(s => s.el = ent('star', s.x, s.y, '⭐'));
  S.fruits = [];
  if (isPredict()) for (const p of ['A', 'B']) S.L.opts[p].forEach(([x, y], i) => S.fruits.push({ p, i, x, y, el: ent('fruit f' + p, x, y, FRUITS[p][i]) }));
  for (const p of ['A', 'B']) {
    const r = ent('robot r-' + p, 0, 0, `<div class="sprite"><div class="flip">${P[p].svg()}</div></div><div class="fx"></div>`);
    S.pos[p] = { el: r };
  }
  resetRun();
  sizeBoard();
}
function sizeBoard() {
  if (!S.L || !$('#scr-game').classList.contains('active')) return;
  fitBoard($('#board'), $('#board-wrap'), S.cols, S.rows);
}
function fitBoard(b, w, cols, rows) {
  const cell = Math.max(30, Math.min(120, Math.floor(Math.min((w.clientWidth - 24) / cols, (w.clientHeight - 24) / rows))));
  b.style.setProperty('--cell', cell + 'px');
  b.style.width = cell * cols + 'px'; b.style.height = cell * rows + 'px';
}
function placeRobot(p, x, y) {
  const r = S.pos[p]; r.x = x; r.y = y;
  r.el.style.setProperty('--x', x); r.el.style.setProperty('--y', y);
}
function initialLeft(p) {
  if (S.homes[p]) return S.homes[p].x < S.start[p].x;
  const firstH = flatten(S.prog[p]).find(s => s.d === 'l' || s.d === 'r');
  return firstH ? firstH.d === 'l' : S.start[p].x > S.cols / 2;
}
function resetRun() {
  for (const p of ['A', 'B']) {
    const r = S.pos[p]; r.el.style.transition = 'none';
    placeRobot(p, S.start[p].x, S.start[p].y);
    r.el.className = 'ent robot r-' + p + (initialLeft(p) ? ' left' : '');
    void r.el.offsetWidth; r.el.style.transition = '';
    S.homes[p]?.el.classList.remove('glow');
  }
  S.stars.forEach(s => { s.got = false; s.el.classList.remove('got'); });
  S.pads.forEach(pd => pd.el.classList.remove('on'));
  S.gates.forEach(g => g.el.classList.remove('open'));
  S.gatesOpen = false; S.got = 0;
  $$('#board .foot').forEach(f => f.remove());
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
  const el = $(sel); if (el) el.classList.add('run');
  if (st.j !== undefined) {
    const rep = $(`#prog-${p} [data-ri="${st.i}"]`);
    if (rep) { rep.classList.add('run'); rep.dataset.iter = `${st.k + 1}/${st.n}`; }
  }
}
function fx(p, emoji) {
  const f = S.pos[p].el.querySelector('.fx');
  f.textContent = emoji; f.classList.remove('show'); void f.offsetWidth; f.classList.add('show');
}

async function run() {
  if (S.running) return;
  S.running = true; Voice.stop();
  $$('.tuto-hand').forEach(h => h.remove());
  resetRun();
  $$('.panel').forEach(p => p.classList.add('locked'));
  await countdown();
  const order = (S.L.first || 'A') === 'A' ? ['A', 'B'] : ['B', 'A'];
  $('#board').style.setProperty('--step', (stepMs() * .85) / 1000 + 's');
  for (const p of order) {
    $$('.panel').forEach(el => el.classList.toggle('active', el.dataset.p === p));
    setBubble(p === 'A' ? '🤖 👣' : '🐱 👣');
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
    await sleep(t === '¡YA!' ? 450 : 550);
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
      Snd.play('bump'); fx(p, '💫');
      await sleep(600); r.el.classList.add('dizzy');
      const c = cellAt(nx, ny);
      return { ok: false, reason: c === null ? 'edge' : c === '~' ? 'water' : c === 'D' ? 'gate' : 'bump' };
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
  let target = S.homes[p];
  if (isPredict()) { const [x, y] = S.L.opts[p][S.pick[p]]; target = { x, y }; }
  if (r.x !== target.x || r.y !== target.y) { r.el.classList.add('sad'); fx(p, '❓'); return { ok: false, reason: isPredict() ? 'guess' : 'nohome' }; }
  S.homes[p]?.el.classList.add('glow'); r.el.classList.add('dance'); Snd.play('home'); fx(p, '❤️');
  return { ok: true };
}

/* ---------- Resultado ---------- */
function fail(p, reason) {
  S.running = false; S.fails++;
  const n = P[p].name;
  const why = { bump: '💥', edge: '🚫', water: '💦', gate: '🔒', nohome: '🏠 ❓', guess: `${FRUITS[p][S.pick[p]] || ''} ❌` }[reason] || '💥';
  const say = {
    bump: `¡Ups! ${n} se chocó. ¡Prueben otra vez!`,
    edge: `¡Ups! ${n} se quiso salir del mapa.`,
    water: `¡Splash! ${n} se cayó al agua.`,
    gate: '¡La puerta está cerrada! Primero hay que pisar el botón rojo.',
    nohome: `¡Casi! ${n} no llegó a su casita.`,
    guess: `¡Uy! ${n} terminó en otro lugar. ¡Miren las flechas otra vez!`
  }[reason];
  Snd.play('fail');
  setTimeout(() => {
    const face = $('#fail-face'); face.innerHTML = P[p].svg();
    face.classList.remove('bump'); void face.offsetWidth; face.classList.add('bump');
    $('#fail-why').textContent = why;
    overlay('ov-fail'); Voice.say(say);
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
  Snd.play('win'); confetti(90);
  const total = S.stars.length, rating = (total === 0 || S.got === total) ? 3 : 2;
  if (!S.custom) {
    S.save.stars[S.idx] = Math.max(S.save.stars[S.idx] || 0, rating);
    S.save.unlocked = Math.max(S.save.unlocked, Math.min(S.idx + 1, LEVELS.length - 1));
    save();
  }
  await sleep(900);
  $('#win-stars').innerHTML = [0, 1, 2].map(k => `<span class="${k < rating ? '' : 'empty'}" style="animation-delay:${.15 + k * .25}s">⭐</span>`).join('');
  $('#win-A').innerHTML = titoSVG(); $('#win-B').innerHTML = lulaSVG();
  $('#win-sticker').textContent = S.custom ? '🛠️' : STICKERS[S.idx];
  S.hf = { A: false, B: false };
  $$('#ov-win .hf').forEach(h => h.classList.remove('on')); $('#ov-win .hf-btns').classList.remove('clap');
  overlay('ov-win');
  [0, 1, 2].forEach(k => k < rating && setTimeout(() => Snd.play('star'), 150 + k * 250));
  Voice.say(['¡Genial!', '¡Excelente!', '¡Bravo!', '¡Súper!'][Math.floor(Math.random() * 4)] +
    (rating < 3 ? ' Les faltaron estrellas.' : '') + ' ¡Chóquenla!');
}
function highFive(p) {
  if (S.overlay !== 'ov-win' || S.hf[p]) return;
  S.hf[p] = true; $('#ov-win .hf-' + p).classList.add('on'); Snd.play('join', p);
  if (!(S.hf.A && S.hf.B)) return;
  $('#ov-win .hf-btns').classList.add('clap'); Snd.play('clap'); confetti(60);
  setTimeout(() => {
    if (S.custom) return openEditor();
    const next = S.idx + 1;
    if (next >= LEVELS.length) return finale();
    if (next % PER_WORLD === 0) return worldDone(worldOf(next));
    startLevel(next);
  }, 800);
}
// Fin de mundo: festejo + cambian de lugar (cada chico prueba el otro personaje)
function worldDone(w) {
  $('#world-next').textContent = WORLDS[w].emoji;
  $('#swap-A').innerHTML = titoSVG(); $('#swap-B').innerHTML = lulaSVG();
  const sw = $('#swap'); sw.classList.remove('go'); void sw.offsetWidth; sw.classList.add('go');
  S.sw = { A: false, B: false }; $$('#ov-world .hf').forEach(h => h.classList.remove('on'));
  overlay('ov-world'); Snd.play('win'); confetti(120);
  Voice.say(`¡Terminaron un mundo! Ahora, ¡cambien de lugar! El que era Tito ahora es Lula. Cuando estén sentados, toquen el pulgar.`);
}
function swapReady(p) {
  if (S.overlay !== 'ov-world' || S.sw[p]) return;
  S.sw[p] = true; $('#ov-world .hf-' + p).classList.add('on'); Snd.play('join', p);
  if (S.sw.A && S.sw.B) { Snd.play('clap'); setTimeout(() => startLevel(S.idx + 1), 600); }
}
function finale() {
  $('#final-A').innerHTML = titoSVG(); $('#final-B').innerHTML = lulaSVG();
  overlay('ov-final'); Snd.play('win'); confetti(150);
  Voice.say('¡Felicitaciones! ¡Son programadores! Ahora pueden inventar sus propios niveles en el taller.');
}

/* ---------- Pista: huellitas ---------- */
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
  $$('#board .foot').forEach(f => f.remove());
  const first = S.L.first || 'A';
  for (const p of ['A', 'B']) {
    let path;
    if (isPredict()) {
      path = [S.start[p]]; let { x, y } = S.start[p];
      for (const st of flatten(parseProg(S.L.pre[p]))) { x += DIRS[st.d][0]; y += DIRS[st.d][1]; path.push({ x, y }); }
      path.push({});
    } else if (p === first && S.pads.length) {
      path = bfs(S.start[p], S.pads[0], false).concat(bfs(S.pads[0], S.homes[p], false).slice(1));
    } else path = bfs(S.start[p], S.homes[p], true);
    path.slice(1, -1).forEach(c => {
      const f = document.createElement('div'); f.className = 'ent foot';
      f.style.setProperty('--x', c.x); f.style.setProperty('--y', c.y);
      f.textContent = p === 'A' ? '👣' : '🐾';
      $('#board').appendChild(f);
    });
  }
  setBubble('👣 🐾');
  Voice.say('¡Sigan las huellitas y cuenten los pasos!');
  setTimeout(() => $$('#board .foot').forEach(f => f.remove()), 6000);
}

/* ---------- Taller: inventar niveles ---------- */
const ED_COLS = 7, ED_ROWS = 5;
const ED_TOOLS = [
  { c: '#', ico: () => '🌳' }, { c: '~', ico: () => '🌊' }, { c: '*', ico: () => '⭐' }, { c: '.', ico: () => '🧽' },
  { c: 'A', ico: titoSVG }, { c: 'a', ico: () => houseSVG(P.A.color, P.A.dark) },
  { c: 'B', ico: lulaSVG }, { c: 'b', ico: () => houseSVG(P.B.color, P.B.dark) },
  { c: 'o', ico: padSVG }, { c: 'D', ico: gateSVG }
];
const ED = { tool: '#', grid: null, painting: false };
function edDefault() {
  return ['A.....a', '.......', '.......', '.......', 'B.....b'].map(r => r.split(''));
}
function openEditor() {
  if (!workshopOpen()) { Snd.play('full'); Voice.say('El taller se abre cuando terminen la playa.'); return; }
  overlay(null); Voice.stop(); setWorld(0); show('scr-editor');
  ED.grid = S.save.custom ? S.save.custom.map(r => r.split('')) : edDefault();
  $('#ed-tools').innerHTML = ED_TOOLS.map(t => `<button class="ed-tool${t.c === ED.tool ? ' on' : ''}" data-c="${t.c}">${t.ico()}</button>`).join('') +
    '<button class="ed-tool wide" id="ed-clear">🗑️</button><button class="ed-tool wide ed-play" id="ed-play">▶</button>';
  $$('#ed-tools [data-c]').forEach(b => b.onclick = () => {
    ED.tool = b.dataset.c; Snd.play('click');
    $$('#ed-tools [data-c]').forEach(x => x.classList.toggle('on', x === b));
  });
  $('#ed-clear').onclick = () => { ED.grid = edDefault(); Snd.play('del'); edRender(); };
  $('#ed-play').onclick = edPlay;
  edRender();
  Voice.say('¡Inventen un nivel! Elijan un dibujo y toquen el tablero. Después, ¡a jugar!');
}
function edIcon(c, x, y) {
  if (c === '#') return '🌳'; if (c === '*') return '⭐';
  if (c === 'A') return titoSVG(); if (c === 'B') return lulaSVG();
  if (c === 'a') return houseSVG(P.A.color, P.A.dark); if (c === 'b') return houseSVG(P.B.color, P.B.dark);
  if (c === 'o') return padSVG(); if (c === 'D') return gateSVG();
  return '';
}
function edRender() {
  const b = $('#ed-board');
  b.innerHTML = ED.grid.map((row, y) => row.map((c, x) =>
    `<div class="tile ${c === '~' ? 'water' : 'g' + ((x + y) % 2)}" data-x="${x}" data-y="${y}" style="--x:${x};--y:${y}">${edIcon(c, x, y)}</div>`).join('')).join('');
  fitBoard(b, $('#ed-wrap'), ED_COLS, ED_ROWS);
  S.save.custom = ED.grid.map(r => r.join('')); save();
}
function edPaint(t) {
  const x = +t.dataset.x, y = +t.dataset.y, c = ED.tool;
  if (ED.grid[y][x] === c) return;
  if ('AaBb'.includes(c)) ED.grid.forEach(r => r.forEach((v, i) => { if (v === c) r[i] = '.'; }));
  ED.grid[y][x] = c; Snd.play('paint'); edRender();
}
function edPlay() {
  const map = ED.grid.map(r => r.join(''));
  const has = c => map.some(r => r.includes(c));
  let say = null;
  if (!has('A') || !has('a')) say = 'Falta Tito o su casita.';
  else if (!has('B') || !has('b')) say = 'Falta Lula o su casita.';
  if (!say) {
    // Probamos que se pueda resolver: Tito camina primero (puede abrir la puerta)
    S.L = { map, mode: null }; parseLevel(); S.idx = 0;
    const A = bfs(S.start.A, S.homes.A, false).length, B = bfs(S.start.B, S.homes.B, true).length;
    if (!A) say = '¡Tito no puede llegar a su casita!';
    else if (!B) say = '¡Lula no puede llegar a su casita!';
    else if (S.gates.length && (!S.pads.length || !bfs(S.start.A, S.pads[0], false).length)) say = 'Tito tiene que poder pisar el botón rojo.';
  }
  if (say) { Snd.play('fail'); Voice.say(say); const b = $('#ed-board'); b.classList.remove('shake'); b.animate([{ transform: 'translateX(-8px)' }, { transform: 'translateX(8px)' }, { transform: 'none' }], 300); return; }
  Snd.play('go');
  startLevel(0, { custom: true, text: '🛠️ ⭐', say: '¡A jugar su nivel!', tools: ['u', 'd', 'l', 'r', 'rep'], max: 12, first: 'A', map });
}

/* ---------- Confeti (liviano) ---------- */
const cv = $('#confetti'), cx = cv.getContext('2d');
let parts = [], confRAF = null;
function confetti(n) {
  cv.width = innerWidth; cv.height = innerHeight;
  const cols = ['#3b8cff', '#ff5fa8', '#ffd23f', '#2ec27e', '#9b5de5', '#ff9f1c'];
  for (let i = 0; i < n; i++) parts.push({
    x: innerWidth / 2 + (Math.random() - .5) * innerWidth * .6, y: innerHeight * .35,
    vx: (Math.random() - .5) * 14, vy: -Math.random() * 14 - 4, s: Math.random() * 8 + 6,
    c: cols[i % cols.length], life: 90 + Math.random() * 30
  });
  parts = parts.slice(-150);
  if (!confRAF) confRAF = requestAnimationFrame(tickConf);
}
function tickConf() {
  cx.clearRect(0, 0, cv.width, cv.height);
  parts = parts.filter(p => p.life-- > 0 && p.y < cv.height);
  for (const p of parts) {
    p.vy += .4; p.x += p.vx; p.y += p.vy;
    cx.fillStyle = p.c; cx.fillRect(p.x, p.y, p.s, p.s * .6);
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
    syncToggles();
  } else { const i = $('#t-ans'); i.classList.add('bad'); setTimeout(() => i.classList.remove('bad'), 500); }
}

/* ---------- Teclado (dos jugadores en la misma compu) ---------- */
const KEYS_A = { KeyW: 'u', KeyA: 'l', KeyS: 'd', KeyD: 'r', KeyR: 'rep', KeyQ: 'back', KeyE: 'ready' };
const KEYS_B = { ArrowUp: 'u', ArrowLeft: 'l', ArrowDown: 'd', ArrowRight: 'r', ShiftRight: 'rep', Backspace: 'back', Enter: 'ready', NumpadEnter: 'ready' };
document.addEventListener('keydown', e => {
  if (e.target.tagName === 'INPUT') { if (e.key === 'Enter') checkTeacher(); return; }
  if (e.repeat) return;
  Snd.init();
  const scr = $('.screen.active').id, pA = KEYS_A[e.code], pB = KEYS_B[e.code];
  if (pB) e.preventDefault();
  const A = e.code === 'KeyE', B = pB === 'ready';
  if (scr === 'scr-start') { if (A) join('A'); if (B) join('B'); return; }
  if (S.overlay === 'ov-win') { if (A) highFive('A'); if (B) highFive('B'); return; }
  if (S.overlay === 'ov-world') { if (A) swapReady('A'); if (B) swapReady('B'); return; }
  if (S.overlay === 'ov-fail') { if (A || B || e.code === 'Space') retry(); return; }
  if (S.overlay) { if (e.code === 'Escape') overlay(null); return; }
  if (scr !== 'scr-game' || S.running) return;
  if (pA) act('A', pA); else if (pB) act('B', pB);
});

/* ---------- Arranque ---------- */
function syncToggles() {
  $$('.snd-toggle').forEach(b => { b.textContent = S.save.sound ? '🔊' : '🔇'; b.classList.toggle('off', !S.save.sound); });
  $('#btn-speed').textContent = S.fast ? '🐇' : '🐢';
  $('#t-voice').textContent = '🗣️ Voz: ' + (S.save.voice ? 'sí' : 'no');
}
function init() {
  initStart(); buildPanel('A'); buildPanel('B'); syncToggles();
  document.addEventListener('pointerdown', () => Snd.init(), { once: true });
  $('#map-back').onclick = () => show('scr-start');
  $('#btn-map').onclick = () => { if (S.running) return; S.custom ? openEditor() : openMap(); };
  $('#btn-hint').onclick = hint;
  $('#btn-say').onclick = () => Voice.say(S.L?.say || $('#bubble-text').textContent);
  $('#btn-speed').onclick = () => { S.fast = !S.fast; syncToggles(); Snd.play('click'); };
  $$('.snd-toggle').forEach(b => b.onclick = () => { S.save.sound = !S.save.sound; save(); syncToggles(); Snd.play('click'); });
  $('#t-voice').onclick = () => { S.save.voice = !S.save.voice; save(); syncToggles(); if (S.save.voice) Voice.say('¡Hola!'); else Voice.stop(); };
  $('#btn-full').onclick = () => { if (!document.fullscreenElement) document.documentElement.requestFullscreen?.().catch(() => {}); else document.exitFullscreen?.(); };
  $('#btn-retry').onclick = retry;
  $$('[data-hf]').forEach(b => b.onclick = () => highFive(b.dataset.hf));
  $$('[data-sw]').forEach(b => b.onclick = () => swapReady(b.dataset.sw));
  $('#btn-album').onclick = openAlbum;
  $('#btn-workshop').onclick = openEditor;
  $('#final-album').onclick = openAlbum;
  $('#final-workshop').onclick = openEditor;
  $('#final-map').onclick = openMap;
  $('#ed-back').onclick = openMap;
  $('#btn-teacher').onclick = openTeacher;
  $('#t-ok').onclick = checkTeacher;
  $('#t-unlock').onclick = () => { S.save.unlocked = LEVELS.length - 1; save(); openMap(); };
  $('#t-reset').onclick = () => { S.save.unlocked = 0; S.save.stars = {}; save(); openMap(); };
  $('#t-levels').onclick = e => { const b = e.target.closest('[data-go]'); if (b) startLevel(+b.dataset.go); };
  $$('[data-close]').forEach(b => b.onclick = () => overlay(null));
  // Taller: tocar o arrastrar para pintar
  const eb = $('#ed-board');
  eb.addEventListener('pointerdown', e => { const t = e.target.closest('.tile'); if (!t) return; ED.painting = true; edPaint(t); });
  eb.addEventListener('pointermove', e => { if (!ED.painting) return; const t = document.elementFromPoint(e.clientX, e.clientY)?.closest('#ed-board .tile'); if (t) edPaint(t); });
  window.addEventListener('pointerup', () => ED.painting = false);
  const onResize = () => {
    sizeBoard();
    if ($('#scr-editor').classList.contains('active')) fitBoard($('#ed-board'), $('#ed-wrap'), ED_COLS, ED_ROWS);
    if (S.tuto) ['A', 'B'].forEach(placeTuto);
  };
  window.addEventListener('resize', onResize);
  new ResizeObserver(onResize).observe($('#board-wrap'));
}
init();
