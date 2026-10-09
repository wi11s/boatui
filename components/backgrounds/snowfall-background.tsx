// <SnowfallBackground>: snow falling at three depths onto soft drifts. Animated.
// Far flakes are small and slow, near flakes are six-armed and spin as they sway.

import type { CSSProperties } from 'react';
import { BackgroundFrame, backgroundStyles as base, r2, seeded, type BackgroundProps } from './background';
import styles from './snowfall-background.module.css';

export const snowfallTheme = {
  skyTop: '#bcd3ee',
  skyBottom: '#eef4fb',
  flake: '#ffffff',
  drift: '#ffffff',
  driftShadow: '#d9e6f4',
};
export type SnowfallTheme = typeof snowfallTheme;

const LAYERS = [
  { count: 40, size: [2, 3.5], fall: [18, 26], sway: [6, 14], opacity: 0.6 },
  { count: 24, size: [4, 6], fall: [12, 17], sway: [12, 24], opacity: 0.85 },
  { count: 12, size: [12, 18], fall: [8, 12], sway: [18, 34], opacity: 1 },
];

const rand = seeded(41);
const between = ([a, b]: number[]) => a + rand() * (b - a);
const FLAKES = LAYERS.flatMap((layer, depth) =>
  Array.from({ length: layer.count }, () => ({
    depth,
    x: r2(rand() * 100),
    y: r2(rand() * 100),
    size: r2(between(layer.size)),
    fall: r2(between(layer.fall)),
    delay: r2(rand() * 30),
    sway: r2(between(layer.sway)),
    swayTime: r2(2 + rand() * 3),
    spin: r2(6 + rand() * 8),
    opacity: layer.opacity,
  })),
);

// Six arms, each with a small V near the tip.
const ARM = 'M0 0 V-9 M0 -6 L-2.5 -8.5 M0 -6 L2.5 -8.5';
function Flake({ size }: { size: number }) {
  return (
    <svg className={styles.flake} width={size} height={size} viewBox="-10 -10 20 20" fill="none" strokeWidth="1.6" strokeLinecap="round">
      {[0, 60, 120, 180, 240, 300].map(a => <path key={a} d={ARM} transform={`rotate(${a})`} />)}
    </svg>
  );
}

/** Snow falling at three depths onto soft drifts. */
export function SnowfallBackground(props: BackgroundProps<SnowfallTheme>) {
  return (
    <BackgroundFrame
      {...props}
      defaultTheme={snowfallTheme}
      layer={
        <>
          <div className={styles.sky} />
          {FLAKES.map((f, i) => (
            <div
              key={i}
              className={`${base.particle} ${styles.fall}`}
              style={{ left: `${f.x}%`, '--y': `${f.y}%`, animationDuration: `${f.fall}s`, animationDelay: `${-f.delay}s`, opacity: f.opacity } as CSSProperties}
            >
              <div className={styles.sway} style={{ '--sway': `${f.sway}px`, animationDuration: `${f.swayTime}s` } as CSSProperties}>
                {f.depth === 2 ? (
                  <span className={styles.spin} style={{ animationDuration: `${f.spin}s` }}>
                    <Flake size={f.size} />
                  </span>
                ) : (
                  <span className={styles.dot} style={{ width: f.size, height: f.size }} />
                )}
              </div>
            </div>
          ))}
          <svg className={styles.drifts} viewBox="0 0 400 72" preserveAspectRatio="none">
            <path fill="var(--drift-shadow)" d="M0 40 C60 18 110 30 160 34 S260 14 320 28 S380 30 400 24 V72 H0 Z" />
            <path fill="var(--drift)" d="M0 52 C50 36 100 46 150 48 S240 32 300 42 S370 46 400 40 V72 H0 Z" />
          </svg>
        </>
      }
    />
  );
}
