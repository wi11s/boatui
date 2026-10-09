// <EmptySprout>: a seedling in a terracotta pot being watered. Drops fall from a tilted watering
// can and ripple the soil, and the sprout's two leaves sway in the sun. For "create your first…"
// and getting-started screens. Animated.

import { EmptyStateFrame, type EmptyStateProps } from './empty-state';
import styles from './empty-sprout.module.css';

export const emptySproutTheme = {
  pot: '#d9825b',
  potShade: '#b8673f',
  soil: '#6b4a3a',
  leaf: '#6cbf6a',
  leafShade: '#4f9a58',
  can: '#9cc9e3',
  canShade: '#7fb2d2',
  water: '#7fb6d4',
  sun: '#f2c14e',
};
export type EmptySproutTheme = typeof emptySproutTheme;

/** A seedling in a pot being watered: for getting-started screens. */
export function EmptySprout(props: EmptyStateProps<EmptySproutTheme>) {
  return (
    <EmptyStateFrame
      {...props}
      defaultTheme={emptySproutTheme}
      art={
        <>
          {/* Sun with slowly turning rays */}
          <g transform="translate(196 40)">
            <g className={styles.rays} stroke="var(--sun)" strokeWidth="2.4" strokeLinecap="round">
              {[0, 45, 90, 135, 180, 225, 270, 315].map(a => (
                <path key={a} d="M0 -19 V-25" transform={`rotate(${a})`} />
              ))}
            </g>
            <circle r="13" fill="var(--sun)" />
          </g>

          {/* Watering can, tipped toward the pot */}
          <g transform="translate(62 46) rotate(24)">
            <path d="M22 -2 L50 -16 L52 -12 L26 4 Z" fill="var(--can-shade)" />
            <ellipse cx="51" cy="-14" rx="3" ry="5" transform="rotate(-27 51 -14)" fill="var(--can-shade)" />
            <path d="M-20 -14 H22 V18 Q22 24 16 24 H-14 Q-20 24 -20 18 Z" fill="var(--can)" />
            <path d="M-16 -14 Q-2 -34 14 -14" fill="none" stroke="var(--can-shade)" strokeWidth="4" strokeLinecap="round" />
            <path d="M-20 -6 H22" stroke="var(--can-shade)" strokeWidth="2" />
          </g>

          {/* Drops from the spout to the soil, staggered */}
          <g fill="var(--water)">
            {[0, 1, 2].map(i => (
              // Position on the group; the path's own transform is the CSS fall.
              <g key={i} transform={`translate(${113 + i * 3} 56)`}>
                <path className={styles.drop} style={{ animationDelay: `${-i * 0.5}s` }} d="M0 -6 Q4.5 0 0 4 Q-4.5 0 0 -6 Z" />
              </g>
            ))}
          </g>

          {/* Pot and soil */}
          <ellipse cx="120" cy="166" rx="40" ry="5" fill="#000" opacity="0.08" />
          <path d="M92 124 H148 L141 164 H99 Z" fill="var(--pot)" />
          <path d="M120 124 H148 L141 164 H120 Z" fill="var(--pot-shade)" opacity="0.35" />
          <rect x="88" y="114" width="64" height="12" rx="3" fill="var(--pot)" />
          <ellipse cx="120" cy="116" rx="28" ry="4" fill="var(--soil)" />
          <ellipse className={styles.ripple} cx="112" cy="116" rx="8" ry="1.6" fill="none" stroke="var(--water)" strokeWidth="1.2" />

          {/* Sprout: a curved stem and two leaves that sway from the base */}
          <g className={styles.sprout}>
            <path d="M120 116 C120 104 118 96 121 86" fill="none" stroke="var(--leaf-shade)" strokeWidth="3" strokeLinecap="round" />
            <g className={styles.leftLeaf}>
              <path d="M120 92 C110 80 96 82 92 90 C100 96 112 96 120 92 Z" fill="var(--leaf)" />
              <path d="M120 92 Q106 88 96 89" fill="none" stroke="var(--leaf-shade)" strokeWidth="1.2" />
            </g>
            <g className={styles.rightLeaf}>
              <path d="M121 86 C130 72 146 72 150 80 C142 88 130 90 121 86 Z" fill="var(--leaf)" />
              <path d="M121 86 Q136 80 146 79" fill="none" stroke="var(--leaf-shade)" strokeWidth="1.2" />
            </g>
          </g>
        </>
      }
    />
  );
}
