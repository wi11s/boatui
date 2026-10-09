// <NightSkyBackground>: a deep night sky with stars twinkling at three sizes, a faint band of the
// Milky Way, and a shooting star every few seconds. Animated.

import type { CSSProperties } from 'react';
import { BackgroundFrame, r2, seeded, type BackgroundProps } from './background';
import styles from './night-sky-background.module.css';

export const nightSkyTheme = {
  skyTop: '#070b1f',
  skyBottom: '#1d2550',
  milkyWay: '#8f9fe0',
  star: '#ffffff',
  warmStar: '#ffe2b0',
};
export type NightSkyTheme = typeof nightSkyTheme;

const rand = seeded(83);
const STARS = Array.from({ length: 110 }, () => {
  const big = rand() > 0.9;
  return {
    x: r2(rand() * 100),
    y: r2(rand() * 100),
    size: big ? r2(2.5 + rand() * 1.5) : r2(0.8 + rand() * 1.4),
    warm: rand() > 0.8,
    twinkle: r2(2 + rand() * 4),
    delay: r2(rand() * 6),
    big,
  };
});

// Shooting stars: where each starts, and when in its long, mostly empty cycle it flashes.
const METEORS = [
  { x: 72, y: 12, cycle: 9, delay: 2 },
  { x: 40, y: 6, cycle: 13, delay: 8 },
  { x: 90, y: 30, cycle: 17, delay: 12 },
];

/** A deep night sky with twinkling stars, the Milky Way and shooting stars. */
export function NightSkyBackground(props: BackgroundProps<NightSkyTheme>) {
  return (
    <BackgroundFrame
      {...props}
      defaultTheme={nightSkyTheme}
      layer={
        <>
          <div className={styles.sky} />
          <div className={styles.milkyWay} />
          {STARS.map((s, i) => (
            <span
              key={i}
              className={`${styles.star} ${s.big ? styles.big : ''}`}
              style={{
                left: `${s.x}%`,
                top: `${s.y}%`,
                width: s.size,
                height: s.size,
                background: s.warm ? 'var(--warm-star)' : 'var(--star)',
                animationDuration: `${s.twinkle}s`,
                animationDelay: `${-s.delay}s`,
              }}
            />
          ))}
          {METEORS.map((m, i) => (
            <span
              key={i}
              className={styles.meteor}
              style={{ left: `${m.x}%`, top: `${m.y}%`, animationDuration: `${m.cycle}s`, animationDelay: `${-m.delay}s` } as CSSProperties}
            />
          ))}
        </>
      }
    />
  );
}
