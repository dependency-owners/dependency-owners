# JavaScript API

## Usage

```ts
import { dependencyOwners } from 'dependency-owners';

await dependencyOwners({
  dependencyFile: 'package.json',
  configFile: './dependency-owners.json',
  loader: '@dependency-owners/package-json-loader',
});
```

## API

### dependencyOwners(options) => Promise

Runs **dependency-owners** and returns a `Promise` that resolves to a mapping of dependency owners for the specified dependencies.

#### options

Type: `object`

The options for the dependency owners lookup.

##### dependencyFile

Type: `string`

Path to the dependency file.

##### loader

Type `string` | `DependencyLoader`

Loader to use for loading dependencies.

Can either be a package name, a path to a file that exports a loader, or an inline implementation of a loader. See [Loader Development](./loader-development.md) for more information on the latter.

##### configFile

Type: `string`

Default: `path.join(process.cwd(), 'dependency-owners.json)`

Path to the configuration file.

##### dependencies

Type: `string[]`

Default: `[]`

List of dependencies to check. If an empty list is provided, all dependencies will be checked.
