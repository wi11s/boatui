import type { ComponentType } from 'react';
import {
  GrainBackground,
  MeshBackground,
  grainTheme,
  meshTheme,
  SnowfallBackground,
  snowfallTheme,
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
    slug: 'grain',
    name: 'GrainBackground',
    title: 'Grain',
    blurb: 'Two-colour gradient with film grain.',
    description: 'A diagonal two-colour gradient with tiled film grain from an inline SVG turbulence filter, blended with multiply. Static, pure CSS.',
    animated: false,
    theme: grainTheme,
    file: 'grain-background',
    Component: GrainBackground as BackgroundEntry['Component'],
  },
  {
    slug: 'mesh',
    name: 'MeshBackground',
    title: 'Mesh gradient',
    blurb: 'Blurred colour blobs drifting slowly.',
    description: 'Three large blurred colour blobs on a base colour, forming a soft mesh gradient. Each blob drifts and scales on its own 18–27 second loop.',
    animated: true,
    theme: meshTheme,
    file: 'mesh-background',
    Component: MeshBackground as BackgroundEntry['Component'],
  },
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
