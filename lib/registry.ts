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
    title: 'Slow crossing',
    blurb: 'A small sailboat on an easy afternoon swell.',
    description:
      'A sailboat bobs across five layers of drifting waves under a hazy sun. The front waves pass over the hull, so it sits in the water instead of on top of it.',
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
    title: 'Night watch',
    blurb: "A steamer passes under the lighthouse's sweep.",
    description:
      'Stars twinkle over a moonlit sea while a lighthouse sweeps its beam and flashes as it turns toward you. A small steamer with lit windows crosses the horizon.',
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
    title: 'First light',
    blurb: 'A balloon lifts over the hills at dawn.',
    description:
      'A striped hot-air balloon rises diagonally over rolling hills, swaying under a flickering burner. Mist drifts between the ridges and a few birds flap past.',
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
    title: 'Reef drift',
    blurb: 'A sea turtle glides across the shallows.',
    description:
      'A sea turtle paddles through rippling light while kelp sways, bubbles rise and a school of fish swims the other way.',
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
