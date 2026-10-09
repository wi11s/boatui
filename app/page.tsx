import { Command } from '@/components/site/command';
import { JsonLd } from '@/components/site/json-ld';
import { SceneCard } from '@/components/site/scene-card';
import { TrackedLink } from '@/components/site/tracked-link';
import { scenes } from '@/lib/registry';
import { INSTALL_COMMAND, REPO_URL, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from '@/lib/site';
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
          hasPart: scenes.map(s => ({
            '@type': 'SoftwareSourceCode',
            name: s.name,
            description: s.description,
            url: `${SITE_URL}/scenes/${s.slug}`,
          })),
        }}
      />

      <section className={styles.hero}>
        <h1 className={styles.title}>Quiet Scenes</h1>
        <p className={styles.lede}>Animated SVG scenes for React. Copy-paste, CSS-only, no dependencies.</p>
        <div className={styles.install}>
          <Command command={INSTALL_COMMAND} location="hero" />
        </div>
        <p className={styles.meta}>
          MIT ·{' '}
          <TrackedLink href={REPO_URL} event="github_click" eventProps={{ target: 'repo', location: 'hero' }}>
            GitHub
          </TrackedLink>
        </p>
      </section>

      <section id="scenes" className={styles.grid} aria-label="Scenes">
        {scenes.map(scene => (
          <SceneCard key={scene.slug} scene={scene} />
        ))}
      </section>
    </div>
  );
}
