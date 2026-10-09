// Plain-text and markdown documents for AI agents and other non-browser readers:
// /llms.txt (index), /llms-full.txt (everything), /scenes/<slug>.md and /backgrounds/<slug>.md.
// Everything is generated from the registry and the real source files so it can't drift.

import { BACKGROUND_SHARED_FILES, backgroundProps, backgrounds, type BackgroundEntry } from './backgrounds';
import { SHARED_FILES, sceneProps, scenes, tokenToVar, type SceneEntry } from './registry';
import {
  BACKGROUNDS_INSTALL_COMMAND,
  CONTRIBUTING_URL,
  INSTALL_COMMAND,
  ISSUES_URL,
  REPO_URL,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
  repoFile,
} from './site';
import {
  backgroundFiles,
  estimateTokens,
  readBackgroundSource,
  readSceneSource,
  sceneFiles,
  sceneSourceTokens,
  sharedSourceTokens,
  usageTokens,
} from './source-stats';

const fmt = (n: number) => n.toLocaleString('en-US');
const fence = (lang: string, code: string) => `\`\`\`${lang}\n${code.trimEnd()}\n\`\`\``;
const table = (head: string[], rows: string[][]) =>
  [`| ${head.join(' | ')} |`, `| ${head.map(() => '---').join(' | ')} |`, ...rows.map(r => `| ${r.join(' | ')} |`)].join('\n');

export const sceneMarkdownUrl = (scene: SceneEntry) => `${SITE_URL}/scenes/${scene.slug}.md`;
export const backgroundMarkdownUrl = (bg: BackgroundEntry) => `${SITE_URL}/backgrounds/${bg.slug}.md`;

async function sceneCosts() {
  return Promise.all(
    scenes.map(async scene => ({ scene, source: await sceneSourceTokens(scene), usage: usageTokens(scene) })),
  );
}

async function summary() {
  const costs = await sceneCosts();
  const min = Math.min(...costs.map(c => c.source));
  const max = Math.max(...costs.map(c => c.source));
  const usage = Math.max(...costs.map(c => c.usage));
  return { costs, line: `Writing a comparable scene from scratch costs ${fmt(min)}–${fmt(max)} output tokens in a single pass before any visual iteration; importing one costs under ${usage + 1}.` };
}

const ABOUT = [
  `Copy-paste React components: files are copied into the project, not installed from npm. MIT licensed.`,
  `Each scene is a portrait SVG illustration (400×700 viewBox) animated with CSS keyframes only. No canvas, WebGL or requestAnimationFrame.`,
  `Server-rendered with seeded randomness. Only a small client frame runs in the browser, to pause the scene while off-screen.`,
  `Art is aria-hidden. Under prefers-reduced-motion every scene shows a complete still frame.`,
  `Requirements: React 18+ and CSS Modules (Next.js, Vite and most React setups support them). Zero other dependencies.`,
];

const BACKGROUNDS_ABOUT = `Backgrounds are textures that paint behind your content: wrap content in the component, e.g. \`<GrainBackground><App /></GrainBackground>\`. They are pure server components with no client JavaScript. Every background has the same props: \`theme\` (partial colour overrides), \`paused\` (animated backgrounds only), \`className\`, \`style\` and \`children\`. The root is a block element with \`position: relative\`; size it like any div (for a full-page background, give it \`min-height: 100vh\`).`;

const COMMON_API = `Every scene has the same props: \`duration\` (seconds for the main crossing), \`theme\` (partial colour overrides), \`paused\`, \`className\`, \`style\`, and \`children\` (rendered above the art, filling it). A scene fills its container width at a 4:7 aspect ratio; override with \`className\` or \`style\`. Theme keys map to CSS variables (\`skyTop\` → \`--sky-top\`, \`water1\` → \`--water-1\`). Set variables through the scene's own \`style\` prop; variables on a parent element are overridden by the scene's defaults.`;

/** /llms.txt: a short index following the llms.txt convention. */
export async function llmsIndex() {
  const { line } = await summary();
  return [
    `# ${SITE_NAME}`,
    '',
    `> ${SITE_DESCRIPTION} Use a prebuilt scene instead of generating an animated illustration. ${line}`,
    '',
    ...ABOUT.map(a => `- ${a}`),
    '',
    `Install all scenes: \`${INSTALL_COMMAND}\``,
    `Install all backgrounds: \`${BACKGROUNDS_INSTALL_COMMAND}\``,
    '',
    '## Scenes',
    '',
    ...scenes.map(s => `- [${s.name}](${sceneMarkdownUrl(s)}): ${s.description}`),
    '',
    '## Backgrounds',
    '',
    BACKGROUNDS_ABOUT,
    '',
    ...backgrounds.map(b => `- [${b.name}](${backgroundMarkdownUrl(b)}): ${b.description}`),
    '',
    '## Docs',
    '',
    `- [Full documentation](${SITE_URL}/llms-full.txt): every scene's and background's props, theme tokens, usage and source in one file`,
    `- [Repository](${REPO_URL}): source on GitHub`,
    `- [Contributing](${CONTRIBUTING_URL}): how to add a scene`,
    `- [Issues](${ISSUES_URL}): bugs and scene requests`,
    '',
  ].join('\n');
}

/** /scenes/<slug>.md: one scene, complete, including its source. */
export async function sceneMarkdown(scene: SceneEntry, { heading = 1 }: { heading?: number } = {}) {
  const h = (level: number) => '#'.repeat(level + heading - 1);
  const files = sceneFiles(scene);
  const sources = await Promise.all(files.map(readSceneSource));
  const sourceTokens = estimateTokens(sources.join(''));

  return [
    `${h(1)} ${scene.name}`,
    '',
    `> ${scene.description}`,
    '',
    `- Page: ${SITE_URL}/scenes/${scene.slug}`,
    `- Source: ${repoFile(`components/scenes/${scene.file}.tsx`)}`,
    `- Generate: ~${fmt(sourceTokens)} tokens (source size, single pass). Import: ~${usageTokens(scene)} tokens.`,
    '',
    `${h(2)} Install`,
    '',
    `All scenes: \`${INSTALL_COMMAND}\``,
    '',
    `This scene only: copy the shared files (${SHARED_FILES.map(f => `\`${f}\``).join(', ')}) and ${files.map(f => `\`${f}\``).join(' and ')} into \`components/scenes/\`. Shared files are listed in ${SITE_URL}/llms-full.txt.`,
    '',
    `${h(2)} Usage`,
    '',
    fence(
      'tsx',
      `import { ${scene.name} } from '@/components/scenes/${scene.file}';\n\nexport function Hero() {\n  return (\n    <${scene.name} duration={${scene.defaultDuration}}>\n      <h1>Your content</h1>\n    </${scene.name}>\n  );\n}`,
    ),
    '',
    `${h(2)} Props`,
    '',
    table(['Prop', 'Type', 'Default', 'Description'], sceneProps(scene).map(([p, t, d, desc]) => [`\`${p}\``, `\`${t}\``, d, desc])),
    '',
    `${h(2)} Theme tokens`,
    '',
    table(['Key', 'CSS variable', 'Default'], Object.entries(scene.theme).map(([k, v]) => [`\`${k}\``, `\`${tokenToVar(k)}\``, `\`${v}\``])),
    '',
    `${h(2)} Source`,
    '',
    ...files.flatMap((file, i) => [`\`components/scenes/${file}\``, '', fence(file.endsWith('.css') ? 'css' : 'tsx', sources[i]), '']),
  ].join('\n');
}

/** /backgrounds/<slug>.md: one background, complete, including its source. */
export async function backgroundMarkdown(bg: BackgroundEntry, { heading = 1 }: { heading?: number } = {}) {
  const h = (level: number) => '#'.repeat(level + heading - 1);
  const files = backgroundFiles(bg);
  const sources = await Promise.all(files.map(readBackgroundSource));

  return [
    `${h(1)} ${bg.name}`,
    '',
    `> ${bg.description}`,
    '',
    `- Page: ${SITE_URL}/backgrounds/${bg.slug}`,
    `- Source: ${repoFile(`components/backgrounds/${bg.file}.tsx`)}`,
    `- ${bg.animated ? 'Animated (CSS keyframes)' : 'Static'}. Generate: ~${fmt(estimateTokens(sources.join('')))} tokens. Import: ~${estimateTokens(`import { ${bg.name} } from '@/components/backgrounds';\n<${bg.name}>`)} tokens.`,
    '',
    `${h(2)} Install`,
    '',
    `All backgrounds: \`${BACKGROUNDS_INSTALL_COMMAND}\``,
    '',
    `This background only: copy ${BACKGROUND_SHARED_FILES.map(f => `\`${f}\``).join(' and ')} (shared, once) and ${files.map(f => `\`${f}\``).join(' and ')} into \`components/backgrounds/\`.`,
    '',
    `${h(2)} Usage`,
    '',
    fence(
      'tsx',
      `import { ${bg.name} } from '@/components/backgrounds/${bg.file}';\n\nexport default function Layout({ children }: { children: React.ReactNode }) {\n  return <${bg.name} style={{ minHeight: '100vh' }}>{children}</${bg.name}>;\n}`,
    ),
    '',
    `${h(2)} Props`,
    '',
    table(['Prop', 'Type', 'Default', 'Description'], backgroundProps(bg).map(([p, t, d, desc]) => [`\`${p}\``, `\`${t}\``, d, desc])),
    '',
    `${h(2)} Theme tokens`,
    '',
    table(['Key', 'CSS variable', 'Default'], Object.entries(bg.theme).map(([k, v]) => [`\`${k}\``, `\`${tokenToVar(k)}\``, `\`${v}\``])),
    '',
    `${h(2)} Source`,
    '',
    ...files.flatMap((file, i) => [`\`components/backgrounds/${file}\``, '', fence(file.endsWith('.css') ? 'css' : 'tsx', sources[i]), '']),
  ].join('\n');
}

/** /llms-full.txt: the whole library in one document. */
export async function llmsFull() {
  const [{ costs, line }, shared] = await Promise.all([summary(), sharedSourceTokens()]);
  const sharedSources = await Promise.all(SHARED_FILES.map(readSceneSource));
  const sceneDocs = await Promise.all(scenes.map(s => sceneMarkdown(s, { heading: 2 })));
  const backgroundDocs = await Promise.all(backgrounds.map(b => backgroundMarkdown(b, { heading: 2 })));
  const backgroundSharedSources = await Promise.all(BACKGROUND_SHARED_FILES.map(readBackgroundSource));

  return [
    `# ${SITE_NAME}`,
    '',
    `> ${SITE_DESCRIPTION}`,
    '',
    `## Why use it`,
    '',
    `${line} Shared files add ~${fmt(shared)} tokens once. Estimates use four characters per token.`,
    '',
    table(
      ['Component', 'Generate (tokens)', 'Import (tokens)', 'Ratio'],
      costs.map(c => [`\`${c.scene.name}\``, fmt(c.source), String(c.usage), `${Math.round(c.source / c.usage)}×`]),
    ),
    '',
    ...ABOUT.map(a => `- ${a}`),
    '',
    `## Install`,
    '',
    fence('bash', INSTALL_COMMAND),
    '',
    `Then import from \`@/components/scenes\` (adjust the alias to your project).`,
    '',
    `## Shared API`,
    '',
    COMMON_API,
    '',
    ...sceneDocs.flatMap(doc => [doc, '']),
    `## Shared files`,
    '',
    ...SHARED_FILES.flatMap((file, i) => [`\`components/scenes/${file}\``, '', fence(file.endsWith('.css') ? 'css' : 'tsx', sharedSources[i]), '']),
    `## Backgrounds`,
    '',
    BACKGROUNDS_ABOUT,
    '',
    fence('bash', BACKGROUNDS_INSTALL_COMMAND),
    '',
    ...backgroundDocs.flatMap(doc => [doc, '']),
    `## Background shared files`,
    '',
    ...BACKGROUND_SHARED_FILES.flatMap((file, i) => [`\`components/backgrounds/${file}\``, '', fence(file.endsWith('.css') ? 'css' : 'tsx', backgroundSharedSources[i]), '']),
  ].join('\n');
}
