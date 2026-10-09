import type { ComponentType } from 'react';
import {
  SnowfallBackground,
  snowfallTheme,
  PetalsBackground,
  petalsTheme,
  FirefliesBackground,
  firefliesTheme,
  CloudsBackground,
  cloudsTheme,
  type BackgroundProps,
} from '@/components/backgrounds';

export type BackgroundEntry = {
  slug: string;
  /** Exported component name. */
  name: string;
  title: string;
  blurb: string;
  description: string;
  /** Whether the background moves (and so responds to `paused`). */
  animated: boolean;
  theme: Record<string, string>;
  /** Base filename in components/backgrounds (without extension). */
  file: string;
  Component: ComponentType<BackgroundProps<Record<string, string>>>;
};

export const backgrounds: BackgroundEntry[] = [
  {
    slug: 'snowfall',
    name: 'SnowfallBackground',
    title: 'Snowfall',
    blurb: 'Snow falling at three depths onto soft drifts.',
    description: 'Snow falling at three depths over a pale winter sky: small slow flakes far away, six-armed spinning flakes up close, all swaying as they fall onto soft drifts at the bottom. About 75 flakes, CSS keyframes only, sized to any box with container units.',
    animated: true,
    theme: snowfallTheme,
    file: 'snowfall-background',
    Component: SnowfallBackground as BackgroundEntry['Component'],
  },
  {
    slug: 'petals',
    name: 'PetalsBackground',
    title: 'Petals',
    blurb: 'Cherry-blossom petals drifting on a breeze.',
    description: 'Cherry-blossom petals drifting down and left on a breeze, each spinning and fluttering (a 3D flip faked with scaleX), over soft bokeh light and a blossoming branch that sways from the top-right corner. 36 petals, CSS keyframes only.',
    animated: true,
    theme: petalsTheme,
    file: 'petals-background',
    Component: PetalsBackground as BackgroundEntry['Component'],
  },
  {
    slug: 'fireflies',
    name: 'FirefliesBackground',
    title: 'Fireflies',
    blurb: 'Fireflies blinking over a dusky meadow.',
    description: 'Thirty fireflies wandering four-point loops and blinking on their own rhythms over a dusk gradient, with a crescent moon and a meadow of swaying grass blades placed by percentage so it spans any width. CSS keyframes only.',
    animated: true,
    theme: firefliesTheme,
    file: 'fireflies-background',
    Component: FirefliesBackground as BackgroundEntry['Component'],
  },
  {
    slug: 'clouds',
    name: 'CloudsBackground',
    title: 'Clouds',
    blurb: 'Soft clouds drifting across the sky in parallax.',
    description: 
      'Twelve soft clouds in three parallax layers drift across a sky gradient: far clouds are small, faint and slow, near ones larger and quicker, each shaded toward its base. A pale sun glows gently in the corner. CSS keyframes and container units.',
    animated: true,
    theme: cloudsTheme,
    file: 'clouds-background',
    Component: CloudsBackground as BackgroundEntry['Component'],
  },
];

export const getBackground = (slug: string) => backgrounds.find(b => b.slug === slug);

/** Files every background depends on; copy these once. */
export const BACKGROUND_SHARED_FILES = ['background.tsx', 'background.module.css'];

/** The props every background accepts, as [name, type, default, description]. */
export const backgroundProps = (bg: BackgroundEntry): [string, string, string, string][] => [
  ['theme', `Partial<${bg.name.replace('Background', 'Theme')}>`, '—', 'Colour overrides. Keys listed under theme tokens.'],
  ['paused', 'boolean', 'false', bg.animated ? 'Freezes the animation.' : 'No effect; this background is static.'],
  ['className', 'string', '—', 'Applied to the root element. Size it like any block element.'],
  ['style', 'CSSProperties', '—', 'Merged into the root element style, after theme variables.'],
  ['children', 'ReactNode', '—', 'Your content. The background paints behind it.'],
];
