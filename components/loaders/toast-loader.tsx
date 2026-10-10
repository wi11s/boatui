// <ToastLoader>: a toaster that crouches, squeezes its eyes shut, then pops two slices of toast up.
// One slice flips head over heels before both drop back in.

import { LoaderFrame, type LoaderProps } from './loader';
import styles from './toast-loader.module.css';

export const toastLoaderTheme = {
  toaster: '#9cc9e3',
  toasterShade: '#7fb2d2',
  bread: '#e9b96e',
  crust: '#b8713a',
  spark: '#f2c14e',
  face: '#3d4a57',
};
export type ToastLoaderTheme = typeof toastLoaderTheme;

function Slice({ x, className }: { x: number; className: string }) {
  return (
    <g className={className}>
      <path d={`M${x} 64 V44 c0 -7 4 -9 9 -9 c5 0 9 2 9 9 V64 Z`} fill="var(--crust)" />
      <path d={`M${x + 2.5} 64 V45 c0 -5 3 -6.5 6.5 -6.5 c3.5 0 6.5 1.5 6.5 6.5 V64 Z`} fill="var(--bread)" />
    </g>
  );
}

/** A toaster that crouches, then pops two slices of toast up; one flips before they drop back in. */
export function ToastLoader(props: LoaderProps<ToastLoaderTheme>) {
  return (
    <LoaderFrame
      {...props}
      defaultTheme={toastLoaderTheme}
      art={
        <>
          <g fill="none" stroke="var(--spark)" strokeWidth="3" strokeLinecap="round">
            <path className={styles.spark} d="M24 26 l-6 -5 M50 16 v-7 M76 26 l6 -5" />
          </g>
          <Slice x={31} className={styles.slice} />
          <Slice x={51} className={`${styles.slice} ${styles.slice2}`} />
          <g className={styles.toaster}>
            <rect x="20" y="50" width="60" height="36" rx="12" fill="var(--toaster)" />
            <rect x="20" y="78" width="60" height="8" rx="4" fill="var(--toaster-shade)" />
            <rect x="30" y="48" width="18" height="5" rx="2.5" fill="var(--toaster-shade)" />
            <rect x="52" y="48" width="18" height="5" rx="2.5" fill="var(--toaster-shade)" />
            <g className={styles.eyes} fill="var(--face)">
              <ellipse cx="41" cy="66" rx="2.2" ry="2.6" />
              <ellipse cx="59" cy="66" rx="2.2" ry="2.6" />
            </g>
            <path d="M47 71 Q50 73.5 53 71" fill="none" stroke="var(--face)" strokeWidth="1.6" strokeLinecap="round" />
            <ellipse cx="35" cy="70.5" rx="3" ry="1.8" fill="var(--spark)" opacity="0.45" />
            <ellipse cx="65" cy="70.5" rx="3" ry="1.8" fill="var(--spark)" opacity="0.45" />
          </g>
          <g className={styles.lever}>
            <rect x="80" y="58" width="9" height="4" rx="2" fill="var(--toaster-shade)" />
          </g>
          <ellipse cx="50" cy="92" rx="30" ry="3" fill="var(--toaster-shade)" opacity="0.4" />
        </>
      }
    />
  );
}
