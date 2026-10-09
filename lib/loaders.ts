import type { ComponentType } from 'react';
import {
  BoatLoader,
  TeaLoader,
  ToastLoader,
  boatLoaderTheme,
  teaLoaderTheme,
  toastLoaderTheme,
  type LoaderProps,
} from '@/components/loaders';

export type LoaderEntry = {
  slug: string;
  /** Exported component name. */
  name: string;
  title: string;
  blurb: string;
  description: string;
  animated: boolean;
  theme: Record<string, string>;
  /** Base filename in components/loaders (without extension). */
  file: string;
  Component: ComponentType<LoaderProps<Record<string, string>>>;
};

export const loaders: LoaderEntry[] = [
  {
    slug: 'boat',
    name: 'BoatLoader',
    title: 'Boat',
    blurb: 'A little boat rocking over scrolling waves.',
    description:
      'A little sailboat rocking and bobbing over two layers of waves that scroll in opposite directions, each by exactly one wavelength per loop so the seam never shows.',
    animated: true,
    theme: boatLoaderTheme,
    file: 'boat-loader',
    Component: BoatLoader as LoaderEntry['Component'],
  },
  {
    slug: 'tea',
    name: 'TeaLoader',
    title: 'Tea',
    blurb: 'A cup of tea with steam curling up.',
    description:
      'A cup of tea on a saucer: three wisps of steam rise, stretch and fade on staggered loops while the teabag tag swings gently on its string.',
    animated: true,
    theme: teaLoaderTheme,
    file: 'tea-loader',
    Component: TeaLoader as LoaderEntry['Component'],
  },
  {
    slug: 'toast',
    name: 'ToastLoader',
    title: 'Toast',
    blurb: 'A toaster popping two slices up, over and over.',
    description:
      'A toaster that crouches, then pops two slices of toast up with a little sparkle; they hang for a moment and drop back in as the lever goes down. A squash-and-stretch loop of 1.6 seconds.',
    animated: true,
    theme: toastLoaderTheme,
    file: 'toast-loader',
    Component: ToastLoader as LoaderEntry['Component'],
  },
];

export const getLoader = (slug: string) => loaders.find(l => l.slug === slug);

/** Files every loader depends on; copy these once. */
export const LOADER_SHARED_FILES = ['loader.tsx', 'loader.module.css'];

/** The props every loader accepts, as [name, type, default, description]. */
export const loaderProps = (entry: LoaderEntry): [string, string, string, string][] => [
  ['theme', `Partial<${entry.name.replace('Loader', 'LoaderTheme')}>`, '—', 'Colour overrides. Keys listed under theme tokens.'],
  ['size', 'number', '64', 'Width and height in pixels.'],
  ['label', 'string', '"Loading…"', 'Announced to screen readers through role="status".'],
  ['paused', 'boolean', 'false', 'Freezes the animation.'],
  ['className', 'string', '—', 'Applied to the root element (an inline-flex span).'],
  ['style', 'CSSProperties', '—', 'Merged into the root element style, after theme variables.'],
];
