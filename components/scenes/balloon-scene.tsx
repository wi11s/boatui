import { W, bandPath, ridgeY, seeded, type Ridge } from './geometry';
import { SceneFrame, sceneStyles as base, useSvgId, type SceneProps } from './scene';
import styles from './balloon-scene.module.css';

export const balloonTheme = {
  skyTop: '#a9b8d9',
  skyMid: '#f6c6b0',
  skyBottom: '#fde3c0',
  sun: '#fff1d4',
  hill1: '#c9a1b1',
  hill2: '#a383a0',
  hill3: '#6e7f7a',
  hill4: '#4d6656',
  envelope: '#e4573d',
  stripe: '#f3c64f',
};
export type BalloonTheme = typeof balloonTheme;

const HILLS: { y: number; components: Ridge; fill: string }[] = [
  { y: 450, components: [[14, 400], [6, 200, 1]],    fill: 'var(--hill-1)' },
  { y: 505, components: [[20, 400, 2], [8, 200]],    fill: 'var(--hill-2)' },
  { y: 575, components: [[24, 400, 4], [9, 200, 1]], fill: 'var(--hill-3)' },
  { y: 645, components: [[20, 400, 1], [10, 100]],   fill: 'var(--hill-4)' },
];
const HILL_PATHS = HILLS.map(h => bandPath(h.y, h.components));

// Trees scattered along the crest of the third hill.
const rand = seeded(11);
const TREES = Array.from({ length: 11 }, () => {
  const x = rand() * W;
  return { x, y: ridgeY(x, HILLS[2].y, HILLS[2].components) + 6, s: 0.7 + rand() * 0.6 };
});

function Balloon({ envelope, stripe }: { envelope: string; stripe: string }) {
  return (
    <>
      <path d="M0 -58 C40 -58 50 -22 38 8 C32 22 18 32 12 40 L-12 40 C-18 32 -32 22 -38 8 C-50 -22 -40 -58 0 -58 Z" fill={envelope} />
      <path d="M0 -58 C20 -58 26 -22 19 8 C16 22 9 32 6 40 L-6 40 C-9 32 -16 22 -19 8 C-26 -22 -20 -58 0 -58 Z" fill={stripe} />
      <path d="M0 -58 C7 -58 9 -22 7 8 C6 22 3 32 2 40 L-2 40 C-3 32 -6 22 -7 8 C-9 -22 -7 -58 0 -58 Z" fill={envelope} />
      <ellipse cx="-17" cy="-30" rx="8" ry="16" fill="#fff" opacity="0.18" />
      <path d="M-11 40 L-8 54 M11 40 L8 54" stroke="#5a3e2b" strokeWidth="1.2" />
      <rect x="-9" y="54" width="18" height="13" rx="2" fill="#8a5a36" />
      <rect x="-9" y="54" width="18" height="3" rx="1" fill="#6e4528" />
    </>
  );
}

const BIRDS = [
  { x: 0,  y: 0,  delay: 0,     d: 'M-6 0 Q-3 -3 0 0 Q3 -3 6 0' },
  { x: 16, y: 8,  delay: -0.2,  d: 'M-5 0 Q-2.5 -2.5 0 0 Q2.5 -2.5 5 0' },
  { x: 30, y: -4, delay: -0.35, d: 'M-5 0 Q-2.5 -2.5 0 0 Q2.5 -2.5 5 0' },
];

/** A hot-air balloon drifting up and across rolling hills at first light. */
export function BalloonScene(props: SceneProps<BalloonTheme>) {
  const sky = useSvgId('sky');
  const glow = useSvgId('glow');

  return (
    <SceneFrame
      {...props}
      defaultTheme={balloonTheme}
      defaultDuration={45}
      art={
        <>
          <defs>
            <linearGradient id={sky} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="var(--sky-top)" />
              <stop offset="0.45" stopColor="var(--sky-mid)" />
              <stop offset="0.7" stopColor="var(--sky-bottom)" />
            </linearGradient>
            <radialGradient id={glow}>
              <stop offset="0" stopColor="var(--sun)" stopOpacity="0.95" />
              <stop offset="1" stopColor="var(--sun)" stopOpacity="0" />
            </radialGradient>
          </defs>

          <rect width={W} height="700" fill={`url(#${sky})`} />
          <circle cx="112" cy="440" r="140" fill={`url(#${glow})`} />
          <circle cx="112" cy="440" r="44" fill="var(--sun)" />

          <g fill="#fff" opacity="0.7">
            <g className={base.across} style={{ animationDuration: '140s', animationDelay: '-30s' }}>
              <ellipse cx="0" cy="120" rx="50" ry="13" />
              <ellipse cx="24" cy="110" rx="28" ry="13" />
            </g>
            <g className={base.across} style={{ animationDuration: '190s', animationDelay: '-140s' }}>
              <ellipse cx="0" cy="250" rx="40" ry="10" />
              <ellipse cx="-16" cy="243" rx="22" ry="9" />
            </g>
          </g>

          {/* A second balloon far off, just bobbing */}
          <g transform="translate(305 300) scale(0.32)">
            <g className={styles.float}>
              <Balloon envelope="#5b7fb8" stripe="#f4efe2" />
            </g>
          </g>

          <g className={styles.flock} stroke="#5b4a5e" strokeWidth="1.5" fill="none" strokeLinecap="round">
            {BIRDS.map((b, i) => (
              <g key={i} transform={`translate(${b.x} ${b.y})`}>
                <path className={styles.flap} style={{ animationDelay: `${b.delay}s` }} d={b.d} />
              </g>
            ))}
          </g>

          <path fill={HILLS[0].fill} d={HILL_PATHS[0]} />
          <path fill={HILLS[1].fill} d={HILL_PATHS[1]} />

          <g className={base.across} style={{ animationDuration: '70s', animationDelay: '-20s' }}>
            <ellipse cx="0" cy="535" rx="130" ry="9" fill="#fff" opacity="0.35" />
          </g>

          <path fill={HILLS[2].fill} d={HILL_PATHS[2]} />
          <g fill="#50655b">
            {TREES.map((t, i) => (
              <g key={i} transform={`translate(${t.x.toFixed(1)} ${t.y.toFixed(1)}) scale(${t.s.toFixed(2)})`}>
                <rect x="-1.5" y="-10" width="3" height="10" />
                <ellipse cy="-17" rx="7" ry="10" />
              </g>
            ))}
          </g>

          <g className={base.across} style={{ animationDuration: '95s', animationDelay: '-60s' }}>
            <ellipse cx="0" cy="612" rx="150" ry="10" fill="#fff" opacity="0.3" />
          </g>

          <path fill={HILLS[3].fill} d={HILL_PATHS[3]} />

          {/* Main balloon: origin at the middle of the envelope */}
          <g className={styles.balloon}>
            <g className={styles.sway}>
              <Balloon envelope="var(--envelope)" stripe="var(--stripe)" />
              <ellipse className={styles.flame} cx="0" cy="46" rx="3" ry="5" fill="#ffb347" />
            </g>
          </g>
        </>
      }
    />
  );
}
