import type { ComponentType } from 'react';
import {
  AuroraScene,
  AutumnScene,
  BalloonScene,
  BlossomScene,
  BoatScene,
  CityScene,
  DesertScene,
  KiteScene,
  LighthouseScene,
  ReefScene,
  SnowfallScene,
  auroraTheme,
  autumnTheme,
  balloonTheme,
  blossomTheme,
  boatTheme,
  cityTheme,
  desertTheme,
  kiteTheme,
  lighthouseTheme,
  reefTheme,
  snowfallTheme,
  TrainScene,
  trainTheme,
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
      'Sailboat crossing five drifting wave layers under a low sun, a small island with a lighthouse on the horizon. Front layers occlude the hull so it reads as floating. Ambient motion: bobbing, wake, clouds, sun glints, two gulls gliding past, and a dolphin that leaps from the swell every 14 seconds.',
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
      'Lighthouse on a headland with a sweeping beam (a soft wide cone under a bright core) that flashes when facing the viewer. A steamer crosses the horizon. Ambient motion: twinkling stars, a glittering moon path down the water, drifting waves.',
    durationLabel: 'the steamer\'s crossing',
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
      'Hot-air balloon ascending diagonally over four hill layers at sunrise, with soft mist lying in the valleys. Ambient motion: swaying basket, a glowing burner flicker, drifting mist puffs, a distant second balloon, birds.',
    durationLabel: 'the balloon\'s ascent',
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
      'Sea turtle swimming across a shallow reef of staghorn, brain and fan coral. A fish school crosses the other way, two clownfish dart around an anemone and a jellyfish pulses upward. Ambient motion: surface ripples, light rays, light rippling on the sand, swaying kelp and tentacles, rising bubbles.',
    durationLabel: 'the turtle\'s crossing',
    defaultDuration: 50,
    theme: reefTheme,
    file: 'reef-scene',
    tone: 'light',
    Component: ReefScene as SceneEntry['Component'],
  },
  {
    slug: 'train',
    name: 'TrainScene',
    title: 'Train',
    blurb: 'Steam train crossing a viaduct. Dusk.',
    description:
      'Steam train with its headlamp lit crossing a five-arched stone viaduct at dusk, mountains and a setting sun behind and a hazy valley seen through the arches. Ambient motion: steam puffs, twinkling stars, drifting valley mist.',
    durationLabel: 'the train crossing the frame',
    defaultDuration: 30,
    theme: trainTheme,
    file: 'train-scene',
    tone: 'light',
    Component: TrainScene as SceneEntry['Component'],
  },
  {
    slug: 'aurora',
    name: 'AuroraScene',
    title: 'Aurora',
    blurb: 'Northern lights over a cabin by a frozen lake. Night.',
    description:
      'Three curtains of northern lights drift, breathe and lean over snow-capped mountains, mirrored faintly in a frozen lake. A cabin with a lit window and smoking chimney sits among pines on the snowy shore. Ambient motion: twinkling stars, an occasional shooting star, chimney smoke, a glowing window.',
    durationLabel: 'the main curtain of light to drift once across the sky',
    defaultDuration: 60,
    theme: auroraTheme,
    file: 'aurora-scene',
    tone: 'light',
    Component: AuroraScene as SceneEntry['Component'],
  },
  {
    slug: 'kite',
    name: 'KiteScene',
    title: 'Kite',
    blurb: 'A child flying a kite from a grassy hill. Breezy afternoon.',
    description:
      'A child on a grassy hill flies a diamond kite that wanders a slow loop in the sky, its ribbon tail waving bow by bow. The string stays pinned to the child\'s hand, turning and stretching with the kite. Ambient motion: gusts that tilt the kite, a fluttering scarf, a windmill turning on the far hill, grass blowing, three layers of drifting clouds.',
    durationLabel: 'one loop of the kite\'s wander',
    defaultDuration: 16,
    theme: kiteTheme,
    file: 'kite-scene',
    tone: 'dark',
    Component: KiteScene as SceneEntry['Component'],
  },
  {
    slug: 'snowfall',
    name: 'SnowfallScene',
    title: 'Snowfall',
    blurb: 'A fox trotting through falling snow. Winter.',
    description:
      'Snow falling at three depths over a quiet winter valley (small slow flakes far away, six-armed spinning flakes up close, about 75 in all) while a red fox trots across the meadow. Snow-laden pines frame the scene and soft drifts lie along the bottom. Ambient motion: swaying flakes, a pale sun glow, the fox\'s bushy tail and an occasional glance.',
    durationLabel: 'the fox to cross the frame',
    defaultDuration: 36,
    theme: snowfallTheme,
    file: 'snowfall-scene',
    tone: 'dark',
    Component: SnowfallScene as SceneEntry['Component'],
  },
  {
    slug: 'blossom',
    name: 'BlossomScene',
    title: 'Blossom',
    blurb: 'Cherry petals drifting over a river as ducks swim by. Spring.',
    description:
      'A spring riverbank under a cherry tree in full bloom. Petals drift down on a breeze, spinning and fluttering (a 3D flip faked with scaleX), past a red arched bridge, while a mother duck leads three ducklings across the water. Ambient motion: a swaying canopy, soft bokeh light, glints on the river, bobbing ducks with fading wakes.',
    durationLabel: 'the ducks to cross the frame',
    defaultDuration: 50,
    theme: blossomTheme,
    file: 'blossom-scene',
    tone: 'dark',
    Component: BlossomScene as SceneEntry['Component'],
  },
  {
    slug: 'city',
    name: 'CityScene',
    title: 'City',
    blurb: 'A tram passing on a rainy city night.',
    description:
      'A city street on a rainy night: two rows of buildings with lit windows (a few flicker), a café with a neon sign that stutters, a streetlamp whose pool of light shows the rain, and a figure waiting under a red umbrella. A tram hums past on its overhead wire, its lights smeared in the wet road. Ambient motion: rain at two depths, ripples in the puddles, shimmering reflections.',
    durationLabel: 'the tram to cross the frame',
    defaultDuration: 24,
    theme: cityTheme,
    file: 'city-scene',
    tone: 'light',
    Component: CityScene as SceneEntry['Component'],
  },
  {
    slug: 'desert',
    name: 'DesertScene',
    title: 'Desert',
    blurb: 'A camel caravan crossing the dunes at sunset.',
    description:
      'A camel caravan crossing a dune crest at sunset: a guide with a staff walks ahead of three camels, one carrying a rider, each stepping along the ridge as it rises and dips. Layered dunes glow under a low sun, with a far oasis, sand blowing off the crests and the first stars coming out. Ambient motion: rolling gaits and nodding heads, wisps of sand, a pulsing sun glow, twinkling stars.',
    durationLabel: 'the caravan to cross the frame',
    defaultDuration: 60,
    theme: desertTheme,
    file: 'desert-scene',
    tone: 'dark',
    Component: DesertScene as SceneEntry['Component'],
  },
  {
    slug: 'autumn',
    name: 'AutumnScene',
    title: 'Autumn',
    blurb: 'A cyclist on a country road as maple leaves fall.',
    description:
      'A cyclist with a basket of flowers rides a winding country road on an autumn afternoon, staying on the road as it rises and dips. Maple leaves tumble down on the wind past orange and gold trees, a red barn with a silo sits on the hill, a fence runs along the verge and geese fly south in a V. Ambient motion: spinning wheels, pedalling legs, a streaming scarf, leaves that sway, spin and flutter.',
    durationLabel: 'the cyclist to cross the frame',
    defaultDuration: 30,
    theme: autumnTheme,
    file: 'autumn-scene',
    tone: 'dark',
    Component: AutumnScene as SceneEntry['Component'],
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
