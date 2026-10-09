// <BoatLoader>: a little boat rocking over endlessly scrolling waves.

import { LoaderFrame, type LoaderProps } from './loader';
import styles from './boat-loader.module.css';

export const boatLoaderTheme = {
  water: '#3a7fa3',
  waterBack: '#9cc9e3',
  hull: '#e4573d',
  sail: '#f2c14e',
};
export type BoatLoaderTheme = typeof boatLoaderTheme;

// A wave with a 40-unit wavelength, long enough to cover the box while it scrolls.
const wave = (y: number, amp: number) => {
  let d = `M-40 ${y}`;
  for (let x = -40; x < 140; x += 40) d += ` q10 ${-amp} 20 0 t20 0`;
  return d;
};

/** A little boat rocking over endlessly scrolling waves. */
export function BoatLoader(props: LoaderProps<BoatLoaderTheme>) {
  return (
    <LoaderFrame
      {...props}
      defaultTheme={boatLoaderTheme}
      art={
        <>
          <defs>
            {/* Waves fade out at both edges instead of spilling past the box. */}
            <linearGradient id="qs-boat-loader-fade" gradientUnits="userSpaceOnUse" x1="8" y1="0" x2="92" y2="0">
              <stop offset="0" stopColor="#fff" stopOpacity="0" />
              <stop offset="0.2" stopColor="#fff" />
              <stop offset="0.8" stopColor="#fff" />
              <stop offset="1" stopColor="#fff" stopOpacity="0" />
            </linearGradient>
            <mask id="qs-boat-loader-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="100" height="100">
              <rect width="100" height="100" fill="url(#qs-boat-loader-fade)" />
            </mask>
          </defs>
          <g mask="url(#qs-boat-loader-mask)">
            <path className={styles.wavesBack} d={wave(62, 6)} fill="none" stroke="var(--water-back)" strokeWidth="4" strokeLinecap="round" />
          </g>
          <g className={styles.boat}>
            <path d="M50 22 V56 H30 Z" fill="var(--sail)" />
            <path d="M53 30 V56 H68 Z" fill="var(--sail)" opacity="0.75" />
            <rect x="49.5" y="20" width="3" height="38" rx="1.5" fill="var(--hull)" />
            <path d="M26 58 H74 L66 70 H34 Z" fill="var(--hull)" />
          </g>
          <g mask="url(#qs-boat-loader-mask)">
            <path className={styles.waves} d={wave(72, 7)} fill="none" stroke="var(--water)" strokeWidth="5" strokeLinecap="round" />
          </g>
        </>
      }
    />
  );
}
