import type { NextConfig } from 'next';

const COMPONENT_SOURCES = [
  './components/scenes/**/*',
  './components/backgrounds/**/*',
  './components/empty-states/**/*',
  './components/loaders/**/*',
  './components/three/**/*',
];

const nextConfig: NextConfig = {
  // These routes read component source files from disk.
  outputFileTracingIncludes: {
    '/[category]/[slug]': COMPONENT_SOURCES,
    '/md/[category]/[slug]': COMPONENT_SOURCES,
    '/llms.txt': COMPONENT_SOURCES,
    '/llms-full.txt': COMPONENT_SOURCES,
  },
  async rewrites() {
    return {
      // Checked before dynamic routes, so /scenes/boat.md doesn't hit the /[category]/[slug] page.
      beforeFiles: [{ source: '/:category/:slug.md', destination: '/md/:category/:slug' }],
      afterFiles: [],
      fallback: [],
    };
  },
};

export default nextConfig;
