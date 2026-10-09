import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CodeBlock } from '@/components/site/code-block';
import { JsonLd } from '@/components/site/json-ld';
import { Playground } from '@/components/site/playground';
import { TrackedLink } from '@/components/site/tracked-link';
import { SHARED_FILES, getScene, sceneProps, scenes, tokenToVar } from '@/lib/registry';
import { REPO_URL, SITE_NAME, SITE_URL, repoFile } from '@/lib/site';
import { readSceneSource, sceneFiles } from '@/lib/source-stats';
import styles from './page.module.css';

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return scenes.map(s => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const scene = getScene((await params).slug);
  if (!scene) return {};
  return {
    title: scene.name,
    description: `<${scene.name} />: ${scene.description}`,
    alternates: { canonical: `/scenes/${scene.slug}`, types: { 'text/markdown': `/scenes/${scene.slug}.md` } },
  };
}

export default async function ScenePage({ params }: Params) {
  const scene = getScene((await params).slug);
  if (!scene) notFound();

  const [own, shared] = await Promise.all([
    Promise.all(sceneFiles(scene).map(async name => ({ name, code: await readSceneSource(name) }))),
    Promise.all(SHARED_FILES.map(async name => ({ name, code: await readSceneSource(name) }))),
  ]);

  return (
    <div className="container">
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'SoftwareSourceCode',
          name: scene.name,
          description: scene.description,
          url: `${SITE_URL}/scenes/${scene.slug}`,
          codeRepository: REPO_URL,
          license: 'https://opensource.org/licenses/MIT',
          programmingLanguage: ['TypeScript', 'CSS'],
          runtimePlatform: 'React',
          isPartOf: { '@type': 'SoftwareSourceCode', name: SITE_NAME, url: SITE_URL },
        }}
      />

      <Link href="/" className={styles.back}>← Scenes</Link>

      <header className={styles.header}>
        <h1 className={styles.title}>{scene.title}</h1>
        <p className={styles.lede}>
          <code className={styles.name}>{`<${scene.name} />`}</code> {scene.blurb}
        </p>
        <p className={styles.meta}>
          <TrackedLink
            href={repoFile(`components/scenes/${scene.file}.tsx`)}
            event="github_click"
            eventProps={{ target: 'source_file', location: 'scene_header', scene: scene.slug }}
          >
            Source
          </TrackedLink>{' '}
          · <a href={`/scenes/${scene.slug}.md`}>Markdown</a>
        </p>
      </header>

      <Playground slug={scene.slug} />

      <details className={styles.details}>
        <summary>Props and theme tokens</summary>
        <div className={styles.detailsBody}>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr>
              </thead>
              <tbody>
                {sceneProps(scene).map(([prop, type, def, desc]) => (
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
                {Object.entries(scene.theme).map(([key, value]) => (
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
            Copy into <code>components/scenes/</code>. The shared files are needed once for all scenes.
          </p>
          {[...own, ...shared].map(f => (
            <CodeBlock key={f.name} title={`components/scenes/${f.name}`} code={f.code} scene={scene.slug} />
          ))}
        </div>
      </details>
    </div>
  );
}
