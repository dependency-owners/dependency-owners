# Using Loaders

Dependency files are read using loaders.

Check out the [Loaders section](/loaders) for a list of official loaders.

## Adding a Loader

To use a loader, it first needs to be installed in your project as a dev dependency. For example, we will use the official `@dependency-owners/package-json-loader`:

::: code-group

```bash [npm]
npm add -D @dependency-owners/package-json-loader
```

```bash [pnpm]
pnpm add -D @dependency-owners/package-json-loader
```

```bash [yarn]
yarn add -D @dependency-owners/package-json-loader
```

:::

## Oficial Loaders

| Dependency file | Loader                                     |
| --------------- | ------------------------------------------ |
| `package.json`  | [@dependency-owners/package-json-loader]() |
| `pubspec.yaml`  | [@dependency-owners/pubspec-loader]()      |

[@dependency-owners/package-json-loader]: https://github.com/dependency-owners/package-json-loader
[@dependency-owners/pubspec-loader]: https://github.com/dependency-owners/pubspec-loader
