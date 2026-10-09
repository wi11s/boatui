'use client';

import { useRef, useState } from 'react';
import { trackEvent } from '@/lib/analytics';
import { getThreeScene } from '@/lib/three';
import { CodeBlock } from './code-block';
import { ThemeControls, snippetFor } from './theme-controls';
import styles from './playground.module.css';

/** Live preview and controls for a 3D scene. */
export function ThreePlayground({ slug }: { slug: string }) {
  const entry = getThreeScene(slug)!;
  const { Component, theme: defaults, name } = entry;

  const [speed, setSpeed] = useState(1);
  const [paused, setPaused] = useState(false);
  const [theme, setTheme] = useState<Record<string, string>>({});

  const used = useRef(new Set<string>());
  const noteUse = (control: string) => {
    if (used.current.has(control)) return;
    used.current.add(control);
    trackEvent('playground_use', { kind: 'three', item: slug, control });
  };

  const snippet = snippetFor(name, { props: [speed !== 1 && `speed={${speed}}`], theme, defaults });

  return (
    <div className={`${styles.playground} ${styles.playgroundWide}`}>
      <Component theme={theme} paused={paused} speed={speed} className={styles.threePreview} />

      <div className={styles.controls}>
        <div className={styles.group}>
          <label className={styles.row}>
            <span>Speed</span>
            <output>{speed}×</output>
          </label>
          <input
            type="range"
            min={0.25}
            max={3}
            step={0.25}
            value={speed}
            onChange={e => {
              setSpeed(Number(e.target.value));
              noteUse('speed');
            }}
            aria-label="Animation speed"
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
              setSpeed(1);
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
