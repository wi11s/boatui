// Detail page for any catalog item: /scenes/boat, /loaders/tea, …

import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CodeBlock } from '@/components/site/code-block';
import { ItemPlayground } from '@/components/site/item-playground';
import { JsonLd } from '@/components/site/json-ld';
import { TrackedLink } from '@/components/site/tracked-link';
import { allItems, findItem } from '@/lib/catalog';
import { tokenToVar } from '@/lib/registry';
import { REPO_URL, SITE_NAME, SITE_URL, repoFile } from '@/lib/site';
import { itemSources, sharedSources } from '@/lib/source-stats';
import styles from '@/components/site/item-page.module.css';

type Params = { params: Promise<{ category: string; slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return allItems().map(({ category, item }) => ({ category: category.path, slug: item.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { category: path, slug } = await params;
  const found = findItem(path, slug);
  if (!found) return {};
  const { item } = found;
  return {
    title: item.name,
    description: `<${item.name} />: ${item.description}`,
    alternates: { canonical: `/${path}/${slug}`, types: { 'text/markdown': `/${path}/${slug}.md` } },
  };
}

export default async function ItemPage({ params }: Params) {
  const { category: path, slug } = await params;
  const found = findItem(path, slug);
  if (!found) notFound();
  const { category, item } = found;

  const [own, shared] = await Promise.all([itemSources(category, item), sharedSources(category)]);

  return (
    <div className="container">
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'SoftwareSourceCode',
          name: item.name,
          description: item.description,
          url: `${SITE_URL}/${category.path}/${item.slug}`,
          codeRepository: REPO_URL,
          license: 'https://opensource.org/licenses/MIT',
          programmingLanguage: ['TypeScript', 'CSS'],
          runtimePlatform: 'React',
          isPartOf: { '@type': 'SoftwareSourceCode', name: SITE_NAME, url: SITE_URL },
        }}
      />

      <Link href={`/#${category.path}`} className={styles.back}>← {category.label}</Link>

      <header className={styles.header}>
        <h1 className={styles.title}>{item.title}</h1>
        <p className={styles.lede}>
          <code className={styles.name}>{`<${item.name} />`}</code> {item.blurb}
        </p>
        <p className={styles.meta}>
          {item.animated ? 'Animated' : 'Static'} ·{' '}
          <TrackedLink
            href={repoFile(`${category.dir}/${item.file}.tsx`)}
            event="github_click"
            eventProps={{ target: 'source_file', location: 'item_header', item: item.slug }}
          >
            Source
          </TrackedLink>{' '}
          · <a href={`/${category.path}/${item.slug}.md`}>Markdown</a>
        </p>
      </header>

      <ItemPlayground kind={category.kind} slug={item.slug} />

      <details className={styles.details}>
        <summary>Props and theme tokens</summary>
        <div className={styles.detailsBody}>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr>
              </thead>
              <tbody>
                {category.props(item).map(([prop, type, def, desc]) => (
                  <tr key={prop}>
                    <td><code>{prop}</code></td>
                    <td><code>{type}</code></td>
                    <td>{def}</td>
                    <td>{desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr><th>Theme key</th><th>CSS variable</th><th>Default</th></tr>
              </thead>
              <tbody>
                {Object.entries(item.theme).map(([key, value]) => (
                  <tr key={key}>
                    <td><code>{key}</code></td>
                    <td><code>{tokenToVar(key)}</code></td>
                    <td>
                      <span className={styles.swatch} style={{ background: value }} aria-hidden="true" />
                      <code>{value}</code>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </details>

      <details className={styles.details}>
        <summary>Source files</summary>
        <div className={styles.detailsBody}>
          <p className={styles.note}>
            Copy into <code>{category.dir}/</code>. The shared files are needed once for all {category.label.toLowerCase()}.
            {category.requires && (
              <>
                {' '}Also run <code>{category.requires}</code>.
              </>
            )}
          </p>
          {[...own, ...shared].map(f => (
            <CodeBlock key={f.name} title={`${category.dir}/${f.name}`} code={f.code} item={item.slug} />
          ))}
        </div>
      </details>
    </div>
  );
}
