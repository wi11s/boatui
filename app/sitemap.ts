import type { MetadataRoute } from 'next';
import { allItems } from '@/lib/catalog';
import { SITE_URL } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const items = allItems();
  return [
    { url: SITE_URL, priority: 1 },
    ...items.map(({ category, item }) => ({ url: `${SITE_URL}/${category.path}/${item.slug}`, priority: 0.8 })),
    { url: `${SITE_URL}/llms.txt`, priority: 0.6 },
    { url: `${SITE_URL}/llms-full.txt`, priority: 0.6 },
    ...items.map(({ category, item }) => ({ url: `${SITE_URL}/${category.path}/${item.slug}.md`, priority: 0.5 })),
  ];
}
