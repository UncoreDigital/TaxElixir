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

// ---------------------------------------------------------------------------
// Packs PNG frames into an .ico. Every current browser reads PNG-in-ICO, and
// sharp has no ICO encoder.
// ---------------------------------------------------------------------------
function ico(pngs) {
  const header = Buffer.alloc(6 + 16 * pngs.length);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(pngs.length, 4);
  let offset = header.length;
  pngs.forEach((png, i) => {
    const size = png.readUInt32BE(16); // IHDR width; frames are square
    const e = 6 + 16 * i;
    header.writeUInt8(size >= 256 ? 0 : size, e);
    header.writeUInt8(size >= 256 ? 0 : size, e + 1);
    header.writeUInt16LE(1, e + 4);
    header.writeUInt16LE(32, e + 6);
    header.writeUInt32LE(png.length, e + 8);
    header.writeUInt32LE(offset, e + 12);
    offset += png.length;
  });
  return Buffer.concat([header, ...pngs]);
}

(async () => {
  fs.mkdirSync('public/assets/patterns', { recursive: true });
  fs.mkdirSync('public/assets/brand', { recursive: true });

  fs.writeFileSync('public/assets/patterns/grid.svg', gridPattern);
  fs.writeFileSync('public/assets/patterns/grid-gold.svg', gridPatternGold);
  fs.writeFileSync('public/assets/patterns/shield-watermark.svg', watermark);

  // App icons — cut from the header lockup's own shield, so the browser tab,
  // the home screen and the header all show the same artwork. header-logo.png
  // has a transparent field; the shield sits in its first ~700px and the
  // wordmark starts at ~825px, so a 760px strip trimmed to its content is
  // exactly the shield.
  // Two pipelines: within one, sharp trims before it extracts.
  const shield = await sharp(await sharp('public/assets/header-logo.png')
    .extract({ left: 0, top: 0, width: 760, height: 804 }).toBuffer()).trim().toBuffer();
  const CLEAR = { r: 0, g: 0, b: 0, alpha: 0 };
  const shieldIcon = async (size, { pad = 0, bg = CLEAR } = {}) => {
    const inner = Math.round(size * (1 - 2 * pad));
    const mark = await sharp(shield)
      .resize(inner, inner, { fit: 'contain', background: CLEAR }).toBuffer();
    return sharp({ create: { width: size, height: size, channels: 4, background: bg } })
      .composite([{ input: mark, gravity: 'center' }]).png().toBuffer();
  };

  // Tab favicon: transparent, so the gold shield sits on light and dark tab
  // strips alike. favicon.ico carries pre-shrunk 16/32/48 frames — the serif
  // TE turns to mush if the browser downsamples a large PNG itself.
  fs.writeFileSync('app/icon.png', await shieldIcon(192));
  fs.writeFileSync('app/favicon.ico', ico(await Promise.all([16, 32, 48].map((s) => shieldIcon(s)))));

  // Home-screen icons sit on the paper field, as the lockup does in the header.
  // iOS would fill a transparent apple-icon with black.
  const paper = { pad: 0.1, bg: B.paper };
  fs.writeFileSync('app/apple-icon.png', await shieldIcon(180, paper));
  fs.writeFileSync('public/assets/brand/icon-192.png', await shieldIcon(192, paper));
  fs.writeFileSync('public/assets/brand/icon-512.png', await shieldIcon(512, paper));
  // Maskable: Android may crop to a circle of 80% diameter, so the shield's
  // corners need to sit inside it.
  fs.writeFileSync('public/assets/brand/icon-maskable-512.png',
    await shieldIcon(512, { pad: 0.2, bg: B.paper }));

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
