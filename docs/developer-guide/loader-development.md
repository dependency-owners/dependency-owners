# Loader development

Loaders are the bridge between `dependency-owners` and the dependency file your project uses. A loader reads a file like `package.json`, `pyproject.toml`, or any other manifest format and returns the dependencies that should be checked.

Each loader implements this interface:

```ts
interface Dependency {
  name: string;
  version: string;
}

interface DependencyLoader {
  canLoad(filePath: string): Promise<boolean>;
  load(filePath: string): Promise<Dependency[]>;
}
```

### `canLoad(filePath)`

Return `true` when the loader knows how to read that manifest.

### `load(filePath)`

Read the file and return a list of dependencies. Each entry should look like:

```ts
{
  name: '@types/node',
  version: '25.9.9',
}
```

## Minimal example

This example accepts a `package.json` file, parses it, and returns the dependencies from the top-level `dependencies`, `devDependencies`, and `peerDependencies` sections.

```ts
import * as fs from 'node:fs';

export default {
  async canLoad(filePath: string) {
    return filePath.endsWith('package.json');
  },

  async load(filePath: string) {
    const manifest = JSON.parse(await fs.promises.readFile(filePath, 'utf-8'));
    const sections = ['dependencies', 'devDependencies', 'peerDependencies'];

    return sections.flatMap((section) => {
      const deps = manifest[section] ?? {};
      return Object.entries(deps).map(([name, version]) => ({
        name,
        version: String(version),
      }));
    });
  },
};
```

## Using your loader

Pass a package name or a file path to the CLI:

```bash
dependency-owners --loader ./my-loader.js package.json
```

File paths are resolved relative to the current working directory. In the [JavaScript API](./javascript-api.md), you can also pass a loader object directly.

## Best practices

- Keep `canLoad` specific so the wrong loader is not used accidentally.
- Return the exact package names as they appear in the manifest.
- Include version strings when possible; they are useful for diagnostics and debugging.
- Prefer one loader per file type or ecosystem.

To publish a loader, export the implementation as the package's default export. Consumers can then pass the package name to `--loader` or the JavaScript API.
