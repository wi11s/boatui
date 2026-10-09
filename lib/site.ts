export const SITE_NAME = 'Quiet Scenes';
export const SITE_DESCRIPTION =
  'Prebuilt animated SVG scene components for React. CSS-only motion, typed props, theme tokens, zero dependencies.';

/**
 * Absolute site origin, used for sitemap, robots, llms.txt and structured data.
 * Set NEXT_PUBLIC_SITE_URL for a custom domain; on Vercel the production URL is used automatically.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : 'http://localhost:3000')
).replace(/\/$/, '');

export const REPO_URL = 'https://github.com/wi11s/boatui';

/** Link to a file or folder on the main branch. */
export const repoFile = (path: string) => `${REPO_URL}/blob/main/${path}`;

export const CONTRIBUTING_URL = repoFile('CONTRIBUTING.md');
export const ISSUES_URL = `${REPO_URL}/issues`;

/** Copies the whole scenes folder into a project. */
export const INSTALL_COMMAND = 'npx degit wi11s/boatui/components/scenes components/scenes';
