// <EmptyHammock>: someone dozing in a hammock strung between two palms, a hat over their face,
// swinging gently while the fronds stir. For "all caught up", inbox zero and "nothing to do".
// Animated.

import { EmptyStateFrame, type EmptyStateProps } from './empty-state';
import styles from './empty-hammock.module.css';

export const emptyHammockTheme = {
  trunk: '#9a6b45',
  fronds: '#6cbf6a',
  frondsShade: '#4f9a58',
  hammock: '#e4573d',
  stripe: '#f2c14e',
  shirt: '#9cc9e3',
  skin: '#f1c7a3',
  hat: '#e8c27a',
  sand: '#f0d9a6',
};
export type EmptyHammockTheme = typeof emptyHammockTheme;

function Palm({ x, lean, flip }: { x: number; lean: number; flip?: boolean }) {
  return (
    <g transform={`translate(${x} 164)${flip ? ' scale(-1 1)' : ''}`}>
      <path d={`M-4 0 Q${lean * 0.4} -60 ${lean} -118 L${lean + 6} -118 Q${lean * 0.4 + 6} -60 4 0 Z`} fill="var(--trunk)" />
      <g transform={`translate(${lean + 3} -118)`}>
        <g className={styles.fronds}>
          <g fill="var(--fronds-shade)">
            <path d="M0 0 C-12 -14 -32 -12 -42 2 C-28 -4 -14 -2 0 0 Z" />
            <path d="M0 0 C14 -16 34 -12 42 2 C28 -4 14 -2 0 0 Z" />
          </g>
          <g fill="var(--fronds)">
            <path d="M0 0 C-6 -18 -24 -26 -38 -18 C-22 -16 -10 -10 0 0 Z" />
            <path d="M0 0 C6 -18 24 -26 38 -18 C22 -16 10 -10 0 0 Z" />
            <path d="M0 0 C-14 4 -28 16 -30 28 C-20 18 -10 10 0 0 Z" />
            <path d="M0 0 C14 4 28 16 30 28 C20 18 10 10 0 0 Z" />
          </g>
          <circle cx="-2" cy="4" r="3" fill="var(--trunk)" />
          <circle cx="3" cy="5" r="3" fill="var(--trunk)" />
        </g>
      </g>
    </g>
  );
}

/** Someone dozing in a hammock between two palms: for "all caught up". */
export function EmptyHammock(props: EmptyStateProps<EmptyHammockTheme>) {
  return (
    <EmptyStateFrame
      {...props}
      defaultTheme={emptyHammockTheme}
      art={
        <>
          <ellipse cx="120" cy="166" rx="104" ry="9" fill="var(--sand)" />
          <Palm x={30} lean={6} />
          <Palm x={210} lean={6} flip />

          {/* The hammock swings from its two tie points; everything in it swings too */}
          <g className={styles.swing}>
            <path d="M40 78 L66 108 M200 78 L174 108" stroke="#8a6a4a" strokeWidth="1.4" />
            <path d="M64 104 Q120 150 176 104 L176 110 Q120 158 64 110 Z" fill="var(--hammock)" />
            <path d="M80 118 Q120 146 160 118" fill="none" stroke="var(--stripe)" strokeWidth="2.4" />

            {/* Sleeper: head on the left under a hat, feet crossed on the right */}
            <path d="M84 112 Q120 132 156 108 L158 102 Q120 124 86 104 Z" fill="var(--shirt)" />
            <circle cx="80" cy="102" r="8" fill="var(--skin)" />
            <g className={styles.breathe}>
              <path d="M68 100 Q80 82 94 98 Z" fill="var(--hat)" />
              <path d="M64 100 H98" stroke="var(--hat)" strokeWidth="3" strokeLinecap="round" />
            </g>
            {/* Legs crossed at the ankle, shoes over the edge */}
            <path d="M150 108 L166 96 M152 112 L168 102" stroke="#5b7a93" strokeWidth="5" strokeLinecap="round" />
            <ellipse cx="169" cy="94" rx="4.5" ry="3" transform="rotate(-30 169 94)" fill="#3d4a57" />
            <ellipse cx="171" cy="100" rx="4.5" ry="3" transform="rotate(-30 171 100)" fill="#3d4a57" />
          </g>

          {/* A drink waiting on the sand */}
          <g transform="translate(120 160)">
            <path d="M-5 0 L-6 -14 H6 L5 0 Z" fill="#f7d26a" opacity="0.9" />
            <path d="M2 -14 L6 -24" stroke="var(--hammock)" strokeWidth="1.4" strokeLinecap="round" />
            <circle cx="-4" cy="-15" r="3" fill="var(--fronds)" />
          </g>

          {/* Zs, small and slow */}
          <g fill="none" stroke="#8a97a0" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            {[0, 1.6].map((delay, i) => (
              <g key={i} transform={`translate(${92 + i * 6} ${82 - i * 4})`}>
                <path className={styles.z} style={{ animationDelay: `${-delay}s` }} d={`M0 0 H${6 + i * 2} L0 ${6 + i * 2} H${6 + i * 2}`} />
              </g>
            ))}
          </g>
        </>
      }
    />
  );
}
