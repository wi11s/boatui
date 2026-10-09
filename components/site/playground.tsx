'use client';

import { useRef, useState } from 'react';
import { trackEvent } from '@/lib/analytics';
import { getScene } from '@/lib/registry';
import { CodeBlock } from './code-block';
import styles from './playground.module.css';

// waterTop → "Water top", hill2 → "Hill 2"
const label = (key: string) => {
  const words = key.replace(/([A-Z])/g, ' $1').replace(/(\d+)/g, ' $1').toLowerCase();
  return words.charAt(0).toUpperCase() + words.slice(1);
};

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
    trackEvent('playground_use', { scene: slug, control });
  };

  const changed = Object.entries(theme).filter(([key, value]) => value !== defaults[key]);
  const props = [
    duration !== defaultDuration && `  duration={${duration}}`,
    changed.length > 0 &&
      `  theme={{\n${changed.map(([key, value]) => `    ${key}: '${value}',`).join('\n')}\n  }}`,
  ].filter(Boolean);
  const snippet = props.length ? `<${name}\n${props.join('\n')}\n/>` : `<${name} />`;

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

        <fieldset className={styles.colors}>
          <legend>Theme</legend>
          {Object.entries(defaults).map(([key, value]) => (
            <label key={key} className={styles.color}>
              <input
                type="color"
                value={theme[key] ?? value}
                onChange={e => {
                  setTheme(t => ({ ...t, [key]: e.target.value }));
                  noteUse(`theme.${key}`);
                }}
              />
              <span>{label(key)}</span>
            </label>
          ))}
        </fieldset>

        <CodeBlock title="Usage" code={snippet} scene={slug} />
      </div>
    </div>
  );
}
