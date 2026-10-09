import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // The scene pages read component source files from disk to show them.
  outputFileTracingIncludes: {
    '/scenes/[slug]': ['./components/scenes/**/*'],
  },
};

export default nextConfig;
