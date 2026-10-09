import type { SceneEntry } from '@/lib/registry';
import { TrackedLink } from './tracked-link';
import styles from './scene-card.module.css';

export function SceneCard({ scene }: { scene: SceneEntry }) {
  const { Component } = scene;
  return (
    <TrackedLink
      href={`/scenes/${scene.slug}`}
      className={styles.card}
      event="item_open"
      eventProps={{ kind: 'scene', item: scene.slug, location: 'grid' }}
    >
      <div className={styles.art}>
        <Component />
      </div>
      <div className={styles.caption}>
        <span className={styles.title}>{scene.title}</span>
        <code className={styles.name}>{scene.name}</code>
      </div>
    </TrackedLink>
  );
}
