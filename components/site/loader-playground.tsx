'use client';

import { useRef, useState } from 'react';
import { trackEvent } from '@/lib/analytics';
import { getLoader } from '@/lib/loaders';
import { CodeBlock } from './code-block';
import { ThemeControls, snippetFor } from './theme-controls';
import styles from './playground.module.css';

/** Live preview and controls for a loader. */
export function LoaderPlayground({ slug }: { slug: string }) {
  const entry = getLoader(slug)!;
  const { Component, theme: defaults, name } = entry;

  const [size, setSize] = useState(96);
  const [paused, setPaused] = useState(false);
  const [theme, setTheme] = useState<Record<string, string>>({});

  const used = useRef(new Set<string>());
  const noteUse = (control: string) => {
    if (used.current.has(control)) return;
    used.current.add(control);
    trackEvent('playground_use', { kind: 'loader', item: slug, control });
  };

  const snippet = snippetFor(name, { props: [size !== 64 && `size={${size}}`], theme, defaults });

  return (
    <div className={`${styles.playground} ${styles.playgroundWide}`}>
      <div className={styles.loaderPreview}>
        <Component theme={theme} paused={paused} size={size} />
      </div>

      <div className={styles.controls}>
        <div className={styles.group}>
          <label className={styles.row}>
            <span>Size</span>
            <output>{size}px</output>
          </label>
          <input
            type="range"
            min={24}
            max={200}
            step={4}
            value={size}
            onChange={e => {
              setSize(Number(e.target.value));
              noteUse('size');
            }}
            aria-label="Size in pixels"
          />
        </div>

        <div className={styles.buttons}>
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
          <button
            type="button"
            className={styles.button}
            onClick={() => {
              setSize(96);
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
