import type { ComponentType } from 'react';
import {
  DotGridBackground,
  GrainBackground,
  MeshBackground,
  dotGridTheme,
  grainTheme,
  meshTheme,
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
    slug: 'dot-grid',
    name: 'DotGridBackground',
    title: 'Dot grid',
    blurb: 'Fine dot grid fading toward the edges.',
    description: 'A 22px dot grid on a flat base colour, masked with a radial fade so it disappears toward the edges. Static, pure CSS.',
    animated: false,
    theme: dotGridTheme,
    file: 'dot-grid-background',
    Component: DotGridBackground as BackgroundEntry['Component'],
  },
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
