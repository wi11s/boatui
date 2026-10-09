// <EmptyNap>: a cat curled up asleep on a cushion, breathing slowly, with Zs drifting up.
// For "nothing here yet" screens. Animated.

import { EmptyStateFrame, type EmptyStateProps } from './empty-state';
import styles from './empty-nap.module.css';

export const emptyNapTheme = {
  cat: '#f2a65a',
  stripes: '#d9823b',
  cushion: '#9cc9e3',
  cushionShade: '#7fb2d2',
  blush: '#f7b7c8',
  ink: '#4a3a33',
  zzz: '#8a97a0',
};
export type EmptyNapTheme = typeof emptyNapTheme;

/** A cat curled up asleep on a cushion, for "nothing here yet" screens. */
export function EmptyNap(props: EmptyStateProps<EmptyNapTheme>) {
  return (
    <EmptyStateFrame
      {...props}
      defaultTheme={emptyNapTheme}
      art={
        <>
          {/* Cushion */}
          <ellipse cx="120" cy="150" rx="84" ry="16" fill="var(--cushion-shade)" />
          <ellipse cx="120" cy="143" rx="84" ry="16" fill="var(--cushion)" />
          <circle cx="44" cy="141" r="5" fill="var(--cushion-shade)" />
          <circle cx="196" cy="141" r="5" fill="var(--cushion-shade)" />

          {/* Tail curls around the front, hinged at the hip */}
          <path
            className={styles.tail}
            d="M164 128 C186 132 188 150 160 152 C130 154 104 152 92 148"
            fill="none"
            stroke="var(--cat)"
            strokeWidth="11"
            strokeLinecap="round"
          />

          <g className={styles.breathe}>
            {/* Body */}
            <ellipse cx="128" cy="122" rx="50" ry="26" fill="var(--cat)" />
            <g fill="none" stroke="var(--stripes)" strokeWidth="4" strokeLinecap="round">
              <path d="M118 98 C122 104 122 110 118 116" />
              <path d="M134 97 C138 103 138 109 134 115" />
              <path d="M150 100 C154 106 154 112 150 118" />
            </g>
            {/* Head resting on the front paws */}
            <path className={styles.ear} d="M70 98 L74 78 L88 92 Z" fill="var(--cat)" />
            <path d="M96 94 L106 76 L112 96 Z" fill="var(--cat)" />
            <path d="M74 95 L76 84 L84 92 Z" fill="var(--blush)" />
            <ellipse cx="90" cy="114" rx="26" ry="22" fill="var(--cat)" />
            <ellipse cx="86" cy="134" rx="16" ry="7" fill="var(--cat)" />
            <g fill="none" stroke="var(--ink)" strokeWidth="2.2" strokeLinecap="round">
              <path d="M76 112 Q80 116 84 112" />
              <path d="M94 112 Q98 116 102 112" />
              <path d="M87 121 Q89 123 91 121" />
            </g>
            <ellipse cx="74" cy="120" rx="5" ry="3" fill="var(--blush)" opacity="0.8" />
            <ellipse cx="105" cy="120" rx="5" ry="3" fill="var(--blush)" opacity="0.8" />
          </g>

          {/* Zs drifting up from the head */}
          <g fill="none" stroke="var(--zzz)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            {[0, 1.2, 2.4].map((delay, i) => (
              // Position on the group; the path's own transform is the CSS float.
              <g key={i} transform={`translate(${108 + i * 4} ${78 - i * 2})`}>
                <path
                  className={styles.z}
                  style={{ animationDelay: `${-delay}s` }}
                  d={`M0 0 H${8 + i * 2} L0 ${8 + i * 2} H${8 + i * 2}`}
                />
              </g>
            ))}
          </g>

          <g fill="var(--zzz)">
            <path className={styles.star} d="M188 40 l2 5 5 2 -5 2 -2 5 -2 -5 -5 -2 5 -2 Z" />
            <path className={styles.star} style={{ animationDelay: '-1.2s' }} d="M206 70 l1.4 3.5 3.5 1.4 -3.5 1.4 -1.4 3.5 -1.4 -3.5 -3.5 -1.4 3.5 -1.4 Z" />
          </g>
        </>
      }
    />
  );
}
