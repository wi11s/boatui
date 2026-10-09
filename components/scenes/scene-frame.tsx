'use client';

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { H, W } from './geometry';
import styles from './scene.module.css';

// skyTop → --sky-top, water1 → --water-1
const toVar = (key: string) => `--${key.replace(/([A-Z])/g, '-$1').replace(/(\d+)/g, '-$1').toLowerCase()}`;

export type SceneFrameProps = {
  defaultTheme: Record<string, string>;
  defaultDuration: number;
  art: ReactNode;
  duration?: number;
  theme?: Record<string, string | undefined>;
  paused?: boolean;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
};

/**
 * The frame shared by every scene: sizing, theming, overlay and off-screen pausing.
 * It's the only client component; the scene art itself renders on the server.
 */
export function SceneFrame({
  defaultTheme,
  defaultDuration,
  art,
  duration = defaultDuration,
  theme,
  paused,
  className,
  style,
  children,
}: SceneFrameProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [offscreen, setOffscreen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setOffscreen(!entry.isIntersecting));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const vars: Record<string, string> = { '--duration': `${duration}s` };
  for (const [key, value] of Object.entries({ ...defaultTheme, ...theme })) {
    if (value) vars[toVar(key)] = value;
  }

  const classes = [styles.root, (paused || offscreen) && styles.paused, className].filter(Boolean).join(' ');

  return (
    <div ref={ref} className={classes} style={{ ...vars, ...style } as CSSProperties}>
      <svg
        className={styles.art}
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
        focusable="false"
      >
        {art}
      </svg>
      {children && <div className={styles.overlay}>{children}</div>}
    </div>
  );
}
