import { useId, type CSSProperties, type ReactNode } from 'react';
import { H, bandPath, type Ridge } from './geometry';
import styles from './scene.module.css';

export { SceneFrame } from './scene-frame';
export { styles as sceneStyles };

/** Props every scene accepts. `T` is the scene's theme (colour tokens). */
export type SceneProps<T> = {
  /** Seconds for the scene's main crossing. */
  duration?: number;
  /** Override any of the scene's colours. */
  theme?: Partial<T>;
  /** Freeze the animation. Scenes also pause on their own while off-screen. */
  paused?: boolean;
  className?: string;
  style?: CSSProperties;
  /** Content rendered on top of the scene (headings, buttons…). */
  children?: ReactNode;
};

/** A per-instance prefix for gradient ids, so several copies of a scene can share a page. */
export function useSvgId(name: string): string {
  return `qs${useId().replace(/[^a-zA-Z0-9_-]/g, '')}${name}`;
}

export type WaveLayerProps = {
  y: number;
  components: Ridge;
  fill: string;
  /** Seconds per sideways loop; 0 keeps the band still. */
  drift?: number;
  /** Seconds per up-and-down swell; 0 disables it. */
  swell?: number;
  reverse?: boolean;
  delay?: number;
  /** Fill toward the bottom (H) or the top (0) of the scene. */
  toward?: number;
  opacity?: number;
};

/** A band of water, hills or sand that can drift sideways and swell. */
export function WaveLayer({ y, components, fill, drift = 0, swell = 0, reverse, delay = 0, toward = H, opacity }: WaveLayerProps) {
  const path = (
    <path
      className={drift ? `${styles.drift} ${reverse ? styles.reverse : ''}` : undefined}
      style={drift ? { animationDuration: `${drift}s` } : undefined}
      fill={fill}
      opacity={opacity}
      d={bandPath(y, components, toward)}
    />
  );
  if (!swell) return path;
  return (
    <g className={styles.swell} style={{ animationDuration: `${swell}s`, animationDelay: `${-delay}s` }}>
      {path}
    </g>
  );
}
