import type { MetadataRoute } from 'next';
import { backgrounds } from '@/lib/backgrounds';
import { scenes } from '@/lib/registry';
import { SITE_URL } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE_URL, priority: 1 },
    ...scenes.map(s => ({ url: `${SITE_URL}/scenes/${s.slug}`, priority: 0.8 })),
    ...backgrounds.map(b => ({ url: `${SITE_URL}/backgrounds/${b.slug}`, priority: 0.8 })),
    { url: `${SITE_URL}/llms.txt`, priority: 0.6 },
    { url: `${SITE_URL}/llms-full.txt`, priority: 0.6 },
    ...scenes.map(s => ({ url: `${SITE_URL}/scenes/${s.slug}.md`, priority: 0.5 })),
    ...backgrounds.map(b => ({ url: `${SITE_URL}/backgrounds/${b.slug}.md`, priority: 0.5 })),
  ];
}
