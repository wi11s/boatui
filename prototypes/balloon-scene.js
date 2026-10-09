// <balloon-scene> — a hot-air balloon drifting up and across rolling hills at first light.
//
// Usage:
//   <script type="module" src="balloon-scene.js"></script>
//   <balloon-scene duration="45"></balloon-scene>
//
// Attributes:
//   duration  seconds for one left-to-right ascent (default 45)
//
// Theming: --sky-top, --sky-mid, --sky-bottom, --sun, --hill-1 … --hill-4, --envelope, --stripe

import { W, defineScene, ridgeY, bandPath, seeded } from './scene-base.js';

const HILLS = [
  { y: 450, components: [[14, 400], [6, 200, 1]],    fill: 'var(--hill-1)' },
  { y: 505, components: [[20, 400, 2], [8, 200]],    fill: 'var(--hill-2)' },
  { y: 575, components: [[24, 400, 4], [9, 200, 1]], fill: 'var(--hill-3)' },
  { y: 645, components: [[20, 400, 1], [10, 100]],   fill: 'var(--hill-4)' },
];

// Trees scattered along the crest of the third hill.
const rand = seeded(11);
const trees = Array.from({ length: 11 }, () => {
  const x = rand() * W;
  return { x, y: ridgeY(x, HILLS[2].y, HILLS[2].components) + 6, s: 0.7 + rand() * 0.6 };
});

const balloon = (envelope, stripe) => `
  <path d="M0 -58 C40 -58 50 -22 38 8 C32 22 18 32 12 40 L-12 40 C-18 32 -32 22 -38 8 C-50 -22 -40 -58 0 -58 Z" fill="${envelope}"/>
  <path d="M0 -58 C20 -58 26 -22 19 8 C16 22 9 32 6 40 L-6 40 C-9 32 -16 22 -19 8 C-26 -22 -20 -58 0 -58 Z" fill="${stripe}"/>
  <path d="M0 -58 C7 -58 9 -22 7 8 C6 22 3 32 2 40 L-2 40 C-3 32 -6 22 -7 8 C-9 -22 -7 -58 0 -58 Z" fill="${envelope}"/>
  <ellipse cx="-17" cy="-30" rx="8" ry="16" fill="#fff" opacity="0.18"/>
  <path d="M-11 40 L-8 54 M11 40 L8 54" stroke="#5a3e2b" stroke-width="1.2"/>
  <rect x="-9" y="54" width="18" height="13" rx="2" fill="#8a5a36"/>
  <rect x="-9" y="54" width="18" height="3" rx="1" fill="#6e4528"/>`;

defineScene('balloon-scene', {
  css: `
    :host {
      --duration: 45s;
      --sky-top: #a9b8d9;
      --sky-mid: #f6c6b0;
      --sky-bottom: #fde3c0;
      --sun: #fff1d4;
      --hill-1: #c9a1b1;
      --hill-2: #a383a0;
      --hill-3: #6e7f7a;
      --hill-4: #4d6656;
      --envelope: #e4573d;
      --stripe: #f3c64f;
    }

    .balloon {
      transform: translate(200px, 330px);
      animation: rise var(--duration) linear infinite;
      animation-delay: calc(var(--duration) * -0.3);
    }
    .sway  { animation: sway 5s ease-in-out infinite alternate; }
    .flame { animation: flicker 0.35s ease-in-out infinite alternate; }
    .float { animation: float 6s ease-in-out infinite alternate; }
    .flock { transform: translate(260px, 190px); animation: flock 34s linear infinite; animation-delay: -12s; }
    .flap  { animation: flap 0.5s ease-in-out infinite alternate; }

    @keyframes rise {
      from { transform: translate(-70px, 600px); }
      to   { transform: translate(${W + 70}px, 140px); }
    }
    @keyframes sway    { from { transform: rotate(-3deg) translateY(-2px); } to { transform: rotate(3deg) translateY(2px); } }
    @keyframes flicker { from { opacity: 0.45; } to { opacity: 1; } }
    @keyframes float   { from { transform: translateY(-6px); } to { transform: translateY(6px); } }
    @keyframes flock   { from { transform: translate(${W + 40}px, 210px); } to { transform: translate(-60px, 170px); } }
    @keyframes flap    { from { transform: scaleY(1); } to { transform: scaleY(-0.4); } }
  `,
  svg: `
    <defs>
      <linearGradient id="bl-sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="var(--sky-top)"/>
        <stop offset="0.45" stop-color="var(--sky-mid)"/>
        <stop offset="0.7" stop-color="var(--sky-bottom)"/>
      </linearGradient>
      <radialGradient id="bl-glow">
        <stop offset="0" stop-color="var(--sun)" stop-opacity="0.95"/>
        <stop offset="1" stop-color="var(--sun)" stop-opacity="0"/>
      </radialGradient>
    </defs>

    <rect width="${W}" height="700" fill="url(#bl-sky)"/>
    <circle cx="112" cy="440" r="140" fill="url(#bl-glow)"/>
    <circle cx="112" cy="440" r="44" fill="var(--sun)"/>

    <g fill="#fff" opacity="0.7">
      <g class="across" style="animation-duration:140s; animation-delay:-30s">
        <ellipse cx="0" cy="120" rx="50" ry="13"/><ellipse cx="24" cy="110" rx="28" ry="13"/>
      </g>
      <g class="across" style="animation-duration:190s; animation-delay:-140s">
        <ellipse cx="0" cy="250" rx="40" ry="10"/><ellipse cx="-16" cy="243" rx="22" ry="9"/>
      </g>
    </g>

    <!-- A second balloon far off, just bobbing -->
    <g transform="translate(305 300) scale(0.32)">
      <g class="float">${balloon('#5b7fb8', '#f4efe2')}</g>
    </g>

    <g class="flock" stroke="#5b4a5e" stroke-width="1.5" fill="none" stroke-linecap="round">
      <g transform="translate(0 0)"><path class="flap" d="M-6 0 Q-3 -3 0 0 Q3 -3 6 0"/></g>
      <g transform="translate(16 8)"><path class="flap" style="animation-delay:-0.2s" d="M-5 0 Q-2.5 -2.5 0 0 Q2.5 -2.5 5 0"/></g>
      <g transform="translate(30 -4)"><path class="flap" style="animation-delay:-0.35s" d="M-5 0 Q-2.5 -2.5 0 0 Q2.5 -2.5 5 0"/></g>
    </g>

    <path fill="${HILLS[0].fill}" d="${bandPath(HILLS[0].y, HILLS[0].components)}"/>
    <path fill="${HILLS[1].fill}" d="${bandPath(HILLS[1].y, HILLS[1].components)}"/>

    <g class="across" style="animation-duration:70s; animation-delay:-20s">
      <ellipse cx="0" cy="535" rx="130" ry="9" fill="#fff" opacity="0.35"/>
    </g>

    <path fill="${HILLS[2].fill}" d="${bandPath(HILLS[2].y, HILLS[2].components)}"/>
    <g fill="#50655b">
      ${trees.map(t => `<g transform="translate(${t.x.toFixed(1)} ${t.y.toFixed(1)}) scale(${t.s.toFixed(2)})">
        <rect x="-1.5" y="-10" width="3" height="10"/><ellipse cy="-17" rx="7" ry="10"/></g>`).join('')}
    </g>

    <g class="across" style="animation-duration:95s; animation-delay:-60s">
      <ellipse cx="0" cy="612" rx="150" ry="10" fill="#fff" opacity="0.3"/>
    </g>

    <path fill="${HILLS[3].fill}" d="${bandPath(HILLS[3].y, HILLS[3].components)}"/>

    <!-- Main balloon: origin at the middle of the envelope -->
    <g class="balloon">
      <g class="sway">
        ${balloon('var(--envelope)', 'var(--stripe)')}
        <ellipse class="flame" cx="0" cy="46" rx="3" ry="5" fill="#ffb347"/>
      </g>
    </g>
  `,
});
