const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function createOgImage() {
  const logoPath = path.join(__dirname, '..', 'public', 'pop-logo.png');
  const outPath = path.join(__dirname, '..', 'public', 'og-image.png');

  const logoBuffer = fs.readFileSync(logoPath);
  const logoBase64 = 'data:image/png;base64,' + logoBuffer.toString('base64');

  const svg = `
  <svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#0a0a14" />
        <stop offset="50%" stop-color="#121224" />
        <stop offset="100%" stop-color="#1b1830" />
      </linearGradient>
      <linearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#FF4D8D" />
        <stop offset="100%" stop-color="#FFD23F" />
      </linearGradient>
      <pattern id="sprockets" width="40" height="28" patternUnits="userSpaceOnUse">
        <rect x="8" y="4" width="24" height="20" rx="4" fill="#1a1a2e" stroke="#FFD23F" stroke-width="1.5" />
      </pattern>
    </defs>

    <!-- Background -->
    <rect width="1200" height="630" fill="url(#bgGradient)" />

    <!-- Top and Bottom Film Sprocket Borders -->
    <rect x="0" y="0" width="1200" height="36" fill="#07070d" />
    <rect x="0" y="4" width="1200" height="28" fill="url(#sprockets)" />

    <rect x="0" y="594" width="1200" height="36" fill="#07070d" />
    <rect x="0" y="598" width="1200" height="28" fill="url(#sprockets)" />

    <!-- Inner Card Container -->
    <rect x="60" y="60" width="1080" height="510" rx="24" fill="rgba(255, 255, 255, 0.03)" stroke="#FFD23F" stroke-width="3" />

    <!-- Logo Image -->
    <image href="${logoBase64}" x="100" y="110" width="140" height="140" />

    <!-- Brand Header -->
    <text x="270" y="180" font-family="sans-serif" font-size="84" font-weight="900" fill="#FFF8E7" letter-spacing="2">POP</text>
    <rect x="470" y="128" width="250" height="44" rx="10" fill="#FFD23F" />
    <text x="486" y="158" font-family="monospace" font-size="20" font-weight="900" fill="#0d0d1f" letter-spacing="1">AI MOVIE INSIGHTS</text>

    <!-- Subtitle and Value Proposition -->
    <text x="100" y="320" font-family="sans-serif" font-size="42" font-weight="800" fill="#FFF8E7">
      Honest Cinema Intelligence from Real Viewer Voices.
    </text>

    <!-- Feature Pills -->
    <g transform="translate(100, 370)">
      <rect x="0" y="0" width="270" height="48" rx="24" fill="rgba(255, 77, 141, 0.2)" stroke="#FF4D8D" stroke-width="2" />
      <text x="24" y="31" font-family="monospace" font-size="16" font-weight="800" fill="#FF4D8D">&#9733; AUDIENCE SENTIMENT</text>

      <rect x="290" y="0" width="260" height="48" rx="24" fill="rgba(255, 210, 63, 0.2)" stroke="#FFD23F" stroke-width="2" />
      <text x="314" y="31" font-family="monospace" font-size="16" font-weight="800" fill="#FFD23F">&#127871; EMOTION FINGERPRINT</text>

      <rect x="570" y="0" width="280" height="48" rx="24" fill="rgba(255, 255, 255, 0.1)" stroke="#FFF8E7" stroke-width="2" />
      <text x="594" y="31" font-family="monospace" font-size="16" font-weight="800" fill="#FFF8E7">&#128269; VERIFIED REVIEW DATA</text>
    </g>

    <!-- Footer URL -->
    <text x="100" y="515" font-family="monospace" font-size="20" font-weight="700" fill="#FFD23F" letter-spacing="1">
      https://pop.vedaangsharma.in &#183; Built by Vedaang Sharma
    </text>
  </svg>
  `;

  await sharp(Buffer.from(svg))
    .png()
    .toFile(outPath);

  console.log('og-image.png successfully created at ' + outPath);
}

createOgImage().catch(err => {
  console.error(err);
  process.exit(1);
});
