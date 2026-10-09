// <MeshBackground>: soft colour blobs blurred into a mesh gradient, drifting slowly. Animated.

import { BackgroundFrame, type BackgroundProps } from './background';
import styles from './mesh-background.module.css';

export const meshTheme = {
  base: '#f6f3fb',
  blob1: '#c8d8ff',
  blob2: '#f6c9dc',
  blob3: '#c9f0e2',
};
export type MeshTheme = typeof meshTheme;

/** Soft colour blobs blurred into a mesh gradient, drifting slowly. */
export function MeshBackground(props: BackgroundProps<MeshTheme>) {
  return (
    <BackgroundFrame
      {...props}
      defaultTheme={meshTheme}
      layer={
        <>
          <div className={styles.base} />
          <div className={`${styles.blob} ${styles.blob1}`} />
          <div className={`${styles.blob} ${styles.blob2}`} />
          <div className={`${styles.blob} ${styles.blob3}`} />
        </>
      }
    />
  );
}
