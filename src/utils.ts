import fs from 'node:fs';
import path from 'node:path';

import { DependencyLoader } from './loader.js';

/**
 * Get the mapping of dependency owners from a JSON file.
 * @param {string} filePath - The path to the dependency owners file.
 * @returns {Record<string, string[]>} A mapping of dependency owners.
 */
export function getOwnersMapping(filePath: string): Record<string, string[]> {
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

/**
 * Get the owners of the specified dependencies.
 * @param {string[]} dependencies - The list of dependencies to check.
 * @param {Record<string, string[]>} ownersMapping - The mapping of dependency owners.
 * @returns {Record<string, string[]>} A mapping of dependency owners for the specified dependencies.
 */
export function getOwners(
  dependencies: string[],
  ownersMapping: Record<string, string[]>
): Record<string, string[]> {
  return dependencies.reduce<Record<string, string[]>>((result, dep) => {
    const owners = Object.keys(ownersMapping).filter(
      (owner) =>
        Array.isArray(ownersMapping[owner]) &&
        ownersMapping[owner].includes(dep)
    );
    result[dep] = owners;
    return result;
  }, {});
}

/**
 * Import a dependency loader by name.
 * @param {string} loaderName The name of the loader to import.
 * @returns {Promise<DependencyLoader>} The imported dependency loader.
 */
async function importDependencyLoader(
  loaderName: string
): Promise<DependencyLoader> {
  let loaderModule;

  // Try importing from an installed dependency/absolute path
  try {
    loaderModule = await import(loaderName);
  } catch {
    // no-op
  }

  // Try import from relative path
  try {
    loaderModule = await import(path.join(process.cwd(), loaderName));
  } catch {
    // no-op
  }

  // If we couldn't find the module, throw an error
  if (!loaderModule) {
    throw new Error(`Failed to import loader: ${loaderName}`);
  }

  // Check if the loader has the required functions
  const loader = loaderModule.default || loaderModule;
  if (
    loader &&
    typeof loader.canLoad === 'function' &&
    typeof loader.load === 'function'
  ) {
    return loader;
  } else {
    throw new Error(
      `Invalid loader: ${loaderName}. The module does not export an object with 'canLoad' and 'load' functions.`
    );
  }
}

/**
 * Resolve a dependency loader for a specific file.
 * @param {DependencyLoader | string} loader The loader to use.
 * @param {string} depFilePath The path to the dependency file.
 * @returns {Promise<DependencyLoader | undefined>} The resolved dependency loader or undefined if not found.
 */
export async function resolveDependencyLoader(
  loader: DependencyLoader | string,
  depFilePath: string
): Promise<DependencyLoader | undefined> {
  const resolvedLoader =
    typeof loader === 'string' ? await importDependencyLoader(loader) : loader;
  const canLoad = await resolvedLoader.canLoad(depFilePath);
  return canLoad ? resolvedLoader : undefined;
}

/**
 * Get a formatted error message.
 * @param error The error to format.
 * @returns The formatted error message.
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
}
