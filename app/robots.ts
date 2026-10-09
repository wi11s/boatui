import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';

// Everything is public and meant to be read, including by AI crawlers and agents.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/' }],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
