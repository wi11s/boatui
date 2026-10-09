import type { ComponentType } from 'react';
import {
  BalloonScene,
  BoatScene,
  LighthouseScene,
  ReefScene,
  balloonTheme,
  boatTheme,
  lighthouseTheme,
  reefTheme,
  type SceneProps,
} from '@/components/scenes';

export type SceneEntry = {
  slug: string;
  /** Exported component name. */
  name: string;
  title: string;
  blurb: string;
  description: string;
  /** What `duration` controls in this scene. */
  durationLabel: string;
  defaultDuration: number;
  theme: Record<string, string>;
  /** Base filename in components/scenes (without extension). */
  file: string;
  /** Overlay text colour that reads well on this scene. */
  tone: 'light' | 'dark';
  Component: ComponentType<SceneProps<Record<string, string>>>;
};

export const scenes: SceneEntry[] = [
  {
    slug: 'boat',
    name: 'BoatScene',
    title: 'Boat',
    blurb: 'Sailboat crossing layered waves. Daytime.',
    description:
      'Sailboat crossing five drifting wave layers under a low sun. Front layers occlude the hull so it reads as floating. Ambient motion: bobbing, wake, clouds, sun glints.',
    durationLabel: 'one left-to-right crossing',
    defaultDuration: 40,
    theme: boatTheme,
    file: 'boat-scene',
    tone: 'dark',
    Component: BoatScene as SceneEntry['Component'],
  },
  {
    slug: 'lighthouse',
    name: 'LighthouseScene',
    title: 'Lighthouse',
    blurb: 'Rotating beam over a night sea. Ship on the horizon.',
    description:
      'Lighthouse on a headland with a sweeping beam that flashes when facing the viewer. A steamer crosses the horizon. Ambient motion: twinkling stars, moon glints, drifting waves.',
    durationLabel: "the steamer's crossing",
    defaultDuration: 80,
    theme: lighthouseTheme,
    file: 'lighthouse-scene',
    tone: 'light',
    Component: LighthouseScene as SceneEntry['Component'],
  },
  {
    slug: 'balloon',
    name: 'BalloonScene',
    title: 'Balloon',
    blurb: 'Hot-air balloon rising over hills. Dawn.',
    description:
      'Hot-air balloon ascending diagonally over four hill layers at sunrise. Ambient motion: swaying basket, burner flicker, drifting mist, a distant second balloon, birds.',
    durationLabel: "the balloon's ascent",
    defaultDuration: 45,
    theme: balloonTheme,
    file: 'balloon-scene',
    tone: 'dark',
    Component: BalloonScene as SceneEntry['Component'],
  },
  {
    slug: 'reef',
    name: 'ReefScene',
    title: 'Reef',
    blurb: 'Sea turtle crossing a reef. Underwater.',
    description:
      'Sea turtle swimming across a shallow reef. A fish school crosses the other way. Ambient motion: surface ripples, light rays, swaying kelp, rising bubbles.',
    durationLabel: "the turtle's crossing",
    defaultDuration: 50,
    theme: reefTheme,
    file: 'reef-scene',
    tone: 'light',
    Component: ReefScene as SceneEntry['Component'],
  },
];

export const getScene = (slug: string) => scenes.find(s => s.slug === slug);

/** Files every scene depends on; copy these once. */
export const SHARED_FILES = ['geometry.ts', 'scene.tsx', 'scene-frame.tsx', 'scene.module.css'];

// skyTop → --sky-top, water1 → --water-1 (mirrors the conversion in scene-frame.tsx)
export const tokenToVar = (key: string) =>
  `--${key.replace(/([A-Z])/g, '-$1').replace(/(\d+)/g, '-$1').toLowerCase()}`;

/** The props every scene accepts, as [name, type, default, description]. */
export const sceneProps = (scene: SceneEntry): [string, string, string, string][] => [
  ['duration', 'number', `${scene.defaultDuration}`, `Seconds for ${scene.durationLabel}.`],
  ['theme', `Partial<${scene.name.replace('Scene', 'Theme')}>`, '—', 'Colour overrides. Keys listed under theme tokens.'],
  ['paused', 'boolean', 'false', 'Freezes all motion. Also paused automatically while off-screen.'],
  ['className', 'string', '—', 'Applied to the root element.'],
  ['style', 'CSSProperties', '—', 'Merged into the root element style, after theme variables.'],
  ['children', 'ReactNode', '—', 'Rendered above the art in an absolutely positioned layer.'],
];
