// <TrainScene>: a steam train crossing a five-arched stone viaduct at dusk, its headlamp lit,
// with mountains and a hazy valley behind.
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
  valley: '#9c6f8e',
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

// Viaduct: a solid wall with five wide arched openings cut out (even-odd fill).
const SPAN = 80;
const PIER = 14;
const SPRING = 528; // where the arches start to curve
const ARCHES = Array.from({ length: W / SPAN }, (_, i) => {
  const left = i * SPAN + PIER / 2;
  const right = (i + 1) * SPAN - PIER / 2;
  return { left, right, r: (right - left) / 2 };
});
const VIADUCT = (() => {
  let d = `M-10 ${DECK} H${W + 10} V700 H-10 Z`;
  for (const { left, right, r } of ARCHES) d += ` M${left} 700 V${SPRING} A${r} ${r} 0 0 1 ${right} ${SPRING} V700 Z`;
  return d;
})();

const CARRIAGES = [0, 1, 2].map(k => -110 - 50 * k);

/** A steam train crossing a stone viaduct at dusk. */
export function TrainScene(props: SceneProps<TrainTheme>) {
  const sky = useSvgId('sky');
  const glow = useSvgId('glow');
  const valley = useSvgId('valley');
  const mist = useSvgId('mist');
  const lamp = useSvgId('lamp');

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
            {/* The valley seen through the arches: lit and hazy near the top, darker below */}
            <linearGradient id={valley} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="var(--sky-bottom)" stopOpacity="0.55" />
              <stop offset="0.35" stopColor="var(--valley)" />
              <stop offset="1" stopColor="var(--mountain-2)" />
            </linearGradient>
            <radialGradient id={mist}>
              <stop offset="0" stopColor="#fff" stopOpacity="0.35" />
              <stop offset="1" stopColor="#fff" stopOpacity="0" />
            </radialGradient>
            <linearGradient id={lamp} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="var(--windows)" stopOpacity="0.55" />
              <stop offset="1" stopColor="var(--windows)" stopOpacity="0" />
            </linearGradient>
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

          {/* Far side of the valley, then haze, seen through the arches */}
          <rect x="0" y={DECK} width={W} height={700 - DECK} fill={`url(#${valley})`} />
          <path fill="var(--mountain-2)" opacity="0.6" d={bandPath(600, [[8, 100], [5, 50, 2]])} />
          <g className={base.across} style={{ animationDuration: '80s', animationDelay: '-30s' }}>
            <ellipse cx="0" cy="560" rx="170" ry="22" fill={`url(#${mist})`} />
            <ellipse cx="200" cy="575" rx="120" ry="16" fill={`url(#${mist})`} />
          </g>

          <path fill="var(--viaduct)" fillRule="evenodd" d={VIADUCT} />
          {/* Stonework: arch rings, pier caps, and a parapet catching the last of the sun */}
          <g fill="none" stroke="var(--sky-bottom)" strokeOpacity="0.16" strokeWidth="5">
            {ARCHES.map(a => (
              <path key={a.left} d={`M${a.left - 2.5} ${SPRING} A${a.r + 2.5} ${a.r + 2.5} 0 0 1 ${a.right + 2.5} ${SPRING}`} />
            ))}
          </g>
          <g fill="var(--sky-bottom)" opacity="0.12">
            {ARCHES.map(a => (
              <rect key={a.left} x={a.left - PIER / 2 - 3} y={SPRING - 2} width={PIER + 6} height="5" />
            ))}
          </g>
          <rect x="-10" y={DECK - 8} width={W + 20} height="10" fill="var(--viaduct)" />
          <rect x="-10" y={DECK - 8} width={W + 20} height="2" fill="var(--sky-bottom)" opacity="0.35" />
          <rect x="-10" y={DECK + 2} width={W + 20} height="2" fill="#000" opacity="0.2" />

          {/* Train: origin at the front of the locomotive, on the deck, heading right */}
          <g className={styles.train}>
            <path d="M4 -20 L90 -40 L90 6 Z" fill={`url(#${lamp})`} />
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
              <circle cx="2.5" cy="-18" r="2.2" />
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
