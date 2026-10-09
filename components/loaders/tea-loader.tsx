// <TeaLoader>: a cup of tea with steam curling up and the teabag tag swaying.

import { LoaderFrame, type LoaderProps } from './loader';
import styles from './tea-loader.module.css';

export const teaLoaderTheme = {
  cup: '#9cc9e3',
  cupShade: '#7fb2d2',
  tea: '#b8713a',
  steam: '#a7b4bd',
  tag: '#f2c14e',
};
export type TeaLoaderTheme = typeof teaLoaderTheme;

/** A cup of tea with steam curling up and the teabag tag swaying. */
export function TeaLoader(props: LoaderProps<TeaLoaderTheme>) {
  return (
    <LoaderFrame
      {...props}
      defaultTheme={teaLoaderTheme}
      art={
        <>
          <g fill="none" stroke="var(--steam)" strokeWidth="3.5" strokeLinecap="round">
            {[36, 50, 64].map((x, i) => (
              <path
                key={x}
                className={styles.steam}
                style={{ animationDelay: `${-i * 0.8}s` }}
                d={`M${x} 40 c-5 -5 5 -9 0 -14 c-5 -5 5 -9 0 -14`}
              />
            ))}
          </g>
          <ellipse cx="50" cy="86" rx="34" ry="6" fill="var(--cup-shade)" />
          <path d="M71 56 c12 0 12 16 0 16" fill="none" stroke="var(--cup)" strokeWidth="5" strokeLinecap="round" />
          <path d="M24 48 H76 V60 C76 78 64 84 50 84 C36 84 24 78 24 60 Z" fill="var(--cup)" />
          <ellipse cx="50" cy="48" rx="26" ry="5" fill="var(--tea)" />
          <path d="M62 47 C64 52 66 56 67 60" fill="none" stroke="var(--steam)" strokeWidth="1.2" />
          <g className={styles.tag}>
            <path d="M67 60 V64" stroke="var(--steam)" strokeWidth="1.2" />
            <rect x="63" y="64" width="8" height="9" rx="1.5" fill="var(--tag)" />
          </g>
        </>
      }
    />
  );
}
