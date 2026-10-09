// <KiteScene>: a child flying a diamond kite from a grassy hill on a breezy spring afternoon.
// The kite wanders a loop in the sky with its ribbon tail waving; the string stays pinned to the
// child's hand (it turns and stretches with the kite). A windmill turns on the far hill.
// `duration` is seconds for one loop of the kite's wander (default 16).

import { W, bandPath, ridgeY, seeded, type Ridge } from './geometry';
import { SceneFrame, sceneStyles as base, useSvgId, type SceneProps } from './scene';
import styles from './kite-scene.module.css';

export const kiteTheme = {
  skyTop: '#8cc4ea',
  skyBottom: '#eaf5f6',
  sun: '#fff7d6',
  hill1: '#b7dcb0',
  hill2: '#8cc98a',
  hill3: '#64b06a',
  grass: '#4f9a58',
  kite: '#e4573d',
  kiteAlt: '#f3c64f',
  tail: '#5b7fb8',
  string: '#ffffff',
  windmill: '#f4f1ea',
  shirt: '#5b7fb8',
};
export type KiteTheme = typeof kiteTheme;

const HILL1: Ridge = [[16, 400, 1], [6, 200]];
const HILL2: Ridge = [[18, 400, 3], [7, 100, 1]];
const HILL3: Ridge = [[14, 400, 2.2], [5, 200, 1]];

// The child's hand, where the string is tied; the kite's first keyframe in kite-scene.module.css.
const HAND = { x: 78, y: 594 };
const KITE0 = { x: 232, y: 236 };

const rand = seeded(23);
const FLOWERS = Array.from({ length: 26 }, () => {
  const x = rand() * W;
  return { x, y: ridgeY(x, 552, HILL2) + 6 + rand() * 30, c: rand() > 0.5 ? 'var(--kite-alt)' : '#ffffff' };
});
const TUFTS = Array.from({ length: 30 }, (_, i) => {
  const x = i * 14 + rand() * 8;
  return { x, y: ridgeY(x, 624, HILL3) + 3 + rand() * 50, h: 7 + rand() * 7, delay: rand() * 3 };
});

/** One bow of the kite's tail; each holds the next, so the wave travels down the tail. */
function Tail({ depth }: { depth: number }) {
  if (depth === 0) return null;
  return (
    <g className={styles.tail} style={{ animationDelay: `${-depth * 0.18}s` }}>
      <path d="M0 0 Q4 7 0 14" fill="none" stroke="var(--tail)" strokeWidth="1.4" />
      <path d="M-5 11 L0 14 L-5 17 Z M5 11 L0 14 L5 17 Z" fill={depth % 2 ? 'var(--kite-alt)' : 'var(--kite)'} />
      <g transform="translate(0 14)">
        <Tail depth={depth - 1} />
      </g>
    </g>
  );
}

/** A child flying a kite from a grassy hill on a breezy afternoon. */
export function KiteScene(props: SceneProps<KiteTheme>) {
  const sky = useSvgId('sky');
  const glow = useSvgId('glow');

  return (
    <SceneFrame
      {...props}
      defaultTheme={kiteTheme}
      defaultDuration={16}
      art={
        <>
          <defs>
            <linearGradient id={sky} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="var(--sky-top)" />
              <stop offset="0.7" stopColor="var(--sky-bottom)" />
            </linearGradient>
            <radialGradient id={glow}>
              <stop offset="0" stopColor="var(--sun)" stopOpacity="0.9" />
              <stop offset="1" stopColor="var(--sun)" stopOpacity="0" />
            </radialGradient>
          </defs>

          <rect width={W} height="700" fill={`url(#${sky})`} />
          <circle cx="330" cy="120" r="100" fill={`url(#${glow})`} />
          <circle cx="330" cy="120" r="28" fill="var(--sun)" />

          <g fill="#fff">
            <g className={base.across} style={{ animationDuration: '70s', animationDelay: '-10s' }} opacity="0.9">
              <ellipse cx="0" cy="170" rx="44" ry="13" />
              <ellipse cx="18" cy="160" rx="26" ry="14" />
              <ellipse cx="-20" cy="164" rx="16" ry="9" />
            </g>
            <g className={base.across} style={{ animationDuration: '95s', animationDelay: '-60s' }} opacity="0.75">
              <ellipse cx="0" cy="330" rx="36" ry="10" />
              <ellipse cx="-12" cy="322" rx="20" ry="10" />
            </g>
            <g className={base.across} style={{ animationDuration: '120s', animationDelay: '-30s' }} opacity="0.6">
              <ellipse cx="0" cy="420" rx="30" ry="8" />
            </g>
          </g>

          <path fill="var(--hill-1)" d={bandPath(480, HILL1)} />

          {/* Windmill on the far hill */}
          <g transform={`translate(318 ${ridgeY(318, 480, HILL1).toFixed(1)})`}>
            <path d="M-7 4 L-4 -34 H4 L7 4 Z" fill="var(--windmill)" />
            <path d="M-6 -33 L0 -42 L6 -33 Z" fill="var(--kite)" />
            <g transform="translate(0 -34)">
              <g className={styles.blades} fill="var(--windmill)">
                {[0, 90, 180, 270].map(a => (
                  <rect key={a} x="-2" y="-26" width="4" height="24" rx="1" transform={`rotate(${a})`} />
                ))}
                <circle r="2.6" fill="var(--kite)" />
              </g>
            </g>
          </g>

          <path fill="var(--hill-2)" d={bandPath(552, HILL2)} />
          <g>
            {FLOWERS.map((f, i) => (
              <circle key={i} cx={f.x.toFixed(1)} cy={f.y.toFixed(1)} r="1.8" fill={f.c} />
            ))}
          </g>
          <path fill="var(--hill-3)" d={bandPath(624, HILL3)} />

          {/* String: drawn toward the kite's first position, then turned and stretched about the hand */}
          <g transform={`translate(${HAND.x} ${HAND.y})`}>
            <g className={styles.string}>
              <path
                d={`M0 0 Q${((KITE0.x - HAND.x) * 0.55).toFixed(1)} ${((KITE0.y - HAND.y) * 0.4).toFixed(1)} ${KITE0.x - HAND.x} ${KITE0.y - HAND.y}`}
                fill="none"
                stroke="var(--string)"
                strokeOpacity="0.85"
                strokeWidth="1.2"
                vectorEffect="non-scaling-stroke"
              />
            </g>
          </g>

          {/* Kite: origin at the point where the string ties on */}
          <g className={styles.kite}>
            <g className={styles.dance}>
              <g transform="translate(0 30)">
                <Tail depth={6} />
              </g>
              <path d="M0 -34 L22 -4 L0 30 L-22 -4 Z" fill="var(--kite)" />
              <path d="M0 -34 L22 -4 L0 -4 Z M0 -4 L-22 -4 L0 30 Z" fill="var(--kite-alt)" />
              <path d="M0 -34 V30 M-22 -4 H22" stroke="#7a4a2e" strokeOpacity="0.6" strokeWidth="1.4" />
            </g>
          </g>

          {/* The child, holding the string up */}
          <g transform={`translate(${HAND.x - 14} ${HAND.y + 2})`}>
            <path d="M14 -2 L4 10" stroke="#f1c7a3" strokeWidth="3" strokeLinecap="round" />
            <path d="M-6 30 L-2 6 Q2 2 6 6 L10 30 Z" fill="var(--shirt)" />
            <path d="M-2 30 V40 M5 30 V40" stroke="#3d4a57" strokeWidth="3" strokeLinecap="round" />
            <circle cx="2" cy="-4" r="7" fill="#f1c7a3" />
            <path d="M-5 -6 Q-4 -13 3 -12 Q9 -12 9 -5 Q5 -9 -5 -6 Z" fill="#5a3e2b" />
            <path className={styles.scarf} d="M-1 6 Q-10 6 -16 10" stroke="var(--kite)" strokeWidth="3" strokeLinecap="round" fill="none" />
          </g>

          <g fill="none" stroke="var(--grass)" strokeWidth="2" strokeLinecap="round">
            {TUFTS.map((t, i) => (
              <g key={i} transform={`translate(${t.x.toFixed(1)} ${t.y.toFixed(1)})`}>
                <path
                  className={styles.blade}
                  style={{ animationDelay: `${(-t.delay).toFixed(2)}s` }}
                  d={`M-3 0 Q-4 ${(-t.h * 0.6).toFixed(1)} -6 ${(-t.h).toFixed(1)} M0 0 Q1 ${(-t.h * 0.7).toFixed(1)} 2 ${(-t.h - 3).toFixed(1)} M3 0 Q5 ${(-t.h * 0.5).toFixed(1)} 7 ${(-t.h * 0.8).toFixed(1)}`}
                />
              </g>
            ))}
          </g>
        </>
      }
    />
  );
}
