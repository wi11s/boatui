// <BoatScene>: a sailboat crossing layered waves on a calm afternoon, with an island on the
// horizon, gulls overhead and a dolphin that leaps now and then. `duration` is seconds for one
// left-to-right crossing (default 40).

import { W } from './geometry';
import { SceneFrame, WaveLayer, sceneStyles as base, useSvgId, type SceneProps, type WaveLayerProps } from './scene';
import styles from './boat-scene.module.css';

export const boatTheme = {
  skyTop: '#9cc9e3',
  skyBottom: '#f3e6d3',
  sun: '#fff6dc',
  water1: '#6fa9c2',
  water2: '#4f92b2',
  water3: '#3a7fa3',
  water4: '#2a6a8d',
  water5: '#1d5675',
  hull: '#b8322a',
  island: '#5f8f7a',
  dolphin: '#93acc0',
};
export type BoatTheme = typeof boatTheme;

const BACK_WAVES: WaveLayerProps[] = [
  { y: 382, components: [[2.5, 80]],  fill: 'var(--water-1)', drift: 16, swell: 5.0, delay: 0 },
  { y: 430, components: [[5, 100]],   fill: 'var(--water-2)', drift: 12, swell: 4.2, delay: 0.9, reverse: true },
];
const FRONT_WAVES: WaveLayerProps[] = [
  { y: 482, components: [[7, W / 3]], fill: 'var(--water-3)', drift: 9, swell: 3.6, delay: 1.8 },
  { y: 560, components: [[9, 200]],   fill: 'var(--water-4)', drift: 8, swell: 4.6, delay: 2.7, reverse: true },
  { y: 640, components: [[11, 200]],  fill: 'var(--water-5)', drift: 6, swell: 3.9, delay: 3.6 },
];

/** A small sailboat crossing gentle waves on a calm afternoon. */
export function BoatScene(props: SceneProps<BoatTheme>) {
  const sky = useSvgId('sky');
  const glow = useSvgId('glow');

  return (
    <SceneFrame
      {...props}
      defaultTheme={boatTheme}
      defaultDuration={40}
      art={
        <>
          <defs>
            <linearGradient id={sky} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="var(--sky-top)" />
              <stop offset="1" stopColor="var(--sky-bottom)" />
            </linearGradient>
            <radialGradient id={glow}>
              <stop offset="0" stopColor="var(--sun)" stopOpacity="0.9" />
              <stop offset="1" stopColor="var(--sun)" stopOpacity="0" />
            </radialGradient>
          </defs>

          <rect width={W} height="700" fill={`url(#${sky})`} />
          <circle cx="290" cy="250" r="110" fill={`url(#${glow})`} />
          <circle cx="290" cy="250" r="34" fill="var(--sun)" />

          <g fill="#fff" opacity="0.75">
            <g className={base.across} style={{ animationDuration: '120s', animationDelay: '-50s' }}>
              <ellipse cx="0" cy="140" rx="46" ry="14" />
              <ellipse cx="22" cy="130" rx="28" ry="14" />
            </g>
            <g className={base.across} style={{ animationDuration: '160s', animationDelay: '-120s' }}>
              <ellipse cx="0" cy="210" rx="36" ry="10" />
              <ellipse cx="-14" cy="203" rx="20" ry="10" />
            </g>
          </g>

          {/* Gulls gliding across, wings flexing */}
          <g fill="none" stroke="#4a5d6b" strokeWidth="1.6" strokeLinecap="round">
            {[
              { y: 176, dur: 46, delay: 10, s: 1 },
              { y: 196, dur: 58, delay: 30, s: 0.75 },
            ].map((g, i) => (
              <g key={i} className={base.across} style={{ animationDuration: `${g.dur}s`, animationDelay: `${-g.delay}s` }}>
                <g transform={`translate(0 ${g.y}) scale(${g.s})`}>
                  <path className={styles.gull} d="M-9 0 Q-4.5 -5 0 0 Q4.5 -5 9 0" />
                </g>
              </g>
            ))}
          </g>

          {/* A small island with a lighthouse on the horizon */}
          <g fill="var(--island)" opacity="0.7">
            <path d="M28 384 Q44 364 64 366 Q80 360 96 374 Q104 380 110 384 Z" />
            <rect x="72" y="346" width="5" height="20" />
            <path d="M71 346 L74.5 341 L78 346 Z" />
          </g>

          {BACK_WAVES.map((w, i) => <WaveLayer key={i} {...w} />)}

          <g fill="var(--sun)">
            <rect className={base.glint} x="262" y="396" width="56" height="2.5" rx="1.25" style={{ animationDuration: '1.7s' }} />
            <rect className={base.glint} x="274" y="410" width="34" height="2" rx="1" style={{ animationDuration: '2.3s', animationDelay: '-1s' }} />
            <rect className={base.glint} x="252" y="422" width="22" height="2" rx="1" style={{ animationDuration: '1.4s', animationDelay: '-0.5s' }} />
          </g>

          {/* Boat: origin is the waterline at mid-hull, bow pointing right */}
          <g className={styles.boat}>
            <path
              className={styles.wake}
              d="M-46 2 Q-90 6 -150 3 M-40 9 Q-80 14 -130 13"
              fill="none"
              stroke="#fff"
              strokeOpacity="0.55"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray="12 6"
            />
            <g className={styles.bob}>
              <path d="M8 -80 L8 -10 L-38 -10 Z" fill="#faf7f0" />
              <path d="M12 -74 L12 -10 L44 -10 Z" fill="#ece5d8" />
              <rect x="8" y="-84" width="3" height="78" fill="#5a3e2b" />
              <path d="M11 -84 L25 -80 L11 -76 Z" fill="#e8b33a" />
              <rect x="-32" y="-18" width="26" height="12" rx="2" fill="#f4f1ea" />
              <rect x="-27" y="-15" width="5" height="4" fill="#7fa6b8" />
              <rect x="-18" y="-15" width="5" height="4" fill="#7fa6b8" />
              <path d="M-50 -6 L52 -6 Q46 10 30 15 L-40 15 Q-47 8 -50 -6 Z" fill="var(--hull)" />
              <path d="M-50 -6 L52 -6 L50.5 -2 L-49 -2 Z" fill="#f4f1ea" />
            </g>
          </g>

          <WaveLayer {...FRONT_WAVES[0]} />
          {/* Dolphin: rides a ring that turns about a point under the water, so it arcs out of the
              swell and dives back behind the nearer waves, once every 14 seconds */}
          <g transform="translate(118 578)">
            <g className={styles.leap}>
              <g transform="translate(0 -48) scale(1.2)">
                <path
                  d="M-18 2 C-12 -6 6 -8 16 -2 L22 -1 L16 2 C8 6 -8 6 -16 4 L-22 9 L-20 2 L-24 -4 Z M-2 -6 L2 -13 L5 -5 Z"
                  fill="var(--dolphin)"
                />
                <path d="M-14 3.5 C-4 6 8 5 16 1.5" fill="none" stroke="#e8f0f5" strokeWidth="1.6" strokeLinecap="round" />
                <circle cx="12" cy="-2" r="0.9" fill="#1d2b33" />
              </g>
            </g>
          </g>
          {FRONT_WAVES.slice(1).map((w, i) => <WaveLayer key={i} {...w} />)}
        </>
      }
    />
  );
}
