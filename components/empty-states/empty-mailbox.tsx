// <EmptyMailbox>: a mailbox on a post with its door hanging open and nothing inside, flag down.
// A small bird perched on top bobs its head and chirps. For inbox zero and "no messages". Animated.

import { EmptyStateFrame, type EmptyStateProps } from './empty-state';
import styles from './empty-mailbox.module.css';

export const emptyMailboxTheme = {
  box: '#9cc9e3',
  boxShade: '#7fb2d2',
  inside: '#3d4a57',
  flag: '#e4573d',
  post: '#9a6b45',
  grass: '#b9dca8',
  bird: '#f2a65a',
  birdWing: '#d9823b',
  birdInk: '#4a3a33',
  notes: '#8a97a0',
};
export type EmptyMailboxTheme = typeof emptyMailboxTheme;

/** An open, empty mailbox with a bird chirping on top: for inbox zero. */
export function EmptyMailbox(props: EmptyStateProps<EmptyMailboxTheme>) {
  return (
    <EmptyStateFrame
      {...props}
      defaultTheme={emptyMailboxTheme}
      art={
        <>
          <ellipse cx="120" cy="164" rx="86" ry="9" fill="var(--grass)" />
          <g className={styles.tufts} fill="none" stroke="var(--grass)" strokeWidth="2.4" strokeLinecap="round">
            <path d="M58 162 q-2 -8 -6 -12 M62 162 q0 -9 3 -13 M168 163 q1 -9 -2 -13 M173 163 q3 -8 7 -11" />
          </g>

          {/* Post */}
          <rect x="116" y="92" width="12" height="72" rx="2" fill="var(--post)" />
          <rect x="108" y="90" width="28" height="6" rx="2" fill="var(--post)" />

          {/* Body: a rounded tunnel seen from the side, its open end facing left */}
          <path d="M88 50 H150 Q170 50 170 70 V92 H88 Z" fill="var(--box-shade)" />
          <path d="M100 50 H150 Q164 50 166 64" fill="none" stroke="#ffffff" strokeOpacity="0.35" strokeWidth="3" strokeLinecap="round" />

          {/* Flag: down, so there's no mail */}
          <rect x="152" y="74" width="4" height="4" rx="1" fill="var(--inside)" />
          <rect x="154" y="74.5" width="30" height="3" rx="1.5" fill="var(--flag)" />
          <rect x="176" y="77" width="9" height="12" rx="1.5" fill="var(--flag)" />

          {/* Front: the open arch with an empty, dark inside */}
          <path d="M68 92 V68 A18 18 0 0 1 104 68 V92 Z" fill="var(--box)" />
          <path d="M73 91 V69 A13 13 0 0 1 99 69 V91 Z" fill="var(--inside)" />
          <path d="M73 88 H99 V91 H73 Z" fill="#000000" opacity="0.2" />

          {/* Door hanging open from its bottom hinge, swinging slightly */}
          <g className={styles.door}>
            <path d="M68 92 H104 V108 A18 18 0 0 1 68 108 Z" fill="var(--box)" />
            <path d="M80 104 H92" stroke="var(--box-shade)" strokeWidth="3" strokeLinecap="round" />
          </g>

          {/* Bird on the roof */}
          <g transform="translate(132 50)">
            <g className={styles.hop}>
              <path d="M-12 -8 L-20 -4 L-12 -2 Z" fill="var(--bird-wing)" />
              <ellipse cx="-3" cy="-8" rx="11" ry="8" fill="var(--bird)" />
              <path d="M-9 -9 Q-3 -3 3 -8" fill="var(--bird-wing)" />
              <g className={styles.head}>
                <circle cx="7" cy="-16" r="6.5" fill="var(--bird)" />
                <circle cx="9" cy="-17" r="1.3" fill="var(--bird-ink)" />
                <path d="M13 -16.5 L18 -15 L13 -13.5 Z" fill="var(--flag)" />
              </g>
              <path d="M-4 0 V2 M1 0 V2" stroke="var(--bird-ink)" strokeWidth="1.4" strokeLinecap="round" />
            </g>
          </g>

          {/* Chirps */}
          <g fill="var(--notes)">
            <g className={styles.note}>
              <path d="M160 28 v-10 l7 -2 v10" fill="none" stroke="var(--notes)" strokeWidth="1.6" />
              <ellipse cx="158.5" cy="28.5" rx="2.6" ry="2" />
              <ellipse cx="165.5" cy="26.5" rx="2.6" ry="2" />
            </g>
            <g className={`${styles.note} ${styles.note2}`}>
              <path d="M150 20 v-9" fill="none" stroke="var(--notes)" strokeWidth="1.6" />
              <ellipse cx="148.5" cy="20.5" rx="2.4" ry="1.9" />
            </g>
          </g>
        </>
      }
    />
  );
}
