// <LighthouseScene>: a lighthouse on a headland sweeping its beam over a moonlit sea while a
// steamer crosses the horizon. `duration` is seconds for the steamer's crossing (default 80).

import { W, seeded } from './geometry';
import { SceneFrame, WaveLayer, sceneStyles as base, useSvgId, type SceneProps, type WaveLayerProps } from './scene';
import styles from './lighthouse-scene.module.css';

export const lighthouseTheme = {
  skyTop: '#0a1430',
  skyBottom: '#2b3f6e',
  moon: '#f3edd8',
  beam: '#fff1c4',
  land: '#0d162d',
  water1: '#26395f',
  water2: '#1b2b50',
  water3: '#132142',
  water4: '#0c1733',
};
export type LighthouseTheme = typeof lighthouseTheme;

const HORIZON = 432;
const LAMP = { x: 318, y: 283 };

// Starfield, kept above the horizon and clear of the moon.
const rand = seeded(7);
const STARS = Array.from({ length: 48 }, () => {
  const x = rand() * W, y = 20 + rand() * 360;
  return { x, y, r: 0.5 + rand() * 1.2, dur: 2 + rand() * 3, delay: rand() * 5 };
}).filter(s => Math.hypot(s.x - 96, s.y - 150) > 40);

// Tower tapers from half-width 15 at the base (y 404) to 10 at the gallery (y 300).
const halfWidth = (y: number) => 10 + (5 * (y - 300)) / 104;
const towerBand = (y1: number, y2: number) =>
  `M${LAMP.x - halfWidth(y1)} ${y1} L${LAMP.x + halfWidth(y1)} ${y1} ` +
  `L${LAMP.x + halfWidth(y2)} ${y2} L${LAMP.x - halfWidth(y2)} ${y2} Z`;

// Glints below the moon: lower rows are wider, more scattered and fainter.
const MOON_PATH = Array.from({ length: 12 }, (_, i) => {
  const y = 478 + i * 16;
  const w = 10 + i * 2.5 + rand() * 12;
  return { x: 96 - w / 2 + (rand() - 0.5) * (10 + i * 5), y, w, o: 0.75 - i * 0.045, dur: 1.4 + rand() * 1.4, delay: rand() * 2 };
});

const FRONT_WAVES: WaveLayerProps[] = [
  { y: 470, components: [[4, 100]],   fill: 'var(--water-2)', drift: 13, swell: 4.4, delay: 1, reverse: true },
  { y: 540, components: [[7, W / 3]], fill: 'var(--water-3)', drift: 10, swell: 3.8, delay: 2 },
  { y: 620, components: [[10, 200]],  fill: 'var(--water-4)', drift: 7,  swell: 4.6, delay: 3, reverse: true },
];

/** A lighthouse sweeping its beam over a moonlit sea while a distant steamer crosses the horizon. */
export function LighthouseScene(props: SceneProps<LighthouseTheme>) {
  const sky = useSvgId('sky');
  const moonGlow = useSvgId('moonglow');
  const beam = useSvgId('beam');
  const lampGlow = useSvgId('lampglow');

  return (
    <SceneFrame
      {...props}
      defaultTheme={lighthouseTheme}
      defaultDuration={80}
      art={
        <>
          <defs>
            <linearGradient id={sky} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="var(--sky-top)" />
              <stop offset="0.62" stopColor="var(--sky-bottom)" />
            </linearGradient>
            <radialGradient id={moonGlow}>
              <stop offset="0" stopColor="var(--moon)" stopOpacity="0.45" />
              <stop offset="1" stopColor="var(--moon)" stopOpacity="0" />
            </radialGradient>
            <linearGradient id={beam} x1="1" y1="0" x2="0" y2="0">
              <stop offset="0" stopColor="var(--beam)" stopOpacity="0.65" />
              <stop offset="1" stopColor="var(--beam)" stopOpacity="0" />
            </linearGradient>
            <radialGradient id={lampGlow}>
              <stop offset="0" stopColor="var(--beam)" stopOpacity="1" />
              <stop offset="1" stopColor="var(--beam)" stopOpacity="0" />
            </radialGradient>
          </defs>

          <rect width={W} height="700" fill={`url(#${sky})`} />

          <g fill="#fff">
            {STARS.map((s, i) => (
              <circle
                key={i}
                className={styles.star}
                cx={s.x.toFixed(1)}
                cy={s.y.toFixed(1)}
                r={s.r.toFixed(2)}
                style={{ animationDuration: `${s.dur.toFixed(2)}s`, animationDelay: `${(-s.delay).toFixed(2)}s` }}
              />
            ))}
          </g>

          <circle cx="96" cy="150" r="90" fill={`url(#${moonGlow})`} />
          <circle cx="96" cy="150" r="24" fill="var(--moon)" />

          {/* Distant steamer: origin at its waterline */}
          <g className={styles.ship} fill="#0a1226">
            <path d="M-28 -6 L30 -6 L26 2 L-24 2 Z" />
            <rect x="-14" y="-14" width="22" height="8" />
            <rect x="0" y="-21" width="5" height="7" />
            <g fill="#ffd98a">
              <rect x="-11" y="-12" width="2" height="2" />
              <rect x="-6" y="-12" width="2" height="2" />
              <rect x="-1" y="-12" width="2" height="2" />
              <rect x="16" y="-4" width="2" height="2" />
            </g>
          </g>

          <WaveLayer y={HORIZON} components={[[2, 80]]} fill="var(--water-1)" drift={18} swell={5.2} />

          <g fill="var(--moon)">
            <rect className={base.glint} x="78" y="442" width="36" height="2" rx="1" style={{ animationDuration: '1.9s' }} />
            <rect className={base.glint} x="86" y="452" width="22" height="2" rx="1" style={{ animationDuration: '2.6s', animationDelay: '-1.2s' }} />
            <rect className={base.glint} x="72" y="461" width="16" height="1.6" rx="0.8" style={{ animationDuration: '1.5s', animationDelay: '-0.4s' }} />
          </g>

          {/* Headland, keeper's cottage and lighthouse */}
          <path fill="var(--land)" d="M215 700 L222 470 L238 440 L262 418 L300 404 L400 398 L400 700 Z" />
          <rect x="338" y="388" width="28" height="14" fill="#18223f" />
          <path d="M335 389 L352 378 L369 389 Z" fill="#18223f" />
          <rect x="344" y="393" width="5" height="4" fill="#ffd98a" />

          <path d={towerBand(404, 300)} fill="#e6e0d4" />
          <path d={towerBand(386, 366)} fill="#a8322c" />
          <path d={towerBand(345, 325)} fill="#a8322c" />
          <rect x="304" y="294" width="28" height="6" fill="#1a2238" />
          <rect x="309" y="272" width="18" height="22" fill="#ffe7a3" />
          <path d="M305 272 L318 258 L331 272 Z" fill="#7d2621" />

          <g transform={`translate(${LAMP.x} ${LAMP.y})`}>
            <g className={styles.beam}>
              {/* A wide soft cone under a narrow bright core reads as light in haze */}
              <path d="M0 -6 L-430 -78 L-430 78 L0 6 Z" fill={`url(#${beam})`} opacity="0.35" />
              <path d="M0 -3 L-430 -34 L-430 34 L0 3 Z" fill={`url(#${beam})`} />
            </g>
            <circle className={styles.lamp} r="22" fill={`url(#${lampGlow})`} />
          </g>

          {FRONT_WAVES.map((w, i) => <WaveLayer key={i} {...w} />)}

          {/* The moon's glitter path, widening and fading toward the viewer */}
          <g fill="var(--moon)">
            {MOON_PATH.map((g, i) => (
              <rect
                key={i}
                className={base.glint}
                x={g.x.toFixed(1)}
                y={g.y}
                width={g.w.toFixed(1)}
                height="2"
                rx="1"
                opacity={g.o}
                style={{ animationDuration: `${g.dur.toFixed(2)}s`, animationDelay: `${(-g.delay).toFixed(2)}s` }}
              />
            ))}
          </g>
        </>
      }
    />
  );
}
