import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BackgroundPlayground } from '@/components/site/background-playground';
import { CodeBlock } from '@/components/site/code-block';
import { JsonLd } from '@/components/site/json-ld';
import { TrackedLink } from '@/components/site/tracked-link';
import { BACKGROUND_SHARED_FILES, backgroundProps, backgrounds, getBackground } from '@/lib/backgrounds';
import { tokenToVar } from '@/lib/registry';
import { REPO_URL, SITE_NAME, SITE_URL, repoFile } from '@/lib/site';
import { backgroundFiles, readBackgroundSource } from '@/lib/source-stats';
import styles from '@/components/site/item-page.module.css';

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return backgrounds.map(b => ({ slug: b.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const bg = getBackground((await params).slug);
  if (!bg) return {};
  return {
    title: bg.name,
    description: `<${bg.name} />: ${bg.description}`,
    alternates: { canonical: `/backgrounds/${bg.slug}`, types: { 'text/markdown': `/backgrounds/${bg.slug}.md` } },
  };
}

export default async function BackgroundPage({ params }: Params) {
  const bg = getBackground((await params).slug);
  if (!bg) notFound();

  const files = await Promise.all(
    [...backgroundFiles(bg), ...BACKGROUND_SHARED_FILES].map(async name => ({
      name,
      code: await readBackgroundSource(name),
    })),
  );

  return (
    <div className="container">
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'SoftwareSourceCode',
          name: bg.name,
          description: bg.description,
          url: `${SITE_URL}/backgrounds/${bg.slug}`,
          codeRepository: REPO_URL,
          license: 'https://opensource.org/licenses/MIT',
          programmingLanguage: ['TypeScript', 'CSS'],
          runtimePlatform: 'React',
          isPartOf: { '@type': 'SoftwareSourceCode', name: SITE_NAME, url: SITE_URL },
        }}
      />

      <Link href="/#backgrounds" className={styles.back}>← Backgrounds</Link>

      <header className={styles.header}>
        <h1 className={styles.title}>{bg.title}</h1>
        <p className={styles.lede}>
          <code className={styles.name}>{`<${bg.name} />`}</code> {bg.blurb}
        </p>
        <p className={styles.meta}>
          {bg.animated ? 'Animated' : 'Static'} ·{' '}
          <TrackedLink
            href={repoFile(`components/backgrounds/${bg.file}.tsx`)}
            event="github_click"
            eventProps={{ target: 'source_file', location: 'background_header', item: bg.slug }}
          >
            Source
          </TrackedLink>{' '}
          · <a href={`/backgrounds/${bg.slug}.md`}>Markdown</a>
        </p>
      </header>

      <BackgroundPlayground slug={bg.slug} />

      <details className={styles.details}>
        <summary>Props and theme tokens</summary>
        <div className={styles.detailsBody}>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr>
              </thead>
              <tbody>
                {backgroundProps(bg).map(([prop, type, def, desc]) => (
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
                {Object.entries(bg.theme).map(([key, value]) => (
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
            Copy into <code>components/backgrounds/</code>. The shared files are needed once for all backgrounds.
          </p>
          {files.map(f => (
            <CodeBlock key={f.name} title={`components/backgrounds/${f.name}`} code={f.code} item={bg.slug} />
          ))}
        </div>
      </details>
    </div>
  );
}
