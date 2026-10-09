'use client';

// Playground for components that wrap your content: backgrounds paint behind it,
// empty states show it under an illustration.

import { useRef, useState, type ComponentType } from 'react';
import { trackEvent, type ItemKind } from '@/lib/analytics';
import { getBackground } from '@/lib/backgrounds';
import { getEmptyState } from '@/lib/empty-states';
import { CodeBlock } from './code-block';
import { ThemeControls, snippetFor } from './theme-controls';
import styles from './playground.module.css';

type WrapKind = Extract<ItemKind, 'background' | 'empty'>;
type Entry = {
  name: string;
  animated: boolean;
  theme: Record<string, string>;
  Component: ComponentType<{ theme?: Partial<Record<string, string>>; paused?: boolean; className?: string; children?: React.ReactNode }>;
};

const lookup: Record<WrapKind, (slug: string) => Entry | undefined> = {
  background: getBackground,
  empty: getEmptyState,
};

export function WrapPlayground({ kind, slug }: { kind: WrapKind; slug: string }) {
  const entry = lookup[kind](slug)!;
  const { Component, theme: defaults, name } = entry;

  const [paused, setPaused] = useState(false);
  const [theme, setTheme] = useState<Record<string, string>>({});

  const used = useRef(new Set<string>());
  const noteUse = (control: string) => {
    if (used.current.has(control)) return;
    used.current.add(control);
    trackEvent('playground_use', { kind, item: slug, control });
  };

  const snippet = snippetFor(name, { theme, defaults, wrap: true });

  return (
    <div className={`${styles.playground} ${styles.playgroundWide}`}>
      {kind === 'background' ? (
        <Component theme={theme} paused={paused} className={styles.bgPreview}>
          <div className={styles.sampleCard}>
            <strong>Your app</strong>
            <span>Content sits on top of the background.</span>
          </div>
        </Component>
      ) : (
        <Component theme={theme} paused={paused} className={styles.emptyPreview}>
          <strong>Nothing here yet</strong>
          <p>Your message goes here, with an action if you need one.</p>
        </Component>
      )}

      <div className={styles.controls}>
        <div className={styles.buttons}>
          {entry.animated && (
            <button
              type="button"
              className={styles.button}
              onClick={() => {
                setPaused(p => !p);
                noteUse('pause');
              }}
            >
              {paused ? 'Play' : 'Pause'}
            </button>
          )}
          <button
            type="button"
            className={styles.button}
            onClick={() => {
              setTheme({});
              noteUse('reset');
            }}
          >
            Reset
          </button>
        </div>

        <ThemeControls
          defaults={defaults}
          theme={theme}
          onChange={(key, value) => {
            setTheme(t => ({ ...t, [key]: value }));
            noteUse(`theme.${key}`);
          }}
        />

        <CodeBlock title="Usage" code={snippet} item={slug} />
      </div>
    </div>
  );
}
