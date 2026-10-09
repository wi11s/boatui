// <WavesBackground>: a calm sea rolling along the bottom edge under an open sky: four wave layers
// scroll at different speeds, with foam glints on the crests. Good behind footers and heroes. Animated.

import { BackgroundFrame, type BackgroundProps } from './background';
import styles from './waves-background.module.css';

export const wavesTheme = {
  skyTop: '#d7ecf7',
  skyBottom: '#f6fbfd',
  wave1: '#a9d4ea',
  wave2: '#7fbad9',
  wave3: '#4f97bf',
  wave4: '#2f7aa6',
  foam: '#ffffff',
};
export type WavesTheme = typeof wavesTheme;

/**
 * A wave strip 800 units wide (two 400-unit periods) in a 100-unit-tall box, filled to the bottom.
 * The strip is 200% of the layer's width, so sliding it by half loops seamlessly.
 */
const wave = (crest: number, amp: number, len: number, phase = 0) => {
  let d = `M0 100 L0 ${crest}`;
  for (let x = 0; x <= 800; x += 10) {
    d += ` L${x} ${(crest - amp * Math.sin((x / len) * Math.PI * 2 + phase)).toFixed(1)}`;
  }
  return `${d} L800 100 Z`;
};

const LAYERS = [
  { height: 34, d: wave(30, 8, 200), fill: 'var(--wave-1)', time: 22, reverse: true },
  { height: 26, d: wave(30, 10, 400 / 3, 1), fill: 'var(--wave-2)', time: 16, reverse: false },
  { height: 19, d: wave(30, 12, 200, 2), fill: 'var(--wave-3)', time: 12, reverse: true },
  { height: 12, d: wave(30, 14, 400, 0.5), fill: 'var(--wave-4)', time: 9, reverse: false },
];

/** A calm sea rolling along the bottom edge under an open sky. */
export function WavesBackground(props: BackgroundProps<WavesTheme>) {
  return (
    <BackgroundFrame
      {...props}
      defaultTheme={wavesTheme}
      layer={
        <>
          <div className={styles.sky} />
          {LAYERS.map((l, i) => (
            <div key={i} className={styles.band} style={{ height: `${l.height}%` }}>
              <div className={styles.bob} style={{ animationDelay: `${-i * 0.9}s` }}>
                <svg
                  className={`${styles.strip} ${l.reverse ? styles.reverse : ''}`}
                  style={{ animationDuration: `${l.time}s` }}
                  viewBox="0 0 800 100"
                  preserveAspectRatio="none"
                >
                  <path d={l.d} fill={l.fill} />
                </svg>
              </div>
            </div>
          ))}
          <div className={styles.glints}>
            {[12, 34, 58, 81].map((x, i) => (
              <span key={x} className={styles.glint} style={{ left: `${x}%`, animationDelay: `${-i * 0.7}s` }} />
            ))}
          </div>
        </>
      }
    />
  );
}
