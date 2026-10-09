// <AutumnScene>: a cyclist riding a winding country road on an autumn afternoon while maple leaves
// tumble down. A red barn sits on the hill among orange and gold trees; a fence runs along the
// verge. `duration` is seconds for the cyclist to cross the frame (default 30).

import type { CSSProperties } from 'react';
import { W, bandPath, ridgeY, seeded, type Ridge } from './geometry';
import { SceneFrame, useSvgId, type SceneProps } from './scene';
import styles from './autumn-scene.module.css';

export const autumnTheme = {
  skyTop: '#a9cde6',
  skyBottom: '#fbe7c6',
  sun: '#fff4d6',
  hill1: '#d9b878',
  hill2: '#b79a52',
  field: '#9cab5a',
  road: '#d8c3a0',
  leaf1: '#e07a3a',
  leaf2: '#c84a32',
  leaf3: '#e8b84a',
  barn: '#b8402e',
  coat: '#4f7d9c',
  scarf: '#e0503c',
};
export type AutumnTheme = typeof autumnTheme;

const FAR: Ridge = [[14, 400, 1.6], [6, 200]];
const MID: Ridge = [[18, 400, 0.2], [7, 100, 2]];
const ROAD_Y = 590;
const ROAD: Ridge = [[10, 400, 2.2], [3, 200, 0.4]];
const ROAD_WIDTH = 30;

// The road as a ribbon between two copies of the same curve.
const ROAD_PATH = (() => {
  const top: string[] = [];
  const bottom: string[] = [];
  for (let x = 0; x <= W; x += 8) {
    top.push(`${x} ${ridgeY(x, ROAD_Y, ROAD).toFixed(1)}`);
    bottom.unshift(`${x} ${(ridgeY(x, ROAD_Y, ROAD) + ROAD_WIDTH).toFixed(1)}`);
  }
  return `M${top.join(' L')} L${bottom.join(' L')} Z`;
})();

// The cyclist's height at eleven points along the ride, from the road's own curve.
const STEPS = Array.from({ length: 11 }, (_, i) => -80 + i * 56);
const RIDE_STYLE = Object.fromEntries(
  STEPS.map((x, i) => [`--y${i}`, `${(ridgeY(x, ROAD_Y, ROAD) + ROAD_WIDTH * 0.62).toFixed(1)}px`]),
) as CSSProperties;

const MAPLE = 'M0 -9 L2 -3.5 L7.5 -5.5 L4.5 0 L8.5 3 L2.5 3 L1.5 8 L0 4.5 L-1.5 8 L-2.5 3 L-8.5 3 L-4.5 0 L-7.5 -5.5 L-2 -3.5 Z';
const LEAF_COLORS = ['var(--leaf-1)', 'var(--leaf-2)', 'var(--leaf-3)'];

const rand = seeded(29);
// Leaves rest at scattered (x, y); the fall runs relative to that point, drifting right on the wind.
const LEAVES = Array.from({ length: 28 }, (_, i) => {
  const y = rand() * 700;
  return {
    x: -90 + rand() * (W + 90),
    y,
    size: 0.8 + rand() * 0.7,
    fall: 10 + rand() * 8,
    delay: rand() * 18,
    spin: (4 + rand() * 6) * (rand() > 0.5 ? 1 : -1),
    flutter: 0.9 + rand() * 1.1,
    color: LEAF_COLORS[i % 3],
  };
});

// Round autumn trees on the middle hill, in three colours.
const TREES = Array.from({ length: 14 }, (_, i) => {
  const x = 120 + rand() * 300;
  return { x, y: ridgeY(x, 520, MID) + 4, r: 9 + rand() * 9, color: LEAF_COLORS[i % 3] };
});

const FALLEN = Array.from({ length: 24 }, (_, i) => ({
  x: rand() * W,
  y: 646 + rand() * 50,
  rot: rand() * 360,
  color: LEAF_COLORS[i % 3],
}));

/** A cyclist with a flower basket, facing right, origin on the road under the bottom bracket. */
function Cyclist() {
  const wheel = (x: number) => (
    <g transform={`translate(${x} -11)`}>
      <circle r="11" fill="none" stroke="#3d4a57" strokeWidth="2.2" />
      <g className={styles.spin}>
        <path d="M-10 0 H10 M0 -10 V10 M-7 -7 L7 7 M-7 7 L7 -7" stroke="#3d4a57" strokeWidth="0.8" />
      </g>
    </g>
  );
  return (
    <g className={styles.bob}>
      {wheel(-17)}
      {wheel(19)}
      {/* Far leg, behind the frame */}
      <g transform="translate(-6 -32)">
        <path className={`${styles.leg} ${styles.legB}`} d="M0 0 L8 10 L4 21" fill="none" stroke="#2f3b46" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <path d="M-17 -11 L-2 -11 L10 -27 L-6 -27 Z M-2 -11 L-8 -30 M10 -27 L19 -11 M10 -27 L9 -34" fill="none" stroke="#3d4a57" strokeWidth="2.2" strokeLinejoin="round" />
      <path d="M-12 -31 H-4" stroke="#3d4a57" strokeWidth="2.6" strokeLinecap="round" />
      <path d="M6 -35 H13" stroke="#3d4a57" strokeWidth="2" strokeLinecap="round" />
      {/* Basket of flowers on the handlebars */}
      <path d="M12 -32 H24 L22 -24 H14 Z" fill="#b8875a" />
      <g fill="var(--leaf-3)">
        <circle cx="15" cy="-34" r="2.2" />
        <circle cx="19" cy="-35" r="2.4" fill="var(--scarf)" />
        <circle cx="22" cy="-33.5" r="2" />
      </g>
      {/* Rider */}
      <path d="M-8 -32 Q-6 -46 2 -50 L8 -46 Q2 -40 -1 -32 Z" fill="var(--coat)" />
      <path d="M4 -46 L11 -36" stroke="var(--coat)" strokeWidth="3.4" strokeLinecap="round" />
      <circle cx="6" cy="-55" r="5" fill="#f1c7a3" />
      <path d="M1 -57 Q2 -62 7 -61 Q11 -60 10 -56 Q6 -59 1 -57 Z" fill="#5a3e2b" />
      <g className={styles.scarf}>
        <path d="M3 -50 Q-6 -50 -14 -46" fill="none" stroke="var(--scarf)" strokeWidth="3" strokeLinecap="round" />
      </g>
      {/* Near leg, in front of the frame */}
      <g transform="translate(-6 -32)">
        <path className={styles.leg} d="M0 0 L8 10 L4 21" fill="none" stroke="#3d4a57" strokeWidth="3.6" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </g>
  );
}

/** A cyclist on a country road on an autumn afternoon, maple leaves tumbling down. */
export function AutumnScene(props: SceneProps<AutumnTheme>) {
  const sky = useSvgId('sky');
  const glow = useSvgId('glow');

  return (
    <SceneFrame
      {...props}
      defaultTheme={autumnTheme}
      defaultDuration={30}
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
          <circle cx="300" cy="300" r="130" fill={`url(#${glow})`} />
          <circle cx="300" cy="300" r="30" fill="var(--sun)" />

          {/* Geese heading south in a V */}
          <g className={styles.geese} fill="none" stroke="#5b5a63" strokeWidth="1.3" strokeLinecap="round">
            {[
              [0, 0],
              [-10, -6],
              [-20, -12],
              [-10, 6],
              [-20, 12],
            ].map(([x, y], i) => (
              <path key={i} className={styles.flap} style={{ animationDelay: `${-i * 0.15}s` }} d={`M${x - 4} ${y} q2 -3 4 0 q2 -3 4 0`} />
            ))}
          </g>

          <path fill="var(--hill-1)" d={bandPath(450, FAR)} />
          <path fill="var(--hill-2)" d={bandPath(520, MID)} />

          {/* Red barn with a silo on the hill */}
          <g transform={`translate(70 ${(ridgeY(70, 520, MID) + 6).toFixed(1)})`}>
            <rect x="34" y="-56" width="14" height="56" fill="#c9c2b6" />
            <path d="M34 -56 Q41 -66 48 -56 Z" fill="#8a8a8a" />
            <path d="M-26 0 V-30 L0 -46 L26 -30 V0 Z" fill="var(--barn)" />
            <path d="M-28 -29 L0 -48 L28 -29" fill="none" stroke="#ffffff" strokeWidth="2.4" />
            <rect x="-9" y="-20" width="18" height="20" fill="#ffffff" />
            <path d="M-9 -20 L9 0 M9 -20 L-9 0" stroke="var(--barn)" strokeWidth="2" />
            <rect x="-4" y="-38" width="8" height="7" fill="#ffffff" />
          </g>

          {TREES.map((t, i) => (
            <g key={i}>
              <rect x={(t.x - 1.5).toFixed(1)} y={(t.y - t.r).toFixed(1)} width="3" height={t.r.toFixed(1)} fill="#6b4a32" />
              <circle cx={t.x.toFixed(1)} cy={(t.y - t.r * 1.4).toFixed(1)} r={t.r.toFixed(1)} fill={t.color} />
              <circle cx={(t.x + t.r * 0.3).toFixed(1)} cy={(t.y - t.r * 1.2).toFixed(1)} r={(t.r * 0.6).toFixed(1)} fill="#000" opacity="0.1" />
            </g>
          ))}

          {/* Field and road */}
          <path fill="var(--field)" d={bandPath(566, [[8, 400, 1], [3, 100]])} />
          <path fill="var(--road)" d={ROAD_PATH} />

          <g className={styles.ride} style={RIDE_STYLE}>
            <g transform="scale(1.3)">
              <Cyclist />
            </g>
          </g>

          {/* Near verge with a fence and fallen leaves */}
          <path fill="var(--field)" d={bandPath(644, [[6, 400, 2.8], [3, 80]])} />
          <g stroke="#8a6a4a" strokeWidth="3" strokeLinecap="round">
            {Array.from({ length: 11 }, (_, i) => {
              const x = i * 40 + 6;
              const y = ridgeY(x, 644, [[6, 400, 2.8], [3, 80]]) + 4;
              return <path key={i} d={`M${x} ${y.toFixed(1)} V${(y - 26).toFixed(1)}`} />;
            })}
          </g>
          <path
            d={Array.from({ length: 11 }, (_, i) => {
              const x = i * 40 + 6;
              const y = ridgeY(x, 644, [[6, 400, 2.8], [3, 80]]) + 4;
              return `${i ? 'L' : 'M'}${x} ${(y - 20).toFixed(1)}`;
            }).join(' ')}
            fill="none"
            stroke="#8a6a4a"
            strokeWidth="2.4"
          />
          {FALLEN.map((f, i) => (
            <path key={i} d={MAPLE} fill={f.color} transform={`translate(${f.x.toFixed(1)} ${f.y.toFixed(1)}) rotate(${f.rot.toFixed(0)}) scale(0.7)`} />
          ))}

          {/* Leaves on the wind, drawn last so they tumble in front of everything */}
          {LEAVES.map((l, i) => (
            <g key={i} transform={`translate(${l.x.toFixed(1)} ${l.y.toFixed(1)})`}>
              <g
                className={styles.fall}
                style={
                  {
                    '--from': `${(-l.y - 20).toFixed(1)}px`,
                    '--to': `${(720 - l.y).toFixed(1)}px`,
                    animationDuration: `${l.fall.toFixed(2)}s`,
                    animationDelay: `${(-l.delay).toFixed(2)}s`,
                  } as CSSProperties
                }
              >
                <g className={styles.sway}>
                  <g
                    className={styles.tumble}
                    style={{ animationDuration: `${Math.abs(l.spin).toFixed(2)}s`, animationDirection: l.spin < 0 ? 'reverse' : 'normal' }}
                  >
                    <g className={styles.flutter} style={{ animationDuration: `${l.flutter.toFixed(2)}s` }}>
                      <path d={MAPLE} fill={l.color} transform={`scale(${l.size.toFixed(2)})`} />
                    </g>
                  </g>
                </g>
              </g>
            </g>
          ))}
        </>
      }
    />
  );
}
