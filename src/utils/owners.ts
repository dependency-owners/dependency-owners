import * as fs from 'node:fs';

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
 * Get a list of unowned dependencies.
 * @param owners The mapping of dependency owners.
 * @returns A list of unowned dependencies.
 */
export function getUnownedDependencies(
  owners: Record<string, string[]>
): string[] {
  return Object.entries(owners)
    .filter(([_key, deps]) => deps.length === 0)
    .map(([key]) => key);
}
