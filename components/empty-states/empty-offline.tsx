// <EmptyOffline>: a tin-can telephone whose string has gone slack. Dots leave one can and fade
// out before they reach the other. For offline, "can't connect" and lost-connection screens. Animated.

import { EmptyStateFrame, type EmptyStateProps } from './empty-state';
import styles from './empty-offline.module.css';

export const emptyOfflineTheme = {
  can: '#c9d6df',
  canShade: '#a7b4bd',
  label: '#9cc9e3',
  labelAlt: '#f2c14e',
  string: '#9a6b45',
  ground: '#e7eef3',
  dots: '#7fb2d2',
};
export type EmptyOfflineTheme = typeof emptyOfflineTheme;

function Can({ x, label, className }: { x: number; label: string; className?: string }) {
  return (
    <g className={className}>
      <path d={`M${x} 104 V146 a18 5 0 0 0 36 0 V104 Z`} fill="var(--can)" />
      <path d={`M${x} 116 H${x + 36} V132 H${x} Z`} fill={label} />
      <g fill="none" stroke="var(--can-shade)" strokeWidth="1.4">
        <path d={`M${x} 110 a18 5 0 0 0 36 0`} />
        <path d={`M${x} 138 a18 5 0 0 0 36 0`} />
      </g>
      <ellipse cx={x + 18} cy="104" rx="18" ry="5" fill="var(--can-shade)" />
      <ellipse cx={x + 18} cy="104.6" rx="15" ry="3.6" fill="#ffffff" opacity="0.25" />
    </g>
  );
}

/** A tin-can telephone with a slack string: for offline screens. */
export function EmptyOffline(props: EmptyStateProps<EmptyOfflineTheme>) {
  return (
    <EmptyStateFrame
      {...props}
      defaultTheme={emptyOfflineTheme}
      art={
        <>
          <ellipse cx="120" cy="154" rx="96" ry="10" fill="var(--ground)" />

          {/* Slack string: sagging to the ground and swaying, its ends fixed to the cans */}
          <g className={styles.string}>
            <path d="M72 140 C96 166 144 166 168 140" fill="none" stroke="var(--string)" strokeWidth="2" strokeLinecap="round" />
          </g>

          <Can x={36} label="var(--label)" className={styles.speaker} />
          <Can x={168} label="var(--label-alt)" />

          {/* Dots leave the left can and fade before reaching the right one */}
          <g fill="var(--dots)">
            {[0, 1, 2].map(i => (
              <circle key={i} className={styles.dot} style={{ animationDelay: `${i * 0.35}s` }} cx="58" cy="90" r="4" />
            ))}
          </g>

          {/* A question mark hangs over the right can */}
          <g className={styles.question} fill="none" stroke="var(--can-shade)" strokeWidth="3" strokeLinecap="round">
            <path d="M180 74 q0 -8 6 -8 q6 0 6 6 q0 5 -6 7 v4" />
            <circle cx="186" cy="90" r="0.6" />
          </g>
        </>
      }
    />
  );
}
