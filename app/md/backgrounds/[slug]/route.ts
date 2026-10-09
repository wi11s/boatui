// Served at /backgrounds/<slug>.md through a rewrite in next.config.ts.
import { getBackground, backgrounds } from '@/lib/backgrounds';
import { backgroundMarkdown } from '@/lib/llms';

export const dynamic = 'force-static';

export function generateStaticParams() {
  return backgrounds.map(b => ({ slug: b.slug }));
}

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const bg = getBackground((await params).slug);
  if (!bg) return new Response('Not found', { status: 404 });
  return new Response(await backgroundMarkdown(bg), { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } });
}
