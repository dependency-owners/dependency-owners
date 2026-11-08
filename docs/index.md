# Getting started

`dependency-owners` helps teams answer a simple but important question: who owns each dependency in a project? It reads a dependency manifest, matches each dependency name against a JSON ownership map, and reports the owners.

Use it to make dependency ownership visible in reviews and enforce ownership in CI.

## When to use it

`dependency-owners` is useful in monorepos where multiple teams add or rely on dependencies. A shared ownership map can identify the teams responsible for each package, and a dependency can have more than one owner when responsibility is shared. Run checks against each relevant manifest to catch packages that have no owner, or use the [GitHub Actions](./ci-configuration/github-actions.md) to check ownership and request reviews from owners when dependencies change.

## Installation

### Prerequisites

- [Node.js](https://nodejs.org/) version 22 or higher.

::: code-group

```bash [npm]
npm add -D dependency-owners
```

```bash [pnpm]
pnpm add -D dependency-owners
```

```bash [yarn]
yarn add -D dependency-owners
```

:::

## Quick start

1. Create a `dependency-owners.json` file at the repository root:

```json
{
  "kirkeaton": ["@stricli/core", "typescript", "vitepress"],
  "platform-team": ["react", "react-dom"]
}
```

2. Install a loader for your dependency file. For `package.json`, use the official package JSON loader:

```bash
npm add -D @dependency-owners/package-json-loader
```

3. Run the CLI:

```bash
dependency-owners \
  --loader @dependency-owners/package-json-loader \
  package.json
```

The output is a JSON object mapping each dependency to one or more owners.

Dependencies absent from the ownership map have no owners. The CLI and [check action](./ci-configuration/github-actions.md) can make that a failure.

## Next steps

- Review the [configuration format](./usage/configuration.md)
- See the available [loaders](./usage/loaders.md)
- Learn the [CLI usage](./usage/cli.md)
- Set up [GitHub Actions](./ci-configuration/github-actions.md) for CI checks and reviewer assignment
- Use the [JavaScript API](./developer-guide/javascript-api.md)
- Create a custom [loader](./developer-guide/loader-development.md)
