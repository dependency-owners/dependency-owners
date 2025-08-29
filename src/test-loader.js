import fs from 'node:fs/promises';
import path from 'node:path';
const mapDependency = ([name, version]) => ({
    name,
    version: String(version),
});
/**
 * Check if the loader can handle the specified file.
 * @param {string} filePath The path of the file to check.
 * @returns {Promise<boolean>} True if the file can be loaded, false otherwise.
 */
export const canLoad = async function (filePath) {
    return path.basename(filePath) === 'package.json';
};
/**
 * Loads the package.json file and returns its dependencies.
 * @param {string} filePath The path of the package.json file to load.
 * @returns {Promise<Dependency[]>} An array of dependencies.
 */
export const load = async function (filePath) {
    const pkg = JSON.parse(await fs.readFile(filePath, 'utf-8'));
    return [
        ...Object.entries(pkg.dependencies || {}).map(mapDependency),
        ...Object.entries(pkg.devDependencies || {}).map(mapDependency),
    ];
};
