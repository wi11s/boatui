// Shared frame for every empty state: an illustration with your message underneath.
// Empty states are pure server components: no client JavaScript.

import type { CSSProperties, ReactNode } from 'react';
import styles from './empty-state.module.css';

/** Props every empty state accepts. `T` is the illustration's theme (colour tokens). */
export type EmptyStateProps<T> = {
  /** Override any of the illustration's colours. */
  theme?: Partial<T>;
  /** Freeze the animation. */
  paused?: boolean;
  /** Illustration width in pixels (default 240). It scales down to fit narrow containers. */
  size?: number;
  className?: string;
  style?: CSSProperties;
  /** Your message and actions, shown under the illustration. */
  children?: ReactNode;
};

// skyTop → --sky-top, leaf1 → --leaf-1
const toVar = (key: string) => `--${key.replace(/([A-Z])/g, '-$1').replace(/(\d+)/g, '-$1').toLowerCase()}`;

type EmptyStateFrameProps<T extends Record<string, string>> = EmptyStateProps<T> & {
  defaultTheme: T;
  /** SVG content drawn in a 240×180 box. */
  art: ReactNode;
};

export function EmptyStateFrame<T extends Record<string, string>>({
  defaultTheme,
  art,
  theme,
  paused,
  size = 240,
  className,
  style,
  children,
}: EmptyStateFrameProps<T>) {
  const vars: Record<string, string> = {};
  for (const [key, value] of Object.entries({ ...defaultTheme, ...theme })) {
    if (value) vars[toVar(key)] = value;
  }
  const classes = [styles.root, paused && styles.paused, className].filter(Boolean).join(' ');

  return (
    <div className={classes} style={{ ...vars, ...style } as CSSProperties}>
      <svg className={styles.art} width={size} viewBox="0 0 240 180" aria-hidden="true" focusable="false">
        {art}
      </svg>
      {children && <div className={styles.content}>{children}</div>}
    </div>
  );
}
