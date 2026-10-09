// <RainBackground>: soft rain falling on a slant at two depths, with ripples spreading in the
// puddles along the bottom. Animated.

import type { CSSProperties } from 'react';
import { BackgroundFrame, backgroundStyles as base, r2, seeded, type BackgroundProps } from './background';
import styles from './rain-background.module.css';

export const rainTheme = {
  skyTop: '#9fb3c4',
  skyBottom: '#dbe4ec',
  drop: '#ffffff',
  ground: '#b7c6d3',
  ripple: '#ffffff',
};
export type RainTheme = typeof rainTheme;

const LAYERS = [
  { count: 46, length: [10, 16], fall: [1.2, 1.6], width: 1, opacity: 0.45 },
  { count: 26, length: [20, 30], fall: [0.7, 0.95], width: 1.6, opacity: 0.75 },
];

const rand = seeded(61);
const between = ([a, b]: number[]) => a + rand() * (b - a);
const DROPS = LAYERS.flatMap(layer =>
  Array.from({ length: layer.count }, () => ({
    // Start further right than the box: the slant carries drops left as they fall.
    x: r2(rand() * 125),
    y: r2(rand() * 100),
    length: r2(between(layer.length)),
    fall: r2(between(layer.fall)),
    delay: r2(rand() * 3),
    width: layer.width,
    opacity: layer.opacity,
  })),
);

const RIPPLES = Array.from({ length: 14 }, () => ({
  x: r2(3 + rand() * 94),
  y: r2(6 + rand() * 30),
  size: r2(14 + rand() * 18),
  time: r2(1.6 + rand() * 1.4),
  delay: r2(rand() * 3),
}));

/** Soft rain falling on a slant, with ripples in the puddles below. */
export function RainBackground(props: BackgroundProps<RainTheme>) {
  return (
    <BackgroundFrame
      {...props}
      defaultTheme={rainTheme}
      layer={
        <>
          <div className={styles.sky} />
          {DROPS.map((d, i) => (
            <div
              key={i}
              className={`${base.particle} ${styles.fall}`}
              style={{ left: `${d.x}%`, '--y': `${d.y}%`, animationDuration: `${d.fall}s`, animationDelay: `${-d.delay}s` } as CSSProperties}
            >
              <span className={styles.streak} style={{ height: d.length, width: d.width, opacity: d.opacity }} />
            </div>
          ))}
          <div className={styles.ground}>
            {RIPPLES.map((r, i) => (
              <span
                key={i}
                className={styles.ripple}
                style={{ left: `${r.x}%`, bottom: `${r.y}%`, width: r.size, height: r.size * 0.32, animationDuration: `${r.time}s`, animationDelay: `${-r.delay}s` }}
              />
            ))}
          </div>
        </>
      }
    />
  );
}
