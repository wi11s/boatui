import type { MetadataRoute } from 'next';
import { scenes } from '@/lib/registry';
import { SITE_URL } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE_URL, priority: 1 },
    ...scenes.map(s => ({ url: `${SITE_URL}/scenes/${s.slug}`, priority: 0.8 })),
    { url: `${SITE_URL}/llms.txt`, priority: 0.6 },
    { url: `${SITE_URL}/llms-full.txt`, priority: 0.6 },
    ...scenes.map(s => ({ url: `${SITE_URL}/scenes/${s.slug}.md`, priority: 0.5 })),
  ];
}
