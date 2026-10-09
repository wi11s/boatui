// Shared frame for every background: theming, layering and pausing.
// Backgrounds are pure server components: no client JavaScript.

import type { CSSProperties, ReactNode } from 'react';
import styles from './background.module.css';

export { styles as backgroundStyles };

/** Deterministic PRNG so particles render identically on server and client. */
export function seeded(seed: number): () => number {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Round for stable, compact inline styles. */
export const r2 = (n: number) => Math.round(n * 100) / 100;

/** Props every background accepts. `T` is the background's theme (colour tokens). */
export type BackgroundProps<T> = {
  /** Override any of the background's colours. */
  theme?: Partial<T>;
  /** Freeze animated backgrounds. Static backgrounds ignore it. */
  paused?: boolean;
  className?: string;
  style?: CSSProperties;
  /** Your content. The background paints behind it. */
  children?: ReactNode;
};

// baseColor → --base-color, blob1 → --blob-1
const toVar = (key: string) => `--${key.replace(/([A-Z])/g, '-$1').replace(/(\d+)/g, '-$1').toLowerCase()}`;

type BackgroundFrameProps<T extends Record<string, string>> = BackgroundProps<T> & {
  defaultTheme: T;
  /** The texture itself, rendered in an absolutely positioned layer behind the children. */
  layer: ReactNode;
};

export function BackgroundFrame<T extends Record<string, string>>({
  defaultTheme,
  layer,
  theme,
  paused,
  className,
  style,
  children,
}: BackgroundFrameProps<T>) {
  const vars: Record<string, string> = {};
  for (const [key, value] of Object.entries({ ...defaultTheme, ...theme })) {
    if (value) vars[toVar(key)] = value;
  }
  const classes = [styles.root, paused && styles.paused, className].filter(Boolean).join(' ');

  return (
    <div className={classes} style={{ ...vars, ...style } as CSSProperties}>
      <div className={styles.layer} aria-hidden="true">
        {layer}
      </div>
      {children}
    </div>
  );
}
