import Link from 'next/link';
import type { SceneEntry } from '@/lib/registry';
import styles from './scene-card.module.css';

export function SceneCard({ scene }: { scene: SceneEntry }) {
  const { Component } = scene;
  return (
    <Link href={`/scenes/${scene.slug}`} className={styles.card} aria-label={`${scene.title}: ${scene.name}`}>
      <Component>
        <div className={`${styles.copy} ${scene.tone === 'light' ? styles.light : ''}`}>
          <h3>{scene.title}</h3>
          <p>{scene.blurb}</p>
        </div>
        <span className={styles.tag}>{`<${scene.name} />`}</span>
      </Component>
    </Link>
  );
}
