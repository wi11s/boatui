// One description per component category. The home page, detail pages, markdown docs,
// llms.txt and sitemap all read from here, so adding a category is one entry plus its components.

import type { ComponentType, ReactNode } from 'react';
import type { ItemKind } from './analytics';
import { BACKGROUND_SHARED_FILES, backgroundProps, backgrounds } from './backgrounds';
import { SHARED_FILES, sceneProps, scenes } from './registry';
import { BACKGROUNDS_INSTALL_COMMAND, INSTALL_COMMAND } from './site';

/** [prop, type, default, description] */
export type PropRow = [string, string, string, string];

export type CatalogItem = {
  slug: string;
  /** Exported component name. */
  name: string;
  title: string;
  blurb: string;
  description: string;
  animated: boolean;
  theme: Record<string, string>;
  /** Base filename in the category folder (without extension). */
  file: string;
  // Props differ per category; each category's own playground and card know the shape.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Component: ComponentType<any>;
};

export type Category = {
  kind: ItemKind;
  /** Plural label, e.g. "Scenes". */
  label: string;
  /** URL segment: /<path>/<slug> and /<path>/<slug>.md */
  path: string;
  /** Folder the components live in. */
  dir: string;
  sharedFiles: string[];
  install: string;
  /** Packages to install besides React, if any. */
  requires?: string;
  /** One paragraph for agents: what the category is and the shared API. */
  about: string;
  /** Card shape on the home page. */
  card: 'tall' | 'wide';
  items: CatalogItem[];
  props: (item: CatalogItem) => PropRow[];
  /** Files for one item, relative to `dir`. */
  files: (item: CatalogItem) => string[];
  /** A minimal usage example. */
  usage: (item: CatalogItem) => string;
};

const tsxAndCss = (item: CatalogItem) => [`${item.file}.tsx`, `${item.file}.module.css`];

export const categories: Category[] = [
  {
    kind: 'scene',
    label: 'Scenes',
    path: 'scenes',
    dir: 'components/scenes',
    sharedFiles: SHARED_FILES,
    install: INSTALL_COMMAND,
    about:
      'Scenes are portrait SVG illustrations (400×700 viewBox) animated with CSS keyframes only. They render on the server; a small client frame pauses them while off-screen. Every scene has the same props: `duration` (seconds for the main crossing), `theme` (partial colour overrides), `paused`, `className`, `style`, and `children` (rendered above the art, filling it). A scene fills its container width at a 4:7 aspect ratio. Theme keys map to CSS variables (`skyTop` → `--sky-top`, `water1` → `--water-1`); set variables through the scene\'s own `style`, not a parent.',
    card: 'tall',
    items: scenes.map(s => ({ ...s, animated: true })),
    props: item => sceneProps(scenes.find(s => s.slug === item.slug)!),
    files: tsxAndCss,
    usage: item => {
      const s = scenes.find(x => x.slug === item.slug)!;
      return `import { ${s.name} } from '@/components/scenes/${s.file}';\n\nexport function Hero() {\n  return (\n    <${s.name} duration={${s.defaultDuration}}>\n      <h1>Your content</h1>\n    </${s.name}>\n  );\n}`;
    },
  },
  {
    kind: 'background',
    label: 'Backgrounds',
    path: 'backgrounds',
    dir: 'components/backgrounds',
    sharedFiles: BACKGROUND_SHARED_FILES,
    install: BACKGROUNDS_INSTALL_COMMAND,
    about:
      'Backgrounds are textures that paint behind your content: wrap content in the component, e.g. `<PetalsBackground><App /></PetalsBackground>`. They are pure server components with no client JavaScript; particles move with CSS keyframes and container units, so they fill any size. Every background has the same props: `theme`, `paused`, `className`, `style` and `children`. The root is a block element with `position: relative`; size it like any div (for a full page, `min-height: 100vh`).',
    card: 'wide',
    items: backgrounds,
    props: item => backgroundProps(backgrounds.find(b => b.slug === item.slug)!),
    files: tsxAndCss,
    usage: item =>
      `import { ${item.name} } from '@/components/backgrounds/${item.file}';\n\nexport default function Layout({ children }: { children: React.ReactNode }) {\n  return <${item.name} style={{ minHeight: '100vh' }}>{children}</${item.name}>;\n}`,
  },
];

export const getCategory = (path: string) => categories.find(c => c.path === path);

export const findItem = (path: string, slug: string) => {
  const category = getCategory(path);
  const item = category?.items.find(i => i.slug === slug);
  return category && item ? { category, item } : undefined;
};

/** Every [category, item] pair, for static params and sitemaps. */
export const allItems = () => categories.flatMap(category => category.items.map(item => ({ category, item })));

export type { ReactNode };
