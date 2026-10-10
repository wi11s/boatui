// <EmptyBasket>: an empty wicker shopping basket with a spotted cloth tucked over its rim. A
// ladybird walks up and over the handle and back, and a butterfly flutters round it. For an empty
// cart or bag. Animated.

import { EmptyStateFrame, type EmptyStateProps } from './empty-state';
import styles from './empty-basket.module.css';

export const emptyBasketTheme = {
  wicker: '#e0ae6a',
  wickerShade: '#b9803f',
  inside: '#7a5236',
  cloth: '#e4573d',
  clothDots: '#ffffff',
  ladybird: '#e4573d',
  butterfly: '#7aa7e0',
  spots: '#2b2b33',
};
export type EmptyBasketTheme = typeof emptyBasketTheme;

// The basket's mouth is an ellipse; the handle is a half circle on the same centre, so the
// ladybird can walk along it by rotating about that centre.
const CX = 120;
const RIM_Y = 98;
const RIM_RX = 62;
const RIM_RY = 12;
const HANDLE_R = 56;

/** y of the front edge of the rim at x. */
const rimFront = (x: number) => RIM_Y + RIM_RY * Math.sqrt(Math.max(0, 1 - ((x - CX) / RIM_RX) ** 2));
const BOTTOM = 154;
/** x of the basket's side at height y (it tapers toward the bottom). */
const side = (y: number, dir: -1 | 1) => CX + dir * (RIM_RX - ((y - RIM_Y) / (BOTTOM - RIM_Y)) * 12);

const SLATS = [72, 88, 104, 120, 136, 152, 168];
const BANDS = [114, 128, 142];

/** An empty basket with a ladybird walking over the handle: for an empty cart. */
export function EmptyBasket(props: EmptyStateProps<EmptyBasketTheme>) {
  const front = `M${CX - RIM_RX} ${RIM_Y} A${RIM_RX} ${RIM_RY} 0 0 0 ${CX + RIM_RX} ${RIM_Y}`;
  return (
    <EmptyStateFrame
      {...props}
      defaultTheme={emptyBasketTheme}
      art={
        <>
          <ellipse cx={CX} cy={BOTTOM + 3} rx="72" ry="6" fill="var(--wicker-shade)" opacity="0.25" />

          {/* The empty inside, then the back of the rim */}
          <ellipse cx={CX} cy={RIM_Y} rx={RIM_RX} ry={RIM_RY} fill="var(--inside)" />
          <path d={`M${CX - RIM_RX} ${RIM_Y} A${RIM_RX} ${RIM_RY} 0 0 1 ${CX + RIM_RX} ${RIM_Y}`} fill="none" stroke="var(--wicker-shade)" strokeWidth="5" />

          {/* Handle: wicker wrapped with a darker cord */}
          <path d={`M${CX - HANDLE_R} ${RIM_Y} A${HANDLE_R} ${HANDLE_R} 0 0 1 ${CX + HANDLE_R} ${RIM_Y}`} fill="none" stroke="var(--wicker)" strokeWidth="7" />
          <path
            d={`M${CX - HANDLE_R} ${RIM_Y} A${HANDLE_R} ${HANDLE_R} 0 0 1 ${CX + HANDLE_R} ${RIM_Y}`}
            fill="none"
            stroke="var(--wicker-shade)"
            strokeWidth="7"
            strokeDasharray="2 6"
          />

          {/* Body: tapered, with woven slats and bands */}
          <path
            d={`${front} L${side(BOTTOM, 1)} ${BOTTOM - 4} Q${side(BOTTOM, 1) - 2} ${BOTTOM} ${side(BOTTOM, 1) - 8} ${BOTTOM} H${side(BOTTOM, -1) + 8} Q${side(BOTTOM, -1) + 2} ${BOTTOM} ${side(BOTTOM, -1)} ${BOTTOM - 4} Z`}
            fill="var(--wicker)"
          />
          <g fill="none" stroke="var(--wicker-shade)" strokeLinecap="round">
            {SLATS.map(x => {
              const bottomX = CX + (x - CX) * ((RIM_RX - 12) / RIM_RX);
              return <path key={x} d={`M${x} ${rimFront(x).toFixed(1)} L${bottomX.toFixed(1)} ${BOTTOM - 2}`} strokeWidth="2" opacity="0.55" />;
            })}
            {BANDS.map(y => (
              <path
                key={y}
                d={`M${side(y, -1).toFixed(1)} ${y} Q${CX} ${y + RIM_RY * 2} ${side(y, 1).toFixed(1)} ${y}`}
                strokeWidth="3"
                opacity="0.7"
              />
            ))}
          </g>
          <path d={front} fill="none" stroke="var(--wicker-shade)" strokeWidth="7" strokeLinecap="round" />

          {/* A spotted cloth tucked over the front rim, its corner stirring in the breeze */}
          <g className={styles.cloth}>
            <path d="M74 104 Q92 110 112 109 Q104 122 92 134 Q86 124 74 104 Z" fill="var(--cloth)" />
            <g fill="var(--cloth-dots)">
              <circle cx="84" cy="110" r="1.8" />
              <circle cx="97" cy="113" r="1.8" />
              <circle cx="92" cy="122" r="1.8" />
              <circle cx="104" cy="110" r="1.5" />
            </g>
          </g>

          {/* Ladybird walking up and over the handle and back */}
          <g transform={`translate(${CX} ${RIM_Y})`}>
            <g className={styles.walk}>
              <g transform={`translate(0 ${-HANDLE_R - 5})`}>
                <g className={styles.turn}>
                  <ellipse cx="5" cy="0" rx="2.8" ry="2.6" fill="var(--spots)" />
                  <ellipse cx="0" cy="0" rx="6" ry="4.6" fill="var(--ladybird)" />
                  <path d="M0 -4.6 V4.6" stroke="var(--spots)" strokeWidth="0.8" />
                  <g fill="var(--spots)">
                    <circle cx="-2.6" cy="-1.8" r="1.1" />
                    <circle cx="2" cy="-2.2" r="0.9" />
                    <circle cx="-1.6" cy="2" r="0.9" />
                    <circle cx="2.4" cy="1.8" r="1.1" />
                  </g>
                </g>
              </g>
            </g>
          </g>

          {/* Butterfly fluttering round the basket */}
          <g className={styles.flutter}>
            <g transform="scale(1.6)">
              <g className={styles.wings}>
                <path d="M0 0 C-8 -10 -14 -4 -10 2 C-8 5 -3 4 0 0 Z" fill="var(--butterfly)" />
                <path d="M0 0 C8 -10 14 -4 10 2 C8 5 3 4 0 0 Z" fill="var(--butterfly)" />
                <path d="M0 0 C-6 4 -8 9 -3 9 Z M0 0 C6 4 8 9 3 9 Z" fill="var(--butterfly)" opacity="0.7" />
              </g>
              <path d="M0 -3 V5" stroke="var(--spots)" strokeWidth="1.4" strokeLinecap="round" />
            </g>
          </g>
        </>
      }
    />
  );
}
