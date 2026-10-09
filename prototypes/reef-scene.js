// <reef-scene> — a sea turtle gliding across a sunlit reef, with swaying kelp,
// rising bubbles and a school of fish heading the other way.
//
// Usage:
//   <script type="module" src="reef-scene.js"></script>
//   <reef-scene duration="50"></reef-scene>
//
// Attributes:
//   duration  seconds for the turtle's left-to-right crossing (default 50)
//
// Theming: --water-top, --water-mid, --water-deep, --sand-1, --sand-2, --kelp, --fish

import { W, defineScene, ridgeY, bandPath, seeded, waveLayer } from './scene-base.js';

const SAND_BACK = { y: 615, components: [[10, 400, 2], [4, 100]] };
const SAND_FRONT = { y: 662, components: [[8, 200, 1], [3, 80]] };

const rand = seeded(23);

const bubbles = Array.from({ length: 12 }, () => ({
  x: 20 + rand() * (W - 40),
  r: 1.5 + rand() * 3,
  dur: 8 + rand() * 8,
  delay: rand() * 16,
}));

const KELP = [
  { x: 34,  h: 300, dur: 5.5 },
  { x: 60,  h: 220, dur: 4.4 },
  { x: 214, h: 150, dur: 6.2 },
  { x: 352, h: 280, dur: 5.0 },
  { x: 378, h: 200, dur: 4.1 },
];

const kelp = ({ x, h, dur }, i) => {
  const leaves = [];
  for (let k = 40, side = 1; k < h - 10; k += 34, side = -side) {
    leaves.push(`<ellipse cx="${side * 7}" cy="${-k}" rx="9" ry="3.5" transform="rotate(${side * -30} ${side * 7} ${-k})"/>`);
  }
  return `
    <g transform="translate(${x} 690)">
      <g class="sway" style="animation-duration:${dur}s; animation-delay:${-i * 1.3}s">
        <path d="M0 0 C-12 ${-h * 0.25} 12 ${-h * 0.5} 0 ${-h * 0.75} S-6 ${-h} -2 ${-h}"
              fill="none" stroke="var(--kelp)" stroke-width="5" stroke-linecap="round"/>
        <g fill="var(--kelp)">${leaves.join('')}</g>
      </g>
    </g>`;
};

const coral = (x, colors) => {
  const y = ridgeY(x, SAND_BACK.y, SAND_BACK.components);
  return `
    <g transform="translate(${x} ${y.toFixed(1)})">
      <circle cx="-8" cy="-4" r="9" fill="${colors[0]}"/>
      <circle cx="6" cy="-9" r="11" fill="${colors[1]}"/>
      <circle cx="16" cy="-2" r="7" fill="${colors[0]}"/>
      <circle cx="2" cy="2" r="8" fill="${colors[2]}"/>
    </g>`;
};

const FISH = [[0, 0], [22, -10], [26, 12], [46, 2], [50, -16], [68, 10], [12, 22]];
const fish = ([x, y], i) => `
  <g transform="translate(${x} ${y})">
    <g class="swell" style="animation-duration:${1.4 + (i % 3) * 0.3}s; animation-delay:${-i * 0.4}s">
      <path d="M0 0 Q10 -6 20 0 Q10 6 0 0 Z M1 0 L-7 -5 L-7 5 Z" fill="var(--fish)"/>
      <circle cx="15" cy="-1" r="1.2" fill="#1d2b33"/>
    </g>
  </g>`;

defineScene('reef-scene', {
  css: `
    :host {
      --duration: 50s;
      --water-top: #5fd0d4;
      --water-mid: #1f8aa6;
      --water-deep: #0b3b5a;
      --sand-1: #c4ab74;
      --sand-2: #a99062;
      --kelp: #2f7d52;
      --fish: #f2c14e;
    }

    .turtle {
      transform: translate(200px, 320px);
      animation: cruise var(--duration) linear infinite;
      animation-delay: calc(var(--duration) * -0.25);
    }
    .glide  { animation: glide 4s ease-in-out infinite alternate; }
    .paddle { animation: paddle 2.4s ease-in-out infinite alternate; }
    .school { transform: translate(260px, 470px); animation: school 24s linear infinite; animation-delay: -6s; }
    .ray    { animation: ray ease-in-out infinite alternate; }
    .sway   { animation: sway ease-in-out infinite alternate; }
    .rise   { animation: rise linear infinite; }
    .wobble { animation: wobble 1.6s ease-in-out infinite alternate; }

    @keyframes cruise {
      from { transform: translate(-90px, 340px); }
      to   { transform: translate(${W + 90}px, 300px); }
    }
    @keyframes glide  { from { transform: translateY(-5px) rotate(-2deg); } to { transform: translateY(5px) rotate(2deg); } }
    @keyframes paddle { from { transform: rotate(-20deg); } to { transform: rotate(24deg); } }
    @keyframes school { from { transform: translate(${W + 70}px, 480px); } to { transform: translate(-130px, 455px); } }
    @keyframes ray    { from { opacity: 0.3; } to { opacity: 1; } }
    @keyframes sway   { from { transform: rotate(-5deg); } to { transform: rotate(5deg); } }
    @keyframes rise {
      0%   { transform: translateY(0); opacity: 0; }
      10%  { opacity: 0.8; }
      85%  { opacity: 0.6; }
      100% { transform: translateY(-680px); opacity: 0; }
    }
    @keyframes wobble { from { transform: translateX(-3px); } to { transform: translateX(3px); } }
  `,
  svg: `
    <defs>
      <linearGradient id="rf-water" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="var(--water-top)"/>
        <stop offset="0.4" stop-color="var(--water-mid)"/>
        <stop offset="1" stop-color="var(--water-deep)"/>
      </linearGradient>
      <linearGradient id="rf-ray" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#fff" stop-opacity="0.32"/>
        <stop offset="0.8" stop-color="#fff" stop-opacity="0"/>
      </linearGradient>
    </defs>

    <rect width="${W}" height="700" fill="url(#rf-water)"/>

    <!-- Surface seen from below -->
    ${waveLayer({ y: 34, components: [[5, 100], [3, 80, 1]], fill: '#c9f6f2', opacity: 0.45, drift: 14, toward: 0 })}
    ${waveLayer({ y: 20, components: [[4, 200], [2, 100]], fill: '#e9fcf9', opacity: 0.5, drift: 19, reverse: true, toward: 0 })}

    <g fill="url(#rf-ray)">
      <path class="ray" style="animation-duration:6s"  d="M70 0 L112 0 L210 700 L140 700 Z"/>
      <path class="ray" style="animation-duration:8s; animation-delay:-3s" d="M170 0 L196 0 L290 700 L246 700 Z"/>
      <path class="ray" style="animation-duration:7s; animation-delay:-5s" d="M250 0 L300 0 L410 700 L330 700 Z"/>
      <path class="ray" style="animation-duration:9s; animation-delay:-1s" d="M10 0 L30 0 L90 700 L50 700 Z"/>
    </g>

    <path fill="#1d7290" opacity="0.6" d="${bandPath(520, [[14, 400], [6, 200, 2]])}"/>
    <path fill="#17607a" d="${bandPath(560, [[16, 400, 1], [7, 100]])}"/>

    <!-- Turtle: origin at mid-shell, facing right -->
    <g class="turtle">
      <g class="glide">
        <ellipse cx="-32" cy="8" rx="11" ry="4" transform="rotate(25 -32 8)" fill="#6f8a52"/>
        <g transform="translate(12 2)"><g class="paddle" style="animation-delay:-1.2s">
          <ellipse cx="12" cy="10" rx="18" ry="5" transform="rotate(40 12 10)" fill="#6f8a52"/>
        </g></g>
        <path d="M30 0 Q40 -4 46 -2 L44 6 Q36 6 30 4 Z" fill="#93a86a"/>
        <ellipse cx="48" cy="0" rx="11" ry="7.5" fill="#93a86a"/>
        <circle cx="52" cy="-2" r="1.6" fill="#1d2b20"/>
        <path d="M-36 4 C-32 -24 -14 -30 2 -30 C20 -30 34 -20 38 4 Z" fill="#6d7f3e"/>
        <g fill="#5b6c32">
          <ellipse cx="-16" cy="-10" rx="9" ry="7"/>
          <ellipse cx="2" cy="-17" rx="9" ry="7"/>
          <ellipse cx="19" cy="-8" rx="8" ry="7"/>
        </g>
        <path d="M-36 4 L38 4 Q30 11 0 11 Q-30 11 -36 4 Z" fill="#d9c88f"/>
        <g transform="translate(16 6)"><g class="paddle">
          <ellipse cx="12" cy="10" rx="20" ry="5.5" transform="rotate(35 12 10)" fill="#8aa262"/>
        </g></g>
      </g>
    </g>

    <!-- School of fish heading right-to-left -->
    <g class="school"><g transform="scale(-1 1)">${FISH.map(fish).join('')}</g></g>

    <path fill="var(--sand-1)" d="${bandPath(SAND_BACK.y, SAND_BACK.components)}"/>
    ${coral(122, ['#e8846f', '#f2a65a', '#d96a8b'])}
    ${coral(268, ['#d96a8b', '#e8846f', '#f2c14e'])}
    ${KELP.map(kelp).join('')}
    <path fill="var(--sand-2)" d="${bandPath(SAND_FRONT.y, SAND_FRONT.components)}"/>

    <g fill="none" stroke="#e9fcf9" stroke-width="1.2">
      ${bubbles.map(b => `
        <g transform="translate(${b.x.toFixed(1)} 660)">
          <g class="rise" style="animation-duration:${b.dur.toFixed(2)}s; animation-delay:${(-b.delay).toFixed(2)}s">
            <circle class="wobble" r="${b.r.toFixed(2)}"/>
          </g>
        </g>`).join('')}
    </g>
  `,
});
