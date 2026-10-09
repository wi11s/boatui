'use client';

import styles from './playground.module.css';

// waterTop → "Water top", hill2 → "Hill 2"
const label = (key: string) => {
  const words = key.replace(/([A-Z])/g, ' $1').replace(/(\d+)/g, ' $1').toLowerCase();
  return words.charAt(0).toUpperCase() + words.slice(1);
};

type Props = {
  defaults: Record<string, string>;
  theme: Record<string, string>;
  onChange: (key: string, value: string) => void;
};

/** A colour picker per theme token. */
export function ThemeControls({ defaults, theme, onChange }: Props) {
  return (
    <fieldset className={styles.colors}>
      <legend>Theme</legend>
      {Object.entries(defaults).map(([key, value]) => (
        <label key={key} className={styles.color}>
          <input type="color" value={theme[key] ?? value} onChange={e => onChange(key, e.target.value)} />
          <span>{label(key)}</span>
        </label>
      ))}
    </fieldset>
  );
}

type SnippetOptions = {
  props?: (string | false)[];
  theme: Record<string, string>;
  defaults: Record<string, string>;
  /** Wrap `{children}` instead of self-closing. */
  wrap?: boolean;
};

/** The JSX a user would write for the current playground state. */
export function snippetFor(name: string, { props = [], theme, defaults, wrap }: SnippetOptions) {
  const changed = Object.entries(theme).filter(([key, value]) => value !== defaults[key]);
  const lines = [
    ...props.filter((p): p is string => Boolean(p)).map(p => `  ${p}`),
    ...(changed.length > 0
      ? [`  theme={{\n${changed.map(([key, value]) => `    ${key}: '${value}',`).join('\n')}\n  }}`]
      : []),
  ];
  const open = lines.length ? `<${name}\n${lines.join('\n')}\n` : `<${name} `;
  return wrap ? `${open.trimEnd()}>\n  {children}\n</${name}>` : `${open}/>`;
}
