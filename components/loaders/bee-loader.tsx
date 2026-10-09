// <BeeLoader>: a bumblebee flying figure-eights over a flower, wings a blur, turning to face
// the way it's going. The figure-eight is two eased sways at a 1:2 ratio (a Lissajous curve).

import { LoaderFrame, type LoaderProps } from './loader';
import styles from './bee-loader.module.css';

export const beeLoaderTheme = {
  body: '#f6c445',
  stripes: '#3d3a3a',
  wings: '#e6f3fb',
  petals: '#f49ab5',
  centre: '#f2c14e',
  stem: '#6cbf6a',
  trail: '#c9b8d6',
};
export type BeeLoaderTheme = typeof beeLoaderTheme;

/** A bumblebee flying figure-eights over a flower. */
export function BeeLoader(props: LoaderProps<BeeLoaderTheme>) {
  return (
    <LoaderFrame
      {...props}
      defaultTheme={beeLoaderTheme}
      art={
        <>
          {/* Flower: sways from the base of its stem */}
          <g className={styles.flower}>
            <path d="M50 94 C50 84 48 78 50 70" fill="none" stroke="var(--stem)" strokeWidth="3" strokeLinecap="round" />
            <path d="M50 86 C44 84 40 80 40 76 C45 76 49 80 50 86 Z" fill="var(--stem)" />
            <g fill="var(--petals)">
              {[0, 72, 144, 216, 288].map(a => (
                <ellipse key={a} cx="50" cy="62" rx="4.6" ry="7" transform={`rotate(${a} 50 69)`} />
              ))}
            </g>
            <circle cx="50" cy="69" r="4.5" fill="var(--centre)" />
          </g>

          {/* Bee: x sways once per 2.4s, y twice, a quarter-beat apart, tracing a figure eight */}
          <g transform="translate(50 36)">
            <g className={styles.x}>
              <g className={styles.y}>
                <g className={styles.face}>
                  <g className={styles.bob}>
                    <ellipse className={styles.wing} cx="-2" cy="-7" rx="5" ry="7" fill="var(--wings)" opacity="0.9" />
                    <ellipse className={`${styles.wing} ${styles.wingBack}`} cx="2" cy="-6" rx="4" ry="6" fill="var(--wings)" opacity="0.7" />
                    <path d="M-12 1 L-15 2 L-12 3 Z" fill="var(--stripes)" />
                    <ellipse cx="0" cy="2" rx="12" ry="8.5" fill="var(--body)" />
                    <path d="M-5 -6 Q-7 2 -5 10 M1 -6.5 Q-1 2 1 10.5" fill="none" stroke="var(--stripes)" strokeWidth="3" />
                    <circle cx="9" cy="1" r="5" fill="var(--stripes)" />
                    <circle cx="10.5" cy="0" r="1.3" fill="#ffffff" />
                    <path d="M9 -4 Q10 -9 13 -10" fill="none" stroke="var(--stripes)" strokeWidth="1.2" strokeLinecap="round" />
                  </g>
                </g>
              </g>
            </g>
          </g>
        </>
      }
    />
  );
}
