import type { ComponentType } from 'react';
import {
  EmptyBalloon,
  EmptyFishing,
  EmptyHammock,
  EmptySprout,
  EmptyMailbox,
  EmptyNap,
  emptyBalloonTheme,
  emptyFishingTheme,
  emptyHammockTheme,
  emptySproutTheme,
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
  {
    slug: 'sprout',
    name: 'EmptySprout',
    title: 'Sprout',
    blurb: 'A seedling being watered. For "create your first…".',
    description:
      'A seedling in a terracotta pot being watered: drops fall from a tilted watering can and ripple the soil, the sprout sways and its two leaves open and close, and the sun\'s rays turn slowly. For getting-started and "create your first…" screens.',
    animated: true,
    theme: emptySproutTheme,
    file: 'empty-sprout',
    Component: EmptySprout as EmptyStateEntry['Component'],
  },
  {
    slug: 'hammock',
    name: 'EmptyHammock',
    title: 'Hammock',
    blurb: 'Someone dozing in a hammock. For "all caught up".',
    description:
      'Someone dozing in a hammock strung between two palms, a straw hat over their face and a drink waiting on the sand. The hammock swings like a pendulum, the hat rises and falls with their breathing, the fronds stir and small Zs drift up. For "all caught up", inbox zero and "nothing to do" screens.',
    animated: true,
    theme: emptyHammockTheme,
    file: 'empty-hammock',
    Component: EmptyHammock as EmptyStateEntry['Component'],
  },
  {
    slug: 'balloon',
    name: 'EmptyBalloon',
    title: 'Balloon',
    blurb: 'A lone balloon drifting away. For "page not found".',
    description:
      'A lone red balloon drifting up and away, its string trailing and waving, as clouds slide down past it and a bird flaps by. It hangs in the frame and tilts on the breeze, so it reads as rising without leaving. For "page not found" (404), missing links and lost things.',
    animated: true,
    theme: emptyBalloonTheme,
    file: 'empty-balloon',
    Component: EmptyBalloon as EmptyStateEntry['Component'],
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
