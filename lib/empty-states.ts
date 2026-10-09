import type { ComponentType } from 'react';
import {
  EmptyFishing,
  EmptyMailbox,
  EmptyNap,
  emptyFishingTheme,
  emptyMailboxTheme,
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
  {
    slug: 'fishing',
    name: 'EmptyFishing',
    title: 'Fishing',
    blurb: 'A bobber in a quiet pond, fish swimming past. For "no results".',
    description:
      'A fishing line dropped into a quiet pond: the bobber bobs and sends out rings while two fish glide right past it under the surface. Reeds and cattails sway at the edge and a lily flowers on its pad. For "no results" and empty search screens.',
    animated: true,
    theme: emptyFishingTheme,
    file: 'empty-fishing',
    Component: EmptyFishing as EmptyStateEntry['Component'],
  },
  {
    slug: 'mailbox',
    name: 'EmptyMailbox',
    title: 'Mailbox',
    blurb: 'An open, empty mailbox with a bird on top. For inbox zero.',
    description:
      'A mailbox on a post with its door hanging open on an empty inside and the flag down. A small bird perched on the roof pecks, hops and chirps; the door sways a little and the grass stirs. For inbox zero, "no messages" and "no notifications" screens.',
    animated: true,
    theme: emptyMailboxTheme,
    file: 'empty-mailbox',
    Component: EmptyMailbox as EmptyStateEntry['Component'],
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
