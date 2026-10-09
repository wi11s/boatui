import type { NextConfig } from 'next';

const COMPONENT_SOURCES = [
  './components/scenes/**/*',
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
  // Removed items: send old links somewhere useful. The two backgrounds that became scenes go to
  // their scene; everything else goes to its section of the home page.
  async redirects() {
    return [
      { source: '/backgrounds/snowfall', destination: '/scenes/snowfall', permanent: true },
      { source: '/backgrounds/snowfall.md', destination: '/scenes/snowfall.md', permanent: true },
      { source: '/backgrounds/petals', destination: '/scenes/blossom', permanent: true },
      { source: '/backgrounds/petals.md', destination: '/scenes/blossom.md', permanent: true },
      { source: '/backgrounds/:slug*', destination: '/#scenes', permanent: true },
      { source: '/empty-states/offline', destination: '/#empty-states', permanent: true },
      { source: '/empty-states/offline.md', destination: '/#empty-states', permanent: true },
    ];
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
