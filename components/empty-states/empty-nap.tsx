// <EmptyNap>: a cat curled up asleep on a cushion, breathing slowly, with Zs drifting up.
// Its tail is wrapped round its front and the tip flicks now and then; an ear twitches.
// For "nothing here yet" screens. Animated.

import { EmptyStateFrame, type EmptyStateProps } from './empty-state';
import styles from './empty-nap.module.css';

export const emptyNapTheme = {
  cat: '#f2a65a',
  stripes: '#d9823b',
  cushion: '#9cc9e3',
  cushionShade: '#7fb2d2',
  blush: '#f7b7c8',
  face: '#4a3a33',
  yarn: '#e4708a',
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
          {/* Cushion, with a seam and button tufts */}
          <ellipse cx="118" cy="151" rx="86" ry="17" fill="var(--cushion-shade)" />
          <ellipse cx="118" cy="144" rx="86" ry="16" fill="var(--cushion)" />
          <path d="M42 146 Q118 166 194 146" fill="none" stroke="var(--cushion-shade)" strokeWidth="1.5" strokeDasharray="3 4" />
          <circle cx="40" cy="142" r="5" fill="var(--cushion-shade)" />
          <circle cx="196" cy="142" r="5" fill="var(--cushion-shade)" />

          {/* Ball of yarn on the floor, its loose end trailing to the cushion */}
          <path d="M206 152 C214 164 196 168 188 160" fill="none" stroke="var(--yarn)" strokeWidth="1.8" strokeLinecap="round" />
          <circle cx="214" cy="146" r="11" fill="var(--yarn)" />
          <g fill="none" stroke="#ffffff" strokeOpacity="0.45" strokeWidth="1.4" strokeLinecap="round">
            <path d="M205 141 Q214 146 222 139" />
            <path d="M206 150 Q214 144 224 149" />
            <path d="M210 136 Q208 146 213 156" />
          </g>

          <g className={styles.breathe}>
            {/* Body */}
            <ellipse cx="130" cy="123" rx="52" ry="27" fill="var(--cat)" />
            <g fill="none" stroke="var(--stripes)" strokeWidth="4" strokeLinecap="round">
              <path d="M122 98 C126 104 126 110 122 116" />
              <path d="M138 97 C142 103 142 109 138 115" />
              <path d="M154 100 C158 106 158 112 154 118" />
            </g>

            {/* Ears first, so the head covers their bases and they grow out of it */}
            <g className={styles.ear}>
              <path d="M64 104 Q63 86 68 76 Q74 80 84 93 Z" fill="var(--cat)" />
              <path d="M68 96 Q68 87 70 82 Q74 86 78 93 Z" fill="var(--blush)" />
            </g>
            <path d="M92 92 Q99 82 105 74 Q110 84 110 102 Z" fill="var(--cat)" />
            <path d="M97 92 Q101 86 104 81 Q106 88 106 96 Z" fill="var(--blush)" />

            {/* Head resting low, between the paws */}
            <ellipse cx="88" cy="114" rx="28" ry="23" fill="var(--cat)" />
            <g fill="none" stroke="var(--stripes)" strokeWidth="2.5" strokeLinecap="round">
              <path d="M82 94 V100" />
              <path d="M88 93 V100" />
              <path d="M94 94 V100" />
            </g>
            <g fill="none" stroke="var(--face)" strokeWidth="2.2" strokeLinecap="round">
              <path d="M73 113 Q77 117 81 113" />
              <path d="M94 113 Q98 117 102 113" />
              <path d="M85 122 Q87.5 124.5 90 122" />
            </g>
            <path d="M86 119.5 H89 L87.5 121 Z" fill="var(--face)" />
            <ellipse cx="71" cy="121" rx="5" ry="3" fill="var(--blush)" opacity="0.8" />
            <ellipse cx="104" cy="121" rx="5" ry="3" fill="var(--blush)" opacity="0.8" />
            <g fill="none" stroke="var(--face)" strokeOpacity="0.35" strokeWidth="1" strokeLinecap="round">
              <path d="M66 118 L56 116 M66 122 L56 124" />
              <path d="M109 118 L119 116 M109 122 L119 124" />
            </g>

            {/* Front paws tucked under the chin */}
            <ellipse cx="78" cy="137" rx="10" ry="6" fill="var(--cat)" />
            <ellipse cx="99" cy="138" rx="10" ry="6" fill="var(--cat)" />
            <g fill="none" stroke="var(--stripes)" strokeWidth="1.2" strokeLinecap="round">
              <path d="M75 139 v-2.5 M79 139.5 v-2.5" />
              <path d="M96 140 v-2.5 M100 140.5 v-2.5" />
            </g>

            {/* Tail wrapped round the front; only the tip moves. A faint darker edge separates it from the body. */}
            <g fill="none" strokeLinecap="round">
              <path d="M178 128 C192 138 184 152 162 152 C146 152 132 151 120 149" stroke="var(--stripes)" strokeOpacity="0.45" strokeWidth="13" />
              <path d="M178 128 C192 138 184 152 162 152 C146 152 132 151 120 149" stroke="var(--cat)" strokeWidth="11" />
              <path d="M150 146.5 v11 M164 146.5 v11" stroke="var(--stripes)" strokeWidth="3" />
            </g>
            <g className={styles.tip} fill="none" strokeLinecap="round">
              <path d="M121 149 C114 148 110 147 105 143" stroke="var(--stripes)" strokeOpacity="0.45" strokeWidth="12" />
              <path d="M121 149 C114 148 110 147 105 143" stroke="var(--cat)" strokeWidth="10" />
              <path d="M113 143.5 l-2 9 M107 140 l-3 7" stroke="var(--stripes)" strokeWidth="2.6" />
            </g>
          </g>

          {/* Zs drifting up from the head */}
          <g fill="none" stroke="var(--zzz)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            {[0, 1.2, 2.4].map((delay, i) => (
              // Position on the group; the path's own transform is the CSS float.
              <g key={i} transform={`translate(${112 + i * 4} ${74 - i * 2})`}>
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
