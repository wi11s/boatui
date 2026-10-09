'use client';

import type { ItemKind } from '@/lib/analytics';
import { BackgroundPlayground } from './background-playground';
import { Playground } from './playground';
import { ThreePlayground } from './three-playground';

/** Picks the playground for a category. Add new categories here. */
export function ItemPlayground({ kind, slug }: { kind: ItemKind; slug: string }) {
  switch (kind) {
    case 'scene':
      return <Playground slug={slug} />;
    case 'background':
      return <BackgroundPlayground slug={slug} />;
    case 'three':
      return <ThreePlayground slug={slug} />;
  }
}
