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
    blurb: 'A sailboat riding the swell in a round porthole.',
    description:
      'A sailboat in a round porthole, riding a wave that scrolls by exactly one wavelength per 2.4s loop. Its rise, fall and tilt are sampled from the same wave at the boat, so it climbs each crest bow-first and noses into the trough, kicking up spray. A pennant flutters, foam peels off the stern, a back swell scrolls at a slower parallax and a cloud drifts past.',
    animated: true,
    theme: boatLoaderTheme,
    file: 'boat-loader',
    Component: BoatLoader as LoaderEntry['Component'],
  },
  {
    slug: 'tea',
    name: 'TeaLoader',
    title: 'Tea',
    blurb: 'A teabag dunking into a cup of tea.',
    description:
      'A teabag on a string dunks into a cup of tea on a 2.4s loop: rings spread across the surface as it goes under, it lifts out swinging, and a drip falls back with a smaller ring. Two wisps of steam curl up beside it.',
    animated: true,
    theme: teaLoaderTheme,
    file: 'tea-loader',
    Component: TeaLoader as LoaderEntry['Component'],
  },
  {
    slug: 'toast',
    name: 'ToastLoader',
    title: 'Toast',
    blurb: 'A toaster popping two slices up; one does a flip.',
    description:
      'A toaster with a little face crouches and squeezes its eyes shut, then pops two slices of toast up with a sparkle. One slice flips head over heels at the top before both drop back in as the lever goes down. A squash-and-stretch loop of 1.6 seconds.',
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
