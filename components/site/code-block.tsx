'use client';

import { useState } from 'react';
import styles from './code-block.module.css';

type Props = {
  code: string;
  /** Shown in the header bar, e.g. a filename. */
  title?: string;
};

export function CodeBlock({ code, title }: Props) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard can be unavailable (insecure context, denied permission); leave the button as is.
    }
  }

  return (
    <div className={styles.block}>
      <div className={styles.bar}>
        <span className={styles.title}>{title}</span>
        <button type="button" className={styles.copy} onClick={copy}>
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre className={styles.pre}>
        <code>{code}</code>
      </pre>
    </div>
  );
}
