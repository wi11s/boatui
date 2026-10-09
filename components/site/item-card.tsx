import type { CatalogItem, Category } from '@/lib/catalog';
import { TrackedLink } from './tracked-link';
import styles from './item-card.module.css';

/** A home-page card: the live component plus its title and export name. */
export function ItemCard({ category, item }: { category: Category; item: CatalogItem }) {
  const { Component } = item;
  return (
    <TrackedLink
      href={`/${category.path}/${item.slug}`}
      className={styles.card}
      event="item_open"
      eventProps={{ kind: category.kind, item: item.slug, location: 'grid' }}
    >
      <Component {...category.cardProps} className={`${styles.art} ${category.card === 'wide' ? styles.wide : ''}`} />
      <div className={styles.caption}>
        <span className={styles.title}>{item.title}</span>
        <code className={styles.name}>{item.name}</code>
      </div>
    </TrackedLink>
  );
}
