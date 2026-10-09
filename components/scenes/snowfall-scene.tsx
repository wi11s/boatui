// <SnowfallScene>: snow falling at three depths over a quiet winter valley while a fox trots
// across the meadow. Far flakes are small and slow; near flakes are six-armed and spin as they
// sway. `duration` is seconds for the fox to cross the frame (default 36).

import type { CSSProperties } from 'react';
import { W, bandPath, ridgeY, seeded, type Ridge } from './geometry';
import { SceneFrame, useSvgId, type SceneProps } from './scene';
import styles from './snowfall-scene.module.css';

export const snowfallTheme = {
  skyTop: '#bcd3ee',
  skyBottom: '#eef4fb',
  sun: '#fffaf0',
  hill1: '#c9d9ec',
  hill2: '#aec4dd',
  pine: '#47657f',
  snow: '#ffffff',
  snowShadow: '#d9e6f4',
  fox: '#e2763a',
  flake: '#ffffff',
};
export type SnowfallTheme = typeof snowfallTheme;

const FIELD = 590;
const FAR: Ridge = [[16, 400, 1], [8, 200]];
const NEAR: Ridge = [[20, 400, 2.6], [8, 100, 1]];
const MEADOW: Ridge = [[8, 400, 0.4], [4, 200, 2]];

const rand = seeded(41);

/** Three depths of snow: count, size, seconds to fall the full height, sideways sway, opacity. */
const DEPTHS = [
  { count: 40, size: [1.2, 2], fall: [18, 26], sway: [6, 14], opacity: 0.6 },
  { count: 24, size: [2.4, 3.6], fall: [12, 17], sway: [12, 24], opacity: 0.85 },
  { count: 12, size: [10, 15], fall: [8, 12], sway: [18, 34], opacity: 1 },
];
const between = ([a, b]: number[]) => a + rand() * (b - a);
// Each flake rests at a scattered (x, y), so under reduced motion the snow hangs mid-air
// instead of lining up along the top edge. The fall keyframes run relative to that point.
const FLAKES = DEPTHS.flatMap((d, depth) =>
  Array.from({ length: d.count }, () => {
    const y = rand() * 700;
    return {
      depth,
      x: rand() * W,
      y,
      size: between(d.size),
      fall: between(d.fall),
      delay: rand() * 30,
      sway: between(d.sway),
      swayTime: 2 + rand() * 3,
      spin: 6 + rand() * 8,
      opacity: d.opacity,
    };
  }),
);

// Snow-laden pines on the far slopes, and a few large ones framing the meadow.
const FAR_PINES = Array.from({ length: 26 }, () => {
  const x = rand() * W;
  return { x, y: ridgeY(x, 470, NEAR) + 4, h: 14 + rand() * 12 };
});
const NEAR_PINES = [
  { x: 28, y: 640, h: 120 },
  { x: 70, y: 652, h: 84 },
  { x: 352, y: 648, h: 104 },
];

const FLAKE_ARM = 'M0 0 V-9 M0 -6 L-2.5 -8.5 M0 -6 L2.5 -8.5';

function Pine({ x, y, h, snowy }: { x: number; y: number; h: number; snowy: boolean }) {
  const tiers = [0, 1, 2].map(i => {
    const top = y - h + i * h * 0.26;
    const half = h * (0.2 + i * 0.09);
    const bottom = top + h * 0.42;
    return { top, half, bottom };
  });
  return (
    <g>
      <rect x={x - h * 0.03} y={y - h * 0.12} width={h * 0.06} height={h * 0.12} fill="var(--pine)" />
      {tiers.map((t, i) => (
        <g key={i}>
          <path d={`M${x} ${t.top} L${x + t.half} ${t.bottom} H${x - t.half} Z`} fill="var(--pine)" />
          {snowy && (
            <path
              d={`M${x} ${t.top} L${x + t.half * 0.38} ${t.top + (t.bottom - t.top) * 0.38} Q${x} ${t.top + (t.bottom - t.top) * 0.3} ${x - t.half * 0.38} ${t.top + (t.bottom - t.top) * 0.38} Z`}
              fill="var(--snow)"
            />
          )}
        </g>
      ))}
    </g>
  );
}

/** A red fox, facing right, origin on the snow under its middle. Legs trot in diagonal pairs. */
function Fox() {
  const leg = (x: number, pair: 'a' | 'b') => (
    <g transform={`translate(${x} -11)`}>
      <g className={`${styles.leg} ${pair === 'b' ? styles.legB : ''}`}>
        <rect x="-1.6" y="0" width="3.2" height="11" rx="1.6" fill="var(--fox)" />
        <rect x="-1.6" y="6" width="3.2" height="5" rx="1.6" fill="#3d2a24" />
      </g>
    </g>
  );
  return (
    <g className={styles.trot}>
      <g className={styles.tail}>
        <path d="M-13 -18 C-24 -26 -38 -24 -44 -14 C-36 -17 -26 -13 -14 -13 Z" fill="var(--fox)" />
        <path d="M-44 -14 C-41 -19 -37 -20 -34 -19 C-36 -16 -39 -15 -44 -14 Z" fill="#ffffff" />
      </g>
      {leg(-9, 'b')}
      {leg(9, 'a')}
      <ellipse cx="0" cy="-17" rx="16" ry="8" fill="var(--fox)" />
      {leg(-5, 'a')}
      {leg(13, 'b')}
      <ellipse cx="14" cy="-18" rx="4.5" ry="5" fill="#ffffff" />
      <g className={styles.head}>
        <path d="M17 -29 L18.5 -38 L23 -30 Z M22 -30 L25.5 -38.5 L28 -29 Z" fill="#3d2a24" />
        <path d="M14 -24 Q16 -31 23 -31 Q28 -31 30 -27 L37 -23 Q33 -19 26 -19 Q17 -19 14 -24 Z" fill="var(--fox)" />
        <path d="M24 -19.5 Q31 -19.5 37 -23 Q33 -17.5 25 -17.5 Z" fill="#ffffff" />
        <circle cx="37" cy="-23" r="1.6" fill="#3d2a24" />
        <path d="M25 -26 q1.5 -1.2 3 0" fill="none" stroke="#3d2a24" strokeWidth="1.2" strokeLinecap="round" />
      </g>
    </g>
  );
}

/** Snow falling over a quiet winter valley while a fox trots across the meadow. */
export function SnowfallScene(props: SceneProps<SnowfallTheme>) {
  const sky = useSvgId('sky');
  const glow = useSvgId('glow');

  return (
    <SceneFrame
      {...props}
      defaultTheme={snowfallTheme}
      defaultDuration={36}
      art={
        <>
          <defs>
            <linearGradient id={sky} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="var(--sky-top)" />
              <stop offset="0.65" stopColor="var(--sky-bottom)" />
            </linearGradient>
            <radialGradient id={glow}>
              <stop offset="0" stopColor="var(--sun)" stopOpacity="0.9" />
              <stop offset="1" stopColor="var(--sun)" stopOpacity="0" />
            </radialGradient>
          </defs>

          <rect width={W} height="700" fill={`url(#${sky})`} />
          <circle cx="110" cy="330" r="120" fill={`url(#${glow})`} />
          <circle cx="110" cy="330" r="26" fill="var(--sun)" opacity="0.8" />

          {/* Distant snowy hills and forested slopes */}
          <path fill="var(--hill-1)" d={bandPath(430, FAR)} />
          <path fill="var(--hill-2)" d={bandPath(470, NEAR)} />
          <g opacity="0.55">
            {FAR_PINES.map((p, i) => (
              <Pine key={i} x={p.x} y={p.y} h={p.h} snowy={false} />
            ))}
          </g>

          {/* Meadow: a shadowed drift behind the open snow the fox crosses */}
          <path fill="var(--snow-shadow)" d={bandPath(FIELD - 26, MEADOW)} />
          <path fill="var(--snow)" d={bandPath(FIELD, MEADOW)} />

          <g className={styles.fox}>
            <g transform="scale(1.25)">
              <Fox />
            </g>
          </g>

          {NEAR_PINES.map((p, i) => (
            <Pine key={i} x={p.x} y={p.y} h={p.h} snowy />
          ))}

          {/* Drifts along the bottom edge */}
          <path fill="var(--snow-shadow)" d="M0 640 C60 618 110 630 160 634 S260 614 320 628 S380 630 400 624 V700 H0 Z" />
          <path fill="var(--snow)" d="M0 656 C50 640 100 650 150 652 S240 636 300 646 S370 650 400 644 V700 H0 Z" />

          {/* Snow, far to near, drawn last so it falls in front of everything */}
          {FLAKES.map((f, i) => (
            <g key={i} transform={`translate(${f.x.toFixed(1)} ${f.y.toFixed(1)})`} opacity={f.opacity}>
              <g
                className={styles.fall}
                style={
                  {
                    '--from': `${(-f.y - 20).toFixed(1)}px`,
                    '--to': `${(720 - f.y).toFixed(1)}px`,
                    animationDuration: `${f.fall.toFixed(2)}s`,
                    animationDelay: `${(-f.delay).toFixed(2)}s`,
                  } as CSSProperties
                }
              >
                <g className={styles.sway} style={{ '--sway': `${f.sway.toFixed(1)}px`, animationDuration: `${f.swayTime.toFixed(2)}s` } as CSSProperties}>
                  {f.depth === 2 ? (
                    <g className={styles.spin} style={{ animationDuration: `${f.spin.toFixed(2)}s` }}>
                      <g transform={`scale(${(f.size / 20).toFixed(3)})`} fill="none" stroke="var(--flake)" strokeWidth="1.6" strokeLinecap="round">
                        {[0, 60, 120, 180, 240, 300].map(a => (
                          <path key={a} d={FLAKE_ARM} transform={`rotate(${a})`} />
                        ))}
                      </g>
                    </g>
                  ) : (
                    <circle r={f.size.toFixed(2)} fill="var(--flake)" />
                  )}
                </g>
              </g>
            </g>
          ))}
        </>
      }
    />
  );
}
