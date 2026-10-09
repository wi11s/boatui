import type { ComponentType } from 'react';
import {
  TinyPlanet3D,
  tinyPlanetTheme,
  Lagoon3D,
  lagoonTheme,
  type ThreeSceneProps,
} from '@/components/three';

export type ThreeEntry = {
  slug: string;
  /** Exported component name. */
  name: string;
  title: string;
  blurb: string;
  description: string;
  animated: boolean;
  theme: Record<string, string>;
  /** Base filename in components/three (without extension). */
  file: string;
  Component: ComponentType<ThreeSceneProps<Record<string, string>>>;
};

export const threeScenes: ThreeEntry[] = [
  {
    slug: 'tiny-planet',
    name: 'TinyPlanet3D',
    title: 'Tiny planet',
    blurb: 'Low-poly planet with cottages, a windmill and orbiting clouds.',
    description:
      'A small, slightly lumpy low-poly planet turning slowly: 22 trees, three cottages with lit windows, a windmill with spinning blades, five clouds on tilted orbits, a moon and a 300-star field. Flat-shaded three.js with hemisphere, key and rim lights.',
    animated: true,
    theme: tinyPlanetTheme,
    file: 'tiny-planet-3d',
    Component: TinyPlanet3D as ThreeEntry['Component'],
  },
  {
    slug: 'lagoon',
    name: 'Lagoon3D',
    title: 'Lagoon',
    blurb: 'Sailboat circling a palm-tree island on a low-poly sea.',
    description: 
      'A sailboat circling a small palm-tree island on a flat-shaded low-poly sea. The boat samples the same wave function as the water, so it pitches and rolls with the swell. Gulls flap overhead, clouds drift past, and distance fog blends the sea into a warm horizon. three.js.',
    animated: true,
    theme: lagoonTheme,
    file: 'lagoon-3d',
    Component: Lagoon3D as ThreeEntry['Component'],
  },
];

export const getThreeScene = (slug: string) => threeScenes.find(s => s.slug === slug);

/** Files every 3D scene depends on; copy these once. */
export const THREE_SHARED_FILES = ['three-frame.tsx', 'three-frame.module.css'];

/** The props every 3D scene accepts, as [name, type, default, description]. */
export const threeProps = (entry: ThreeEntry): [string, string, string, string][] => [
  ['theme', `Partial<${entry.name.replace('3D', 'Theme')}>`, '—', 'Colour overrides. Applied live without rebuilding the scene.'],
  ['speed', 'number', '1', 'Animation speed multiplier.'],
  ['paused', 'boolean', 'false', 'Freezes the animation. Also stops rendering while off-screen or in a hidden tab.'],
  ['className', 'string', '—', 'Applied to the root element (4:3 by default; override the aspect ratio or height here).'],
  ['style', 'CSSProperties', '—', 'Merged into the root element style.'],
  ['children', 'ReactNode', '—', 'Rendered above the canvas, filling it.'],
];
