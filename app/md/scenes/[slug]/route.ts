// Served at /scenes/<slug>.md through a rewrite in next.config.ts.
import { sceneMarkdown } from '@/lib/llms';
import { getScene, scenes } from '@/lib/registry';

export const dynamic = 'force-static';

export function generateStaticParams() {
  return scenes.map(s => ({ slug: s.slug }));
}

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const scene = getScene((await params).slug);
  if (!scene) return new Response('Not found', { status: 404 });
  return new Response(await sceneMarkdown(scene), { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } });
}
