// <PlaneLoader>: a paper plane looping the loop, trailing a fading dashed line, while small clouds
// drift past. The loop eases, so the plane hangs at the top and swoops through the bottom.

import { LoaderFrame, type LoaderProps } from './loader';
import styles from './plane-loader.module.css';

export const planeLoaderTheme = {
  paper: '#ffffff',
  paperShade: '#cfdde8',
  outline: '#5b7a93',
  trail: '#9cc9e3',
  cloud: '#e4eff6',
};
export type PlaneLoaderTheme = typeof planeLoaderTheme;

/** Loop radius; the plane circles the centre of the box. */
const R = 28;

/** An arc of the loop from angle a0 to a1 (degrees, 0 = top, clockwise). */
const arc = (a0: number, a1: number) => {
  const pt = (a: number) => {
    const r = (a * Math.PI) / 180;
    return `${(50 + R * Math.sin(r)).toFixed(2)} ${(50 - R * Math.cos(r)).toFixed(2)}`;
  };
  return `M${pt(a0)} A${R} ${R} 0 0 1 ${pt(a1)}`;
};

/** A paper plane looping the loop. */
export function PlaneLoader(props: LoaderProps<PlaneLoaderTheme>) {
  return (
    <LoaderFrame
      {...props}
      defaultTheme={planeLoaderTheme}
      art={
        <>
          <g fill="var(--cloud)">
            <g className={styles.cloud}>
              <ellipse cx="20" cy="74" rx="11" ry="4.5" />
              <ellipse cx="25" cy="70" rx="6.5" ry="4.5" />
            </g>
            <g className={`${styles.cloud} ${styles.cloudSlow}`}>
              <ellipse cx="70" cy="30" rx="8" ry="3.5" />
              <ellipse cx="73" cy="27.5" rx="4.5" ry="3" />
            </g>
          </g>

          {/* Everything that loops: the trail sits behind the plane, which starts at the top heading right. */}
          <g className={styles.loop}>
            <g fill="none" stroke="var(--trail)" strokeWidth="2.6" strokeLinecap="round" strokeDasharray="0.1 6">
              <path d={arc(-150, -95)} opacity="0.3" />
              <path d={arc(-95, -50)} opacity="0.6" />
              <path d={arc(-50, -12)} opacity="1" />
            </g>
            <g transform={`translate(50 ${50 - R})`}>
              <g className={styles.plane} strokeLinejoin="round" strokeWidth="1.4" stroke="var(--outline)">
                <path d="M14 0 L-10 9 L-4 1 Z" fill="var(--paper-shade)" />
                <path d="M14 0 L-12 -9 L-4 1 Z" fill="var(--paper)" />
                <path d="M14 0 L-4 1 L-7 5 Z" fill="var(--paper-shade)" />
              </g>
            </g>
          </g>
        </>
      }
    />
  );
}
