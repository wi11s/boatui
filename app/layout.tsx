import { Analytics } from '@vercel/analytics/next';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import Link from 'next/link';
import { Logo } from '@/components/site/logo';
import { TrackedLink } from '@/components/site/tracked-link';
import { categories } from '@/lib/catalog';
import { REPO_URL, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from '@/lib/site';
import './globals.css';
import styles from './layout.module.css';

const sans = Geist({ subsets: ['latin'], variable: '--font-geist-sans' });
const mono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono' });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: SITE_NAME, template: `%s · ${SITE_NAME}` },
  description: `${SITE_DESCRIPTION} Import a finished scene instead of generating one. MIT.`,
  // Point agents at the plain-text docs.
  alternates: { types: { 'text/markdown': '/llms.txt' } },
  openGraph: { siteName: SITE_NAME, type: 'website' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable}`}>
      <body>
        <header className={styles.header}>
          <div className={`container ${styles.headerInner}`}>
            <Link href="/" className={styles.logo}>
              <Logo size={24} />
              {SITE_NAME}
            </Link>
            <nav className={styles.nav}>
              {categories.map(c => (
                <Link key={c.path} href={`/#${c.path}`} className={styles.optional}>
                  {c.label}
                </Link>
              ))}
              <TrackedLink href={REPO_URL} event="github_click" eventProps={{ target: 'repo', location: 'header' }}>
                GitHub
              </TrackedLink>
            </nav>
          </div>
        </header>

        <main className={styles.main}>{children}</main>

        <footer className={styles.footer}>
          <div className={`container ${styles.footerInner}`}>
            <span>MIT licensed</span>
            <span className={styles.footerLinks}>
              <TrackedLink href={REPO_URL} event="github_click" eventProps={{ target: 'repo', location: 'footer' }}>
                Source
              </TrackedLink>
              <a href="/llms.txt">llms.txt</a>
            </span>
          </div>
        </footer>
        <Analytics />
      </body>
    </html>
  );
}
