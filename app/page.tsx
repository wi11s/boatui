import { Command } from '@/components/site/command';
import { ItemCard } from '@/components/site/item-card';
import { JsonLd } from '@/components/site/json-ld';
import { TrackedLink } from '@/components/site/tracked-link';
import { allItems, categories } from '@/lib/catalog';
import { REPO_URL, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from '@/lib/site';
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
          hasPart: allItems().map(({ category, item }) => ({
            '@type': 'SoftwareSourceCode',
            name: item.name,
            description: item.description,
            url: `${SITE_URL}/${category.path}/${item.slug}`,
          })),
        }}
      />

      <section className={styles.hero}>
        <h1 className={styles.lede}>Animated scenes, backgrounds and 3D for React. Copy-paste components you own.</h1>
        <p className={styles.meta}>
          MIT ·{' '}
          <TrackedLink href={REPO_URL} event="github_click" eventProps={{ target: 'repo', location: 'hero' }}>
            GitHub
          </TrackedLink>
        </p>
      </section>

      {categories.map(category => (
        <section key={category.path} id={category.path} className={styles.section}>
          <div className={styles.sectionHead}>
            <h2>{category.label}</h2>
            <Command command={category.install} location={category.path} />
          </div>
          {category.requires && (
            <p className={styles.requires}>
              Requires <code>{category.requires}</code>
            </p>
          )}
          <div className={category.card === 'wide' ? styles.wideGrid : styles.grid}>
            {category.items.map(item => (
              <ItemCard key={item.slug} category={category} item={item} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
