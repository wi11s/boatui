import { CodeBlock } from '@/components/site/code-block';
import { SceneCard } from '@/components/site/scene-card';
import { scenes } from '@/lib/registry';
import styles from './page.module.css';

const FEATURES = [
  { title: 'Light to run', body: 'Pure SVG and CSS keyframes. No WebGL, no canvas, no animation loop in JavaScript.' },
  { title: 'Yours to edit', body: 'Copy the files into your project. Change the timing and colours through props, or the drawing itself.' },
  { title: 'Considerate', body: 'Pauses while off-screen and holds still for people who prefer reduced motion.' },
];

const USAGE = `import { BoatScene } from '@/components/scenes';

export default function Hero() {
  return (
    <BoatScene duration={60} theme={{ hull: '#2f6fb0' }}>
      <h1>Slow crossings</h1>
    </BoatScene>
  );
}`;

export default function Home() {
  return (
    <>
      <section className={`container ${styles.hero}`}>
        <div className={styles.heroInner}>
          <p className={styles.eyebrow}>Open source · MIT</p>
          <h1 className={styles.title}>Small, calm scenes for the web.</h1>
          <p className={styles.lede}>
            Quiet Scenes is a collection of animated illustrations you can drop into a page as React components.
            Each one is a single portrait card with room for your own content on top.
          </p>
        </div>
      </section>

      <section id="scenes" className={`container ${styles.grid}`}>
        {scenes.map(scene => (
          <SceneCard key={scene.slug} scene={scene} />
        ))}
      </section>

      <section className={`container ${styles.features}`}>
        {FEATURES.map(f => (
          <div key={f.title} className={styles.feature}>
            <h2>{f.title}</h2>
            <p>{f.body}</p>
          </div>
        ))}
      </section>

      <section id="usage" className={`container ${styles.usage}`}>
        <div>
          <h2>Usage</h2>
          <p>
            Copy <code>components/scenes</code> into your project, or just the shared files plus the scenes you want.
            Every scene takes the same props: <code>duration</code>, <code>theme</code>, <code>paused</code>,{' '}
            <code>className</code>, <code>style</code>, and children to render on top.
          </p>
          <p>Open any scene above to try its colours and timing and copy its source.</p>
        </div>
        <CodeBlock title="app/hero.tsx" code={USAGE} />
      </section>
    </>
  );
}
