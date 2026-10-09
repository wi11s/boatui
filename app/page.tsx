import { BackgroundCard } from '@/components/site/background-card';
import { Command } from '@/components/site/command';
import { JsonLd } from '@/components/site/json-ld';
import { SceneCard } from '@/components/site/scene-card';
import { TrackedLink } from '@/components/site/tracked-link';
import { backgrounds } from '@/lib/backgrounds';
import { scenes } from '@/lib/registry';
import {
  BACKGROUNDS_INSTALL_COMMAND,
  INSTALL_COMMAND,
  REPO_URL,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
} from '@/lib/site';
import styles from './page.module.css';

export default function Home() {
  return (
    <div className="container">
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'SoftwareSourceCode',
          name: SITE_NAME,
          description: SITE_DESCRIPTION,
          url: SITE_URL,
          codeRepository: REPO_URL,
          license: 'https://opensource.org/licenses/MIT',
          programmingLanguage: ['TypeScript', 'CSS'],
          runtimePlatform: 'React',
          hasPart: [
            ...scenes.map(s => ({ name: s.name, description: s.description, url: `${SITE_URL}/scenes/${s.slug}` })),
            ...backgrounds.map(b => ({ name: b.name, description: b.description, url: `${SITE_URL}/backgrounds/${b.slug}` })),
          ].map(part => ({ '@type': 'SoftwareSourceCode', ...part })),
        }}
      />

      <section className={styles.hero}>
        <h1 className={styles.title}>Quiet Scenes</h1>
        <p className={styles.lede}>
          Animated scenes and textured backgrounds for React. Copy-paste, CSS-only, no dependencies.
        </p>
        <p className={styles.meta}>
          MIT ·{' '}
          <TrackedLink href={REPO_URL} event="github_click" eventProps={{ target: 'repo', location: 'hero' }}>
            GitHub
          </TrackedLink>
        </p>
      </section>

      <section id="scenes" className={styles.section}>
        <div className={styles.sectionHead}>
          <h2>Scenes</h2>
          <Command command={INSTALL_COMMAND} location="scenes" />
        </div>
        <div className={styles.grid}>
          {scenes.map(scene => (
            <SceneCard key={scene.slug} scene={scene} />
          ))}
        </div>
      </section>

      <section id="backgrounds" className={styles.section}>
        <div className={styles.sectionHead}>
          <h2>Backgrounds</h2>
          <Command command={BACKGROUNDS_INSTALL_COMMAND} location="backgrounds" />
        </div>
        <div className={styles.bgGrid}>
          {backgrounds.map(bg => (
            <BackgroundCard key={bg.slug} background={bg} />
          ))}
        </div>
      </section>
    </div>
  );
}
