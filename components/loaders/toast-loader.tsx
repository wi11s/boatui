// <ToastLoader>: a toaster that crouches, then pops two slices of toast up and catches them.

import { LoaderFrame, type LoaderProps } from './loader';
import styles from './toast-loader.module.css';

export const toastLoaderTheme = {
  toaster: '#9cc9e3',
  toasterShade: '#7fb2d2',
  bread: '#e9b96e',
  crust: '#b8713a',
  spark: '#f2c14e',
};
export type ToastLoaderTheme = typeof toastLoaderTheme;

function Slice({ x, className }: { x: number; className: string }) {
  return (
    <g className={className}>
      <path d={`M${x} 56 V36 c0 -7 4 -9 9 -9 c5 0 9 2 9 9 V56 Z`} fill="var(--crust)" />
      <path d={`M${x + 2.5} 56 V37 c0 -5 3 -6.5 6.5 -6.5 c3.5 0 6.5 1.5 6.5 6.5 V56 Z`} fill="var(--bread)" />
    </g>
  );
}

/** A toaster that crouches, then pops two slices of toast up and catches them. */
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
            <circle cx="30" cy="66" r="2" fill="#ffffff" opacity="0.7" />
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
