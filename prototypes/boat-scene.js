// <boat-scene> — a small sailboat crossing gentle waves on a calm afternoon.
//
// Usage:
//   <script type="module" src="boat-scene.js"></script>
//   <boat-scene duration="40">
//     <h1>Optional overlay content</h1>
//   </boat-scene>
//
// Attributes:
//   duration  seconds for one left-to-right crossing (default 40)
//
// Theming (CSS custom properties on the element):
//   --sky-top, --sky-bottom, --sun, --water-1 … --water-5, --hull

import { W, defineScene, waveLayer } from './scene-base.js';

const WATERLINE = 478; // y where the boat floats

// Back-to-front. `reverse` alternates drift direction for a choppier feel.
const BACK_WAVES = [
  { y: 382, components: [[2.5, 80]],      fill: 'var(--water-1)', drift: 16, swell: 5.0 },
  { y: 430, components: [[5, 100]],       fill: 'var(--water-2)', drift: 12, swell: 4.2, reverse: true },
];
const FRONT_WAVES = [
  { y: 482, components: [[7, W / 3]],     fill: 'var(--water-3)', drift: 9,  swell: 3.6 },
  { y: 560, components: [[9, 200]],       fill: 'var(--water-4)', drift: 8,  swell: 4.6, reverse: true },
  { y: 640, components: [[11, 200]],      fill: 'var(--water-5)', drift: 6,  swell: 3.9 },
].map((w, i) => ({ ...w, delay: (i + 2) * 0.9 }));
BACK_WAVES.forEach((w, i) => { w.delay = i * 0.9; });

defineScene('boat-scene', {
  css: `
    :host {
      --sky-top: #9cc9e3;
      --sky-bottom: #f3e6d3;
      --sun: #fff6dc;
      --water-1: #6fa9c2;
      --water-2: #4f92b2;
      --water-3: #3a7fa3;
      --water-4: #2a6a8d;
      --water-5: #1d5675;
      --hull: #b8322a;
    }

    .boat {
      transform: translate(200px, ${WATERLINE}px); /* resting spot for reduced motion */
      animation: sail var(--duration) linear infinite;
      animation-delay: calc(var(--duration) * -0.2); /* start already in view */
    }
    .bob  { animation: bob 3.4s ease-in-out infinite alternate; }
    .wake { animation: wake 1.2s linear infinite; }

    @keyframes sail {
      from { transform: translate(-90px, ${WATERLINE}px); }
      to   { transform: translate(${W + 90}px, ${WATERLINE}px); }
    }
    @keyframes bob {
      0%   { transform: translateY(-2px) rotate(-2.5deg); }
      50%  { transform: translateY(2px) rotate(1deg); }
      100% { transform: translateY(-1px) rotate(3deg); }
    }
    @keyframes wake { to { stroke-dashoffset: 18; } }
  `,
  svg: `
    <defs>
      <linearGradient id="bt-sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="var(--sky-top)"/>
        <stop offset="1" stop-color="var(--sky-bottom)"/>
      </linearGradient>
      <radialGradient id="bt-glow">
        <stop offset="0" stop-color="var(--sun)" stop-opacity="0.9"/>
        <stop offset="1" stop-color="var(--sun)" stop-opacity="0"/>
      </radialGradient>
    </defs>

    <rect width="${W}" height="700" fill="url(#bt-sky)"/>
    <circle cx="290" cy="250" r="110" fill="url(#bt-glow)"/>
    <circle cx="290" cy="250" r="34" fill="var(--sun)"/>

    <g fill="#fff" opacity="0.75">
      <g class="across" style="animation-duration:120s; animation-delay:-50s">
        <ellipse cx="0" cy="140" rx="46" ry="14"/><ellipse cx="22" cy="130" rx="28" ry="14"/>
      </g>
      <g class="across" style="animation-duration:160s; animation-delay:-120s">
        <ellipse cx="0" cy="210" rx="36" ry="10"/><ellipse cx="-14" cy="203" rx="20" ry="10"/>
      </g>
    </g>

    ${BACK_WAVES.map(waveLayer).join('')}

    <g fill="var(--sun)">
      <rect class="glint" x="262" y="396" width="56" height="2.5" rx="1.25" style="animation-duration:1.7s"/>
      <rect class="glint" x="274" y="410" width="34" height="2" rx="1" style="animation-duration:2.3s; animation-delay:-1s"/>
      <rect class="glint" x="252" y="422" width="22" height="2" rx="1" style="animation-duration:1.4s; animation-delay:-0.5s"/>
    </g>

    <!-- Boat: origin is the waterline at mid-hull, bow pointing right -->
    <g class="boat">
      <path class="wake" d="M-46 2 Q-90 6 -150 3 M-40 9 Q-80 14 -130 13"
            fill="none" stroke="#fff" stroke-opacity="0.55" stroke-width="2.5"
            stroke-linecap="round" stroke-dasharray="12 6"/>
      <g class="bob">
        <path d="M8 -80 L8 -10 L-38 -10 Z" fill="#faf7f0"/>
        <path d="M12 -74 L12 -10 L44 -10 Z" fill="#ece5d8"/>
        <rect x="8" y="-84" width="3" height="78" fill="#5a3e2b"/>
        <path d="M11 -84 L25 -80 L11 -76 Z" fill="#e8b33a"/>
        <rect x="-32" y="-18" width="26" height="12" rx="2" fill="#f4f1ea"/>
        <rect x="-27" y="-15" width="5" height="4" fill="#7fa6b8"/>
        <rect x="-18" y="-15" width="5" height="4" fill="#7fa6b8"/>
        <path d="M-50 -6 L52 -6 Q46 10 30 15 L-40 15 Q-47 8 -50 -6 Z" fill="var(--hull)"/>
        <path d="M-50 -6 L52 -6 L50.5 -2 L-49 -2 Z" fill="#f4f1ea"/>
      </g>
    </g>

    ${FRONT_WAVES.map(waveLayer).join('')}
  `,
});
