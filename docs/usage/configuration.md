# Configuration

**dependency-owners** requires a JSON file that maps owner names to lists of dependencies they own. The default file is `dependency-owners.json` at the repository root.

## Format

The configuration file is a plain JSON object where each key is an owner identifier (a string) and the value is an array of package names (strings) that the owner is responsible for.

A simple example (also used in the repository):

```json
{
  "kirkeaton": [
    "@dependency-owners/package-json-loader",
    "@kirkeaton/prettier-config",
    "@kirkeaton/semantic-release-config",
    "@kirkeaton/tsconfig",
    "@stricli/core",
    "@types/node",
    "fs-fixture",
    "prettier",
    "semantic-release",
    "tsx",
    "typescript",
    "vitepress"
  ]
}
```

Notes:

- Package names must match exactly how they appear in the dependency file (no implicit globbing or pattern matching).
- A dependency may appear under multiple owners; the tool will return all matching owners for a dependency.
- The file must be valid JSON; it is parsed using a synchronous JSON parse at runtime.
