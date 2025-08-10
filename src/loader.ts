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
   * @returns {string[]} The list of loaded dependencies.
   */
  load(filePath: string): Promise<string[]>;
}
