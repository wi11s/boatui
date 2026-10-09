// <FishbowlLoader>: a goldfish swimming laps of a round bowl, turning at each side, while bubbles
// rise, the weed sways and the water's surface ripples.

import { useId } from 'react';
import { LoaderFrame, type LoaderProps } from './loader';
import styles from './fishbowl-loader.module.css';

export const fishbowlLoaderTheme = {
  glass: '#b9d8ea',
  water: '#d8ecf6',
  fish: '#f08a3c',
  fin: '#f6b26b',
  weed: '#6cbf6a',
  pebbles: '#c9b79a',
  bubbles: '#ffffff',
};
export type FishbowlLoaderTheme = typeof fishbowlLoaderTheme;

/** A goldfish swimming laps of a round bowl. */
export function FishbowlLoader(props: LoaderProps<FishbowlLoaderTheme>) {
  const id = `qs${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;
  return (
    <LoaderFrame
      {...props}
      defaultTheme={fishbowlLoaderTheme}
      art={
        <>
          <defs>
            {/* The water: the bowl's disc below a surface line */}
            <clipPath id={`${id}water`}>
              <path d="M10 40 H90 V100 H10 Z" />
            </clipPath>
            <clipPath id={`${id}bowl`}>
              <circle cx="50" cy="55" r="36" />
            </clipPath>
          </defs>

          <g clipPath={`url(#${id}bowl)`}>
            <g clipPath={`url(#${id}water)`}>
              <rect x="0" y="0" width="100" height="100" fill="var(--water)" />
            </g>
            <g className={styles.surface}>
              <path d="M6 40 q6 -2 12 0 t12 0 t12 0 t12 0 t12 0 t12 0 t12 0 t12 0" fill="none" stroke="var(--glass)" strokeWidth="1.6" />
            </g>

            {/* Pebbles and weed on the bottom */}
            <g fill="var(--pebbles)">
              <ellipse cx="30" cy="88" rx="10" ry="5" />
              <ellipse cx="46" cy="90" rx="9" ry="5" />
              <ellipse cx="62" cy="89" rx="10" ry="5" />
              <ellipse cx="74" cy="86" rx="7" ry="4" />
            </g>
            <g transform="translate(68 86)">
              <path className={styles.weed} d="M0 0 C-5 -10 5 -18 0 -28 C-4 -34 2 -38 0 -42" fill="none" stroke="var(--weed)" strokeWidth="3.4" strokeLinecap="round" />
            </g>
            <g transform="translate(32 86)">
              <path className={`${styles.weed} ${styles.weed2}`} d="M0 0 C4 -8 -4 -14 0 -22" fill="none" stroke="var(--weed)" strokeWidth="3" strokeLinecap="round" />
            </g>

            {/* Bubbles from the weed */}
            <g fill="none" stroke="var(--bubbles)" strokeWidth="1.2">
              {[0, 1, 2].map(i => (
                <g key={i} transform={`translate(${66 + i * 3} 60)`}>
                  <circle className={styles.bubble} style={{ animationDelay: `${-i * 0.6}s` }} r={1.6 + i * 0.5} />
                </g>
              ))}
            </g>

            {/* Fish: swims across and back, turning (a squeeze through zero width) at each side */}
            <g className={styles.swim}>
              <g className={styles.turn}>
                <g className={styles.wiggle}>
                  <path className={styles.tail} d="M-9 0 L-18 -7 Q-15 0 -18 7 Z" fill="var(--fin)" />
                  <path d="M-10 0 C-6 -8 8 -8 12 0 C8 8 -6 8 -10 0 Z" fill="var(--fish)" />
                  <path d="M-2 -6 Q2 -11 6 -6 Z" fill="var(--fin)" />
                  <circle cx="7" cy="-1.5" r="1.4" fill="#2b2b2b" />
                </g>
              </g>
            </g>
          </g>

          {/* Glass: outline, rim and a highlight */}
          <circle cx="50" cy="55" r="36" fill="none" stroke="var(--glass)" strokeWidth="3" />
          <path d="M30 22 Q50 16 70 22" fill="none" stroke="var(--glass)" strokeWidth="4" strokeLinecap="round" />
          <path d="M24 48 Q24 34 34 28" fill="none" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" opacity="0.8" />
        </>
      }
    />
  );
}
