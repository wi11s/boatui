// <GrainBackground>: a soft two-colour gradient with film grain on top. Static.

import { BackgroundFrame, type BackgroundProps } from './background';
import styles from './grain-background.module.css';

export const grainTheme = {
  from: '#f4efe6',
  to: '#e6ddd0',
};
export type GrainTheme = typeof grainTheme;

/** A soft two-colour gradient with film grain on top. */
export function GrainBackground(props: BackgroundProps<GrainTheme>) {
  return (
    <BackgroundFrame
      {...props}
      defaultTheme={grainTheme}
      layer={
        <>
          <div className={styles.base} />
          <div className={styles.grain} />
        </>
      }
    />
  );
}
