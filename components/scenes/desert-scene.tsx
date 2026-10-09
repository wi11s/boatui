// <DesertScene>: a camel caravan crossing a dune crest at sunset. A guide walks ahead of three
// camels, each stepping along the ridge line as it rises and dips; sand blows off the crests and
// the first stars come out. `duration` is seconds for the caravan to cross the frame (default 60).

import type { CSSProperties } from 'react';
import { W, bandPath, ridgeY, seeded, type Ridge } from './geometry';
import { SceneFrame, useSvgId, type SceneProps } from './scene';
import styles from './desert-scene.module.css';

export const desertTheme = {
  skyTop: '#41588c',
  skyMid: '#f2a477',
  skyBottom: '#fde1b0',
  sun: '#fff1c9',
  dune1: '#eab889',
  dune2: '#d99a6c',
  dune3: '#c47a55',
  dune4: '#a9603f',
  silhouette: '#3b2a35',
};
export type DesertTheme = typeof desertTheme;

const FAR: Ridge = [[10, 400, 2], [5, 200]];
const CREST_Y = 478;
const CREST: Ridge = [[6, 400, 0.5], [2, 200, 1]];
const NEAR: Ridge = [[16, 400, 3.4], [6, 100, 1]];
const FRONT: Ridge = [[12, 200, 0.6], [4, 80]];

// The crest's top edge alone, for its sunlit rim.
const CREST_LINE = Array.from({ length: W / 8 + 1 }, (_, i) => `${i ? 'L' : 'M'}${i * 8} ${ridgeY(i * 8, CREST_Y, CREST).toFixed(1)}`).join(' ');

// The caravan's keyframes run along these x positions; each walker's height at every one is the
// crest's height under it, passed in as --y0 … --y10 so it stays on the sand.
const STEPS = Array.from({ length: 11 }, (_, i) => -140 + i * 68);
const WALKERS = [
  { dx: 40, kind: 'guide' as const },
  { dx: 0, kind: 'rider' as const },
  { dx: -64, kind: 'camel' as const },
  { dx: -128, kind: 'camel' as const },
];
const walkerStyle = (dx: number) => {
  const vars: Record<string, string> = { '--dx': `${dx}px` };
  STEPS.forEach((x, i) => (vars[`--y${i}`] = `${ridgeY(x + dx, CREST_Y, CREST).toFixed(1)}px`));
  return vars as CSSProperties;
};

const rand = seeded(19);
const STARS = Array.from({ length: 26 }, () => ({
  x: rand() * W,
  y: 10 + rand() * 170,
  r: 0.4 + rand() * 0.9,
  dur: 2 + rand() * 3,
  delay: rand() * 5,
}));

// Wisps of sand lifted off crests by the wind.
const WISPS = [
  { x: 60, y: ridgeY(60, 548, NEAR) - 2, delay: 0 },
  { x: 250, y: ridgeY(250, 548, NEAR) - 2, delay: -2.2 },
  { x: 330, y: ridgeY(330, CREST_Y, CREST) - 2, delay: -4.1 },
];

// Ripples raked into the nearest dune by the wind.
const RIPPLES = Array.from({ length: 9 }, (_, i) => {
  const y = 628 + i * 8;
  const x = 20 + rand() * 60;
  return `M${x.toFixed(1)} ${y} q60 -6 120 0 t120 0`;
});

function Legs({ xs, len }: { xs: number[]; len: number }) {
  return (
    <>
      {xs.map((x, i) => (
        <g key={x} transform={`translate(${x} ${-len})`}>
          <rect className={`${styles.leg} ${i % 2 ? styles.legB : ''}`} x="-1.6" y="0" width="3.2" height={len} rx="1.6" />
        </g>
      ))}
    </>
  );
}

/** A camel facing right, origin on the sand under its middle. Optionally carrying a rider. */
function Camel({ rider }: { rider: boolean }) {
  return (
    <g className={styles.sway}>
      <Legs xs={[-16, -9, 11, 18]} len={26} />
      <path d="M-24 -28 C-24 -38 -16 -42 -10 -42 C-6 -54 6 -56 10 -44 C16 -44 22 -40 22 -32 L22 -26 C10 -22 -12 -22 -24 -26 Z" />
      <path d="M-24 -32 Q-30 -30 -29 -22" fill="none" stroke="var(--silhouette)" strokeWidth="2" strokeLinecap="round" />
      <g className={styles.nod}>
        <path d="M18 -38 C26 -40 29 -48 31 -56 L40 -57 C43 -55 43 -51 39 -50 L35 -50 C33 -42 28 -31 19 -28 Z" />
      </g>
      {rider && (
        <g>
          <path d="M-4 -52 L4 -52 L6 -40 L-6 -40 Z" />
          <circle cx="0" cy="-57" r="4" />
          <path className={styles.scarf} d="M-3 -58 Q-12 -56 -16 -50" fill="none" stroke="var(--silhouette)" strokeWidth="2" strokeLinecap="round" />
        </g>
      )}
    </g>
  );
}

/** A guide on foot with a staff, origin on the sand. */
function Guide() {
  return (
    <g className={styles.sway}>
      <Legs xs={[-2, 2]} len={16} />
      <path d="M-5 -16 L-4 -32 Q0 -36 4 -32 L5 -16 Z" />
      <circle cx="0" cy="-37" r="4" />
      <path d="M8 2 L10 -40" stroke="var(--silhouette)" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M4 -28 L9 -24" stroke="var(--silhouette)" strokeWidth="2.4" strokeLinecap="round" />
    </g>
  );
}

/** A camel caravan crossing a dune crest at sunset. */
export function DesertScene(props: SceneProps<DesertTheme>) {
  const sky = useSvgId('sky');
  const glow = useSvgId('glow');

  return (
    <SceneFrame
      {...props}
      defaultTheme={desertTheme}
      defaultDuration={60}
      art={
        <>
          <defs>
            <linearGradient id={sky} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="var(--sky-top)" />
              <stop offset="0.48" stopColor="var(--sky-mid)" />
              <stop offset="0.68" stopColor="var(--sky-bottom)" />
            </linearGradient>
            <radialGradient id={glow}>
              <stop offset="0" stopColor="var(--sun)" stopOpacity="0.9" />
              <stop offset="1" stopColor="var(--sun)" stopOpacity="0" />
            </radialGradient>
          </defs>

          <rect width={W} height="700" fill={`url(#${sky})`} />
          <g fill="#ffffff">
            {STARS.map((s, i) => (
              <circle
                key={i}
                className={styles.star}
                cx={s.x.toFixed(1)}
                cy={s.y.toFixed(1)}
                r={s.r.toFixed(2)}
                style={{ animationDuration: `${s.dur.toFixed(2)}s`, animationDelay: `${(-s.delay).toFixed(2)}s` }}
              />
            ))}
          </g>

          {/* Thin streaks of cloud lit from below */}
          <g fill="var(--sun)" opacity="0.55">
            <rect x="40" y="268" width="150" height="3" rx="1.5" />
            <rect x="80" y="278" width="90" height="2.5" rx="1.25" />
            <rect x="250" y="250" width="110" height="2.5" rx="1.25" />
          </g>

          <circle className={styles.glow} cx="276" cy="410" r="150" fill={`url(#${glow})`} />
          <circle cx="276" cy="410" r="48" fill="var(--sun)" />

          <path fill="var(--dune-1)" d={bandPath(436, FAR)} />
          {/* Two palms at a far oasis */}
          <g fill="var(--dune-3)" opacity="0.6">
            <path d="M66 430 q2 -12 0 -24 M74 432 q-2 -10 2 -20" stroke="var(--dune-3)" strokeWidth="2" fill="none" />
            <path d="M66 406 q-8 0 -12 5 q6 -2 12 -1 q-4 -6 -10 -6 q8 -2 10 2 q2 -6 8 -6 q-4 3 -6 6 q8 0 10 5 q-6 -3 -12 -5 Z" />
            <path d="M76 412 q-6 0 -9 4 q5 -2 9 -1 q-3 -4 -7 -4 q6 -2 7 1 q2 -4 6 -4 q-3 2 -4 4 q6 0 7 4 q-4 -2 -9 -4 Z" />
          </g>

          {/* The crest the caravan walks, its shaded face and a lit edge */}
          <path fill="var(--dune-2)" d={bandPath(CREST_Y, CREST)} />
          <path fill="none" stroke="var(--sky-bottom)" strokeOpacity="0.6" strokeWidth="1.6" d={CREST_LINE} />

          {WALKERS.map((w, i) => (
            <g key={i} className={styles.walk} style={walkerStyle(w.dx)} fill="var(--silhouette)">
              {w.kind === 'guide' ? <Guide /> : <Camel rider={w.kind === 'rider'} />}
            </g>
          ))}

          <path fill="var(--dune-3)" d={bandPath(548, NEAR)} />
          <g fill="none" stroke="var(--sky-bottom)" strokeWidth="1.4" strokeLinecap="round">
            {WISPS.map((w, i) => (
              <path
                key={i}
                className={styles.wisp}
                style={{ animationDelay: `${w.delay}s` }}
                d={`M${w.x.toFixed(1)} ${w.y.toFixed(1)} q14 -4 30 -2 M${(w.x + 6).toFixed(1)} ${(w.y + 3).toFixed(1)} q12 -3 24 -1`}
              />
            ))}
          </g>

          <path fill="var(--dune-4)" d={bandPath(612, FRONT)} />
          <g fill="none" stroke="#000000" strokeOpacity="0.1" strokeWidth="1.4">
            {RIPPLES.map((d, i) => (
              <path key={i} d={d} />
            ))}
          </g>
        </>
      }
    />
  );
}
