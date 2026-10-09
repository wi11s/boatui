// <BlossomScene>: a spring riverbank under a cherry tree in full bloom. Petals drift down on a
// breeze, spinning and fluttering, past a red arched bridge while a mother duck leads three
// ducklings across the water. `duration` is seconds for the ducks to cross the frame (default 50).

import type { CSSProperties } from 'react';
import { W, bandPath, ridgeY, seeded, type Ridge } from './geometry';
import { SceneFrame, sceneStyles as base, useSvgId, type SceneProps } from './scene';
import styles from './blossom-scene.module.css';

export const blossomTheme = {
  skyTop: '#fff7f3',
  skyBottom: '#fde3ea',
  hill1: '#f1d3de',
  hill2: '#e5bccb',
  water: '#cfe2ee',
  bridge: '#d9543f',
  grass: '#b9dca8',
  trunk: '#8a5a52',
  blossom: '#f8bed0',
  blossomDeep: '#f29bb6',
  petal1: '#f6a9be',
  petal2: '#fbcfdc',
  duck: '#fbf8f1',
  duckling: '#f6d55c',
};
export type BlossomTheme = typeof blossomTheme;

const RIVER = 506;
const BANK = 604;
const FAR_HILL: Ridge = [[14, 400, 1.2], [6, 200]];
const NEAR_HILL: Ridge = [[16, 400, 3], [7, 100, 2]];
const GRASS: Ridge = [[6, 400, 0.8], [4, 200, 2]];

// Heart-shaped petal with a notch at the tip (same as the old petals background).
const PETAL = 'M0 8 C-6 4 -7 -3 -3 -7 C-1.5 -8.5 -0.5 -7.5 0 -6 C0.5 -7.5 1.5 -8.5 3 -7 C7 -3 6 4 0 8 Z';

const rand = seeded(57);
// Each petal rests at a scattered (x, y); the fall keyframes run relative to that point, and the
// breeze carries it 110 units left on the way down, so they start spread past the right edge.
const PETALS = Array.from({ length: 34 }, (_, i) => {
  const y = rand() * 700;
  return {
    x: rand() * (W + 110),
    y,
    size: 0.6 + rand() * 0.5,
    fall: 11 + rand() * 9,
    delay: rand() * 20,
    spin: (5 + rand() * 7) * (rand() > 0.5 ? 1 : -1),
    flutter: 0.8 + rand() * 1.2,
    color: i % 3 === 0 ? 'var(--petal-1)' : 'var(--petal-2)',
  };
});

const BOKEH = Array.from({ length: 6 }, () => ({
  x: rand() * W,
  y: 40 + rand() * 340,
  r: 30 + rand() * 45,
  dur: 8 + rand() * 8,
  delay: rand() * 8,
}));

// Small blossoming trees along the far hill.
const FAR_TREES = Array.from({ length: 9 }, () => {
  const x = rand() * W;
  return { x, y: ridgeY(x, 470, NEAR_HILL), r: 9 + rand() * 7 };
});

// The big tree's canopy: overlapping puffs of blossom in two tones, centred on the crown.
const CANOPY = Array.from({ length: 46 }, () => {
  const a = rand() * Math.PI * 2;
  const d = Math.sqrt(rand());
  return { x: 300 + Math.cos(a) * d * 96, y: 392 + Math.sin(a) * d * 62, r: 14 + rand() * 16, deep: rand() > 0.62 };
}).sort((a, b) => Number(b.deep) - Number(a.deep));

const FALLEN = Array.from({ length: 22 }, () => {
  const x = rand() * W;
  return { x, y: ridgeY(x, BANK, GRASS) + 8 + rand() * 80, rot: rand() * 180 };
});

function Blossom({ x, y, r }: { x: number; y: number; r: number }) {
  return (
    <g transform={`translate(${x.toFixed(1)} ${y.toFixed(1)})`}>
      {[0, 72, 144, 216, 288].map(a => (
        <ellipse key={a} cx="0" cy={-r * 0.55} rx={r * 0.42} ry={r * 0.55} transform={`rotate(${a})`} fill="var(--petal-2)" />
      ))}
      <circle r={r * 0.22} fill="var(--blossom-deep)" />
    </g>
  );
}

/** A duck, facing right, origin on the waterline. `s` scales it (ducklings are small). */
function Duck({ fill, s, bill }: { fill: string; s: number; bill: string }) {
  return (
    <g transform={`scale(${s})`}>
      <path d="M-22 4 Q-26 -4 -20 -8 Q-10 -12 4 -10 Q14 -9 16 -2 Q16 4 10 6 H-14 Q-20 6 -22 4 Z" fill={fill} />
      <path d="M-20 -8 L-28 -12 L-22 -4 Z" fill={fill} />
      <path d="M-10 -6 Q-2 -2 6 -6" fill="none" stroke="#000" strokeOpacity="0.12" strokeWidth="2" strokeLinecap="round" />
      <circle cx="10" cy="-16" r="7" fill={fill} />
      <path d="M8 -12 Q12 -10 14 -10" fill="none" stroke={fill} strokeWidth="6" strokeLinecap="round" />
      <path d="M16 -17 L24 -15 L16 -12.5 Z" fill={bill} />
      <circle cx="12" cy="-18" r="1.3" fill="#3d2f2a" />
    </g>
  );
}

/** A spring riverbank under a cherry tree in full bloom, petals drifting down, ducks crossing. */
export function BlossomScene(props: SceneProps<BlossomTheme>) {
  const sky = useSvgId('sky');
  const glow = useSvgId('glow');
  const water = useSvgId('water');

  const ducks = [
    { x: 0, s: 1, fill: 'var(--duck)', bill: '#f0a24a', delay: 0 },
    { x: -34, s: 0.55, fill: 'var(--duckling)', bill: '#f0a24a', delay: -0.4 },
    { x: -56, s: 0.5, fill: 'var(--duckling)', bill: '#f0a24a', delay: -0.9 },
    { x: -76, s: 0.52, fill: 'var(--duckling)', bill: '#f0a24a', delay: -1.3 },
  ];

  return (
    <SceneFrame
      {...props}
      defaultTheme={blossomTheme}
      defaultDuration={50}
      art={
        <>
          <defs>
            <linearGradient id={sky} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="var(--sky-top)" />
              <stop offset="0.7" stopColor="var(--sky-bottom)" />
            </linearGradient>
            <radialGradient id={glow}>
              <stop offset="0" stopColor="#ffffff" stopOpacity="0.8" />
              <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
            </radialGradient>
            <linearGradient id={water} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="var(--water)" stopOpacity="0.75" />
              <stop offset="1" stopColor="var(--water)" />
            </linearGradient>
          </defs>

          <rect width={W} height="700" fill={`url(#${sky})`} />
          {BOKEH.map((b, i) => (
            <circle
              key={i}
              className={styles.bokeh}
              cx={b.x.toFixed(1)}
              cy={b.y.toFixed(1)}
              r={b.r.toFixed(1)}
              fill={`url(#${glow})`}
              style={{ animationDuration: `${b.dur.toFixed(2)}s`, animationDelay: `${(-b.delay).toFixed(2)}s` }}
            />
          ))}

          <path fill="var(--hill-1)" d={bandPath(430, FAR_HILL)} />
          <path fill="var(--hill-2)" d={bandPath(470, NEAR_HILL)} />
          {FAR_TREES.map((t, i) => (
            <g key={i}>
              <rect x={t.x - 1.2} y={t.y - t.r} width="2.4" height={t.r} fill="var(--trunk)" opacity="0.6" />
              <circle cx={t.x} cy={t.y - t.r * 1.3} r={t.r} fill="var(--blossom)" opacity="0.85" />
            </g>
          ))}

          {/* River, with the bridge's reflection and drifting glints */}
          <rect x="0" y={RIVER} width={W} height={700 - RIVER} fill={`url(#${water})`} />
          <g opacity="0.22" transform={`translate(0 ${RIVER * 2}) scale(1 -1)`}>
            <path d="M18 506 Q120 430 222 506" fill="none" stroke="var(--bridge)" strokeWidth="9" />
          </g>
          <g fill="#ffffff">
            <rect className={base.glint} x="250" y="528" width="40" height="2" rx="1" style={{ animationDuration: '2.2s' }} />
            <rect className={base.glint} x="60" y="548" width="28" height="2" rx="1" style={{ animationDuration: '1.8s', animationDelay: '-0.7s' }} />
            <rect className={base.glint} x="300" y="586" width="34" height="2" rx="1" style={{ animationDuration: '2.6s', animationDelay: '-1.4s' }} />
          </g>

          {/* Arched bridge across the river */}
          <g>
            <path d="M18 506 Q120 430 222 506" fill="none" stroke="var(--bridge)" strokeWidth="9" />
            <path d="M14 488 Q120 412 226 488" fill="none" stroke="var(--bridge)" strokeWidth="3.5" />
            <g stroke="var(--bridge)" strokeWidth="3" strokeLinecap="round">
              {[30, 56, 84, 120, 156, 184, 210].map(x => {
                const t = (x - 18) / 204;
                const yDeck = (1 - t) * (1 - t) * 506 + 2 * (1 - t) * t * 430 + t * t * 506;
                return <path key={x} d={`M${x} ${(yDeck - 4).toFixed(1)} V${(yDeck - 22).toFixed(1)}`} />;
              })}
            </g>
            <path d="M18 506 Q120 444 222 506" fill="none" stroke="#000" strokeOpacity="0.12" strokeWidth="3" />
          </g>

          {/* Ducks: a mother leading three ducklings, each with its own bob and wake */}
          <g className={styles.ducks}>
            {ducks.map((d, i) => (
              <g key={i} transform={`translate(${d.x} 0)`}>
                <path
                  className={styles.wake}
                  style={{ animationDelay: `${d.delay}s` }}
                  d={`M${-24 * d.s} ${4 * d.s} L${-46 * d.s} ${-2 * d.s} M${-24 * d.s} ${6 * d.s} L${-46 * d.s} ${12 * d.s}`}
                  stroke="#ffffff"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                />
                <g className={styles.bob} style={{ animationDelay: `${d.delay}s` }}>
                  <Duck fill={d.fill} s={d.s} bill={d.bill} />
                </g>
              </g>
            ))}
          </g>

          {/* Near bank */}
          <path fill="var(--grass)" d={bandPath(BANK, GRASS)} />
          <g>
            {FALLEN.map((f, i) => (
              <path
                key={i}
                d={PETAL}
                fill="var(--petal-2)"
                transform={`translate(${f.x.toFixed(1)} ${f.y.toFixed(1)}) rotate(${f.rot.toFixed(0)}) scale(0.55)`}
              />
            ))}
          </g>

          {/* The cherry tree: trunk and branches, then a canopy that sways from the trunk */}
          <path
            d="M352 700 C346 640 340 560 320 500 M330 530 C300 500 270 470 244 440 M324 510 C346 470 360 440 372 410 M318 480 C312 450 300 420 296 400"
            fill="none"
            stroke="var(--trunk)"
            strokeWidth="9"
            strokeLinecap="round"
          />
          <g className={styles.canopy}>
            {/* Deeper pink first, so it reads as shade between the paler puffs on top */}
            {CANOPY.map((c, i) => (
              <circle key={i} cx={c.x.toFixed(1)} cy={c.y.toFixed(1)} r={c.r.toFixed(1)} fill={c.deep ? 'var(--blossom-deep)' : 'var(--blossom)'} />
            ))}
            <Blossom x={236} y={412} r={10} />
            <Blossom x={282} y={346} r={9} />
            <Blossom x={350} y={372} r={11} />
            <Blossom x={312} y={438} r={9} />
            <Blossom x={380} y={420} r={10} />
            <Blossom x={252} y={380} r={8} />
          </g>

          {/* Petals on the breeze, drawn last so they drift in front of everything */}
          {PETALS.map((p, i) => (
            <g key={i} transform={`translate(${p.x.toFixed(1)} ${p.y.toFixed(1)})`}>
              <g
                className={styles.fall}
                style={
                  {
                    '--from': `${(-p.y - 20).toFixed(1)}px`,
                    '--to': `${(720 - p.y).toFixed(1)}px`,
                    animationDuration: `${p.fall.toFixed(2)}s`,
                    animationDelay: `${(-p.delay).toFixed(2)}s`,
                  } as CSSProperties
                }
              >
                <g
                  className={styles.spin}
                  style={{ animationDuration: `${Math.abs(p.spin).toFixed(2)}s`, animationDirection: p.spin < 0 ? 'reverse' : 'normal' }}
                >
                  <g className={styles.flutter} style={{ animationDuration: `${p.flutter.toFixed(2)}s` }}>
                    <g transform={`scale(${p.size.toFixed(2)})`}>
                      <path d={PETAL} fill={p.color} />
                      <path d="M0 6 V-3" stroke="#fff" strokeOpacity="0.5" strokeWidth="0.8" strokeLinecap="round" />
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
