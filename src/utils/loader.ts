import path from 'node:path';

/**
 * Type representing a dependency.
 */
export interface Dependency {
  /**
   * The name of the dependency.
   */
  name: string;
  /**
   * The version of the dependency.
   */
  version: string;
}

/**
 * Interface for loading dependencies from various file types.
 */
export interface DependencyLoader {
  /**
   * Check if the loader can handle the specified file.
   * @param {string} filePath The path to the file to check.
   * @returns {boolean} True if the loader can handle the file, false otherwise.
   */
  canLoad(filePath: string): Promise<boolean>;
  /**
   * Load the dependencies from the specified file.
   * @param {string} filePath The path to the file to load dependencies from.
   * @returns {Dependency[]} The list of loaded dependencies.
   */
  load(filePath: string): Promise<Dependency[]>;
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
