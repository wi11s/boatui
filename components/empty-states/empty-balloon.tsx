// <EmptyBalloon>: a lone red balloon drifting up and away, its string trailing, as clouds slide
// past below it and a bird flaps by. For "page not found", missing links and lost things. Animated.

import { EmptyStateFrame, type EmptyStateProps } from './empty-state';
import styles from './empty-balloon.module.css';

export const emptyBalloonTheme = {
  balloon: '#e4573d',
  shine: '#ffffff',
  string: '#8a97a0',
  cloud: '#e7f1f7',
  bird: '#5b6b78',
};
export type EmptyBalloonTheme = typeof emptyBalloonTheme;

/** A lone balloon drifting up and away: for "page not found". */
export function EmptyBalloon(props: EmptyStateProps<EmptyBalloonTheme>) {
  return (
    <EmptyStateFrame
      {...props}
      defaultTheme={emptyBalloonTheme}
      art={
        <>
          {/* Clouds slide down past the balloon, so it reads as rising */}
          <g fill="var(--cloud)">
            {[
              { x: 50, w: 34, delay: 0 },
              { x: 186, w: 42, delay: -3.4 },
              { x: 120, w: 26, delay: -6.8 },
            ].map((c, i) => (
              <g key={i} className={styles.cloud} style={{ animationDelay: `${c.delay}s` }}>
                <ellipse cx={c.x} cy="0" rx={c.w} ry={c.w * 0.32} />
                <ellipse cx={c.x + c.w * 0.3} cy={-c.w * 0.22} rx={c.w * 0.5} ry={c.w * 0.32} />
                <ellipse cx={c.x - c.w * 0.35} cy={-c.w * 0.12} rx={c.w * 0.38} ry={c.w * 0.26} />
              </g>
            ))}
          </g>

          {/* A bird flapping across */}
          <g className={styles.bird}>
            <path className={styles.flap} d="M-7 0 Q-3.5 -4 0 0 Q3.5 -4 7 0" fill="none" stroke="var(--bird)" strokeWidth="1.6" strokeLinecap="round" />
          </g>

          {/* Balloon and string: the whole thing drifts and tilts; the string waves on its own */}
          <g className={styles.drift}>
            <g transform="translate(120 70)">
              <g className={styles.tilt}>
                <path className={styles.string} d="M0 42 C-8 56 8 70 0 84 C-6 94 4 104 0 114" fill="none" stroke="var(--string)" strokeWidth="1.4" strokeLinecap="round" />
                <path d="M-4 40 L4 40 L2 44 L-2 44 Z" fill="var(--balloon)" />
                <path d="M0 -38 C22 -38 32 -20 32 -2 C32 20 14 36 0 40 C-14 36 -32 20 -32 -2 C-32 -20 -22 -38 0 -38 Z" fill="var(--balloon)" />
                <path d="M-18 -18 C-16 -26 -10 -30 -4 -31" fill="none" stroke="var(--shine)" strokeOpacity="0.6" strokeWidth="4" strokeLinecap="round" />
                <circle cx="-20" cy="-8" r="2.4" fill="var(--shine)" opacity="0.5" />
              </g>
            </g>
          </g>
        </>
      }
    />
  );
}
