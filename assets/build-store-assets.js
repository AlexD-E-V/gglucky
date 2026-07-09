/* Genera los assets de la ficha de Play Store en /store:
   - icon-512.png        (512×512, ícono de la ficha)
   - feature-graphic.png (1024×500, gráfico destacado)
   Reusa el mismo lenguaje visual de build-icons.js (ruleta + dorado sobre #0b0717). */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const OUT = path.join(__dirname, '..', 'store');
const PALETTE = ['#8e2d6b','#5b2b9e','#2b4ea8','#1f7a8c','#1f8a5b','#c9851f','#c0392b','#7a3aa0'];

const pt = (cx, cy, r, deg) => {
  const a = (deg - 90) * Math.PI / 180;
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

/* Ruleta (sin fondo) centrada en (cx,cy) con radio R, como grupo SVG */
function wheelGroup(cx, cy, R) {
  const rim = R * 1.085;
  const hubR = R * 0.30;
  let segs = '';
  for (let i = 0; i < 8; i++) {
    segs += `<path d="${pieSlice(cx, cy, R, i * 45, (i + 1) * 45)}" fill="${PALETTE[i]}" stroke="rgba(244,201,93,.35)" stroke-width="${(R*0.012).toFixed(2)}"/>`;
  }
  const py = cy - rim - R * 0.02;
  return `
    <circle cx="${cx}" cy="${cy}" r="${rim.toFixed(2)}" fill="url(#rimGrad)"/>
    <circle cx="${cx}" cy="${cy}" r="${(rim*0.97).toFixed(2)}" fill="#0a0712"/>
    <g>${segs}</g>
    <path d="M${(cx-R*0.10).toFixed(2)},${py.toFixed(2)} L${(cx+R*0.10).toFixed(2)},${py.toFixed(2)} L${cx.toFixed(2)},${(py+R*0.20).toFixed(2)} Z" fill="#ffe9a8" stroke="#a9761a" stroke-width="${(R*0.01).toFixed(2)}"/>
    <circle cx="${cx}" cy="${cy}" r="${hubR.toFixed(2)}" fill="url(#hubGrad)" stroke="#2a1d06" stroke-width="${(R*0.03).toFixed(2)}"/>
    <path d="${star(cx, cy, hubR*0.72, hubR*0.30, 5)}" fill="#3a2806"/>`;
}

const GRADS = `
  <radialGradient id="rimGrad" cx="50%" cy="30%" r="75%">
    <stop offset="0%" stop-color="#ffe9a8"/><stop offset="55%" stop-color="#f4c95d"/><stop offset="100%" stop-color="#a9761a"/>
  </radialGradient>
  <radialGradient id="hubGrad" cx="50%" cy="35%" r="70%">
    <stop offset="0%" stop-color="#ffe9a8"/><stop offset="45%" stop-color="#f4c95d"/><stop offset="100%" stop-color="#a9761a"/>
  </radialGradient>
  <linearGradient id="goldText" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#ffe9a8"/><stop offset="55%" stop-color="#f4c95d"/><stop offset="100%" stop-color="#c9962e"/>
  </linearGradient>`;

/* Gráfico destacado 1024×500: ruleta a la izquierda, título a la derecha */
function featureSVG() {
  const W = 1024, H = 500;
  // estrellitas decorativas dispersas
  let stars = '';
  const spots = [[70,60,7],[180,420,5],[460,70,5],[530,440,6],[940,80,6],[980,300,4],[620,120,4],[840,440,5]];
  for (const [x, y, r] of spots) {
    stars += `<path d="${star(x, y, r, r*0.42, 4)}" fill="#f4c95d" opacity="0.55"/>`;
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <radialGradient id="bgGrad" cx="28%" cy="42%" r="95%">
      <stop offset="0%" stop-color="#241a4d"/><stop offset="50%" stop-color="#15102b"/><stop offset="100%" stop-color="#0b0717"/>
    </radialGradient>
    ${GRADS}
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bgGrad)"/>
  ${stars}
  ${wheelGroup(285, 250, 168)}
  <g text-anchor="middle">
    <text x="710" y="238" font-family="Impact, 'Arial Black', sans-serif" font-size="118" letter-spacing="4"
          fill="url(#goldText)" stroke="#7a5510" stroke-width="2.5">GG LUCKY</text>
    <text x="710" y="308" font-family="'Trebuchet MS', Verdana, sans-serif" font-size="34" font-weight="bold"
          fill="#e8dcff" opacity="0.92">Ruleta de sorteos y rifas</text>
    <text x="710" y="360" font-family="'Trebuchet MS', Verdana, sans-serif" font-size="24"
          fill="#b9a8e0" opacity="0.85">Gira, elimina números y descubre al ganador</text>
  </g>
</svg>`;
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  console.log('Generando assets de Play Store…');
  await sharp(path.join(__dirname, 'icon-only.png')).resize(512, 512).png().toFile(path.join(OUT, 'icon-512.png'));
  console.log('  ✓ icon-512.png (512×512)');
  await sharp(Buffer.from(featureSVG())).png().toFile(path.join(OUT, 'feature-graphic.png'));
  console.log('  ✓ feature-graphic.png (1024×500)');
  console.log('Listo →', OUT);
})().catch(e => { console.error(e); process.exit(1); });
