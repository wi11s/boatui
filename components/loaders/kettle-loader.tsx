// <KettleLoader>: a kettle coming to the boil on a hob. Steam wisps from the spout, then the lid
// rattles and it whistles out a big puff before settling again, over blue flames.

import { LoaderFrame, type LoaderProps } from './loader';
import styles from './kettle-loader.module.css';

export const kettleLoaderTheme = {
  kettle: '#e4573d',
  kettleShade: '#c2442e',
  handle: '#3d4a57',
  steam: '#b9c4cc',
  flame: '#5b9bd5',
  flameCore: '#a8d1f5',
  hob: '#8a97a0',
};
export type KettleLoaderTheme = typeof kettleLoaderTheme;

/** A kettle coming to the boil: steam, a rattling lid and a whistle. */
export function KettleLoader(props: LoaderProps<KettleLoaderTheme>) {
  return (
    <LoaderFrame
      {...props}
      defaultTheme={kettleLoaderTheme}
      art={
        <>
          {/* Steam from the spout: small wisps, then one big puff at the whistle */}
          <g fill="var(--steam)">
            {[0, 1, 2].map(i => (
              <g key={i} transform="translate(82 42)">
                <circle className={styles.wisp} style={{ animationDelay: `${-i * 0.4}s` }} r="3.2" />
              </g>
            ))}
            <g transform="translate(84 38)">
              <g className={styles.puff}>
                <circle cx="0" cy="0" r="6" />
                <circle cx="6" cy="-5" r="5" />
                <circle cx="-3" cy="-7" r="4.5" />
              </g>
            </g>
          </g>

          {/* Flames under the kettle */}
          <g transform="translate(50 94)">
            {[-12, 0, 12].map((x, i) => (
              <g key={x} transform={`translate(${x} 0)`}>
                <g className={styles.flame} style={{ animationDelay: `${-i * 0.13}s` }}>
                  <path d="M0 -9 Q5 -2 3.5 1 Q0 3 -3.5 1 Q-5 -2 0 -9 Z" fill="var(--flame)" />
                  <path d="M0 -4 Q2.2 -0.5 1.5 1 Q0 2 -1.5 1 Q-2.2 -0.5 0 -4 Z" fill="var(--flame-core)" />
                </g>
              </g>
            ))}
          </g>
          <rect x="24" y="93" width="52" height="4" rx="2" fill="var(--hob)" />

          {/* Kettle: body, spout and handle; the whole kettle shivers as it whistles */}
          <g className={styles.kettle}>
            <path d="M68 66 Q76 58 80 44 L85 44 Q84 58 72 72 Z" fill="var(--kettle-shade)" />
            <path d="M34 48 Q34 26 50 26 Q66 26 66 48" fill="none" stroke="var(--handle)" strokeWidth="4.5" strokeLinecap="round" />
            <path d="M24 82 Q22 50 50 46 Q78 50 76 82 Z" fill="var(--kettle)" />
            <path d="M76 82 Q78 58 60 48 Q72 56 70 82 Z" fill="var(--kettle-shade)" />
            <path d="M32 64 Q34 54 42 51" fill="none" stroke="#ffffff" strokeOpacity="0.45" strokeWidth="3" strokeLinecap="round" />
            <rect x="22" y="80" width="56" height="5" rx="2.5" fill="var(--kettle-shade)" />
            <g className={styles.lid}>
              <ellipse cx="50" cy="46" rx="15" ry="4" fill="var(--kettle-shade)" />
              <circle cx="50" cy="41.5" r="3.4" fill="var(--handle)" />
            </g>
          </g>
        </>
      }
    />
  );
}
