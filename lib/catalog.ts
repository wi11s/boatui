// One description per component category. The home page, detail pages, markdown docs,
// llms.txt and sitemap all read from here, so adding a category is one entry plus its components.

import type { ComponentType, ReactNode } from 'react';
import type { ItemKind } from './analytics';
import { SHARED_FILES, sceneProps, scenes } from './registry';
import { EMPTY_STATE_SHARED_FILES, emptyStateProps, emptyStates } from './empty-states';
import { LOADER_SHARED_FILES, loaderProps, loaders } from './loaders';
import {
  EMPTY_STATES_INSTALL_COMMAND,
  INSTALL_COMMAND,
  LOADERS_INSTALL_COMMAND,
  THREE_INSTALL_COMMAND,
} from './site';
import { THREE_SHARED_FILES, threeProps, threeScenes } from './three';

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
  /** Extra props for the home-page card, e.g. a larger loader size. */
  cardProps?: Record<string, unknown>;
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
    kind: 'empty',
    label: 'Empty states',
    path: 'empty-states',
    dir: 'components/empty-states',
    sharedFiles: EMPTY_STATE_SHARED_FILES,
    install: EMPTY_STATES_INSTALL_COMMAND,
    about:
      'Empty states are small animated illustrations for screens with nothing to show yet: empty lists, no search results, inbox zero. Pass your message and actions as children and they appear centred under the illustration. Pure server components with CSS animation, drawn in a 240×180 box. Props: `theme`, `size` (illustration width, default 240), `paused`, `className`, `style`, `children`.',
    card: 'wide',
    items: emptyStates,
    props: item => emptyStateProps(emptyStates.find(e => e.slug === item.slug)!),
    files: tsxAndCss,
    usage: item =>
      `import { ${item.name} } from '@/components/empty-states/${item.file}';\n\nexport function NoProjects() {\n  return (\n    <${item.name}>\n      <h2>No projects yet</h2>\n      <p>Create one to get started.</p>\n    </${item.name}>\n  );\n}`,
  },
  {
    kind: 'loader',
    label: 'Loaders',
    path: 'loaders',
    dir: 'components/loaders',
    sharedFiles: LOADER_SHARED_FILES,
    install: LOADERS_INSTALL_COMMAND,
    about:
      'Loaders are small animated loading indicators with a bit of character, drawn in a 100×100 box. Each renders `role="status"` with a visually hidden label for screen readers. Under prefers-reduced-motion the choreography is replaced by a slow fade, so the loader still reads as working. Pure server components with CSS animation. Props: `theme`, `size` (pixels, default 64), `label` (default "Loading…"), `paused`, `className`, `style`.',
    card: 'wide',
    cardProps: { size: 112 },
    items: loaders,
    props: item => loaderProps(loaders.find(l => l.slug === item.slug)!),
    files: tsxAndCss,
    usage: item =>
      `import { ${item.name} } from '@/components/loaders/${item.file}';\n\nexport function Saving() {\n  return <${item.name} size={48} label="Saving your changes…" />;\n}`,
  },
  {
    kind: 'three',
    label: '3D',
    path: '3d',
    dir: 'components/three',
    sharedFiles: THREE_SHARED_FILES,
    install: THREE_INSTALL_COMMAND,
    requires: 'npm i three',
    about:
      '3D scenes are three.js client components. A shared frame (`three-frame.tsx`) owns the canvas: it sizes to its container (4:3 by default), caps pixel ratio at 2, stops rendering while off-screen, in hidden tabs or when `paused`, shows one still frame under prefers-reduced-motion, falls back to the CSS background when WebGL is unavailable, and disposes every geometry and material on unmount. Each scene is one file with a module-level `setup` that builds the scene and returns `update(time)` and `setTheme(theme)`, so colour changes apply live. Props: `theme`, `speed`, `paused`, `className`, `style`, `children`.',
    card: 'wide',
    items: threeScenes,
    props: item => threeProps(threeScenes.find(s => s.slug === item.slug)!),
    files: item => [`${item.file}.tsx`],
    usage: item =>
      `'use client';\n\nimport { ${item.name} } from '@/components/three/${item.file}';\n\nexport function Hero() {\n  return (\n    <${item.name} speed={1}>\n      <h1>Your content</h1>\n    </${item.name}>\n  );\n}`,
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
