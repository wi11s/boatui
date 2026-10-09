import { readFile } from 'node:fs/promises';
import path from 'node:path';
import type { BackgroundEntry } from './backgrounds';
import { SHARED_FILES, type SceneEntry } from './registry';

const SCENES_DIR = path.join(process.cwd(), 'components/scenes');
const BACKGROUNDS_DIR = path.join(process.cwd(), 'components/backgrounds');

/** Rough token estimate. ~4 characters per token is the usual rule of thumb for code. */
export const estimateTokens = (text: string) => Math.round(text.length / 4);

export const sceneFiles = (scene: SceneEntry) => [`${scene.file}.tsx`, `${scene.file}.module.css`];

export const readSceneSource = (file: string) => readFile(path.join(SCENES_DIR, file), 'utf8');

async function tokensFor(files: string[]) {
  const sources = await Promise.all(files.map(readSceneSource));
  return estimateTokens(sources.join(''));
}

/** Estimated tokens to write a scene's own files from scratch (one clean pass, no revisions). */
export const sceneSourceTokens = (scene: SceneEntry) => tokensFor(sceneFiles(scene));

/** Estimated tokens for the shared files every scene needs. */
export const sharedSourceTokens = () => tokensFor(SHARED_FILES);

/** Estimated tokens to use a scene: the import plus the element. */
export const usageTokens = (scene: SceneEntry) =>
  estimateTokens(`import { ${scene.name} } from '@/components/scenes';\n<${scene.name} />`);

export const backgroundFiles = (bg: BackgroundEntry) => [`${bg.file}.tsx`, `${bg.file}.module.css`];

export const readBackgroundSource = (file: string) => readFile(path.join(BACKGROUNDS_DIR, file), 'utf8');

/** Estimated tokens to write a background's own files from scratch. */
export const backgroundSourceTokens = async (bg: BackgroundEntry) =>
  estimateTokens((await Promise.all(backgroundFiles(bg).map(readBackgroundSource))).join(''));
