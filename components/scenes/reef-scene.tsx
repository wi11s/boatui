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

const CORAL = [
  { x: 122, colors: ['#e8846f', '#f2a65a', '#d96a8b'] },
  { x: 268, colors: ['#d96a8b', '#e8846f', '#f2c14e'] },
].map(c => ({ ...c, y: ridgeY(c.x, SAND_BACK.y, SAND_BACK.components) }));

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
          {CORAL.map((c, i) => (
            <g key={i} transform={`translate(${c.x} ${c.y.toFixed(1)})`}>
              <circle cx="-8" cy="-4" r="9" fill={c.colors[0]} />
              <circle cx="6" cy="-9" r="11" fill={c.colors[1]} />
              <circle cx="16" cy="-2" r="7" fill={c.colors[0]} />
              <circle cx="2" cy="2" r="8" fill={c.colors[2]} />
            </g>
          ))}
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
