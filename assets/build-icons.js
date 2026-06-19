/* Genera los PNG fuente (ícono + splash) para @capacitor/assets.
   Diseño: ruleta de 8 segmentos (paleta del juego) + rima dorada + estrella central,
   sobre el fondo oscuro de la marca (#0b0717). Sin dependencias de fuentes. */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const OUT = __dirname;
const PALETTE = ['#8e2d6b','#5b2b9e','#2b4ea8','#1f7a8c','#1f8a5b','#c9851f','#c0392b','#7a3aa0'];

// --- helpers geométricos ---
const pt = (cx, cy, r, deg) => {
  const a = (deg - 90) * Math.PI / 180; // 0° = arriba
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
};
function pieSlice(cx, cy, r, d0, d1) {
  const [x0, y0] = pt(cx, cy, r, d0);
  const [x1, y1] = pt(cx, cy, r, d1);
  const large = (d1 - d0) > 180 ? 1 : 0;
  return `M${cx},${cy} L${x0.toFixed(2)},${y0.toFixed(2)} A${r},${r} 0 ${large} 1 ${x1.toFixed(2)},${y1.toFixed(2)} Z`;
}
function star(cx, cy, rOut, rIn, points = 5) {
  let p = '';
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 === 0 ? rOut : rIn;
    const [x, y] = pt(cx, cy, r, (i * 180) / points);
    p += (i === 0 ? 'M' : 'L') + x.toFixed(2) + ',' + y.toFixed(2);
  }
  return p + 'Z';
}

// --- dibuja la ruleta centrada; diam = diámetro en px sobre un canvas size×size ---
function wheelSVG(size, diam, withBg) {
  const c = size / 2;
  const R = diam / 2;             // radio del disco de colores
  const rim = R * 1.085;          // rima dorada exterior
  const hubR = R * 0.30;          // cubo central
  let segs = '';
  for (let i = 0; i < 8; i++) {
    segs += `<path d="${pieSlice(c, c, R, i * 45, (i + 1) * 45)}" fill="${PALETTE[i]}" stroke="rgba(244,201,93,.35)" stroke-width="${(R*0.012).toFixed(2)}"/>`;
  }
  const bg = withBg ? `
    <defs>
      <radialGradient id="bgGrad" cx="50%" cy="38%" r="75%">
        <stop offset="0%" stop-color="#221947"/>
        <stop offset="55%" stop-color="#15102b"/>
        <stop offset="100%" stop-color="#0b0717"/>
      </radialGradient>
    </defs>
    <rect width="${size}" height="${size}" fill="url(#bgGrad)"/>` : '';
  const [px, py] = [c, c - rim - R * 0.02];
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
    ${bg}
    <defs>
      <radialGradient id="rimGrad" cx="50%" cy="30%" r="75%">
        <stop offset="0%" stop-color="#ffe9a8"/>
        <stop offset="55%" stop-color="#f4c95d"/>
        <stop offset="100%" stop-color="#a9761a"/>
      </radialGradient>
      <radialGradient id="hubGrad" cx="50%" cy="35%" r="70%">
        <stop offset="0%" stop-color="#ffe9a8"/>
        <stop offset="45%" stop-color="#f4c95d"/>
        <stop offset="100%" stop-color="#a9761a"/>
      </radialGradient>
    </defs>
    <!-- rima dorada -->
    <circle cx="${c}" cy="${c}" r="${rim.toFixed(2)}" fill="url(#rimGrad)"/>
    <circle cx="${c}" cy="${c}" r="${(rim*0.97).toFixed(2)}" fill="#0a0712"/>
    <!-- segmentos -->
    <g>${segs}</g>
    <!-- puntero superior -->
    <path d="M${(px-R*0.10).toFixed(2)},${(py).toFixed(2)} L${(px+R*0.10).toFixed(2)},${(py).toFixed(2)} L${px.toFixed(2)},${(py+R*0.20).toFixed(2)} Z" fill="#ffe9a8" stroke="#a9761a" stroke-width="${(R*0.01).toFixed(2)}"/>
    <!-- cubo + estrella -->
    <circle cx="${c}" cy="${c}" r="${hubR.toFixed(2)}" fill="url(#hubGrad)" stroke="#2a1d06" stroke-width="${(R*0.03).toFixed(2)}"/>
    <path d="${star(c, c, hubR*0.72, hubR*0.30, 5)}" fill="#3a2806"/>
  </svg>`;
}

function bgSVG(size) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
    <defs>
      <radialGradient id="bgGrad" cx="50%" cy="38%" r="80%">
        <stop offset="0%" stop-color="#221947"/>
        <stop offset="55%" stop-color="#15102b"/>
        <stop offset="100%" stop-color="#0b0717"/>
      </radialGradient>
    </defs>
    <rect width="${size}" height="${size}" fill="url(#bgGrad)"/>
  </svg>`;
}

async function render(svg, size, file) {
  await sharp(Buffer.from(svg)).resize(size, size).png().toFile(path.join(OUT, file));
  console.log('  ✓', file);
}

(async () => {
  console.log('Generando fuentes de íconos/splash…');
  // Ícono plano (fondo + ruleta llenando el marco) — legacy/round
  await render(wheelSVG(1024, 1024 * 0.82, true), 1024, 'icon-only.png');
  // Adaptive: fondo (gradiente a sangre completa)
  await render(bgSVG(1024), 1024, 'icon-background.png');
  // Adaptive: primer plano (ruleta dentro de la zona segura ~60%, fondo transparente)
  await render(wheelSVG(1024, 1024 * 0.58, false), 1024, 'icon-foreground.png');
  // Splash (logo centrado sobre fondo oscuro)
  await render(wheelSVG(2732, 2732 * 0.30, true), 2732, 'splash.png');
  await render(wheelSVG(2732, 2732 * 0.30, true), 2732, 'splash-dark.png');
  console.log('Listo.');
})().catch(e => { console.error(e); process.exit(1); });
