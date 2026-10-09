// <TeaLoader>: a teabag dunking into a cup of tea. Rings spread across the surface as it goes in,
// it lifts out with a drip that plinks back, and steam curls up beside it.

import { useId } from 'react';
import { LoaderFrame, type LoaderProps } from './loader';
import styles from './tea-loader.module.css';

export const teaLoaderTheme = {
  cup: '#9cc9e3',
  cupShade: '#7fb2d2',
  tea: '#b8713a',
  ripple: '#dca06a',
  steam: '#a7b4bd',
  bag: '#ead6b0',
  tag: '#f2c14e',
};
export type TeaLoaderTheme = typeof teaLoaderTheme;

/** A teabag dunking into a cup of tea, with ripples, a drip and curling steam. */
export function TeaLoader(props: LoaderProps<TeaLoaderTheme>) {
  const id = `qs${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;
  return (
    <LoaderFrame
      {...props}
      defaultTheme={teaLoaderTheme}
      art={
        <>
          <defs>
            {/* Above the tea's surface line: the bag and string vanish as they go under. */}
            <clipPath id={`${id}above`}>
              <rect x="0" y="-20" width="100" height="68" />
            </clipPath>
            <clipPath id={`${id}surface`}>
              <ellipse cx="50" cy="48" rx="26" ry="5" />
            </clipPath>
          </defs>

          <g fill="none" stroke="var(--steam)" strokeWidth="3" strokeLinecap="round">
            {[0, 1].map(i => (
              <g key={i} transform={`translate(${34 + i * 9} 0)`}>
                <path
                  className={styles.steam}
                  style={{ animationDelay: `${-i * 1.2}s` }}
                  d="M0 40 c-4 -4 4 -8 0 -12 c-4 -4 4 -8 0 -12"
                />
              </g>
            ))}
          </g>

          <ellipse cx="50" cy="87" rx="36" ry="6" fill="var(--cup-shade)" />
          <path d="M73 55 c13 0 13 17 0 17" fill="none" stroke="var(--cup)" strokeWidth="5" strokeLinecap="round" />
          <ellipse cx="50" cy="48" rx="28" ry="6" fill="var(--cup-shade)" />
          <ellipse cx="50" cy="48" rx="26" ry="5" fill="var(--tea)" />

          <g clipPath={`url(#${id}surface)`} fill="none" stroke="var(--ripple)" strokeWidth="1.4">
            <ellipse className={styles.ripple} cx="58" cy="48" rx="8" ry="1.8" />
            <ellipse className={`${styles.ripple} ${styles.ripple2}`} cx="58" cy="48" rx="8" ry="1.8" />
            <ellipse className={`${styles.ripple} ${styles.ripple3}`} cx="58" cy="48" rx="6" ry="1.4" />
          </g>

          <g clipPath={`url(#${id}above)`}>
            <g className={styles.bag}>
              <path d="M58 6 V28" stroke="var(--steam)" strokeWidth="1.2" />
              <rect x="54" y="0" width="8" height="8" rx="1.5" fill="var(--tag)" />
              <path d="M52 28 H64 L63 42 Q58 44 53 42 Z" fill="var(--bag)" />
              <path d="M52 28 H64 V31 H52 Z" fill="var(--tag)" opacity="0.6" />
            </g>
            <circle className={styles.drip} cx="58" cy="43" r="1.6" fill="var(--tea)" />
          </g>

          <path d="M22 48 Q22 49 24 50 C30 53 70 53 76 50 Q78 49 78 48 V60 C78 78 66 85 50 85 C34 85 22 78 22 60 Z" fill="var(--cup)" />
          <path d="M28 60 C29 72 36 79 44 81" fill="none" stroke="#ffffff" strokeOpacity="0.45" strokeWidth="2.5" strokeLinecap="round" />
        </>
      }
    />
  );
}
