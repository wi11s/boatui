'use client';

import { useRef, useState } from 'react';
import { trackEvent } from '@/lib/analytics';
import { getScene } from '@/lib/registry';
import { CodeBlock } from './code-block';
import { ThemeControls, snippetFor } from './theme-controls';
import styles from './playground.module.css';

/** Live preview and controls for a scene. */
export function Playground({ slug }: { slug: string }) {
  const scene = getScene(slug)!;
  const { Component, defaultDuration, theme: defaults, name } = scene;

  const [duration, setDuration] = useState(defaultDuration);
  const [paused, setPaused] = useState(false);
  const [theme, setTheme] = useState<Record<string, string>>({});

  // Record each control once per page view; sliders and colour pickers fire on every movement.
  const used = useRef(new Set<string>());
  const noteUse = (control: string) => {
    if (used.current.has(control)) return;
    used.current.add(control);
    trackEvent('playground_use', { kind: 'scene', item: slug, control });
  };

  const snippet = snippetFor(name, { props: [duration !== defaultDuration && `duration={${duration}}`], theme, defaults });

  return (
    <div className={styles.playground}>
      <div className={styles.preview}>
        <Component duration={duration} paused={paused} theme={theme} />
      </div>

      <div className={styles.controls}>
        <div className={styles.group}>
          <label className={styles.row}>
            <span>
              Duration <small>({scene.durationLabel})</small>
            </span>
            <output>{duration}s</output>
          </label>
          <input
            type="range"
            min={10}
            max={150}
            step={1}
            value={duration}
            onChange={e => {
              setDuration(Number(e.target.value));
              noteUse('duration');
            }}
            aria-label="Duration in seconds"
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
              setDuration(defaultDuration);
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
