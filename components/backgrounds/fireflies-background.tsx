// <FirefliesBackground>: fireflies wandering and blinking over a dusky meadow,
// with a crescent moon and swaying grass. Animated.

import type { CSSProperties } from 'react';
import { BackgroundFrame, r2, seeded, type BackgroundProps } from './background';
import styles from './fireflies-background.module.css';

export const firefliesTheme = {
  skyTop: '#0e1a30',
  skyBottom: '#33284d',
  firefly: '#fbf8c4',
  glow: '#d6f36a',
  grass: '#0a1120',
  moon: '#f3ecd2',
};
export type FirefliesTheme = typeof firefliesTheme;

const rand = seeded(73);
const offset = (range: number) => `${r2((rand() - 0.5) * range)}px`;

const FIREFLIES = Array.from({ length: 30 }, () => ({
  x: r2(3 + rand() * 94),
  y: r2(18 + rand() * 72),
  wander: r2(10 + rand() * 10),
  blink: r2(2.8 + rand() * 3.5),
  delay: r2(rand() * 10),
  path: { '--ax': offset(80), '--ay': offset(50), '--bx': offset(80), '--by': offset(50), '--cx': offset(80), '--cy': offset(50) },
  scale: r2(0.7 + rand() * 0.7),
}));

// Blades are placed at percentage positions so the meadow spans any width without stretching.
const BLADES = Array.from({ length: 70 }, () => ({
  x: r2(rand() * 101),
  h: r2(28 + rand() * 52),
  lean: r2((rand() - 0.5) * 16),
  w: r2(2.5 + rand() * 2.5),
  sway: r2(2.5 + rand() * 2.5),
  delay: r2(rand() * 4),
}));

/** Fireflies wandering and blinking over a dusky meadow. */
export function FirefliesBackground(props: BackgroundProps<FirefliesTheme>) {
  return (
    <BackgroundFrame
      {...props}
      defaultTheme={firefliesTheme}
      layer={
        <>
          <div className={styles.sky} />
          <svg className={styles.moon} viewBox="0 0 54 54">
            <defs>
              <mask id="qs-fireflies-moon">
                <rect width="54" height="54" fill="#fff" />
                <circle cx="36" cy="20" r="21" fill="#000" />
              </mask>
            </defs>
            <circle cx="27" cy="27" r="22" fill="var(--moon)" mask="url(#qs-fireflies-moon)" />
          </svg>

          {FIREFLIES.map((f, i) => (
            <div
              key={i}
              className={styles.firefly}
              style={{ left: `${f.x}%`, top: `${f.y}%`, animationDuration: `${f.wander}s`, animationDelay: `${-f.delay}s`, scale: f.scale, ...f.path } as CSSProperties}
            >
              <span className={styles.light} style={{ animationDuration: `${f.blink}s`, animationDelay: `${-f.delay}s` }} />
            </div>
          ))}

          <svg className={styles.grass}>
            {BLADES.map((b, i) => (
              <svg key={i} x={`${b.x}%`} y="100%" overflow="visible">
                <path
                  className={styles.blade}
                  style={{ animationDuration: `${b.sway}s`, animationDelay: `${-b.delay}s` }}
                  d={`M${-b.w} 0 Q${r2(b.lean * 0.4)} ${r2(-b.h * 0.6)} ${b.lean} ${-b.h} Q${r2(b.lean * 0.4 + 1)} ${r2(-b.h * 0.5)} ${b.w} 0 Z`}
                  fill="var(--grass)"
                />
              </svg>
            ))}
          </svg>
        </>
      }
    />
  );
}
