export const SITE_NAME = 'boatUI';
export const SITE_DESCRIPTION =
  'Prebuilt animated components for React: SVG scenes, textured backgrounds and three.js 3D scenes. Typed props and theme tokens; scenes and backgrounds have zero dependencies.';

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

/** Copies the whole 3D folder into a project (also needs `npm i three`). */
export const THREE_INSTALL_COMMAND = 'npx degit wi11s/boatui/components/three components/three';

/** Copies the whole loaders folder into a project. */
export const LOADERS_INSTALL_COMMAND = 'npx degit wi11s/boatui/components/loaders components/loaders';

/** Copies the whole empty-states folder into a project. */
export const EMPTY_STATES_INSTALL_COMMAND = 'npx degit wi11s/boatui/components/empty-states components/empty-states';

/** Copies the whole backgrounds folder into a project. */
export const BACKGROUNDS_INSTALL_COMMAND = 'npx degit wi11s/boatui/components/backgrounds components/backgrounds';
