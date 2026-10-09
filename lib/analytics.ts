import { track } from '@vercel/analytics';

/**
 * Every custom event the site sends to Vercel Analytics, with its properties.
 * Add new events here so the full list stays in one place.
 */
export type AnalyticsEvents = {
  /** Any link to GitHub: repo, file, issues, guidelines, license. */
  github_click: { target: string; location: string; scene?: string };
  /** Opened a scene page from the home page. */
  scene_open: { scene: string; location: string };
  /** Copied the one-line install command. */
  install_copy: { location: string };
  /** Copied a code block. */
  code_copy: { title: string; scene?: string };
  /** First use of a playground control during a page view. */
  playground_use: { scene: string; control: string };
};

export type AnalyticsEventName = keyof AnalyticsEvents;

export function trackEvent<E extends AnalyticsEventName>(name: E, properties: AnalyticsEvents[E]) {
  track(name, properties);
}
