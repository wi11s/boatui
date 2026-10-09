// <LighthouseLoader>: a lighthouse on a rock whose beam sweeps round and round. The beam is faked
// in 2D by squashing it through zero width, and the lamp flares each time it swings past you.

import { useId } from 'react';
import { LoaderFrame, type LoaderProps } from './loader';
import styles from './lighthouse-loader.module.css';

export const lighthouseLoaderTheme = {
  beam: '#f6c75a',
  lamp: '#fff2c4',
  tower: '#f4f1ea',
  stripes: '#d1493c',
  roof: '#3d4a57',
  rock: '#6b7a86',
  water: '#7fb6d4',
};
export type LighthouseLoaderTheme = typeof lighthouseLoaderTheme;

/** A lighthouse whose beam sweeps round, flaring as it faces you. */
export function LighthouseLoader(props: LoaderProps<LighthouseLoaderTheme>) {
  const id = `qs${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;
  return (
    <LoaderFrame
      {...props}
      defaultTheme={lighthouseLoaderTheme}
      art={
        <>
          <defs>
            {/* The water line fades out at both ends instead of spilling past the box. */}
            <linearGradient id={`${id}fade`} gradientUnits="userSpaceOnUse" x1="10" y1="0" x2="90" y2="0">
              <stop offset="0" stopColor="#fff" stopOpacity="0" />
              <stop offset="0.25" stopColor="#fff" />
              <stop offset="0.75" stopColor="#fff" />
              <stop offset="1" stopColor="#fff" stopOpacity="0" />
            </linearGradient>
            <mask id={`${id}mask`} maskUnits="userSpaceOnUse" x="0" y="0" width="100" height="100">
              <rect width="100" height="100" fill={`url(#${id}fade)`} />
            </mask>
          </defs>

          {/* Beam: hinged at the lamp; its width runs 1 → 0 → -1 like the cosine of a turning light. */}
          <g transform="translate(50 30)">
            <g className={styles.beam}>
              <path d="M0 -3 L46 -12 L46 12 L0 3 Z" fill="var(--beam)" opacity="0.55" />
            </g>
          </g>

          <path d="M41 36 L39 78 H61 L59 36 Z" fill="var(--tower)" />
          <path d="M40.6 46 L40 56 H60 L59.4 46 Z M39.6 66 L39.2 74 H60.8 L60.4 66 Z" fill="var(--stripes)" />
          <rect x="42" y="24" width="16" height="12" rx="1.5" fill="var(--roof)" />
          <rect x="44.5" y="26" width="11" height="9" rx="1" fill="var(--lamp)" />
          <path d="M40 24 L50 15 L60 24 Z" fill="var(--stripes)" />
          <rect x="38" y="35" width="24" height="2.5" rx="1" fill="var(--roof)" />
          <circle className={styles.flare} cx="50" cy="30" r="9" fill="var(--lamp)" />

          <path d="M26 86 Q32 74 44 76 H58 Q70 74 76 86 Z" fill="var(--rock)" />
          <g mask={`url(#${id}mask)`}>
            <g className={styles.water} fill="none" stroke="var(--water)" strokeWidth="3" strokeLinecap="round">
              <path d="M-4 88 q6 -4 12 0 t12 0 t12 0 t12 0 t12 0 t12 0 t12 0 t12 0 t12 0 t12 0" />
            </g>
          </g>
        </>
      }
    />
  );
}
