import * as path from 'node:path';

import { getOwners, getOwnersMapping } from './utils/owners.ts';
import {
  resolveDependencyLoader,
  type DependencyLoader,
} from './utils/loader.ts';

/**
 * Options for the dependency owners lookup.
 */
export interface DependencyOwnersOptions {
  /**
   * Path to the dependency file or files.
   */
  dependencyFile: string | string[];
  /**
   * Path to the configuration file.
   */
  configFile?: string;
  /**
   * List of dependencies to check.
   */
  dependencies?: string[];
  /**
   * Loader or loaders to use for loading dependencies.
   */
  loader: string | DependencyLoader | Array<string | DependencyLoader>;
}

function toArray<T>(value: T | T[]): T[] {
  return Array.isArray(value) ? value : [value];
}

/**
 * Get the owners of the specified dependencies.
 * @param {Options} options - The options for the dependency owners lookup.
 * @returns {Promise<Record<string, string[]>>} A mapping of dependency owners for the specified dependencies.
 */
export async function dependencyOwners(
  options: DependencyOwnersOptions
): Promise<Record<string, string[]>> {
  const {
    dependencies = [],
    loader,
    dependencyFile,
    configFile = path.join(process.cwd(), 'dependency-owners.json'),
  } = options;

  const ownersMapping = getOwnersMapping(configFile);
  const dependencyFiles = toArray(dependencyFile);
  const loaders = toArray(loader);

  const resolvedDependencies = await Promise.all(
    dependencyFiles.map(async (filePath, index) => {
      const resolvedLoader = await resolveDependencyLoader(loaders, filePath);
      if (!resolvedLoader) {
        throw new Error(`No loader found for file: ${filePath}`);
      }
      return resolvedLoader.load(filePath);
    })
  );

  const filteredDependencies = resolvedDependencies
    .flatMap((resolved) =>
      resolved.filter(
        (dep) => dependencies.length === 0 || dependencies.includes(dep.name)
      )
    )
    .map((dep) => dep.name);
  return getOwners(Array.from(new Set(filteredDependencies)), ownersMapping);
}
