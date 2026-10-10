// <EmptySnail>: a snail carrying a little flag on its shell, crawling along at its own pace. Its
// body stretches and gathers, its eye stalks bob and the grass and pebbles slide slowly past
// behind it over a glistening trail. For "coming soon" and features on their way. Animated.

import { EmptyStateFrame, type EmptyStateProps } from './empty-state';
import styles from './empty-snail.module.css';

export const emptySnailTheme = {
  body: '#e9c79b',
  bodyShade: '#d4a873',
  shell: '#c9824a',
  shellLine: '#9a5a2e',
  flag: '#5b9bd5',
  pole: '#7a6a5e',
  ground: '#b9dca8',
  pebbles: '#c9c3b8',
  trail: '#ffffff',
  eyes: '#3d3a3a',
};
export type EmptySnailTheme = typeof emptySnailTheme;

// Ground details that travel right to left across the frame, one setting off every 5s on a 40s
// trip, fading in and out at the ends: alternately a grass tuft and a pebble.
const DETAILS = Array.from({ length: 8 }, (_, i) => ({ pebble: i % 2 === 1, size: [1, 0.8, 1.2, 1, 0.9, 1.3, 1.1, 0.8][i], delay: -i * 5 }));

/** A snail with a flag crawling along at its own pace: for "coming soon". */
export function EmptySnail(props: EmptyStateProps<EmptySnailTheme>) {
  return (
    <EmptyStateFrame
      {...props}
      defaultTheme={emptySnailTheme}
      art={
        <>
          <rect x="10" y="149" width="220" height="5" rx="2.5" fill="var(--ground)" />

          {/* Grass and pebbles passing slowly behind, so the snail seems to make progress */}
          {DETAILS.map((d, i) => (
            <g key={i} className={styles.pass} style={{ animationDelay: `${d.delay}s` }}>
              <g transform={`translate(226 150) scale(${d.size})`}>
                {d.pebble ? (
                  <ellipse cx="0" cy="-1" rx="4" ry="2.8" fill="var(--pebbles)" />
                ) : (
                  <path d="M0 0 q-2 -8 -6 -11 M3 0 q0 -9 3 -12 M6 0 q2 -6 6 -8" fill="none" stroke="var(--ground)" strokeWidth="2.4" strokeLinecap="round" />
                )}
              </g>
            </g>
          ))}

          {/* The glistening trail it leaves behind */}
          <path className={styles.trail} d="M30 150 H104" stroke="var(--trail)" strokeWidth="2" strokeLinecap="round" strokeDasharray="1 7" />

          {/* Snail: the foot stretches and gathers; the shell rides on it with a small lag */}
          <g transform="translate(120 150)">
            <g className={styles.stretch}>
              <path d="M-26 0 C-28 -6 -18 -10 0 -10 H22 C30 -10 34 -14 36 -22 C38 -30 50 -30 50 -20 C50 -10 44 0 36 0 Z" fill="var(--body)" />
              <path d="M-26 0 H36 C40 0 44 -1 46 -3 C40 -2 30 -2 -20 -2 Z" fill="var(--body-shade)" />
            </g>
            {/* Eye stalks */}
            <g className={styles.head}>
              <g stroke="var(--body)" strokeWidth="3" strokeLinecap="round" fill="none">
                <path className={styles.stalk} d="M42 -26 Q42 -36 46 -42" />
                <path className={`${styles.stalk} ${styles.stalk2}`} d="M46 -25 Q50 -34 55 -38" />
              </g>
              <circle cx="46" cy="-43" r="3" fill="var(--body)" />
              <circle cx="55" cy="-39" r="3" fill="var(--body)" />
              <circle cx="47" cy="-43.5" r="1.4" fill="var(--eyes)" />
              <circle cx="56" cy="-39.5" r="1.4" fill="var(--eyes)" />
              <path d="M45 -14 Q48 -12 50 -15" fill="none" stroke="var(--eyes)" strokeWidth="1.3" strokeLinecap="round" />
            </g>
            <g className={styles.ride}>
              {/* Shell: a spiral drawn as nested arcs */}
              <circle cx="4" cy="-32" r="26" fill="var(--shell)" />
              <path
                d="M4 -32 m0 -4 a4 4 0 1 1 -4 4 a8 8 0 0 1 8 -8 a12 12 0 0 1 12 12 a16 16 0 0 1 -16 16 a20 20 0 0 1 -20 -20 a22 22 0 0 1 22 -22"
                fill="none"
                stroke="var(--shell-line)"
                strokeWidth="2.6"
                strokeLinecap="round"
              />
              <path d="M-14 -46 Q-6 -55 6 -56" fill="none" stroke="#ffffff" strokeOpacity="0.35" strokeWidth="3" strokeLinecap="round" />
              {/* Flag on a little pole stuck in the shell */}
              <path d="M10 -56 V-90" stroke="var(--pole)" strokeWidth="2.2" strokeLinecap="round" />
              <g transform="translate(11 -89)">
                <path className={styles.flag} d="M0 0 C8 -2 14 3 22 1 L22 15 C14 17 8 12 0 14 Z" fill="var(--flag)" />
              </g>
            </g>
          </g>
        </>
      }
    />
  );
}
