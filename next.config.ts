import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // These routes read component source files from disk.
  outputFileTracingIncludes: {
    '/scenes/[slug]': ['./components/scenes/**/*'],
    '/md/scenes/[slug]': ['./components/scenes/**/*'],
    '/llms.txt': ['./components/scenes/**/*'],
    '/llms-full.txt': ['./components/scenes/**/*'],
  },
  async rewrites() {
    return {
      // Checked before dynamic routes, so /scenes/boat.md doesn't hit the /scenes/[slug] page.
      beforeFiles: [{ source: '/scenes/:slug.md', destination: '/md/scenes/:slug' }],
      afterFiles: [],
      fallback: [],
    };
  },
};

export default nextConfig;
