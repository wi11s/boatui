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

          {FRONT_WAVES.map((w, i) => <WaveLayer key={i} {...w} />)}
        </>
      }
    />
  );
}
