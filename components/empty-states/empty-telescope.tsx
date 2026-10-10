// <EmptyTelescope>: a telescope on a hilltop slowly scanning a round patch of night sky. Stars
// twinkle and now and then a shooting star streaks past. For "no notifications" and "nothing
// new". Animated.

import { EmptyStateFrame, type EmptyStateProps } from './empty-state';
import styles from './empty-telescope.module.css';

export const emptyTelescopeTheme = {
  night: '#2a3566',
  stars: '#fff6d8',
  moon: '#f4e7c4',
  hill: '#8cc66a',
  hillShade: '#74b35a',
  tube: '#e4573d',
  brass: '#e8b54d',
  tripod: '#5b4a42',
};
export type EmptyTelescopeTheme = typeof emptyTelescopeTheme;

// Stars inside the sky disc (centre 120,84, radius 72): [x, y, r, twinkle delay].
const STARS: [number, number, number, number][] = [
  [78, 52, 1.6, 0],
  [102, 34, 1.2, -1.1],
  [150, 40, 1.8, -0.4],
  [172, 70, 1.2, -1.7],
  [92, 82, 1.1, -0.8],
  [64, 92, 1.4, -2.2],
  [128, 62, 1, -1.4],
  [184, 102, 1.4, -0.2],
  [118, 24, 1.3, -1.9],
  [58, 64, 1, -0.6],
];

/** A telescope scanning a quiet night sky: for "no notifications". */
export function EmptyTelescope(props: EmptyStateProps<EmptyTelescopeTheme>) {
  return (
    <EmptyStateFrame
      {...props}
      defaultTheme={emptyTelescopeTheme}
      art={
        <>
          {/* A round patch of night sky */}
          <circle cx="120" cy="84" r="72" fill="var(--night)" />
          <g fill="var(--stars)">
            {STARS.map(([x, y, r, d]) => (
              <circle key={`${x}-${y}`} className={styles.star} cx={x} cy={y} r={r} style={{ animationDelay: `${d}s` }} />
            ))}
          </g>
          <g transform="translate(160 44)">
            <circle r="11" fill="var(--moon)" />
            <circle cx="-3" cy="-2" r="2.4" fill="#000" opacity="0.08" />
            <circle cx="3.5" cy="3" r="1.8" fill="#000" opacity="0.08" />
          </g>

          {/* Shooting star: a short streak across the upper left, every 6s */}
          <g className={styles.shoot}>
            <path d="M0 0 L-22 -9" stroke="var(--stars)" strokeWidth="1.6" strokeLinecap="round" opacity="0.5" />
            <path d="M0 0 L-8 -3.3" stroke="var(--stars)" strokeWidth="2" strokeLinecap="round" />
          </g>

          {/* Hilltop, overlapping the bottom of the sky */}
          <path d="M20 160 C50 128 90 118 124 120 C164 122 200 136 222 160 Z" fill="var(--hill)" />
          <path d="M124 120 C164 122 200 136 222 160 H170 C176 146 160 130 124 120 Z" fill="var(--hill-shade)" />
          <ellipse cx="120" cy="164" rx="104" ry="5" fill="var(--hill-shade)" opacity="0.35" />

          {/* Tripod */}
          <g stroke="var(--tripod)" strokeWidth="3" strokeLinecap="round">
            <path d="M118 104 L100 136 M118 104 L136 136 M118 104 L120 140" />
          </g>

          {/* Telescope tube on its mount, slowly scanning the sky */}
          <g transform="translate(118 102)">
            <g className={styles.scan}>
              <g transform="rotate(-32)">
                <rect x="-22" y="-6" width="52" height="12" rx="3" fill="var(--tube)" />
                <rect x="28" y="-8" width="12" height="16" rx="3" fill="var(--tube)" />
                <rect x="-30" y="-4" width="9" height="8" rx="2" fill="var(--tripod)" />
                <rect x="6" y="-6" width="4" height="12" fill="var(--brass)" />
                <rect x="36" y="-8" width="4" height="16" rx="1" fill="var(--brass)" />
                <path d="M-14 -3 H20" stroke="#ffffff" strokeOpacity="0.35" strokeWidth="2" strokeLinecap="round" />
              </g>
              <circle r="4" fill="var(--brass)" />
            </g>
          </g>
        </>
      }
    />
  );
}
