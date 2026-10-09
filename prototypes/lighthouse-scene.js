// <lighthouse-scene> — a lighthouse sweeping its beam over a moonlit sea while a
// distant steamer crosses the horizon.
//
// Usage:
//   <script type="module" src="lighthouse-scene.js"></script>
//   <lighthouse-scene duration="80"></lighthouse-scene>
//
// Attributes:
//   duration  seconds for the steamer's left-to-right crossing (default 80)
//
// Theming: --sky-top, --sky-bottom, --moon, --beam, --land, --water-1 … --water-4

import { W, defineScene, seeded, waveLayer } from './scene-base.js';

const HORIZON = 432;
const LAMP = { x: 318, y: 283 };

// Starfield, kept above the horizon and clear of the moon.
const rand = seeded(7);
const stars = Array.from({ length: 48 }, () => {
  const x = rand() * W, y = 20 + rand() * 360;
  return { x, y, r: 0.5 + rand() * 1.2, dur: 2 + rand() * 3, delay: rand() * 5 };
}).filter(s => Math.hypot(s.x - 96, s.y - 150) > 40);

// Tower tapers from half-width 15 at the base (y 404) to 10 at the gallery (y 300).
const halfWidth = y => 10 + (5 * (y - 300)) / 104;
const towerBand = (y1, y2) =>
  `M${LAMP.x - halfWidth(y1)} ${y1} L${LAMP.x + halfWidth(y1)} ${y1} ` +
  `L${LAMP.x + halfWidth(y2)} ${y2} L${LAMP.x - halfWidth(y2)} ${y2} Z`;

defineScene('lighthouse-scene', {
  css: `
    :host {
      --duration: 80s;
      --sky-top: #0a1430;
      --sky-bottom: #2b3f6e;
      --moon: #f3edd8;
      --beam: #fff1c4;
      --land: #0d162d;
      --water-1: #26395f;
      --water-2: #1b2b50;
      --water-3: #132142;
      --water-4: #0c1733;
    }

    .star { animation: twinkle ease-in-out infinite alternate; }
    @keyframes twinkle { from { opacity: 0.15; } to { opacity: 1; } }

    .ship {
      transform: translate(140px, ${HORIZON}px);
      animation: steam var(--duration) linear infinite;
      animation-delay: calc(var(--duration) * -0.25);
    }
    @keyframes steam {
      from { transform: translate(-60px, ${HORIZON}px); }
      to   { transform: translate(${W + 60}px, ${HORIZON}px); }
    }

    /* Squashing the beam through zero reads as a rotating light; the lamp flashes as it faces us. */
    .beam { animation: sweep 10s ease-in-out infinite; }
    .lamp { animation: flash 5s ease-in-out infinite; }
    @keyframes sweep { 0%, 100% { transform: scaleX(1); } 50% { transform: scaleX(-1); } }
    @keyframes flash { 0%, 100% { opacity: 0.35; } 50% { opacity: 1; } }
  `,
  svg: `
    <defs>
      <linearGradient id="lh-sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="var(--sky-top)"/>
        <stop offset="0.62" stop-color="var(--sky-bottom)"/>
      </linearGradient>
      <radialGradient id="lh-moonglow">
        <stop offset="0" stop-color="var(--moon)" stop-opacity="0.45"/>
        <stop offset="1" stop-color="var(--moon)" stop-opacity="0"/>
      </radialGradient>
      <linearGradient id="lh-beam" x1="1" y1="0" x2="0" y2="0">
        <stop offset="0" stop-color="var(--beam)" stop-opacity="0.65"/>
        <stop offset="1" stop-color="var(--beam)" stop-opacity="0"/>
      </linearGradient>
      <radialGradient id="lh-lampglow">
        <stop offset="0" stop-color="var(--beam)" stop-opacity="1"/>
        <stop offset="1" stop-color="var(--beam)" stop-opacity="0"/>
      </radialGradient>
    </defs>

    <rect width="${W}" height="700" fill="url(#lh-sky)"/>

    <g fill="#fff">
      ${stars.map(s => `<circle class="star" cx="${s.x.toFixed(1)}" cy="${s.y.toFixed(1)}" r="${s.r.toFixed(2)}"
        style="animation-duration:${s.dur.toFixed(2)}s; animation-delay:${(-s.delay).toFixed(2)}s"/>`).join('')}
    </g>

    <circle cx="96" cy="150" r="90" fill="url(#lh-moonglow)"/>
    <circle cx="96" cy="150" r="24" fill="var(--moon)"/>

    <!-- Distant steamer: origin at its waterline -->
    <g class="ship" fill="#0a1226">
      <path d="M-28 -6 L30 -6 L26 2 L-24 2 Z"/>
      <rect x="-14" y="-14" width="22" height="8"/>
      <rect x="0" y="-21" width="5" height="7"/>
      <g fill="#ffd98a">
        <rect x="-11" y="-12" width="2" height="2"/><rect x="-6" y="-12" width="2" height="2"/>
        <rect x="-1" y="-12" width="2" height="2"/><rect x="16" y="-4" width="2" height="2"/>
      </g>
    </g>

    ${waveLayer({ y: HORIZON, components: [[2, 80]], fill: 'var(--water-1)', drift: 18, swell: 5.2 })}

    <g fill="var(--moon)">
      <rect class="glint" x="78" y="442" width="36" height="2" rx="1" style="animation-duration:1.9s"/>
      <rect class="glint" x="86" y="452" width="22" height="2" rx="1" style="animation-duration:2.6s; animation-delay:-1.2s"/>
      <rect class="glint" x="72" y="461" width="16" height="1.6" rx="0.8" style="animation-duration:1.5s; animation-delay:-0.4s"/>
    </g>

    <!-- Headland, keeper's cottage and lighthouse -->
    <path fill="var(--land)" d="M215 700 L222 470 L238 440 L262 418 L300 404 L400 398 L400 700 Z"/>
    <rect x="338" y="388" width="28" height="14" fill="#18223f"/>
    <path d="M335 389 L352 378 L369 389 Z" fill="#18223f"/>
    <rect x="344" y="393" width="5" height="4" fill="#ffd98a"/>

    <path d="${towerBand(404, 300)}" fill="#e6e0d4"/>
    <path d="${towerBand(386, 366)}" fill="#a8322c"/>
    <path d="${towerBand(345, 325)}" fill="#a8322c"/>
    <rect x="304" y="294" width="28" height="6" fill="#1a2238"/>
    <rect x="309" y="272" width="18" height="22" fill="#ffe7a3"/>
    <path d="M305 272 L318 258 L331 272 Z" fill="#7d2621"/>

    <g transform="translate(${LAMP.x} ${LAMP.y})">
      <g class="beam"><path d="M0 -4 L-430 -50 L-430 50 L0 4 Z" fill="url(#lh-beam)"/></g>
      <circle class="lamp" r="22" fill="url(#lh-lampglow)"/>
    </g>

    ${[
      { y: 470, components: [[4, 100]],       fill: 'var(--water-2)', drift: 13, swell: 4.4, reverse: true, delay: 1 },
      { y: 540, components: [[7, W / 3]],     fill: 'var(--water-3)', drift: 10, swell: 3.8, delay: 2 },
      { y: 620, components: [[10, 200]],      fill: 'var(--water-4)', drift: 7,  swell: 4.6, reverse: true, delay: 3 },
    ].map(waveLayer).join('')}
  `,
});
