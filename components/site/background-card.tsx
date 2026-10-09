import type { BackgroundEntry } from '@/lib/backgrounds';
import { TrackedLink } from './tracked-link';
import styles from './scene-card.module.css';

export function BackgroundCard({ background: bg }: { background: BackgroundEntry }) {
  const { Component } = bg;
  return (
    <TrackedLink
      href={`/backgrounds/${bg.slug}`}
      className={styles.card}
      event="item_open"
      eventProps={{ kind: 'background', item: bg.slug, location: 'grid' }}
    >
      <Component className={`${styles.art} ${styles.tile}`} />
      <div className={styles.caption}>
        <span className={styles.title}>{bg.title}</span>
        <code className={styles.name}>{bg.name}</code>
      </div>
    </TrackedLink>
  );
}
