# Command Line Interface

## Usage

```
dependency-owners [OPTIONS] --loader <loader> <dependency-file>
```

`<dependency-file>` is a required positional argument pointing to the file containing the dependencies to check (e.g., `package.json`).

## Options

| Flag                  | Description                                                                        | Default                  |
| --------------------- | ---------------------------------------------------------------------------------- | ------------------------ |
| `--loader <name>`     | _(Required)_ Specify which loader to use for parsing the dependency file.          | (required)               |
| `--config <path>`     | Path to the configuration file mapping owners to dependencies.                     | `dependency-owners.json` |
| `--dependency <name>` | Limit checks to one or more specific dependency names (variadic; can be repeated). | (all dependencies)       |
| `--fail-on-unowned`   | Exit with an error code if any inspected dependency has no owner.                  | `false`                  |

## Examples

**Check all dependencies against the default config:**

```bash
dependency-owners \
  --loader @dependency-owners/package-json-loader \
  package.json
```

**Use a custom config file:**

```bash
dependency-owners \
  --loader @dependency-owners/package-json-loader \
  --config config/dependency-owners.json \
  package.json
```

**Fail if any dependencies are unowned (useful in CI):**

```bash
dependency-owners \
  --loader @dependency-owners/package-json-loader \
  --fail-on-unowned \
  package.json
```

**Check only specific dependencies:**

```bash
dependency-owners \
  --loader @dependency-owners/package-json-loader \
  --dependency react --dependency react-dom \
  package.json
```

## Output

A JSON object maps each inspected dependency to its owners. An unowned dependency has an empty array:

```json
{
  "react": ["frontend-team"],
  "unowned-package": []
}
```
