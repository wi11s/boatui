// <CloudsBackground>: puffy clouds drifting across the sky in three parallax layers,
// with a sun whose rays slowly turn and small flocks of birds. Animated.

import type { CSSProperties } from 'react';
import { BackgroundFrame, r2, seeded, type BackgroundProps } from './background';
import styles from './clouds-background.module.css';

export const cloudsTheme = {
  skyTop: '#8ec5f0',
  skyBottom: '#e9f5fd',
  cloud: '#ffffff',
  cloudShade: '#d6e8f6',
  sun: '#ffe39a',
  birds: '#56677a',
};
export type CloudsTheme = typeof cloudsTheme;

// Far layers are smaller, paler and slower; the near layer is large and quicker.
const LAYERS = [
  { count: 6, width: [70, 110], duration: [90, 120], opacity: 0.6, top: [6, 40] },
  { count: 5, width: [120, 170], duration: [60, 80], opacity: 0.85, top: [15, 60] },
  { count: 3, width: [200, 260], duration: [40, 52], opacity: 1, top: [35, 80] },
];

const rand = seeded(88);
const between = ([a, b]: number[]) => a + rand() * (b - a);
const CLOUDS = LAYERS.flatMap(layer =>
  Array.from({ length: layer.count }, (_, i) => {
    const duration = r2(between(layer.duration));
    return {
      width: r2(between(layer.width)),
      top: r2(between(layer.top)),
      duration,
      // Spread evenly along the loop so the sky is never empty.
      delay: r2(duration * ((i + rand() * 0.6) / layer.count)),
      bob: r2(4 + rand() * 4),
      opacity: layer.opacity,
      shape: Math.floor(rand() * 3),
    };
  }),
);

const FLOCKS = [
  { top: 22, duration: 38, delay: 6, birds: [[0, 0], [16, 7], [30, -3]] },
  { top: 48, duration: 46, delay: 30, birds: [[0, 0], [14, 6]] },
];

// Three puffy silhouettes with flat bottoms, drawn in a 100×50 box.
const SHAPES = [
  'M10 44 C2 44 2 30 12 30 C12 18 30 14 36 24 C42 8 66 8 70 24 C80 18 94 26 90 36 C98 38 96 44 90 44 Z',
  'M8 44 C0 44 2 32 12 32 C14 22 26 20 32 26 C38 14 54 12 60 24 C66 16 82 18 84 30 C96 30 98 44 88 44 Z',
  'M12 44 C2 44 4 32 14 32 C16 16 38 12 46 24 C54 14 72 18 74 30 C86 28 92 38 86 44 Z',
];

function Cloud({ shape, width }: { shape: number; width: number }) {
  return (
    <svg width={width} height={width / 2} viewBox="0 0 100 50" style={{ display: 'block' }}>
      <path d={SHAPES[shape]} fill="var(--cloud-shade)" transform="translate(0 3)" />
      <path d={SHAPES[shape]} fill="var(--cloud)" />
    </svg>
  );
}

/** Puffy clouds drifting across the sky in three parallax layers. */
export function CloudsBackground(props: BackgroundProps<CloudsTheme>) {
  return (
    <BackgroundFrame
      {...props}
      defaultTheme={cloudsTheme}
      layer={
        <>
          <div className={styles.sky} />

          <svg className={styles.sun} viewBox="0 0 120 120">
            <g className={styles.rays} stroke="var(--sun)" strokeWidth="4" strokeLinecap="round" opacity="0.7">
              {Array.from({ length: 12 }, (_, i) => (
                <line key={i} x1="60" y1="14" x2="60" y2="26" transform={`rotate(${i * 30} 60 60)`} />
              ))}
            </g>
            <circle cx="60" cy="60" r="26" fill="var(--sun)" />
          </svg>

          {FLOCKS.map((f, i) => (
            <div
              key={`flock-${i}`}
              className={styles.drift}
              style={{ top: `${f.top}%`, animationDuration: `${f.duration}s`, animationDelay: `${-f.delay}s` }}
            >
              <svg width="50" height="24" viewBox="-6 -10 50 24" fill="none" stroke="var(--birds)" strokeWidth="1.6" strokeLinecap="round">
                {f.birds.map(([x, y], j) => (
                  <path
                    key={j}
                    className={styles.flap}
                    style={{ animationDelay: `${-j * 0.15}s` }}
                    d={`M${x - 6} ${y} Q${x - 3} ${y - 4} ${x} ${y} Q${x + 3} ${y - 4} ${x + 6} ${y}`}
                  />
                ))}
              </svg>
            </div>
          ))}

          {CLOUDS.map((c, i) => (
            <div
              key={i}
              className={styles.drift}
              style={{ top: `${c.top}%`, opacity: c.opacity, animationDuration: `${c.duration}s`, animationDelay: `${-c.delay}s` } as CSSProperties}
            >
              <span className={styles.bob} style={{ animationDuration: `${c.bob}s` }}>
                <Cloud shape={c.shape} width={c.width} />
              </span>
            </div>
          ))}
        </>
      }
    />
  );
}
