import { track } from '@vercel/analytics';

/** The component categories in the library. */
export type ItemKind = 'scene' | 'three' | 'empty' | 'loader';

/**
 * Every custom event the site sends to Vercel Analytics, with its properties.
 * Add new events here so the full list stays in one place.
 */
export type AnalyticsEvents = {
  /** Any link to GitHub: repo, file, issues, guidelines, license. */
  github_click: { target: string; location: string; item?: string };
  /** Opened an item's page from the home page. */
  item_open: { kind: ItemKind; item: string; location: string };
  /** Copied a one-line install command. */
  install_copy: { location: string };
  /** Copied a code block. */
  code_copy: { title: string; item?: string };
  /** First use of a playground control during a page view. */
  playground_use: { kind: ItemKind; item: string; control: string };
};

export type AnalyticsEventName = keyof AnalyticsEvents;

export function trackEvent<E extends AnalyticsEventName>(name: E, properties: AnalyticsEvents[E]) {
  track(name, properties);
}
