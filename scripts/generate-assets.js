const fs = require('fs');
const sharp = require('sharp');

const B = { navy:'#0C2748', navyDeep:'#002448', navyLight:'#1B3D66',
            goldLight:'#D8B460', gold:'#CBA85A', goldDark:'#C0A854', paper:'#FCFCFC' };
const OUTER = 'M60 6 L14 22 V70 C14 98 34 118 60 134 C86 118 106 98 106 70 V22 Z';
const MONO = (ink) => `<g fill="${ink}">
  <rect x="20" y="36" width="42" height="11"/><rect x="35" y="36" width="12" height="60"/>
  <rect x="30" y="89" width="22" height="7"/><rect x="58" y="48" width="12" height="48"/>
  <rect x="58" y="48" width="30" height="11"/><rect x="58" y="65" width="24" height="10"/>
  <rect x="58" y="85" width="30" height="11"/></g>`;

const goldGrad = (id) => `<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1">
  <stop offset="0%" stop-color="${B.goldLight}"/><stop offset="55%" stop-color="${B.gold}"/>
  <stop offset="100%" stop-color="${B.goldDark}"/></linearGradient>`;

// ---------------------------------------------------------------------------
// Social card. Rendered to PNG here, at author time, so the serif is baked in
// and the shipped asset never depends on a font being present at build time.
// ---------------------------------------------------------------------------
function socialCard({ w = 1200, h = 630, eyebrow, title, tagline }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    ${goldGrad('g')}
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${B.navyDeep}"/><stop offset="100%" stop-color="${B.navyLight}"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.85" cy="0.15" r="0.6">
      <stop offset="0%" stop-color="${B.gold}" stop-opacity="0.20"/>
      <stop offset="100%" stop-color="${B.gold}" stop-opacity="0"/>
    </radialGradient>
    <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
      <path d="M48 0H0V48" fill="none" stroke="${B.gold}" stroke-opacity="0.055" stroke-width="1"/>
    </pattern>
  </defs>

  <rect width="${w}" height="${h}" fill="url(#bg)"/>
  <rect width="${w}" height="${h}" fill="url(#grid)"/>
  <rect width="${w}" height="${h}" fill="url(#glow)"/>
  <rect x="0" y="0" width="${w}" height="8" fill="url(#g)"/>

  <g transform="translate(88 ${h/2 - 78}) scale(1.42)">
    <path d="${OUTER}" fill="url(#g)"/>${MONO(B.navyDeep)}
  </g>

  <g transform="translate(310 40)">
    <text x="0" y="${h/2 - 96}" font-family="Segoe UI, Helvetica, Arial, sans-serif"
          font-size="21" letter-spacing="4.5" font-weight="600" fill="${B.gold}">${eyebrow}</text>
    <text x="0" y="${h/2 - 28}" font-family="Georgia, 'Times New Roman', serif"
          font-size="72" font-weight="700" fill="#FFFFFF">TaxElixir</text>
    <rect x="0" y="${h/2 - 6}" width="92" height="3" fill="url(#g)"/>
    <text x="0" y="${h/2 + 48}" font-family="Georgia, 'Times New Roman', serif"
          font-size="30" fill="#FFFFFF" fill-opacity="0.9">${tagline}</text>
    <text x="0" y="${h/2 + 104}" font-family="Segoe UI, Helvetica, Arial, sans-serif"
          font-size="23" fill="#FFFFFF" fill-opacity="0.6">${title}</text>
  </g>
</svg>`;
}

// ---------------------------------------------------------------------------
// Decorative pattern assets used as CSS backgrounds.
// ---------------------------------------------------------------------------
const gridPattern = `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">
  <path d="M48 0H0V48" fill="none" stroke="${B.navy}" stroke-opacity="0.05" stroke-width="1"/>
</svg>`;

const gridPatternGold = `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">
  <path d="M48 0H0V48" fill="none" stroke="${B.gold}" stroke-opacity="0.07" stroke-width="1"/>
</svg>`;

const watermark = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 140" width="120" height="140">
  <path d="${OUTER}" fill="none" stroke="${B.gold}" stroke-opacity="0.16" stroke-width="2"/>
  <path d="M60 16 L23 29 V70 C23 92 39 108 60 120 C81 108 97 92 97 70 V29 Z"
        fill="none" stroke="${B.gold}" stroke-opacity="0.10" stroke-width="1.5"/>
</svg>`;

(async () => {
  fs.mkdirSync('public/assets/patterns', { recursive: true });
  fs.mkdirSync('public/assets/brand', { recursive: true });

  fs.writeFileSync('public/assets/patterns/grid.svg', gridPattern);
  fs.writeFileSync('public/assets/patterns/grid-gold.svg', gridPatternGold);
  fs.writeFileSync('public/assets/patterns/shield-watermark.svg', watermark);

  // App icons — Apple needs a real PNG, not an SVG.
  const iconSvg = fs.readFileSync('app/icon.svg');
  await sharp(iconSvg, { density: 900 }).resize(180, 180).png().toFile('app/apple-icon.png');
  await sharp(iconSvg, { density: 900 }).resize(512, 512).png()
    .toFile('public/assets/brand/icon-512.png');
  await sharp(iconSvg, { density: 900 }).resize(192, 192).png()
    .toFile('public/assets/brand/icon-192.png');

  // Default social card, plus one for the Insights section.
  const cards = [
    { file: 'app/opengraph-image.png', eyebrow: 'OFFSHORE SUPPORT FOR US CPA FIRMS',
      tagline: 'Where Trust Meets CPA Excellence',
      title: 'Tax preparation · Accounting · Audit support · Offshore staffing' },
    { file: 'public/assets/brand/og-blog.png', eyebrow: 'INSIGHTS',
      tagline: 'Where Trust Meets CPA Excellence',
      title: 'Practical writing for CPA firm owners' },
  ];
  for (const c of cards) {
    await sharp(Buffer.from(socialCard(c))).png().toFile(c.file);
  }
  fs.copyFileSync('app/opengraph-image.png', 'app/twitter-image.png');

  console.log('assets written');
})();
