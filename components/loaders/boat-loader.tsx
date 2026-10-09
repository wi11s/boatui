// <BoatLoader>: a sailboat riding the swell in a round porthole. The boat's rise, fall and tilt
// follow the height and slope of the wave under it, so it climbs each crest bow-first and
// noses into the trough with a splash. A pennant flutters and a wake trails off the stern.

import { useId } from 'react';
import { LoaderFrame, type LoaderProps } from './loader';
import styles from './boat-loader.module.css';

export const boatLoaderTheme = {
  sky: '#cfe6f3',
  ring: '#9cc9e3',
  water: '#3a7fa3',
  waterBack: '#7fb6d4',
  foam: '#ffffff',
  hull: '#e4573d',
  sail: '#fbf8f1',
  mast: '#5a3e2b',
};
export type BoatLoaderTheme = typeof boatLoaderTheme;

/**
 * A filled sea whose surface is y = base - amp·sin(2πx / 50), drawn 200 units wide so it can
 * scroll left by one 50-unit wavelength per loop without a seam. The boat keyframes in the CSS
 * are sampled from the same function at x = 50.
 */
const sea = (base: number, amp: number) => {
  let d = `M-50 100`;
  for (let x = -50; x <= 150; x += 2.5) d += ` L${x} ${(base - amp * Math.sin((2 * Math.PI * x) / 50)).toFixed(2)}`;
  return `${d} L150 100 Z`;
};

/** A sailboat riding the swell in a round porthole. */
export function BoatLoader(props: LoaderProps<BoatLoaderTheme>) {
  const clip = `qs${useId().replace(/[^a-zA-Z0-9_-]/g, '')}porthole`;
  return (
    <LoaderFrame
      {...props}
      defaultTheme={boatLoaderTheme}
      art={
        <>
          <defs>
            <clipPath id={clip}>
              <circle cx="50" cy="50" r="42" />
            </clipPath>
          </defs>
          <g clipPath={`url(#${clip})`}>
            <rect width="100" height="100" fill="var(--sky)" />
            <g className={styles.cloud} fill="var(--foam)">
              <ellipse cx="0" cy="26" rx="9" ry="3.5" />
              <ellipse cx="4" cy="23" rx="5" ry="3.5" />
            </g>
            <path className={styles.back} d={sea(57, 2)} fill="var(--water-back)" />

            {/* Boat: origin on the waterline at mid-hull (the hull sits 4 units deep), bow to the right */}
            <g className={styles.boat}>
              <path className={styles.pennant} d="M1 -40 L10 -38 L1 -36 Z" fill="var(--hull)" />
              <rect x="-0.5" y="-40" width="2.4" height="33" rx="1.2" fill="var(--mast)" />
              <path d="M-1.5 -36 Q-11 -22 -18 -10 H-1.5 Z" fill="var(--sail)" />
              <path d="M3.5 -33 Q10 -20 16 -10 H3.5 Z" fill="var(--sail)" opacity="0.85" />
              <path d="M-21 -8 H23 Q19 2 10 4 H-14 Q-19 1 -21 -8 Z" fill="var(--hull)" />
              <rect x="-20.5" y="-8" width="43.5" height="2.5" rx="1" fill="var(--sail)" opacity="0.9" />
            </g>

            <g fill="var(--foam)">
              {[0, 1, 2].map(i => (
                <rect key={i} className={styles.wake} style={{ animationDelay: `${-i * 0.4}s` }} x="26" y="61" width="7" height="2" rx="1" />
              ))}
              <circle className={styles.spray} cx="72" cy="62" r="1.8" />
              <circle className={`${styles.spray} ${styles.spray2}`} cx="70" cy="63" r="1.3" />
            </g>
            <path className={styles.front} d={sea(64, 3.2)} fill="var(--water)" />
          </g>
          <circle cx="50" cy="50" r="44" fill="none" stroke="var(--ring)" strokeWidth="4" />
        </>
      }
    />
  );
}
