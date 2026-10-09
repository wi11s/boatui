// <FirefliesBackground>: fireflies drifting and pulsing over dusky hills, with a crescent
// moon and faint stars. Animated.

import type { CSSProperties } from 'react';
import { BackgroundFrame, r2, seeded, type BackgroundProps } from './background';
import styles from './fireflies-background.module.css';

export const firefliesTheme = {
  skyTop: '#101b33',
  skyBottom: '#2e2a4f',
  firefly: '#fdf9c8',
  glow: '#d6f36a',
  hillFar: '#1c2440',
  hillNear: '#121a2e',
  moon: '#f3ecd2',
};
export type FirefliesTheme = typeof firefliesTheme;

const rand = seeded(73);
const offset = (range: number) => `${r2((rand() - 0.5) * range)}px`;

const FIREFLIES = Array.from({ length: 22 }, () => ({
  x: r2(4 + rand() * 92),
  y: r2(35 + rand() * 55),
  wander: r2(12 + rand() * 10),
  pulse: r2(3 + rand() * 3),
  delay: r2(rand() * 12),
  path: { '--ax': offset(70), '--ay': offset(40), '--bx': offset(70), '--by': offset(40), '--cx': offset(70), '--cy': offset(40) },
}));

const STARS = Array.from({ length: 26 }, () => ({
  x: r2(rand() * 100),
  y: r2(rand() * 45),
  dur: r2(2 + rand() * 3),
  delay: r2(rand() * 4),
}));

/** Fireflies drifting and pulsing over dusky hills. */
export function FirefliesBackground(props: BackgroundProps<FirefliesTheme>) {
  return (
    <BackgroundFrame
      {...props}
      defaultTheme={firefliesTheme}
      layer={
        <>
          <div className={styles.sky} />
          {STARS.map((s, i) => (
            <span
              key={`star-${i}`}
              className={styles.star}
              style={{ left: `${s.x}%`, top: `${s.y}%`, animationDuration: `${s.dur}s`, animationDelay: `${-s.delay}s` }}
            />
          ))}
          <svg className={styles.moon} viewBox="0 0 48 48">
            <defs>
              <mask id="qs-fireflies-moon">
                <rect width="48" height="48" fill="#fff" />
                <circle cx="32" cy="18" r="18" fill="#000" />
              </mask>
            </defs>
            <circle cx="24" cy="24" r="19" fill="var(--moon)" mask="url(#qs-fireflies-moon)" />
          </svg>

          {/* Two soft hill silhouettes; smooth curves stretch cleanly to any width. */}
          <svg className={styles.hills} viewBox="0 0 400 100" preserveAspectRatio="none">
            <path fill="var(--hill-far)" d="M0 46 C70 20 130 22 190 40 S320 18 400 34 V100 H0 Z" />
            <path fill="var(--hill-near)" d="M0 70 C80 50 150 58 220 66 S340 52 400 62 V100 H0 Z" />
          </svg>

          {FIREFLIES.map((f, i) => (
            <div
              key={i}
              className={styles.firefly}
              style={{ left: `${f.x}%`, top: `${f.y}%`, animationDuration: `${f.wander}s`, animationDelay: `${-f.delay}s`, ...f.path } as CSSProperties}
            >
              <span className={styles.light} style={{ animationDuration: `${f.pulse}s`, animationDelay: `${-f.delay}s` }} />
            </div>
          ))}
        </>
      }
    />
  );
}
