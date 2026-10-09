// <CityScene>: a city street on a rainy night. Windows glow in two rows of buildings, a streetlamp
// lights the rain falling through it, a figure waits under a red umbrella, and a tram hums past,
// its lights smeared in the wet road. `duration` is seconds for the tram to cross (default 24).

import type { CSSProperties } from 'react';
import { W, seeded } from './geometry';
import { SceneFrame, useSvgId, type SceneProps } from './scene';
import styles from './city-scene.module.css';

export const cityTheme = {
  skyTop: '#151b30',
  skyBottom: '#3d3a58',
  far: '#262d48',
  near: '#1a2038',
  street: '#12172a',
  window: '#ffcf7a',
  lamp: '#ffe2a3',
  tram: '#c8463a',
  umbrella: '#e0503c',
  sign: '#ff7aa8',
  rain: '#c9d6ec',
};
export type CityTheme = typeof cityTheme;

const CURB = 532;
const RAIL = 586;
const WIRE = 470;

const rand = seeded(73);

type Building = { x: number; w: number; top: number; windows: { x: number; y: number; lit: boolean; flicker: number | null }[] };

/** A row of buildings standing on `base`, with a grid of windows, some lit. */
function row(base: number, minH: number, maxH: number, gap: number, litChance: number): Building[] {
  const out: Building[] = [];
  for (let x = -10; x < W + 10; ) {
    const w = 34 + rand() * 40;
    const top = base - (minH + rand() * (maxH - minH));
    const windows: Building['windows'] = [];
    for (let wy = top + 12; wy < base - 18; wy += 16) {
      for (let wx = x + 7; wx < x + w - 10; wx += 11) {
        const lit = rand() < litChance;
        windows.push({ x: wx, y: wy, lit, flicker: lit && rand() < 0.08 ? 3 + rand() * 6 : null });
      }
    }
    out.push({ x, w, top, windows });
    x += w + gap;
  }
  return out;
}

const FAR = row(486, 120, 260, 2, 0.28);
const NEAR = row(CURB, 70, 190, 6, 0.4).filter(b => b.x < 120 || b.x > 250);

// Rain: two depths. Each streak rests at a scattered (x, y); the fall runs relative to it.
const RAIN = [
  { count: 50, len: [8, 12], fall: [0.9, 1.3], opacity: 0.35, width: 1 },
  { count: 28, len: [14, 22], fall: [0.6, 0.8], opacity: 0.6, width: 1.4 },
].flatMap(d =>
  Array.from({ length: d.count }, () => {
    const y = rand() * 700;
    return {
      x: rand() * (W + 60),
      y,
      len: d.len[0] + rand() * (d.len[1] - d.len[0]),
      fall: d.fall[0] + rand() * (d.fall[1] - d.fall[0]),
      delay: rand() * 2,
      opacity: d.opacity,
      width: d.width,
    };
  }),
);

const RIPPLES = Array.from({ length: 12 }, () => ({
  x: rand() * W,
  y: CURB + 70 + rand() * 90,
  r: 6 + rand() * 8,
  dur: 1.2 + rand() * 1.2,
  delay: rand() * 2,
}));

const TRAM_WINDOWS = [-112, -92, -72, -52, -32, -12];

function Tram() {
  return (
    <g>
      {/* Pantograph up to the wire */}
      <path d={`M-70 -46 L-58 -${RAIL - WIRE - 2} L-46 -46`} fill="none" stroke="#0d1122" strokeWidth="2" />
      <path d="M-128 -8 V-40 Q-128 -48 -120 -48 H2 Q14 -48 18 -36 L22 -8 Z" fill="var(--tram)" />
      <rect x="-128" y="-14" width="150" height="6" fill="#000" opacity="0.25" />
      <path d="M-128 -44 H8" stroke="#ffffff" strokeOpacity="0.25" strokeWidth="2" />
      <g fill="var(--window)">
        {TRAM_WINDOWS.map(x => (
          <rect key={x} x={x} y="-38" width="14" height="14" rx="2" />
        ))}
        <path d="M6 -38 H12 Q16 -36 17 -26 H6 Z" />
      </g>
      <circle cx="18" cy="-14" r="2.4" fill="var(--lamp)" />
      <g fill="#0d1122">
        {[-110, -90, -6, 14].map(x => (
          <circle key={x} cx={x - 8} cy="-6" r="4.5" />
        ))}
      </g>
    </g>
  );
}

/** A city street on a rainy night, with a tram passing. */
export function CityScene(props: SceneProps<CityTheme>) {
  const sky = useSvgId('sky');
  const cone = useSvgId('cone');
  const glow = useSvgId('glow');
  const smear = useSvgId('smear');
  const street = useSvgId('street');

  return (
    <SceneFrame
      {...props}
      defaultTheme={cityTheme}
      defaultDuration={24}
      art={
        <>
          <defs>
            <linearGradient id={sky} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="var(--sky-top)" />
              <stop offset="0.7" stopColor="var(--sky-bottom)" />
            </linearGradient>
            <linearGradient id={street} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="var(--sky-bottom)" stopOpacity="0.35" />
              <stop offset="0.25" stopColor="var(--street)" />
            </linearGradient>
            <linearGradient id={cone} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="var(--lamp)" stopOpacity="0.5" />
              <stop offset="1" stopColor="var(--lamp)" stopOpacity="0" />
            </linearGradient>
            <radialGradient id={glow}>
              <stop offset="0" stopColor="var(--lamp)" stopOpacity="0.85" />
              <stop offset="1" stopColor="var(--lamp)" stopOpacity="0" />
            </radialGradient>
            {/* Light smeared down the wet road */}
            <linearGradient id={smear} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="var(--window)" stopOpacity="0.55" />
              <stop offset="1" stopColor="var(--window)" stopOpacity="0" />
            </linearGradient>
          </defs>

          <rect width={W} height="700" fill={`url(#${sky})`} />

          {/* Two rows of buildings, the far one hazier */}
          {[
            { list: FAR, fill: 'var(--far)', opacity: 0.55 },
            { list: NEAR, fill: 'var(--near)', opacity: 0.9 },
          ].map(({ list, fill, opacity }, r) => (
            <g key={r}>
              {list.map((b, i) => (
                <g key={i}>
                  <rect x={b.x.toFixed(1)} y={b.top.toFixed(1)} width={b.w.toFixed(1)} height={(700 - b.top).toFixed(1)} fill={fill} />
                  <g fill="var(--window)" opacity={opacity}>
                    {b.windows
                      .filter(w => w.lit)
                      .map((w, j) => (
                        <rect
                          key={j}
                          className={w.flicker ? styles.flicker : undefined}
                          style={w.flicker ? { animationDuration: `${w.flicker.toFixed(2)}s` } : undefined}
                          x={w.x.toFixed(1)}
                          y={w.y.toFixed(1)}
                          width="5"
                          height="7"
                        />
                      ))}
                  </g>
                </g>
              ))}
            </g>
          ))}

          {/* Café front between the near buildings: awning, lit window and a neon sign */}
          <g>
            <rect x="128" y="452" width="116" height="80" fill="var(--near)" />
            <rect x="140" y="482" width="64" height="40" fill="var(--window)" opacity="0.75" />
            <path d="M161 482 V522 M182 482 V522 M140 506 H204" stroke="var(--near)" strokeWidth="2.5" />
            <rect x="146" y="510" width="52" height="3" fill="#000" opacity="0.2" />
            <path d="M134 470 H238 L232 482 H140 Z" fill="var(--umbrella)" />
            <path d="M140 482 l6 5 l6 -5 l6 5 l6 -5 l6 5 l6 -5 l6 5 l6 -5 l6 5 l6 -5 l6 5 l6 -5 l6 5 l6 -5 l6 5 l2 -5" fill="none" stroke="var(--umbrella)" strokeWidth="2" />
            <rect x="212" y="490" width="22" height="42" fill="#0d1122" />
            <g className={styles.neon}>
              <rect x="150" y="456" width="44" height="10" rx="5" fill="none" stroke="var(--sign)" strokeWidth="2" />
              <rect x="146" y="452" width="52" height="18" rx="9" fill="var(--sign)" opacity="0.15" />
            </g>
          </g>

          {/* Overhead wire for the tram */}
          <path d={`M0 ${WIRE} Q200 ${WIRE + 8} ${W} ${WIRE}`} fill="none" stroke="#0d1122" strokeWidth="1.4" />

          {/* Street, wet and shining */}
          <rect x="0" y={CURB} width={W} height={700 - CURB} fill={`url(#${street})`} />
          <rect x="0" y={CURB} width={W} height="6" fill="#2a3150" />
          <rect x="140" y={CURB + 6} width="64" height="110" fill={`url(#${smear})`} opacity="0.5" className={styles.shimmer} />
          <rect x="284" y={CURB + 6} width="22" height="130" fill={`url(#${smear})`} opacity="0.6" className={styles.shimmer} style={{ animationDelay: '-0.7s' }} />
          <path d={`M0 ${RAIL} H${W} M0 ${RAIL + 10} H${W}`} stroke="#3a4266" strokeWidth="1.5" />

          <g fill="none" stroke="var(--rain)" strokeWidth="1">
            {RIPPLES.map((r, i) => (
              <ellipse
                key={i}
                className={styles.ripple}
                cx={r.x.toFixed(1)}
                cy={r.y.toFixed(1)}
                rx={r.r.toFixed(1)}
                ry={(r.r * 0.3).toFixed(1)}
                style={{ animationDuration: `${r.dur.toFixed(2)}s`, animationDelay: `${(-r.delay).toFixed(2)}s` }}
              />
            ))}
          </g>

          {/* Tram, with its reflection travelling beneath it */}
          <g className={styles.tram}>
            <g transform={`translate(0 ${RAIL})`}>
              <Tram />
            </g>
            <g transform={`translate(0 ${RAIL + 6}) scale(1 -0.8)`} opacity="0.22">
              <Tram />
            </g>
          </g>

          {/* Streetlamp: a pool of light with the rain showing in it */}
          <g>
            <path d="M296 380 L250 700 H350 Z" fill={`url(#${cone})`} opacity="0.5" />
            <rect x="293" y="380" width="4" height={CURB - 380 + 4} fill="#0d1122" />
            <path d="M286 380 H306 L302 372 H290 Z" fill="#0d1122" />
            <circle className={styles.lamp} cx="296" cy="384" r="26" fill={`url(#${glow})`} />
            <rect x="290" y="380" width="12" height="5" rx="2" fill="var(--lamp)" />
          </g>

          {/* Someone waiting under a red umbrella */}
          <g transform={`translate(84 ${CURB + 2})`}>
            <path d="M-6 0 V-30 Q-6 -36 0 -36 Q6 -36 6 -30 V0 Z" fill="#0d1122" />
            <circle cx="0" cy="-41" r="5.5" fill="#0d1122" />
            <path d="M0 -36 V-60" stroke="#0d1122" strokeWidth="1.6" />
            <g className={styles.umbrella}>
              <path d="M-24 -56 Q0 -80 24 -56 Q18 -60 12 -56 Q6 -60 0 -56 Q-6 -60 -12 -56 Q-18 -60 -24 -56 Z" fill="var(--umbrella)" />
            </g>
          </g>

          {/* Rain, drawn last so it falls in front of everything */}
          <g stroke="var(--rain)" strokeLinecap="round">
            {RAIN.map((d, i) => (
              <g key={i} transform={`translate(${d.x.toFixed(1)} ${d.y.toFixed(1)})`} opacity={d.opacity}>
                <path
                  className={styles.fall}
                  style={
                    {
                      '--from': `${(-d.y - 30).toFixed(1)}px`,
                      '--to': `${(720 - d.y).toFixed(1)}px`,
                      animationDuration: `${d.fall.toFixed(2)}s`,
                      animationDelay: `${(-d.delay).toFixed(2)}s`,
                    } as CSSProperties
                  }
                  d={`M0 0 l${(-d.len * 0.2).toFixed(1)} ${d.len.toFixed(1)}`}
                  strokeWidth={d.width}
                />
              </g>
            ))}
          </g>
        </>
      }
    />
  );
}
