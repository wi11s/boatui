import type { ComponentType } from 'react';
import {
  EmptyNap,
  emptyNapTheme,
  type EmptyStateProps,
} from '@/components/empty-states';

export type EmptyStateEntry = {
  slug: string;
  /** Exported component name. */
  name: string;
  title: string;
  blurb: string;
  description: string;
  animated: boolean;
  theme: Record<string, string>;
  /** Base filename in components/empty-states (without extension). */
  file: string;
  Component: ComponentType<EmptyStateProps<Record<string, string>>>;
};

export const emptyStates: EmptyStateEntry[] = [
  {
    slug: 'nap',
    name: 'EmptyNap',
    title: 'Nap',
    blurb: 'A cat asleep on a cushion. For "nothing here yet".',
    description:
      'A tabby cat curled up asleep on a tufted cushion, chin on its paws, tail wrapped round its front, a ball of yarn on the floor beside it. Its body rises and falls as it breathes, the tail tip flicks, an ear twitches now and then, and Zs drift up and fade. For empty lists and "nothing here yet" screens.',
    animated: true,
    theme: emptyNapTheme,
    file: 'empty-nap',
    Component: EmptyNap as EmptyStateEntry['Component'],
  },
];

export const getEmptyState = (slug: string) => emptyStates.find(s => s.slug === slug);

/** Files every empty state depends on; copy these once. */
export const EMPTY_STATE_SHARED_FILES = ['empty-state.tsx', 'empty-state.module.css'];

/** The props every empty state accepts, as [name, type, default, description]. */
export const emptyStateProps = (entry: EmptyStateEntry): [string, string, string, string][] => [
  ['theme', `Partial<${entry.name}Theme>`, '—', 'Colour overrides. Keys listed under theme tokens.'],
  ['size', 'number', '240', 'Illustration width in pixels. Scales down to fit narrow containers.'],
  ['paused', 'boolean', 'false', 'Freezes the animation.'],
  ['className', 'string', '—', 'Applied to the root element (a centred column).'],
  ['style', 'CSSProperties', '—', 'Merged into the root element style, after theme variables.'],
  ['children', 'ReactNode', '—', 'Your message and actions, shown under the illustration.'],
];
