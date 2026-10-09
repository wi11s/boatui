// Served at /<category>/<slug>.md through a rewrite in next.config.ts.
import { allItems, findItem } from '@/lib/catalog';
import { itemMarkdown } from '@/lib/llms';

export const dynamic = 'force-static';
export const dynamicParams = false;

export function generateStaticParams() {
  return allItems().map(({ category, item }) => ({ category: category.path, slug: item.slug }));
}

export async function GET(_request: Request, { params }: { params: Promise<{ category: string; slug: string }> }) {
  const { category: path, slug } = await params;
  const found = findItem(path, slug);
  if (!found) return new Response('Not found', { status: 404 });
  return new Response(await itemMarkdown(found.category, found.item), {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
}
