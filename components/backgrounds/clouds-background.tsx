// <CloudsBackground>: soft clouds drifting across the sky in three parallax layers,
// under a gently glowing sun. Animated.

import type { CSSProperties } from 'react';
import { BackgroundFrame, r2, seeded, type BackgroundProps } from './background';
import styles from './clouds-background.module.css';

export const cloudsTheme = {
  skyTop: '#9ccbee',
  skyBottom: '#eef6fc',
  cloud: '#ffffff',
  cloudShade: '#e2eef8',
  sun: '#fff4d1',
};
export type CloudsTheme = typeof cloudsTheme;

// Far layers are smaller, fainter and slower; the near layer is larger and quicker.
const LAYERS = [
  { count: 5, width: [80, 110], duration: [110, 140], opacity: 0.55, top: [8, 38] },
  { count: 4, width: [130, 170], duration: [75, 95], opacity: 0.8, top: [20, 60] },
  { count: 3, width: [190, 240], duration: [50, 62], opacity: 0.95, top: [45, 82] },
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
      delay: r2(duration * ((i + 0.2 + rand() * 0.6) / layer.count)),
      opacity: layer.opacity,
      flip: rand() > 0.5,
    };
  }),
);

/** One cloud: a flat-bottomed pill with three rounded puffs, shaded toward the base. */
function Cloud({ width, flip, gradient }: { width: number; flip: boolean; gradient: string }) {
  return (
    <svg
      width={width}
      height={width * 0.42}
      viewBox="0 0 100 42"
      style={{ display: 'block', transform: flip ? 'scaleX(-1)' : undefined }}
    >
      <g fill={`url(#${gradient})`}>
        <rect x="4" y="22" width="92" height="18" rx="9" />
        <circle cx="30" cy="24" r="14" />
        <circle cx="52" cy="17" r="17" />
        <circle cx="74" cy="25" r="12" />
      </g>
    </svg>
  );
}

/** Soft clouds drifting across the sky in three parallax layers. */
export function CloudsBackground(props: BackgroundProps<CloudsTheme>) {
  const gradient = 'qs-clouds-shade';
  return (
    <BackgroundFrame
      {...props}
      defaultTheme={cloudsTheme}
      layer={
        <>
          <div className={styles.sky} />
          <div className={styles.sun} />
          <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
            <defs>
              {/* In each cloud's own 100×42 space, so the whole cloud shades as one shape. */}
              <linearGradient id={gradient} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="42">
                <stop offset="0.5" stopColor="var(--cloud)" />
                <stop offset="1" stopColor="var(--cloud-shade)" />
              </linearGradient>
            </defs>
          </svg>
          {CLOUDS.map((c, i) => (
            <div
              key={i}
              className={styles.drift}
              style={{ top: `${c.top}%`, opacity: c.opacity, animationDuration: `${c.duration}s`, animationDelay: `${-c.delay}s` } as CSSProperties}
            >
              <Cloud width={c.width} flip={c.flip} gradient={gradient} />
            </div>
          ))}
        </>
      }
    />
  );
}
