import { readFile } from 'node:fs/promises';
import path from 'node:path';
import type { CatalogItem, Category } from './catalog';

/** Rough token estimate. ~4 characters per token is the usual rule of thumb for code. */
export const estimateTokens = (text: string) => Math.round(text.length / 4);

export const readSource = (category: Category, file: string) =>
  readFile(path.join(process.cwd(), category.dir, file), 'utf8');

const readAll = (category: Category, files: string[]) => Promise.all(files.map(f => readSource(category, f)));

/** An item's own files with their contents. */
export async function itemSources(category: Category, item: CatalogItem) {
  const files = category.files(item);
  const code = await readAll(category, files);
  return files.map((name, i) => ({ name, code: code[i] }));
}

/** The category's shared files with their contents. */
export async function sharedSources(category: Category) {
  const code = await readAll(category, category.sharedFiles);
  return category.sharedFiles.map((name, i) => ({ name, code: code[i] }));
}

/** Estimated tokens to write an item's own files from scratch (one clean pass, no revisions). */
export const generateTokens = async (category: Category, item: CatalogItem) =>
  estimateTokens((await readAll(category, category.files(item))).join(''));

/** Estimated tokens for a category's shared files. */
export const sharedTokens = async (category: Category) =>
  estimateTokens((await readAll(category, category.sharedFiles)).join(''));

/** Estimated tokens to use an item: the import plus the element. */
export const importTokens = (category: Category, item: CatalogItem) =>
  estimateTokens(`import { ${item.name} } from '@/${category.dir}';\n<${item.name} />`);
