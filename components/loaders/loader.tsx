// Shared frame for every loader: theming, sizing and an accessible status label.
// Loaders are pure server components: no client JavaScript.

import type { CSSProperties, ReactNode } from 'react';
import styles from './loader.module.css';

/** Props every loader accepts. `T` is the loader's theme (colour tokens). */
export type LoaderProps<T> = {
  /** Override any of the loader's colours. */
  theme?: Partial<T>;
  /** Width and height in pixels (default 64). */
  size?: number;
  /** Text announced to screen readers (default "Loading…"). */
  label?: string;
  /** Freeze the animation. */
  paused?: boolean;
  className?: string;
  style?: CSSProperties;
};

// waterTop → --water-top, leaf1 → --leaf-1
const toVar = (key: string) => `--${key.replace(/([A-Z])/g, '-$1').replace(/(\d+)/g, '-$1').toLowerCase()}`;

type LoaderFrameProps<T extends Record<string, string>> = LoaderProps<T> & {
  defaultTheme: T;
  /** SVG content drawn in a 100×100 box. */
  art: ReactNode;
};

export function LoaderFrame<T extends Record<string, string>>({
  defaultTheme,
  art,
  theme,
  size = 64,
  label = 'Loading…',
  paused,
  className,
  style,
}: LoaderFrameProps<T>) {
  const vars: Record<string, string> = {};
  for (const [key, value] of Object.entries({ ...defaultTheme, ...theme })) {
    if (value) vars[toVar(key)] = value;
  }
  const classes = [styles.root, paused && styles.paused, className].filter(Boolean).join(' ');

  return (
    <span role="status" className={classes} style={{ ...vars, ...style } as CSSProperties}>
      <svg className={styles.art} width={size} height={size} viewBox="0 0 100 100" aria-hidden="true" focusable="false">
        {art}
      </svg>
      <span className={styles.label}>{label}</span>
    </span>
  );
}
