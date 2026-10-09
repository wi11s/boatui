// <DotGridBackground>: a fine dot grid that fades toward the edges. Static.

import { BackgroundFrame, type BackgroundProps } from './background';
import styles from './dot-grid-background.module.css';

export const dotGridTheme = {
  base: '#fafaf9',
  dot: '#cfcfc9',
};
export type DotGridTheme = typeof dotGridTheme;

/** A fine dot grid that fades toward the edges. */
export function DotGridBackground(props: BackgroundProps<DotGridTheme>) {
  return (
    <BackgroundFrame
      {...props}
      defaultTheme={dotGridTheme}
      layer={
        <>
          <div className={styles.base} />
          <div className={styles.dots} />
        </>
      }
    />
  );
}
