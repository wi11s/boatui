import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // These routes read component source files from disk.
  outputFileTracingIncludes: {
    '/scenes/[slug]': ['./components/scenes/**/*'],
    '/md/scenes/[slug]': ['./components/scenes/**/*'],
    '/backgrounds/[slug]': ['./components/backgrounds/**/*'],
    '/md/backgrounds/[slug]': ['./components/backgrounds/**/*'],
    '/llms.txt': ['./components/scenes/**/*', './components/backgrounds/**/*'],
    '/llms-full.txt': ['./components/scenes/**/*', './components/backgrounds/**/*'],
  },
  async rewrites() {
    return {
      // Checked before dynamic routes, so /scenes/boat.md doesn't hit the /scenes/[slug] page.
      beforeFiles: [
        { source: '/scenes/:slug.md', destination: '/md/scenes/:slug' },
        { source: '/backgrounds/:slug.md', destination: '/md/backgrounds/:slug' },
      ],
      afterFiles: [],
      fallback: [],
    };
  },
};

export default nextConfig;
