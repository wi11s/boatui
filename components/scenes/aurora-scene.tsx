// <AuroraScene>: northern lights rippling over snowy mountains and a frozen lake, a cabin with a lit
// window and smoking chimney among the pines. `duration` is seconds for the main curtain of light
// to drift once across the sky (default 60); the other curtains drift at related speeds.

import { W, bandPath, ridgeY, seeded, type Ridge } from './geometry';
import type { CSSProperties } from 'react';
import { SceneFrame, WaveLayer, useSvgId, type SceneProps } from './scene';
import styles from './aurora-scene.module.css';

export const auroraTheme = {
  skyTop: '#0b1430',
  skyBottom: '#1d3a55',
  aurora1: '#5cf2b0',
  aurora2: '#3fd4d0',
  aurora3: '#b48cff',
  mountain1: '#2c4766',
  mountain2: '#1c3049',
  snow: '#e6eef6',
  lake: '#2a4c66',
  forest: '#0f1d2c',
  cabin: '#5a3e35',
  window: '#ffcf7a',
};
export type AuroraTheme = typeof auroraTheme;

const LAKE = 548;
const FAR_RANGE: Ridge = [[34, 400, 0.6], [20, 200, 2], [9, 100, 1], [4, 50]];
const SHORE: Ridge = [[6, 200], [4, 80, 1]];

/** Curtains of light: their lower edge, how tall they reach, colour, and drift as a multiple of `duration`. */
const CURTAINS = [
  { y: 330, reach: 170, color: 'var(--aurora-3)', ridge: [[12, 400, 1], [5, 100]] as Ridge, drift: 1.6, reverse: true, opacity: 0.55 },
  { y: 390, reach: 210, color: 'var(--aurora-1)', ridge: [[16, 400], [7, 200, 2], [3, 50]] as Ridge, drift: 1, reverse: false, opacity: 0.9 },
  { y: 420, reach: 150, color: 'var(--aurora-2)', ridge: [[10, 200, 3], [4, 80]] as Ridge, drift: 0.7, reverse: true, opacity: 0.6 },
];

const rand = seeded(47);

/**
 * A curtain as vertical rays: each ray rises from the wavy lower edge to a varied height.
 * Heights repeat every W units, so the 2W-wide curtain drifts by W without a seam. Two paths:
 * every ray, and a brighter subset that gives the light its streaks.
 */
function rays(c: (typeof CURTAINS)[number]) {
  const step = 3;
  const heights = Array.from({ length: W / step }, () => 0.45 + rand() * 0.55);
  const bright = heights.map(() => rand() > 0.72);
  let all = '';
  let lit = '';
  for (let i = 0; i < (W * 2) / step; i++) {
    const x = i * step;
    const k = i % heights.length;
    const yb = ridgeY(x, c.y, c.ridge);
    const swell = 0.75 + 0.25 * Math.sin((x / 200) * Math.PI * 2 + c.y);
    const yt = yb - c.reach * heights[k] * swell;
    const seg = ` M${x} ${yb.toFixed(1)} V${yt.toFixed(1)}`;
    all += seg;
    if (bright[k]) lit += seg;
  }
  return { all, lit };
}
const RAYS = CURTAINS.map(rays);

const STARS = Array.from({ length: 70 }, () => ({
  x: rand() * W,
  y: rand() * 360,
  r: 0.4 + rand() * 1.1,
  dur: 2 + rand() * 4,
  delay: rand() * 6,
}));

// Pines along the shore, leaving a gap for the cabin.
const PINES = Array.from({ length: 22 }, (_, i) => {
  const x = i * 19 + rand() * 10 - 6;
  return { x, y: ridgeY(x, 618, SHORE) + 4, h: 28 + rand() * 30 };
}).filter(p => p.x < 250 || p.x > 330);

/** Northern lights over snowy mountains and a frozen lake, with a cabin among the pines. */
export function AuroraScene(props: SceneProps<AuroraTheme>) {
  const sky = useSvgId('sky');
  const lake = useSvgId('lake');
  const glow = useSvgId('glow');
  const curtain = useSvgId('curtain');
  const snowcap = useSvgId('snowcap');

  const curtains = CURTAINS.map((c, i) => (
    <g key={i} className={styles.pulse} style={{ animationDelay: `${-i * 2.3}s` }}>
      <g className={styles.lean} style={{ animationDelay: `${-i * 3.1}s` }}>
        <g
          className={`${styles.drift} ${c.reverse ? styles.reverse : ''}`}
          style={{ '--k': c.drift } as CSSProperties}
          fill="none"
          stroke={`url(#${curtain}${i})`}
          opacity={c.opacity}
        >
          <path d={RAYS[i].all} strokeWidth="3.2" opacity="0.7" />
          <path d={RAYS[i].lit} strokeWidth="2" />
        </g>
      </g>
    </g>
  ));

  return (
    <SceneFrame
      {...props}
      defaultTheme={auroraTheme}
      defaultDuration={60}
      art={
        <>
          <defs>
            <linearGradient id={sky} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="var(--sky-top)" />
              <stop offset="0.75" stopColor="var(--sky-bottom)" />
            </linearGradient>
            {CURTAINS.map((c, i) => (
              // Brightest along the lower edge, fading to nothing as it rises.
              <linearGradient key={i} id={`${curtain}${i}`} gradientUnits="userSpaceOnUse" x1="0" y1={c.y + 20} x2="0" y2={c.y - c.reach}>
                <stop offset="0" stopColor={c.color} stopOpacity="0" />
                <stop offset="0.08" stopColor={c.color} stopOpacity="0.95" />
                <stop offset="0.3" stopColor={c.color} stopOpacity="0.45" />
                <stop offset="1" stopColor={c.color} stopOpacity="0" />
              </linearGradient>
            ))}
            {/* The lights' glow on the ice, strongest at the far shore */}
            <linearGradient id={lake} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="var(--aurora-1)" stopOpacity="0.35" />
              <stop offset="1" stopColor="var(--aurora-2)" stopOpacity="0" />
            </linearGradient>
            {/* Snow on the far peaks, fading out down their flanks */}
            <linearGradient id={snowcap} gradientUnits="userSpaceOnUse" x1="0" y1="404" x2="0" y2="492">
              <stop offset="0" stopColor="var(--snow)" stopOpacity="0.75" />
              <stop offset="0.45" stopColor="var(--snow)" stopOpacity="0.3" />
              <stop offset="1" stopColor="var(--snow)" stopOpacity="0" />
            </linearGradient>
            <radialGradient id={glow}>
              <stop offset="0" stopColor="var(--window)" stopOpacity="0.6" />
              <stop offset="1" stopColor="var(--window)" stopOpacity="0" />
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
          <path className={styles.meteor} d="M0 0 L60 22" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" />

          {/* Curtains of rays; each drifts once per (--duration × --k) seconds */}
          <g>{curtains}</g>

          {/* Mountains: a pale snowy range behind a darker one */}
          <path fill="var(--mountain-1)" d={bandPath(470, FAR_RANGE)} />
          <path fill={`url(#${snowcap})`} d={bandPath(470, FAR_RANGE)} />
          <path fill="var(--mountain-2)" d={bandPath(512, [[22, 400, 2.4], [12, 200], [6, 100, 2]])} />

          {/* Frozen lake, lit by the lights */}
          <rect x="0" y={LAKE} width={W} height="90" fill="var(--lake)" />
          <rect className={styles.shimmer} x="0" y={LAKE} width={W} height="70" fill={`url(#${lake})`} />
          <g fill="none" stroke="#fff" strokeOpacity="0.18" strokeWidth="1.5" strokeLinecap="round">
            <path d="M40 566 H120 M210 578 H330 M90 592 H170" />
          </g>

          {/* Snowy shore, pines and the cabin */}
          <path fill="var(--snow)" d={bandPath(618, SHORE)} />
          <g fill="var(--forest)">
            {PINES.map((p, i) => (
              <path
                key={i}
                d={`M${p.x.toFixed(1)} ${(p.y - p.h).toFixed(1)} L${(p.x + 8).toFixed(1)} ${(p.y - p.h * 0.45).toFixed(1)} L${(p.x + 4).toFixed(1)} ${(p.y - p.h * 0.45).toFixed(1)} L${(p.x + 11).toFixed(1)} ${p.y.toFixed(1)} L${(p.x - 11).toFixed(1)} ${p.y.toFixed(1)} L${(p.x - 4).toFixed(1)} ${(p.y - p.h * 0.45).toFixed(1)} L${(p.x - 8).toFixed(1)} ${(p.y - p.h * 0.45).toFixed(1)} Z`}
              />
            ))}
          </g>

          <g transform="translate(290 616)">
            <circle cx="-8" cy="-16" r="34" fill={`url(#${glow})`} className={styles.glow} />
            <g fill="#f4f1fa" opacity="0.85">
              {[0, 1, 2].map(i => (
                <circle key={i} className={styles.smoke} style={{ animationDelay: `${-i * 1.6}s` }} cx="12" cy="-48" r="3" />
              ))}
            </g>
            <rect x="8" y="-46" width="8" height="16" fill="var(--cabin)" />
            <rect x="-26" y="-28" width="48" height="28" fill="var(--cabin)" />
            <path d="M-32 -26 L-2 -50 L28 -26 Z" fill="var(--cabin)" />
            <path d="M-34 -25 L-2 -52 L30 -25 L26 -23 L-2 -46 L-30 -23 Z" fill="var(--snow)" />
            <rect x="-17" y="-20" width="12" height="10" rx="1" fill="var(--window)" />
            <path d="M-11 -20 V-10 M-17 -15 H-5" stroke="var(--cabin)" strokeWidth="1.4" />
            <rect x="4" y="-18" width="10" height="18" rx="1" fill="#3a2924" />
          </g>

          <WaveLayer y={672} components={[[5, 200], [3, 100, 2]]} fill="var(--snow)" />
          <g fill="#fff" opacity="0.6">
            <circle cx="60" cy="660" r="1.2" />
            <circle cx="150" cy="670" r="1" />
            <circle cx="340" cy="664" r="1.2" />
          </g>
        </>
      }
    />
  );
}
