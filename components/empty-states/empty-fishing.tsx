// <EmptyFishing>: a fishing line dropped in a quiet pond. The bobber bobs and sends out rings while
// fish glide right past it. For "no results" and empty search screens. Animated.

import { useId } from 'react';
import { EmptyStateFrame, type EmptyStateProps } from './empty-state';
import styles from './empty-fishing.module.css';

export const emptyFishingTheme = {
  water: '#9cc9e3',
  waterDeep: '#7fb2d2',
  shore: '#b9dca8',
  reeds: '#6cbf6a',
  cattail: '#9a6b45',
  rod: '#9a6b45',
  line: '#8a97a0',
  bobber: '#e4573d',
  lily: '#6cbf6a',
  flower: '#f7b7c8',
  fish: '#5d97b8',
};
export type EmptyFishingTheme = typeof emptyFishingTheme;

/** A fishing line in a quiet pond, fish swimming past the bobber: for "no results". */
export function EmptyFishing(props: EmptyStateProps<EmptyFishingTheme>) {
  const pond = `qs${useId().replace(/[^a-zA-Z0-9_-]/g, '')}pond`;
  return (
    <EmptyStateFrame
      {...props}
      defaultTheme={emptyFishingTheme}
      art={
        <>
          <defs>
            <clipPath id={pond}>
              <ellipse cx="124" cy="134" rx="98" ry="32" />
            </clipPath>
          </defs>

          {/* Pond on a grassy bank */}
          <ellipse cx="124" cy="137" rx="110" ry="38" fill="var(--shore)" />
          <ellipse cx="124" cy="134" rx="98" ry="32" fill="var(--water)" />

          {/* Fish glide under the surface, ignoring the hook */}
          <g clipPath={`url(#${pond})`} fill="var(--fish)" opacity="0.55">
            <g className={styles.fish}>
              <g className={styles.wag}>
                <path d="M0 0 C6 -6 16 -6 22 0 C16 6 6 6 0 0 Z M0 0 L-8 -6 L-6 0 L-8 6 Z" />
              </g>
            </g>
            <g className={`${styles.fish} ${styles.fishBack}`}>
              <g className={styles.wag}>
                <path d="M0 0 C5 -4.5 12 -4.5 17 0 C12 4.5 5 4.5 0 0 Z M0 0 L-6 -4.5 L-4.5 0 L-6 4.5 Z" />
              </g>
            </g>
            <ellipse cx="124" cy="152" rx="60" ry="8" fill="var(--water-deep)" opacity="0.5" />
          </g>

          {/* Lily pad and flower */}
          <path d="M44 132 a16 6 0 1 0 14 -5 L50 132 Z" fill="var(--lily)" />
          <g fill="var(--flower)">
            <ellipse cx="54" cy="128" rx="3" ry="5" transform="rotate(-30 54 131)" />
            <ellipse cx="54" cy="128" rx="3" ry="5" transform="rotate(30 54 131)" />
            <ellipse cx="54" cy="127" rx="3" ry="5" />
          </g>

          {/* Rod from the top left, line down to the bobber */}
          <path d="M6 58 L66 18" stroke="var(--rod)" strokeWidth="4" strokeLinecap="round" />
          <circle cx="20" cy="49" r="4" fill="none" stroke="var(--rod)" strokeWidth="2" />
          <path d="M66 18 Q108 30 132 115" fill="none" stroke="var(--line)" strokeWidth="1.2" />

          {/* Rings spreading from the bobber */}
          <g fill="none" stroke="#ffffff" strokeWidth="1.6">
            {[0, 1, 2].map(i => (
              <ellipse key={i} className={styles.ring} style={{ animationDelay: `${-i * 1.1}s` }} cx="132" cy="128" rx="12" ry="3.5" />
            ))}
          </g>

          <g className={styles.bob}>
            <path d="M132 114 V120" stroke="var(--line)" strokeWidth="1.6" strokeLinecap="round" />
            <path d="M124.5 127 a7.5 7.5 0 0 1 15 0 Z" fill="#ffffff" />
            <path d="M124.5 127 a7.5 6 0 0 0 15 0 Z" fill="var(--bobber)" />
            <path d="M124.5 127 H139.5" stroke="var(--bobber)" strokeWidth="1" />
          </g>

          {/* Reeds and cattails swaying at the right */}
          <g className={styles.reeds}>
            <g fill="none" stroke="var(--reeds)" strokeWidth="2.6" strokeLinecap="round">
              <path d="M206 140 Q204 118 208 92" />
              <path d="M214 141 Q216 120 214 102" />
              <path d="M199 141 Q194 124 192 110" />
              <path d="M220 140 Q226 126 230 118" />
            </g>
            <rect x="204.5" y="90" width="6" height="16" rx="3" fill="var(--cattail)" />
            <rect x="211" y="100" width="5.5" height="13" rx="2.75" fill="var(--cattail)" />
          </g>
        </>
      }
    />
  );
}
