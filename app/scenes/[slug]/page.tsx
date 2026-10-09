import { readFile } from 'node:fs/promises';
import path from 'node:path';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CodeBlock } from '@/components/site/code-block';
import { Playground } from '@/components/site/playground';
import { SHARED_FILES, getScene, scenes, tokenToVar } from '@/lib/registry';
import styles from './page.module.css';

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return scenes.map(s => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const scene = getScene((await params).slug);
  return scene ? { title: scene.title, description: scene.description } : {};
}

const SCENES_DIR = path.join(process.cwd(), 'components/scenes');
const readSource = (file: string) => readFile(path.join(SCENES_DIR, file), 'utf8');

export default async function ScenePage({ params }: Params) {
  const scene = getScene((await params).slug);
  if (!scene) notFound();

  const ownFiles = [`${scene.file}.tsx`, `${scene.file}.module.css`];
  const [own, shared] = await Promise.all([
    Promise.all(ownFiles.map(async name => ({ name, code: await readSource(name) }))),
    Promise.all(SHARED_FILES.map(async name => ({ name, code: await readSource(name) }))),
  ]);

  const PROPS = [
    ['duration', 'number', `${scene.defaultDuration}`, `Seconds for ${scene.durationLabel}.`],
    ['theme', `Partial<${scene.name.replace('Scene', 'Theme')}>`, '—', 'Override any colour token below.'],
    ['paused', 'boolean', 'false', 'Freeze the animation. It also pauses on its own while off-screen.'],
    ['className', 'string', '—', 'Added to the outer element.'],
    ['style', 'CSSProperties', '—', 'Merged onto the outer element.'],
    ['children', 'ReactNode', '—', 'Rendered on top of the scene, filling it.'],
  ];

  return (
    <div className="container">
      <Link href="/#scenes" className={styles.back}>← All scenes</Link>

      <header className={styles.header}>
        <p className={styles.eyebrow}>{scene.title}</p>
        <h1 className={styles.title}>{`<${scene.name} />`}</h1>
        <p className={styles.lede}>{scene.description}</p>
      </header>

      <Playground slug={scene.slug} />

      <section className={styles.section}>
        <h2>Props</h2>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr>
            </thead>
            <tbody>
              {PROPS.map(([prop, type, def, desc]) => (
                <tr key={prop}>
                  <td><code>{prop}</code></td>
                  <td><code>{type}</code></td>
                  <td><code>{def}</code></td>
                  <td>{desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className={styles.section}>
        <h2>Theme tokens</h2>
        <p className={styles.note}>
          Pass these through <code>theme</code>, or set the CSS variables on a parent with <code>style</code>.
        </p>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr><th>Token</th><th>CSS variable</th><th>Default</th></tr>
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
      </section>

      <section className={styles.section}>
        <h2>Add it to your project</h2>
        <ol className={styles.steps}>
          <li>
            Copy the shared files into <code>components/scenes/</code>. You only need these once, whichever scenes you use.
          </li>
          <li>Copy this scene&apos;s two files next to them.</li>
          <li>
            Import <code>{scene.name}</code> and render it. No packages to install beyond React.
          </li>
        </ol>

        <h3 className={styles.subhead}>{scene.name}</h3>
        <div className={styles.files}>
          {own.map(f => <CodeBlock key={f.name} title={`components/scenes/${f.name}`} code={f.code} />)}
        </div>

        <h3 className={styles.subhead}>Shared files</h3>
        <div className={styles.files}>
          {shared.map(f => (
            <details key={f.name} className={styles.details}>
              <summary>components/scenes/{f.name}</summary>
              <CodeBlock title={`components/scenes/${f.name}`} code={f.code} />
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
