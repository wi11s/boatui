// Plain-text and markdown documents for AI agents and other non-browser readers:
// /llms.txt (index), /llms-full.txt (everything) and /scenes/<slug>.md (one scene).
// Everything is generated from the registry and the real source files so it can't drift.

import { SHARED_FILES, sceneProps, scenes, tokenToVar, type SceneEntry } from './registry';
import {
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
  estimateTokens,
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
    '',
    '## Scenes',
    '',
    ...scenes.map(s => `- [${s.name}](${sceneMarkdownUrl(s)}): ${s.description}`),
    '',
    '## Docs',
    '',
    `- [Full documentation](${SITE_URL}/llms-full.txt): every scene's props, theme tokens, usage and source in one file`,
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

/** /llms-full.txt: the whole library in one document. */
export async function llmsFull() {
  const [{ costs, line }, shared] = await Promise.all([summary(), sharedSourceTokens()]);
  const sharedSources = await Promise.all(SHARED_FILES.map(readSceneSource));
  const sceneDocs = await Promise.all(scenes.map(s => sceneMarkdown(s, { heading: 2 })));

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
  ].join('\n');
}
