'use client';

import { useRef, useState } from 'react';
import { trackEvent } from '@/lib/analytics';
import { getBackground } from '@/lib/backgrounds';
import { CodeBlock } from './code-block';
import { ThemeControls, snippetFor } from './theme-controls';
import styles from './playground.module.css';

/** Live preview and controls for a background, with sample content on top. */
export function BackgroundPlayground({ slug }: { slug: string }) {
  const bg = getBackground(slug)!;
  const { Component, theme: defaults, name } = bg;

  const [paused, setPaused] = useState(false);
  const [theme, setTheme] = useState<Record<string, string>>({});

  const used = useRef(new Set<string>());
  const noteUse = (control: string) => {
    if (used.current.has(control)) return;
    used.current.add(control);
    trackEvent('playground_use', { kind: 'background', item: slug, control });
  };

  const snippet = snippetFor(name, { theme, defaults, wrap: true });

  return (
    <div className={`${styles.playground} ${styles.playgroundWide}`}>
      <Component theme={theme} paused={paused} className={styles.bgPreview}>
        <div className={styles.sampleCard}>
          <strong>Your app</strong>
          <span>Content sits on top of the background.</span>
        </div>
      </Component>

      <div className={styles.controls}>
        <div className={styles.buttons}>
          {bg.animated && (
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
