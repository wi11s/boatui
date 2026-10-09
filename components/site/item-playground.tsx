'use client';

import type { ItemKind } from '@/lib/analytics';
import { LoaderPlayground } from './loader-playground';
import { Playground } from './playground';
import { ThreePlayground } from './three-playground';
import { WrapPlayground } from './wrap-playground';

/** Picks the playground for a category. Add new categories here. */
export function ItemPlayground({ kind, slug }: { kind: ItemKind; slug: string }) {
  switch (kind) {
    case 'scene':
      return <Playground slug={slug} />;
    case 'background':
    case 'empty':
      return <WrapPlayground kind={kind} slug={slug} />;
    case 'loader':
      return <LoaderPlayground slug={slug} />;
    case 'three':
      return <ThreePlayground slug={slug} />;
  }
}
