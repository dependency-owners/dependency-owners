# GitHub Actions

Use the official GitHub Actions to enforce dependency ownership in CI and route pull request reviews to the owners of changed dependencies:

- [`dependency-owners/check`](https://github.com/dependency-owners/check) fails when the dependency file contains unowned dependencies.
- [`dependency-owners/assign`](https://github.com/dependency-owners/assign) assigns reviewers when dependencies change.

Both actions need the dependency file and a compatible loader. They use `dependency-owners.json` by default; set `config-file` to use another ownership map. Paths are relative to the repository workspace. See [Configuration](../usage/configuration.md) and [Loaders](../usage/loaders.md).

## Check for unowned dependencies

Add a workflow such as `.github/workflows/check-dependencies.yml`:

```yaml
name: Check dependency owners

on:
  pull_request:

permissions:
  contents: read

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: dependency-owners/check@v2
        with:
          dependency-file: package.json
          loader: '@dependency-owners/package-json-loader'
```

The action fails the workflow when it finds unowned dependencies.

## Assign reviewers for dependency changes

Add a workflow such as `.github/workflows/assign-dependency-reviewers.yml`:

```yaml
name: Assign dependency reviewers

on:
  pull_request:

permissions:
  contents: read
  pull-requests: write

jobs:
  assign:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: dependency-owners/assign@v2
        with:
          dependency-file: package.json
          loader: '@dependency-owners/package-json-loader'
```

The `pull-requests: write` permission is required to request reviewers. The action uses `github.token` by default; if you provide `github-token`, it must also have permission to request reviewers.

Only owners associated with dependencies changed in the pull request are assigned. To use a different manifest, set `dependency-file` and `loader` to the appropriate path and [loader](../usage/loaders.md#official-loaders).
