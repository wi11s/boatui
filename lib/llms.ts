// Plain-text and markdown documents for AI agents and other non-browser readers:
// /llms.txt (index), /llms-full.txt (everything) and /<category>/<slug>.md (one item).
// Everything is generated from the catalog and the real source files so it can't drift.

import { categories, type CatalogItem, type Category } from './catalog';
import { tokenToVar } from './registry';
import { CONTRIBUTING_URL, ISSUES_URL, REPO_URL, SITE_DESCRIPTION, SITE_NAME, SITE_URL, repoFile } from './site';
import { generateTokens, importTokens, itemSources, sharedSources, sharedTokens } from './source-stats';

const fmt = (n: number) => n.toLocaleString('en-US');
const fence = (lang: string, code: string) => `\`\`\`${lang}\n${code.trimEnd()}\n\`\`\``;
const langOf = (file: string) => (file.endsWith('.css') ? 'css' : 'tsx');
const table = (head: string[], rows: string[][]) =>
  [`| ${head.join(' | ')} |`, `| ${head.map(() => '---').join(' | ')} |`, ...rows.map(r => `| ${r.join(' | ')} |`)].join('\n');

export const itemMarkdownUrl = (category: Category, item: CatalogItem) => `${SITE_URL}/${category.path}/${item.slug}.md`;

const ABOUT = [
  'Copy-paste React components: files are copied into the project, not installed from npm. MIT licensed.',
  'Animation is CSS keyframes wherever possible; nothing runs a JavaScript animation loop unless the category says so.',
  'Every component respects prefers-reduced-motion and has the same `theme`, `className`, `style` and `children` props as the rest of its category.',
  'Requirements: React 18+ and CSS Modules (Next.js, Vite and most React setups support them).',
];

async function costs() {
  return Promise.all(
    categories.flatMap(category =>
      category.items.map(async item => ({
        category,
        item,
        generate: await generateTokens(category, item),
        use: importTokens(category, item),
      })),
    ),
  );
}

async function costLine() {
  const all = await costs();
  const min = Math.min(...all.map(c => c.generate));
  const max = Math.max(...all.map(c => c.generate));
  const use = Math.max(...all.map(c => c.use));
  return {
    all,
    line: `Writing a comparable component from scratch costs ${fmt(min)}–${fmt(max)} output tokens in a single pass before any visual iteration; importing one costs under ${use + 1}.`,
  };
}

/** /llms.txt: a short index following the llms.txt convention. */
export async function llmsIndex() {
  const { line } = await costLine();
  return [
    `# ${SITE_NAME}`,
    '',
    `> ${SITE_DESCRIPTION} Use a prebuilt component instead of generating animated illustrations or textures. ${line}`,
    '',
    ...ABOUT.map(a => `- ${a}`),
    '',
    ...categories.flatMap(category => [
      `## ${category.label}`,
      '',
      category.about,
      '',
      `Install all: \`${category.install}\`${category.requires ? ` (requires \`${category.requires}\`)` : ''}`,
      '',
      ...category.items.map(item => `- [${item.name}](${itemMarkdownUrl(category, item)}): ${item.description}`),
      '',
    ]),
    '## Docs',
    '',
    `- [Full documentation](${SITE_URL}/llms-full.txt): every component's props, theme tokens, usage and source in one file`,
    `- [Repository](${REPO_URL}): source on GitHub`,
    `- [Contributing](${CONTRIBUTING_URL}): how to add a component`,
    `- [Issues](${ISSUES_URL}): bugs and requests`,
    '',
  ].join('\n');
}

/** /<category>/<slug>.md: one item, complete, including its source. */
export async function itemMarkdown(category: Category, item: CatalogItem, { heading = 1 }: { heading?: number } = {}) {
  const h = (level: number) => '#'.repeat(level + heading - 1);
  const sources = await itemSources(category, item);
  const generate = await generateTokens(category, item);

  return [
    `${h(1)} ${item.name}`,
    '',
    `> ${item.description}`,
    '',
    `- Page: ${SITE_URL}/${category.path}/${item.slug}`,
    `- Source: ${repoFile(`${category.dir}/${item.file}.tsx`)}`,
    `- ${item.animated ? 'Animated' : 'Static'}. Generate: ~${fmt(generate)} tokens (source size, single pass). Import: ~${importTokens(category, item)} tokens.`,
    '',
    `${h(2)} Install`,
    '',
    `All ${category.label.toLowerCase()}: \`${category.install}\`${category.requires ? `, then \`${category.requires}\`` : ''}`,
    '',
    `Only this one: copy the shared files (${category.sharedFiles.map(f => `\`${f}\``).join(', ')}) and ${sources.map(f => `\`${f.name}\``).join(' and ')} into \`${category.dir}/\`. Shared files are in ${SITE_URL}/llms-full.txt.`,
    '',
    `${h(2)} Usage`,
    '',
    fence('tsx', category.usage(item)),
    '',
    `${h(2)} Props`,
    '',
    table(['Prop', 'Type', 'Default', 'Description'], category.props(item).map(([p, t, d, desc]) => [`\`${p}\``, `\`${t}\``, d, desc])),
    '',
    `${h(2)} Theme tokens`,
    '',
    table(['Key', 'CSS variable', 'Default'], Object.entries(item.theme).map(([k, v]) => [`\`${k}\``, `\`${tokenToVar(k)}\``, `\`${v}\``])),
    '',
    `${h(2)} Source`,
    '',
    ...sources.flatMap(f => [`\`${category.dir}/${f.name}\``, '', fence(langOf(f.name), f.code), '']),
  ].join('\n');
}

/** /llms-full.txt: the whole library in one document. */
export async function llmsFull() {
  const { all, line } = await costLine();
  const sections = await Promise.all(
    categories.map(async category => {
      const [docs, shared, sharedCount] = await Promise.all([
        Promise.all(category.items.map(item => itemMarkdown(category, item, { heading: 3 }))),
        sharedSources(category),
        sharedTokens(category),
      ]);
      return [
        `## ${category.label}`,
        '',
        category.about,
        '',
        fence('bash', category.requires ? `${category.install}\n${category.requires}` : category.install),
        '',
        `Shared files add ~${fmt(sharedCount)} tokens once.`,
        '',
        ...docs.flatMap(doc => [doc, '']),
        `### Shared ${category.label.toLowerCase()} files`,
        '',
        ...shared.flatMap(f => [`\`${category.dir}/${f.name}\``, '', fence(langOf(f.name), f.code), '']),
      ];
    }),
  );

  return [
    `# ${SITE_NAME}`,
    '',
    `> ${SITE_DESCRIPTION}`,
    '',
    '## Why use it',
    '',
    `${line} Estimates use four characters per token.`,
    '',
    table(
      ['Component', 'Generate (tokens)', 'Import (tokens)', 'Ratio'],
      all.map(c => [`\`${c.item.name}\``, fmt(c.generate), String(c.use), `${Math.round(c.generate / c.use)}×`]),
    ),
    '',
    ...ABOUT.map(a => `- ${a}`),
    '',
    ...sections.flat(),
  ].join('\n');
}
