'use client';

import { useState } from 'react';
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
            onChange={e => setDuration(Number(e.target.value))}
            aria-label="Duration in seconds"
          />
        </div>

        <div className={styles.buttons}>
          <button type="button" className={styles.button} onClick={() => setPaused(p => !p)}>
            {paused ? 'Play' : 'Pause'}
          </button>
          <button
            type="button"
            className={styles.button}
            onClick={() => {
              setDuration(defaultDuration);
              setTheme({});
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
                onChange={e => setTheme(t => ({ ...t, [key]: e.target.value }))}
              />
              <span>{label(key)}</span>
            </label>
          ))}
        </fieldset>

        <CodeBlock title="Usage" code={snippet} />
      </div>
    </div>
  );
}
