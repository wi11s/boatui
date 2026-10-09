'use client';

import Link from 'next/link';
import type { ComponentProps } from 'react';
import { trackEvent, type AnalyticsEventName, type AnalyticsEvents } from '@/lib/analytics';

type Props<E extends AnalyticsEventName> = Omit<ComponentProps<'a'>, 'href'> & {
  href: string;
  event: E;
  eventProps: AnalyticsEvents[E];
};

/** A link that records an analytics event when clicked. Internal paths use next/link. */
export function TrackedLink<E extends AnalyticsEventName>({ href, event, eventProps, onClick, ...rest }: Props<E>) {
  const handleClick: ComponentProps<'a'>['onClick'] = e => {
    trackEvent(event, eventProps);
    onClick?.(e);
  };

  if (href.startsWith('/') || href.startsWith('#')) {
    return <Link href={href} onClick={handleClick} {...rest} />;
  }
  return <a href={href} onClick={handleClick} {...rest} />;
}
