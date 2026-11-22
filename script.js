/* =========================================================================
   Flores-Marina — regalo para Marina
   Flores de limpiapipas (pipe cleaner flowers)
   Puedes plantar flores haciendo clic en cualquier parte de la pantalla.
   Personaliza colores en PALETTES / STEM_* y textos en index.html
   ========================================================================= */

/* ---------- Pétalos cayendo (fondo) ---------- */
const canvas = document.getElementById('petals');
const ctx = canvas.getContext('2d');
let W, H;
const petals = [];
const PETAL_COLORS = ['#f4a9b8', '#e88ba0', '#f7c1cd', '#e8576f', '#f2b08a', '#c5a3e0'];

function resize() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

function makePetal() {
  return {
    x: Math.random() * W,
    y: -20 - Math.random() * H,
    size: 6 + Math.random() * 10,
    speed: 0.5 + Math.random() * 1.4,
    sway: Math.random() * Math.PI * 2,
    swaySpeed: 0.01 + Math.random() * 0.02,
    rot: Math.random() * Math.PI * 2,
    rotSpeed: (Math.random() - 0.5) * 0.04,
    color: PETAL_COLORS[(Math.random() * PETAL_COLORS.length) | 0],
    opacity: 0.4 + Math.random() * 0.5
  };
}
for (let i = 0; i < 60; i++) petals.push(makePetal());

function drawPetal(p) {
  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.rotate(p.rot);
  ctx.globalAlpha = p.opacity;
  ctx.fillStyle = p.color;
  ctx.beginPath();
  ctx.ellipse(0, 0, p.size, p.size * 0.6, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function tick() {
  ctx.clearRect(0, 0, W, H);
  for (const p of petals) {
    p.y += p.speed;
    p.x += Math.sin(p.sway) * 0.6;
    p.sway += p.swaySpeed;
    p.rot += p.rotSpeed;
    if (p.y > H + 30) {
      Object.assign(p, makePetal());
      p.y = -20;
    }
    drawPetal(p);
  }
  requestAnimationFrame(tick);
}
tick();

/* ---------- Plantar flores (limpiapipas) ---------- */
const GARDEN = document.getElementById('garden');
const COUNT = document.getElementById('count');
let count = 0;

const PALETTES = {
  pink:   ['#ff5f9e', '#ff87b5', '#ff2e8a'],
  red:    ['#ff3b30', '#ff6b5e', '#e02020'],
  orange: ['#ff8a00', '#ffa733', '#ff6a00'],
  yellow: ['#ffd60a', '#ffe066', '#ffc300'],
  purple: ['#a45cff', '#c08bff', '#8a2bff'],
  blue:   ['#38b6ff', '#6ccbff', '#0090e0'],
  teal:   ['#1fd6a0', '#5ee6c0', '#00b884'],
  white:  ['#f5f5f7', '#ffffff', '#e6e6ee']
};
const PALETTE_KEYS = Object.keys(PALETTES);
const STEM_GREEN = '#2fae66';
const STEM_LIGHT = '#8ce8b5';
const CENTERS = ['#ffd60a', '#ff9d00', '#ff5f9e', '#ffffff'];

function pick(arr) { return arr[(Math.random() * arr.length) | 0]; }

/* --- trazado de una espiral (coil de limpiapipas) --- */
function spiralPath(turns, rMax) {
  let d = '';
  const steps = 40;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const ang = turns * 2 * Math.PI * t;
    const r = rMax * t;
    const x = r * Math.cos(ang);
    const y = r * Math.sin(ang);
    d += (i === 0 ? 'M' : 'L') + x.toFixed(1) + ' ' + y.toFixed(1);
  }
  return d;
}

/* --- pétalo en bucle (lazo de limpiapipas, apunta hacia arriba) --- */
function loopPetalPath(w, h) {
  return 'M0,0 C ' + (-w) + ',' + (-h * 0.35) + ' ' + (-w) + ',' + (-h * 0.75) + ' 0,' + (-h) +
         ' C ' + w + ',' + (-h * 0.75) + ' ' + w + ',' + (-h * 0.35) + ' 0,0 Z';
}

/* --- trazo "peludo": halo desenfocado + núcleo sólido --- */
function fuzzyPath(d, color, wCore, wHalo) {
  return '<path d="' + d + '" fill="none" stroke="' + color + '" stroke-width="' + wHalo +
         '" stroke-linecap="round" stroke-linejoin="round" opacity="0.3" filter="url(#fuzz)"/>' +
         '<path d="' + d + '" fill="none" stroke="' + color + '" stroke-width="' + wCore +
         '" stroke-linecap="round" stroke-linejoin="round"/>';
}

function loopPetal(angle, w, h, color) {
  return '<g transform="rotate(' + angle + ')">' + fuzzyPath(loopPetalPath(w, h), color, 5, 9) + '</g>';
}

function spiralPetal(angle, offset, turns, rMax, color) {
  return '<g transform="rotate(' + angle + ') translate(0,' + (-offset) + ')">' +
         fuzzyPath(spiralPath(turns, rMax), color, 4, 7) + '</g>';
}

function pompom(color) {
  let s = '<circle r="13" fill="' + color + '" opacity="0.45" filter="url(#fuzz)"/>';
  for (let i = 0; i < 26; i++) {
    const a = i * (360 / 26) * Math.PI / 180;
    s += '<line x1="0" y1="0" x2="' + (Math.cos(a) * 14).toFixed(1) + '" y2="' + (Math.sin(a) * 14).toFixed(1) +
         '" stroke="' + color + '" stroke-width="3" stroke-linecap="round"/>';
  }
  s += '<circle r="8" fill="' + color + '"/>';
  return s;
}

function buildBloom(type, colors) {
  let parts = '';
  if (type === 'loop') {
    const n = 5 + ((Math.random() * 2) | 0); // 5 o 6 pétalos
    const c = pick(colors);
    for (let i = 0; i < n; i++) parts += loopPetal(i * (360 / n), 9, 26, c);
    parts += fuzzyPath(spiralPath(2.5, 7), pick(CENTERS), 4, 7);
  } else if (type === 'spiral') {
    const c = pick(colors);
    for (let i = 0; i < 4; i++) parts += spiralPetal(i * 90, 12, 1.6, 10, c);
    parts += fuzzyPath(spiralPath(1.5, 5), pick(CENTERS), 3, 6);
  } else { // pompón
    parts += pompom(pick(colors));
    parts += fuzzyPath(spiralPath(1.2, 4), pick(CENTERS), 3, 5);
  }
  return '<g class="bloom">' + parts + '</g>';
}

function buildStem(h) {
  const d = 'M40 ' + h + ' C 42 ' + (h * 0.7) + ', 38 ' + (h * 0.45) + ', 40 30';
  const leafD = 'M40 ' + (h * 0.62) + ' Q 20 ' + (h * 0.47) + ' 12 ' + (h * 0.36) +
                ' Q 24 ' + (h * 0.56) + ' 40 ' + (h * 0.72) + ' Z';
  return '<g class="stem">' +
    '<path d="' + d + '" fill="none" stroke="' + STEM_GREEN + '" stroke-width="10" stroke-linecap="round" opacity="0.25" filter="url(#fuzz)"/>' +
    '<path d="' + d + '" fill="none" stroke="' + STEM_GREEN + '" stroke-width="5" stroke-linecap="round"/>' +
    '<path d="' + d + '" fill="none" stroke="' + STEM_LIGHT + '" stroke-width="5" stroke-linecap="round" stroke-dasharray="5 9"/>' +
    '<path d="' + leafD + '" fill="none" stroke="' + STEM_GREEN + '" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>' +
    '</g>';
}

function flowerSVG(type, colors, h) {
  return '<svg viewBox="0 0 80 ' + h + '" width="80" height="' + h + '">' +
         buildStem(h) +
         '<g transform="translate(40,28)">' + buildBloom(type, colors) + '</g>' +
         '</svg>';
}

function plantFlower(x, y, hOpt) {
  const h = hOpt || (90 + Math.random() * 60);
  const type = pick(['loop', 'spiral', 'pompom', 'loop', 'loop', 'spiral']);
  const colors = PALETTES[pick(PALETTE_KEYS)];
  const el = document.createElement('div');
  el.className = 'flower';
  el.style.left = (x - 40) + 'px';
  el.style.top = (y - h) + 'px';
  el.innerHTML = flowerSVG(type, colors, h);
  GARDEN.appendChild(el);
  requestAnimationFrame(function () { el.classList.add('blooming'); });
  count++;
  COUNT.textContent = count;
}

/* --- plantar en cualquier punto de la pantalla (menos en botones/enlaces/carta) --- */
document.addEventListener('click', function (e) {
  if (e.target.closest('button, a, .card, .toolbar')) return;
  plantFlower(e.clientX, e.clientY);
});

/* ---------- Ramo (bouquet) ---------- */
function wrapperSVG() {
  return '<svg viewBox="0 0 160 80" width="160" height="80">' +
    '<path d="M8 8 L80 72 L152 8 Z" fill="#f6c9d6" stroke="#e79ab0" stroke-width="2"/>' +
    '<rect x="58" y="46" width="44" height="12" rx="6" fill="#e8576f"/>' +
    '<path d="M62 52 C 44 34, 34 54, 58 58 Z" fill="#e8576f"/>' +
    '<path d="M98 52 C 116 34, 126 54, 102 58 Z" fill="#e8576f"/>' +
    '<circle cx="80" cy="53" r="5" fill="#c2445c"/>' +
    '</svg>';
}

function spawnBouquet(cx, cy) {
  // envoltorio de papel + lazo
  const wrap = document.createElement('div');
  wrap.className = 'wrap';
  wrap.innerHTML = wrapperSVG();
  wrap.style.left = (cx - 80) + 'px';
  wrap.style.top = (cy - 15) + 'px';
  GARDEN.appendChild(wrap);
  requestAnimationFrame(function () { wrap.classList.add('show'); });

  // flores en forma de domo, con tallos más cortos
  const n = 22;
  for (let i = 0; i < n; i++) {
    const a = Math.PI + (i / (n - 1)) * Math.PI; // π → 2π (semicírculo superior)
    const r = 20 + Math.random() * 45;
    const x = cx + Math.cos(a) * r;
    const y = cy + 40;
    (function (fx, fy) {
      setTimeout(function () { plantFlower(fx, fy, 80 + Math.random() * 30); }, i * 70);
    })(x, y);
  }
}

document.getElementById('bouquet').addEventListener('click', function () {
  spawnBouquet(window.innerWidth / 2, window.innerHeight * 0.6);
});

/* ---------- Carta (voltear y desvanecer) ---------- */
const cardInner = document.getElementById('cardInner');
document.getElementById('openCard').addEventListener('click', function () {
  cardInner.classList.add('flipped');
  document.querySelector('.hero').classList.add('fade');
});

document.getElementById('doneReading').addEventListener('click', finishReading);

function finishReading() {
  const card = document.getElementById('card');
  const rect = card.getBoundingClientRect();
  const section = document.getElementById('carta');
  section.classList.add('gone');
  setTimeout(function () { section.style.display = 'none'; }, 900);
  spawnBouquet(rect.left + rect.width / 2, rect.top + rect.height / 2);
}
