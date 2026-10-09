import type { ComponentType } from 'react';
import {
  TinyPlanet3D,
  tinyPlanetTheme,
  Lagoon3D,
  lagoonTheme,
  Campfire3D,
  campfireTheme,
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
    blurb: 'Low-poly planet with cottages, sheep, a windmill and orbiting clouds.',
    description:
      'A small, slightly lumpy low-poly planet turning slowly: 22 trees, three cottages with lit windows and smoking chimneys, a windmill with spinning blades, a stone-ringed pond, four sheep that dip their heads to graze, scattered flowers, five clouds on tilted orbits, a moon and a 300-star field. A soft atmospheric halo glows behind the rim. Flat-shaded three.js with hemisphere, key and rim lights.',
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
      'A sailboat circling a small island on a flat-shaded low-poly sea. The boat steers along its circle and samples the same wave function as the water, so it pitches and rolls with the swell and leaves a fading V-shaped wake. The island has two palms, rocks, bushes and a little jetty; ragged foam rides the swell around the shore, gulls wheel overhead, and distance fog blends the sea into a hazy horizon. three.js.',
    animated: true,
    theme: lagoonTheme,
    file: 'lagoon-3d',
    Component: Lagoon3D as ThreeEntry['Component'],
  },
  {
    slug: 'campfire',
    name: 'Campfire3D',
    title: 'Campfire',
    blurb: 'A campfire in a night clearing, with a tent, pines and fireflies.',
    description:
      'A campfire in a low-poly night clearing. Three nested flame cones flicker on their own beats and a warm point light pulses with them, lighting a ring of stones, a tent, a log bench and 18 pines. Embers spiral up and burn out, smoke rises and fades, fireflies blink at the tree line, and the camera drifts in a slow arc under a starry sky and a moon. three.js.',
    animated: true,
    theme: campfireTheme,
    file: 'campfire-3d',
    Component: Campfire3D as ThreeEntry['Component'],
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
