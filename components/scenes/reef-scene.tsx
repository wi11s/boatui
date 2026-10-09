// <ReefScene>: a sea turtle gliding across a sunlit reef: staghorn, brain and fan coral, an anemone
// with clownfish, a jellyfish, swaying kelp and light rippling on the sand. `duration` is seconds
// for the turtle's crossing (default 50).

import { W, bandPath, ridgeY, seeded, type Ridge } from './geometry';
import { SceneFrame, WaveLayer, sceneStyles as base, useSvgId, type SceneProps } from './scene';
import styles from './reef-scene.module.css';

export const reefTheme = {
  waterTop: '#5fd0d4',
  waterMid: '#1f8aa6',
  waterDeep: '#0b3b5a',
  sand1: '#c4ab74',
  sand2: '#a99062',
  kelp: '#2f7d52',
  fish: '#f2c14e',
  coral: '#e8846f',
  coralAlt: '#d96a8b',
  anemone: '#f2a6c2',
  clownfish: '#f08a3c',
  jelly: '#f7c6e0',
};
export type ReefTheme = typeof reefTheme;

const SAND_BACK: { y: number; components: Ridge } = { y: 615, components: [[10, 400, 2], [4, 100]] };
const SAND_FRONT: { y: number; components: Ridge } = { y: 662, components: [[8, 200, 1], [3, 80]] };
const PATHS = {
  ridgeFar: bandPath(520, [[14, 400], [6, 200, 2]]),
  ridgeNear: bandPath(560, [[16, 400, 1], [7, 100]]),
  sandBack: bandPath(SAND_BACK.y, SAND_BACK.components),
  sandFront: bandPath(SAND_FRONT.y, SAND_FRONT.components),
};

const rand = seeded(23);
const BUBBLES = Array.from({ length: 12 }, () => ({
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
].map(k => {
  const leaves: { cx: number; cy: number; angle: number }[] = [];
  for (let y = 40, side = 1; y < k.h - 10; y += 34, side = -side) {
    leaves.push({ cx: side * 7, cy: -y, angle: side * -30 });
  }
  return { ...k, leaves };
});

// Where each reef feature sits on the back sand.
const onSand = (x: number) => ridgeY(x, SAND_BACK.y, SAND_BACK.components) + 3;
const STAGHORN = { x: 118, y: onSand(118) };
const ANEMONE = { x: 184, y: onSand(184) };
const BRAIN = { x: 262, y: onSand(262) };
const FAN = { x: 304, y: onSand(304) };

// Staghorn coral: branches forking upward, drawn as round-capped strokes.
const STAGHORN_PATH =
  'M0 0 V-22 L-12 -38 M-6 -30 L-4 -48 M0 -22 L10 -40 L8 -56 M10 -40 L22 -50 M-12 -38 L-22 -46 M0 0 L16 -14 L28 -22';

// Sea fan: branches radiating from the top of the stalk, each forking once near its tip.
const FAN_BRANCHES = [-62, -40, -20, 0, 20, 40, 60]
  .map(deg => {
    const a = (deg * Math.PI) / 180;
    const len = 48 - Math.abs(deg) * 0.22;
    const tx = Math.sin(a) * len;
    const ty = -8 - Math.cos(a) * len;
    const mx = Math.sin(a) * len * 0.65;
    const my = -8 - Math.cos(a) * len * 0.65;
    const f = (d: number) => `M${mx.toFixed(1)} ${my.toFixed(1)} L${(mx + Math.sin(a + d) * 12).toFixed(1)} ${(my - Math.cos(a + d) * 12).toFixed(1)}`;
    return `M0 -8 L${tx.toFixed(1)} ${ty.toFixed(1)} ${f(0.45)} ${f(-0.45)}`;
  })
  .join(' ');

// Light rippling on the sand: short curves that brighten and fade out of step.
const CAUSTICS = Array.from({ length: 9 }, () => {
  const x = 20 + rand() * (W - 40);
  const y = ridgeY(x, SAND_BACK.y, SAND_BACK.components) + 8 + rand() * 30;
  const w = 10 + rand() * 14;
  return { d: `M${x.toFixed(1)} ${y.toFixed(1)} q${(w / 2).toFixed(1)} -4 ${w.toFixed(1)} 0`, dur: 2 + rand() * 2.5, delay: rand() * 3 };
});

const FISH = [[0, 0], [22, -10], [26, 12], [46, 2], [50, -16], [68, 10], [12, 22]];

const RAYS = [
  { d: 'M70 0 L112 0 L210 700 L140 700 Z',  dur: 6, delay: 0 },
  { d: 'M170 0 L196 0 L290 700 L246 700 Z', dur: 8, delay: -3 },
  { d: 'M250 0 L300 0 L410 700 L330 700 Z', dur: 7, delay: -5 },
  { d: 'M10 0 L30 0 L90 700 L50 700 Z',     dur: 9, delay: -1 },
];

/** A sea turtle gliding across a sunlit reef, with swaying kelp, rising bubbles and a school of fish. */
export function ReefScene(props: SceneProps<ReefTheme>) {
  const water = useSvgId('water');
  const ray = useSvgId('ray');

  return (
    <SceneFrame
      {...props}
      defaultTheme={reefTheme}
      defaultDuration={50}
      art={
        <>
          <defs>
            <linearGradient id={water} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="var(--water-top)" />
              <stop offset="0.4" stopColor="var(--water-mid)" />
              <stop offset="1" stopColor="var(--water-deep)" />
            </linearGradient>
            <linearGradient id={ray} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#fff" stopOpacity="0.32" />
              <stop offset="0.8" stopColor="#fff" stopOpacity="0" />
            </linearGradient>
          </defs>

          <rect width={W} height="700" fill={`url(#${water})`} />

          {/* Surface seen from below */}
          <WaveLayer y={34} components={[[5, 100], [3, 80, 1]]} fill="#c9f6f2" opacity={0.45} drift={14} toward={0} />
          <WaveLayer y={20} components={[[4, 200], [2, 100]]} fill="#e9fcf9" opacity={0.5} drift={19} reverse toward={0} />

          <g fill={`url(#${ray})`}>
            {RAYS.map((r, i) => (
              <path key={i} className={styles.ray} style={{ animationDuration: `${r.dur}s`, animationDelay: `${r.delay}s` }} d={r.d} />
            ))}
          </g>

          {/* A jellyfish pulsing slowly upward in the open water */}
          <g transform="translate(78 250)">
            <g className={styles.jellyDrift}>
              <g className={styles.jellyPulse}>
                <path d="M-16 0 C-16 -22 16 -22 16 0 Q12 3 8 0 Q4 3 0 0 Q-4 3 -8 0 Q-12 3 -16 0 Z" fill="var(--jelly)" opacity="0.75" />
                <g fill="none" stroke="var(--jelly)" strokeOpacity="0.6" strokeWidth="1.4" strokeLinecap="round">
                  <path d="M-10 2 q-3 10 0 20 t0 18 M-3 2 q3 12 0 24 t0 16 M4 2 q-3 10 0 22 t0 14 M11 2 q3 9 0 18 t0 14" />
                </g>
              </g>
            </g>
          </g>

          <path fill="#1d7290" opacity="0.6" d={PATHS.ridgeFar} />
          <path fill="#17607a" d={PATHS.ridgeNear} />

          {/* Turtle: origin at mid-shell, facing right */}
          <g className={styles.turtle}>
            <g className={styles.glide}>
              <ellipse cx="-32" cy="8" rx="11" ry="4" transform="rotate(25 -32 8)" fill="#6f8a52" />
              <g transform="translate(12 2)">
                <g className={styles.paddle} style={{ animationDelay: '-1.2s' }}>
                  <ellipse cx="12" cy="10" rx="18" ry="5" transform="rotate(40 12 10)" fill="#6f8a52" />
                </g>
              </g>
              <path d="M30 0 Q40 -4 46 -2 L44 6 Q36 6 30 4 Z" fill="#93a86a" />
              <ellipse cx="48" cy="0" rx="11" ry="7.5" fill="#93a86a" />
              <circle cx="52" cy="-2" r="1.6" fill="#1d2b20" />
              <path d="M-36 4 C-32 -24 -14 -30 2 -30 C20 -30 34 -20 38 4 Z" fill="#6d7f3e" />
              <g fill="#5b6c32">
                <ellipse cx="-16" cy="-10" rx="9" ry="7" />
                <ellipse cx="2" cy="-17" rx="9" ry="7" />
                <ellipse cx="19" cy="-8" rx="8" ry="7" />
              </g>
              <path d="M-36 4 L38 4 Q30 11 0 11 Q-30 11 -36 4 Z" fill="#d9c88f" />
              <g transform="translate(16 6)">
                <g className={styles.paddle}>
                  <ellipse cx="12" cy="10" rx="20" ry="5.5" transform="rotate(35 12 10)" fill="#8aa262" />
                </g>
              </g>
            </g>
          </g>

          {/* School of fish heading right-to-left */}
          <g className={styles.school}>
            <g transform="scale(-1 1)">
              {FISH.map(([x, y], i) => (
                <g key={i} transform={`translate(${x} ${y})`}>
                  <g className={base.swell} style={{ animationDuration: `${1.4 + (i % 3) * 0.3}s`, animationDelay: `${-i * 0.4}s` }}>
                    <path d="M0 0 Q10 -6 20 0 Q10 6 0 0 Z M1 0 L-7 -5 L-7 5 Z" fill="var(--fish)" />
                    <circle cx="15" cy="-1" r="1.2" fill="#1d2b33" />
                  </g>
                </g>
              ))}
            </g>
          </g>

          <path fill="var(--sand-1)" d={PATHS.sandBack} />
          <g fill="none" stroke="#e9fcf9" strokeWidth="2" strokeLinecap="round">
            {CAUSTICS.map((c, i) => (
              <path key={i} className={styles.caustic} style={{ animationDuration: `${c.dur.toFixed(2)}s`, animationDelay: `${(-c.delay).toFixed(2)}s` }} d={c.d} />
            ))}
          </g>

          {/* Sea fan: a lacy net of branches on a short stalk, rocking in the current */}
          <g transform={`translate(${FAN.x} ${FAN.y.toFixed(1)})`}>
            <g className={styles.fan}>
              <path d="M0 -8 C-30 -12 -38 -46 -16 -60 C-4 -67 12 -66 24 -58 C40 -44 30 -12 0 -8 Z" fill="var(--coral-alt)" opacity="0.28" />
              <g fill="none" stroke="var(--coral-alt)" strokeLinecap="round">
                <path d="M0 0 V-8" strokeWidth="4" />
                <path d={FAN_BRANCHES} strokeWidth="2.2" />
                <path d="M-22 -24 Q0 -32 24 -22 M-26 -40 Q0 -50 28 -40 M-16 -54 Q2 -60 20 -54" strokeWidth="1" opacity="0.7" />
              </g>
            </g>
          </g>

          {/* Brain coral: a low dome with winding grooves */}
          <g transform={`translate(${BRAIN.x} ${BRAIN.y.toFixed(1)})`}>
            <path d="M-24 2 C-24 -22 24 -22 24 2 Z" fill="var(--coral)" />
            <path d="M-18 -4 q4 -8 8 0 t8 0 t8 0 t8 0 M-12 -12 q4 -6 8 0 t8 0 t8 0" fill="none" stroke="#ffffff" strokeOpacity="0.35" strokeWidth="1.4" />
          </g>

          {/* Staghorn coral */}
          <g transform={`translate(${STAGHORN.x} ${STAGHORN.y.toFixed(1)})`}>
            <path d={STAGHORN_PATH} fill="none" stroke="var(--coral)" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
            <path d={STAGHORN_PATH} fill="none" stroke="#ffffff" strokeOpacity="0.2" strokeWidth="2" strokeLinecap="round" transform="translate(-1 -1)" />
          </g>

          {/* Anemone: tentacles sway together from the base; two clownfish dart in and out */}
          <g transform={`translate(${ANEMONE.x} ${ANEMONE.y.toFixed(1)})`}>
            <g className={styles.clown}>
              <g transform="translate(-14 -40)">
                <path d="M0 0 Q7 -5 14 0 Q7 5 0 0 Z M1 0 L-5 -4 L-5 4 Z" fill="var(--clownfish)" />
                <path d="M5 -3.5 V3.5 M9 -3 V3" stroke="#ffffff" strokeWidth="1.6" />
                <circle cx="11" cy="-0.8" r="0.9" fill="#1d2b33" />
              </g>
            </g>
            <g className={`${styles.clown} ${styles.clown2}`}>
              <g transform="translate(10 -30) scale(-0.8 0.8)">
                <path d="M0 0 Q7 -5 14 0 Q7 5 0 0 Z M1 0 L-5 -4 L-5 4 Z" fill="var(--clownfish)" />
                <path d="M5 -3.5 V3.5 M9 -3 V3" stroke="#ffffff" strokeWidth="1.6" />
                <circle cx="11" cy="-0.8" r="0.9" fill="#1d2b33" />
              </g>
            </g>
            <g className={styles.tentacles} fill="none" stroke="var(--anemone)" strokeWidth="3.4" strokeLinecap="round">
              {[-14, -10, -6, -2, 2, 6, 10, 14].map((x, i) => (
                <path key={x} d={`M${x * 0.5} -6 Q${x * 0.9} -16 ${x * 1.1 + (i % 2 ? 2 : -2)} -24`} />
              ))}
            </g>
            <path d="M-10 0 Q-10 -8 0 -8 Q10 -8 10 0 Z" fill="var(--coral-alt)" />
          </g>
          {KELP.map((k, i) => (
            <g key={i} transform={`translate(${k.x} 690)`}>
              <g className={styles.sway} style={{ animationDuration: `${k.dur}s`, animationDelay: `${-i * 1.3}s` }}>
                <path
                  d={`M0 0 C-12 ${-k.h * 0.25} 12 ${-k.h * 0.5} 0 ${-k.h * 0.75} S-6 ${-k.h} -2 ${-k.h}`}
                  fill="none"
                  stroke="var(--kelp)"
                  strokeWidth="5"
                  strokeLinecap="round"
                />
                <g fill="var(--kelp)">
                  {k.leaves.map((l, j) => (
                    <ellipse key={j} cx={l.cx} cy={l.cy} rx="9" ry="3.5" transform={`rotate(${l.angle} ${l.cx} ${l.cy})`} />
                  ))}
                </g>
              </g>
            </g>
          ))}
          <path fill="var(--sand-2)" d={PATHS.sandFront} />
          <g transform={`translate(84 ${(ridgeY(84, SAND_FRONT.y, SAND_FRONT.components) + 14).toFixed(1)}) rotate(-12)`}>
            <path d="M0 -10 L3 -3 L10 -3 L4.5 1.5 L6.5 9 L0 4.5 L-6.5 9 L-4.5 1.5 L-10 -3 L-3 -3 Z" fill="var(--coral)" strokeLinejoin="round" stroke="var(--coral)" strokeWidth="2" />
          </g>
          <g transform={`translate(318 ${(ridgeY(318, SAND_FRONT.y, SAND_FRONT.components) + 16).toFixed(1)})`}>
            <path d="M-8 2 Q-8 -9 0 -9 Q8 -9 8 2 Z" fill="#f4e6d0" />
            <path d="M0 2 V-8 M-4 2 L-5 -6 M4 2 L5 -6" stroke="#d9c4a2" strokeWidth="1" />
          </g>

          <g fill="none" stroke="#e9fcf9" strokeWidth="1.2">
            {BUBBLES.map((b, i) => (
              <g key={i} transform={`translate(${b.x.toFixed(1)} 660)`}>
                <g className={styles.rise} style={{ animationDuration: `${b.dur.toFixed(2)}s`, animationDelay: `${(-b.delay).toFixed(2)}s` }}>
                  <circle className={styles.wobble} r={b.r.toFixed(2)} />
                </g>
              </g>
            ))}
          </g>
        </>
      }
    />
  );
}
