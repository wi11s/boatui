// <PetalsBackground>: cherry-blossom petals drifting on a breeze, with a swaying branch
// in the corner and soft bokeh. Animated.

import type { CSSProperties } from 'react';
import { BackgroundFrame, backgroundStyles as base, r2, seeded, type BackgroundProps } from './background';
import styles from './petals-background.module.css';

export const petalsTheme = {
  baseTop: '#fff7f3',
  baseBottom: '#fde3ea',
  petal1: '#f6a9be',
  petal2: '#fbcfdc',
  glow: '#ffffff',
  branch: '#8a5a52',
  blossom: '#f8bed0',
};
export type PetalsTheme = typeof petalsTheme;

// Heart-shaped petal with a notch at the tip.
const PETAL = 'M0 8 C-6 4 -7 -3 -3 -7 C-1.5 -8.5 -0.5 -7.5 0 -6 C0.5 -7.5 1.5 -8.5 3 -7 C7 -3 6 4 0 8 Z';

const rand = seeded(57);
const PETALS = Array.from({ length: 36 }, (_, i) => ({
  // Start up to 25% past the right edge so the breeze carries petals across all of it.
  x: r2(rand() * 125),
  y: r2(rand() * 100),
  size: r2(10 + rand() * 9),
  fall: r2(11 + rand() * 9),
  delay: r2(rand() * 20),
  spin: r2(5 + rand() * 7) * (rand() > 0.5 ? 1 : -1),
  flutter: r2(0.8 + rand() * 1.2),
  color: i % 3 === 0 ? 'var(--petal-1)' : 'var(--petal-2)',
}));

const BOKEH = Array.from({ length: 7 }, () => ({
  x: r2(rand() * 90),
  y: r2(rand() * 85),
  size: r2(60 + rand() * 90),
  dur: r2(8 + rand() * 8),
  delay: r2(rand() * 8),
}));

function Blossom({ x, y, r }: { x: number; y: number; r: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      {[0, 72, 144, 216, 288].map(a => (
        <ellipse key={a} cx="0" cy={-r * 0.55} rx={r * 0.42} ry={r * 0.55} transform={`rotate(${a})`} fill="var(--blossom)" />
      ))}
      <circle r={r * 0.22} fill="#f28aa8" />
    </g>
  );
}

/** Cherry-blossom petals drifting on a breeze. */
export function PetalsBackground(props: BackgroundProps<PetalsTheme>) {
  return (
    <BackgroundFrame
      {...props}
      defaultTheme={petalsTheme}
      layer={
        <>
          <div className={styles.base} />
          {BOKEH.map((b, i) => (
            <div
              key={i}
              className={styles.bokeh}
              style={{ left: `${b.x}%`, top: `${b.y}%`, width: b.size, height: b.size, animationDuration: `${b.dur}s`, animationDelay: `${-b.delay}s` }}
            />
          ))}
          {PETALS.map((p, i) => (
            <div
              key={i}
              className={`${base.particle} ${styles.fall}`}
              style={{ left: `${p.x}%`, '--y': `${p.y}%`, animationDuration: `${p.fall}s`, animationDelay: `${-p.delay}s` } as CSSProperties}
            >
              <span
                className={styles.spin}
                style={{ animationDuration: `${Math.abs(p.spin)}s`, animationDirection: p.spin < 0 ? 'reverse' : 'normal' }}
              >
                <span className={styles.flutter} style={{ animationDuration: `${p.flutter}s` }}>
                  <svg width={p.size} height={p.size} viewBox="-8 -9 16 18" style={{ display: 'block' }}>
                    <path d={PETAL} fill={p.color} />
                    <path d="M0 6 V-3" stroke="#fff" strokeOpacity="0.5" strokeWidth="0.8" strokeLinecap="round" />
                  </svg>
                </span>
              </span>
            </div>
          ))}
          <svg className={styles.branch} viewBox="0 0 230 150">
            <path
              d="M232 4 C190 14 160 30 128 58 C104 80 80 92 40 100 M150 40 C150 62 162 78 176 92 M100 76 C92 96 96 116 108 132"
              fill="none"
              stroke="var(--branch)"
              strokeWidth="5"
              strokeLinecap="round"
            />
            <Blossom x={42} y={100} r={11} />
            <Blossom x={76} y={88} r={9} />
            <Blossom x={128} y={58} r={10} />
            <Blossom x={176} y={92} r={12} />
            <Blossom x={108} y={132} r={9} />
            <Blossom x={190} y={22} r={10} />
            <circle cx="60" cy="96" r="4" fill="var(--blossom)" />
            <circle cx="158" cy="72" r="3.5" fill="var(--blossom)" />
          </svg>
        </>
      }
    />
  );
}
