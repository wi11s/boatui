// <MoonLoader>: the moon running through its phases among twinkling stars. The lit part is the disc
// minus a shadow disc that slides across it, so it works on any background; a faint outline keeps
// the new moon visible.

import { useId } from 'react';
import { LoaderFrame, type LoaderProps } from './loader';
import styles from './moon-loader.module.css';

export const moonLoaderTheme = {
  moon: '#f2d98c',
  crater: '#e2c574',
  outline: '#c9d3dc',
  stars: '#f2c14e',
};
export type MoonLoaderTheme = typeof moonLoaderTheme;

const R = 26;

/** The moon running through its phases among twinkling stars. */
export function MoonLoader(props: LoaderProps<MoonLoaderTheme>) {
  const id = `qs${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;
  return (
    <LoaderFrame
      {...props}
      defaultTheme={moonLoaderTheme}
      art={
        <>
          <defs>
            {/* White shows the lit part: the disc, minus a black disc that slides across it */}
            <mask id={`${id}phase`} maskUnits="userSpaceOnUse" x="0" y="0" width="100" height="100">
              <circle cx="50" cy="50" r={R} fill="#ffffff" />
              <g className={styles.shadow}>
                <circle cx="50" cy="50" r={R + 1} fill="#000000" />
              </g>
            </mask>
          </defs>

          <circle cx="50" cy="50" r={R} fill="none" stroke="var(--outline)" strokeWidth="1.5" strokeDasharray="2 3" />
          <g mask={`url(#${id}phase)`} className={styles.tilt}>
            <circle cx="50" cy="50" r={R} fill="var(--moon)" />
            <g fill="var(--crater)">
              <circle cx="42" cy="42" r="5" />
              <circle cx="59" cy="57" r="6.5" />
              <circle cx="56" cy="38" r="3" />
              <circle cx="41" cy="61" r="3.5" />
            </g>
          </g>

          <g fill="var(--stars)">
            {[
              { x: 14, y: 22, s: 1, d: 0 },
              { x: 86, y: 18, s: 0.8, d: -0.6 },
              { x: 88, y: 78, s: 1.1, d: -1.2 },
              { x: 12, y: 80, s: 0.7, d: -1.8 },
            ].map((st, i) => (
              <g key={i} transform={`translate(${st.x} ${st.y}) scale(${st.s})`}>
                <path className={styles.star} style={{ animationDelay: `${st.d}s` }} d="M0 -6 L1.5 -1.5 L6 0 L1.5 1.5 L0 6 L-1.5 1.5 L-6 0 L-1.5 -1.5 Z" />
              </g>
            ))}
          </g>
        </>
      }
    />
  );
}
