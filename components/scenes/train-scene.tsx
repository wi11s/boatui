// <TrainScene>: a steam train crossing a stone viaduct at dusk, mountains behind.
// `duration` is seconds for the train to cross the frame (default 30).

import { W, bandPath, ridgeY, seeded, type Ridge } from './geometry';
import { SceneFrame, sceneStyles as base, useSvgId, type SceneProps } from './scene';
import styles from './train-scene.module.css';

export const trainTheme = {
  skyTop: '#283a6b',
  skyMid: '#b5647f',
  skyBottom: '#f4a76f',
  sun: '#ffd9a0',
  mountain1: '#7a5a86',
  mountain2: '#563f6b',
  viaduct: '#3a2b4f',
  forest: '#241b38',
  train: '#1b1428',
  windows: '#ffd98a',
};
export type TrainTheme = typeof trainTheme;

const DECK = 470;
const FOREST: Ridge = [[10, 200], [6, 80]];

const rand = seeded(31);
const STARS = Array.from({ length: 30 }, () => ({
  x: rand() * W,
  y: 20 + rand() * 230,
  r: 0.5 + rand() * 1,
  dur: 2 + rand() * 3,
  delay: rand() * 5,
}));

// Trees along the forest ridge in front of the viaduct's piers.
const TREES = Array.from({ length: 16 }, (_, i) => {
  const x = i * 26 + rand() * 12;
  return { x, y: ridgeY(x, 640, FOREST) + 2, h: 26 + rand() * 22 };
});

// Viaduct: a solid wall with arched openings cut out (even-odd fill).
const VIADUCT = (() => {
  let d = `M-10 ${DECK} H${W + 10} V700 H-10 Z`;
  for (let x = 0; x < W; x += 50) {
    const left = x + 12, right = x + 50, r = (right - left) / 2;
    d += ` M${left} 700 V520 A${r} ${r} 0 0 1 ${right} 520 V700 Z`;
  }
  return d;
})();

const CARRIAGES = [0, 1, 2].map(k => -110 - 50 * k);

/** A steam train crossing a stone viaduct at dusk. */
export function TrainScene(props: SceneProps<TrainTheme>) {
  const sky = useSvgId('sky');
  const glow = useSvgId('glow');

  return (
    <SceneFrame
      {...props}
      defaultTheme={trainTheme}
      defaultDuration={30}
      art={
        <>
          <defs>
            <linearGradient id={sky} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="var(--sky-top)" />
              <stop offset="0.42" stopColor="var(--sky-mid)" />
              <stop offset="0.66" stopColor="var(--sky-bottom)" />
            </linearGradient>
            <radialGradient id={glow}>
              <stop offset="0" stopColor="var(--sun)" stopOpacity="0.9" />
              <stop offset="1" stopColor="var(--sun)" stopOpacity="0" />
            </radialGradient>
          </defs>

          <rect width={W} height="700" fill={`url(#${sky})`} />

          <g fill="#fff">
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

          <circle className={styles.glow} cx="112" cy="420" r="130" fill={`url(#${glow})`} />
          <circle cx="112" cy="420" r="34" fill="var(--sun)" />

          <path fill="var(--mountain-1)" d={bandPath(400, [[30, 400], [14, 200, 1]])} />
          <path fill="var(--mountain-2)" d={bandPath(452, [[24, 400, 2], [10, W / 3]])} />

          <g className={base.across} style={{ animationDuration: '80s', animationDelay: '-30s' }}>
            <ellipse cx="0" cy="520" rx="150" ry="10" fill="#fff" opacity="0.18" />
          </g>

          <path fill="var(--viaduct)" fillRule="evenodd" d={VIADUCT} />
          <rect x="-10" y={DECK - 3} width={W + 20} height="3" fill="var(--viaduct)" opacity="0.6" />

          {/* Train: origin at the front of the locomotive, on the deck, heading right */}
          <g className={styles.train}>
            <g fill="var(--train)">
              <rect x="-60" y="-30" width="22" height="26" rx="2" />
              <rect x="-38" y="-22" width="34" height="18" rx="3" />
              <path d="M-4 -22 L2 -16 L2 -4 L-4 -4 Z" />
              <rect x="-14" y="-33" width="6" height="11" />
              <path d="M2 -4 L8 0 L-2 0 Z" />
              {CARRIAGES.map(x => (
                <g key={x}>
                  <rect x={x - 1} y="-27" width="48" height="4" rx="2" />
                  <rect x={x} y="-24" width="46" height="20" rx="3" />
                  <rect x={x + 46} y="-10" width="4" height="3" />
                </g>
              ))}
            </g>
            <g fill="var(--windows)">
              <rect x="-55" y="-26" width="10" height="8" rx="1" />
              {CARRIAGES.flatMap(x =>
                [0, 1, 2, 3].map(j => <rect key={`${x}-${j}`} x={x + 5 + 10 * j} y="-19" width="6" height="7" rx="1" />),
              )}
            </g>
            <g fill="#120d1d">
              {[-50, -36, -20, -8].map(x => <circle key={x} cx={x} cy="-3" r="4" />)}
              {CARRIAGES.flatMap(x => [x + 8, x + 38]).map(x => <circle key={x} cx={x} cy="-3" r="3.5" />)}
            </g>
            <g transform="translate(-11 -36)" fill="#f4eef2">
              {[0, 0.8, 1.6].map(d => (
                <circle key={d} className={styles.puff} r="5" style={{ animationDelay: `${-d}s` }} />
              ))}
            </g>
          </g>

          <path fill="var(--forest)" d={bandPath(640, FOREST)} />
          <g fill="var(--forest)">
            {TREES.map((t, i) => (
              <path
                key={i}
                d={`M${t.x.toFixed(1)} ${(t.y - t.h).toFixed(1)} L${(t.x + 9).toFixed(1)} ${t.y.toFixed(1)} L${(t.x - 9).toFixed(1)} ${t.y.toFixed(1)} Z`}
              />
            ))}
          </g>
        </>
      }
    />
  );
}
