'use client';

import { useState } from 'react';
import { trackEvent } from '@/lib/analytics';
import styles from './command.module.css';

/** A one-line shell command with a copy button. */
export function Command({ command, location }: { command: string; location: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(command);
      trackEvent('install_copy', { location });
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard can be unavailable (insecure context, denied permission); leave the button as is.
    }
  }

  return (
    <div className={styles.command}>
      <span className={styles.prompt} aria-hidden="true">$</span>
      <code className={styles.text}>{command}</code>
      <button type="button" className={styles.copy} onClick={copy} aria-label="Copy command">
        {copied ? 'Copied' : 'Copy'}
      </button>
    </div>
  );
}
