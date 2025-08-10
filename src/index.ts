import fs from 'node:fs/promises';
import path from 'node:path';

import {
  getOwners,
  getOwnersMapping,
  resolveDependencyLoader,
} from './utils.js';
import { DependencyLoader } from './loader.js';

/**
 * Loader for loading dependencies from package.json files.
 */
const PackageJsonLoader: DependencyLoader = {
  async canLoad(filePath: string): Promise<boolean> {
    return path.basename(filePath) === 'package.json';
  },
  async load(filePath: string): Promise<string[]> {
    const pkg = JSON.parse(await fs.readFile(filePath, 'utf-8'));
    return [
      ...Object.keys(pkg.dependencies || {}),
      ...Object.keys(pkg.devDependencies || {}),
    ];
  },
};

/**
 * Options for the dependency owners lookup.
 */
export interface DependencyOwnersOptions {
  /**
   * Path to the dependency file.
   */
  dependencyFile?: string;
  /**
   * Path to the configuration file.
   */
  configFile?: string;
  /**
   * List of dependencies to check.
   */
  dependencies?: string[];
  /**
   * Loader to use for loading dependencies.
   */
  loader?: string | DependencyLoader;
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
    loader = PackageJsonLoader,
    dependencyFile = path.join(process.cwd(), 'package.json'),
    configFile = path.join(process.cwd(), 'dependency-owners.json'),
  } = options;

  const resolvedLoader = await resolveDependencyLoader(loader, dependencyFile);
  if (!resolvedLoader) {
    throw new Error(`No loader found for file: ${dependencyFile}`);
  }

  const ownersMapping = getOwnersMapping(configFile);
  const resolvedDependencies = await resolvedLoader.load(dependencyFile);
  const filteredDependencies = resolvedDependencies.filter(
    (dep) => dependencies.length === 0 || dependencies.includes(dep)
  );
  return getOwners(filteredDependencies, ownersMapping);
}
