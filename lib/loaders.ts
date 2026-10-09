import type { ComponentType } from 'react';
import {
  BeeLoader,
  BoatLoader,
  LighthouseLoader,
  PlaneLoader,
  TeaLoader,
  ToastLoader,
  beeLoaderTheme,
  boatLoaderTheme,
  lighthouseLoaderTheme,
  planeLoaderTheme,
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
  {
    slug: 'plane',
    name: 'PlaneLoader',
    title: 'Paper plane',
    blurb: 'A paper plane looping the loop.',
    description:
      'A paper plane flying a vertical loop with a dashed trail that fades behind it, while two small clouds drift past. The loop eases over 1.8s, so the plane hangs at the top and swoops through the bottom, rolling slightly as it goes. Reads as a spinner with character.',
    animated: true,
    theme: planeLoaderTheme,
    file: 'plane-loader',
    Component: PlaneLoader as LoaderEntry['Component'],
  },
  {
    slug: 'lighthouse',
    name: 'LighthouseLoader',
    title: 'Lighthouse',
    blurb: 'A lighthouse beam sweeping round.',
    description:
      'A striped lighthouse on a rock whose beam sweeps round: the beam is squashed through zero width like a turning light seen side-on, and the lamp flares each time it swings past the viewer. A water line laps at the rock. 2.4s loop.',
    animated: true,
    theme: lighthouseLoaderTheme,
    file: 'lighthouse-loader',
    Component: LighthouseLoader as LoaderEntry['Component'],
  },
  {
    slug: 'bee',
    name: 'BeeLoader',
    title: 'Bee',
    blurb: 'A bumblebee flying figure-eights over a flower.',
    description:
      'A bumblebee flying figure-eights over a swaying flower, wings a blur, turning to face the way it is going. The path is two eased sways at a 1:2 ratio (a Lissajous curve), so it loops smoothly every 2.4s.',
    animated: true,
    theme: beeLoaderTheme,
    file: 'bee-loader',
    Component: BeeLoader as LoaderEntry['Component'],
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
