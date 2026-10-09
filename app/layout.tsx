import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';
import styles from './layout.module.css';

export const metadata: Metadata = {
  title: { default: 'Quiet Scenes', template: '%s · Quiet Scenes' },
  description: 'Small, calm, animated SVG scenes for the web. Copy-paste React components with CSS-only motion. MIT licensed.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className={styles.header}>
          <div className={`container ${styles.headerInner}`}>
            <Link href="/" className={styles.logo}>
              <span className={styles.logoMark} aria-hidden="true" />
              Quiet Scenes
            </Link>
            <nav className={styles.nav}>
              <Link href="/#scenes">Scenes</Link>
              <Link href="/#usage">Usage</Link>
            </nav>
          </div>
        </header>
        <main className={styles.main}>{children}</main>
        <footer className={styles.footer}>
          <div className="container">Open source under the MIT license. Drawn in SVG, moved with CSS.</div>
        </footer>
      </body>
    </html>
  );
}
