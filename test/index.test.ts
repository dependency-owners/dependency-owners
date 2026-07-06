import { execFile } from 'node:child_process';
import * as assert from 'node:assert/strict';
import * as path from 'node:path';
import { promisify } from 'node:util';
import { suite, test } from 'node:test';
import { createFixture } from 'fs-fixture';

const execFileAsync = promisify(execFile);

import { dependencyOwners } from '../src/index.ts';

suite('dependencyOwners', () => {
  test('returns owners for installed dependencies', async () => {
    const fixture = await createFixture({
      'dependency-owners.json': JSON.stringify({
        alice: ['dep1'],
        bob: ['dep2'],
      }),
      'package.json': JSON.stringify({
        dependencies: {
          dep1: '^1.0.0',
          dep2: '^2.0.0',
          dep3: '^3.0.0',
        },
      }),
    });
    const dependencyFile = fixture.getPath('package.json');
    const configFile = fixture.getPath('dependency-owners.json');

    const result = await dependencyOwners({
      dependencyFile,
      configFile,
      loader: '@dependency-owners/package-json-loader',
    });
    assert.deepEqual(result, {
      dep1: ['alice'],
      dep2: ['bob'],
      dep3: [],
    });
  });

  test('should load dependencies using a custom loader', async () => {
    const fixture = await createFixture({
      'custom-loader.js': `
        module.exports = {
          canLoad: async (file) => {
            return true;
          },
          load: async (file) => {
            return [
              { name: 'dep1', version: '1.0.0' },
              { name: 'dep2', version: '1.2.3' },
              { name: 'dep3', version: '3.2.1' },
            ];
          },
        };
      `,
      'dependency-owners.json': JSON.stringify({
        alice: ['dep1'],
        bob: ['dep2'],
      }),
      'package.json': JSON.stringify({
        dependencies: {
          dep1: '^1.0.0',
          dep2: '^2.0.0',
          dep3: '^3.0.0',
        },
      }),
    });
    const dependencyFile = fixture.getPath('package.json');
    const configFile = fixture.getPath('dependency-owners.json');
    const loaderPath = fixture.getPath('custom-loader.js');

    const result = await dependencyOwners({
      dependencyFile,
      configFile,
      loader: loaderPath,
    });
    assert.deepEqual(result, {
      dep1: ['alice'],
      dep2: ['bob'],
      dep3: [],
    });
  });

  test('supports multiple dependency files and loaders', async () => {
    const fixture = await createFixture({
      'custom-loader.js': `
        module.exports = {
          canLoad: async (file) => file.endsWith('.custom.json'),
          load: async (file) => {
            return [
              { name: 'dep2', version: '2.0.0' },
              { name: 'dep3', version: '3.2.1' },
            ];
          },
        };
      `,
      'dependency-owners.json': JSON.stringify({
        alice: ['dep1'],
        bob: ['dep2'],
      }),
      'package.json': JSON.stringify({
        dependencies: {
          dep1: '^1.0.0',
          dep2: '^2.0.0',
          dep3: '^3.0.0',
        },
      }),
      'custom.custom.json': JSON.stringify({
        dependencies: {
          dep2: '^2.0.0',
          dep3: '^3.0.0',
        },
      }),
    });
    const packageFile = fixture.getPath('package.json');
    const customFile = fixture.getPath('custom.custom.json');
    const configFile = fixture.getPath('dependency-owners.json');
    const loaderPath = fixture.getPath('custom-loader.js');

    const result = await dependencyOwners({
      dependencyFile: [packageFile, customFile],
      configFile,
      loader: ['@dependency-owners/package-json-loader', loaderPath],
    });

    assert.deepEqual(result, {
      dep1: ['alice'],
      dep2: ['bob'],
      dep3: [],
    });
  });

  test('cli supports multiple dependency files and loaders', async () => {
    const fixture = await createFixture({
      'custom-loader.js': `
        module.exports = {
          canLoad: async (file) => file.endsWith('.custom.json'),
          load: async (file) => {
            return [{ name: 'dep2', version: '2.0.0' }];
          },
        };
      `,
      'dependency-owners.json': JSON.stringify({
        alice: ['dep1'],
        bob: ['dep2'],
      }),
      'package.json': JSON.stringify({
        dependencies: {
          dep1: '^1.0.0',
          dep2: '^2.0.0',
        },
      }),
      'custom.custom.json': JSON.stringify({
        dependencies: {
          dep2: '^2.0.0',
        },
      }),
    });

    const cliPath = path.resolve(process.cwd(), 'src/cli.ts');
    const { stdout } = await execFileAsync(
      process.execPath,
      [
        cliPath,
        'package.json',
        'custom.custom.json',
        '--loader',
        '@dependency-owners/package-json-loader',
        '--loader',
        fixture.getPath('custom-loader.js'),
      ],
      {
        cwd: fixture.path,
      }
    );

    assert.match(stdout, /"dep1": \[\s*"alice"\s*\]/);
    assert.match(stdout, /"dep2": \[\s*"bob"\s*\]/);
  });

  test('throws error if dependency file cannot be loaded', async () => {
    const fixture = await createFixture({
      'dependency-owners.json': JSON.stringify({
        alice: ['dep1'],
        bob: ['dep2'],
      }),
      'unknown.json': JSON.stringify({
        dependencies: {
          dep1: '^1.0.0',
          dep2: '^2.0.0',
          dep3: '^3.0.0',
        },
      }),
    });
    const dependencyFile = fixture.getPath('unknown.json');
    const configFile = fixture.getPath('dependency-owners.json');

    await assert.rejects(
      async () => {
        await dependencyOwners({
          dependencyFile,
          configFile,
          loader: '@dependency-owners/package-json-loader',
        });
      },
      {
        message: `No loader found for file: ${dependencyFile}`,
      }
    );
  });

  test('throws error if custom loader is invalid', async () => {
    const fixture = await createFixture({
      'custom-loader.js': `
        module.exports = {
          invalidFunc: async (file) => {
            return true;
          },
        };
      `,
      'dependency-owners.json': JSON.stringify({
        alice: ['dep1'],
        bob: ['dep2'],
      }),
      'package.json': JSON.stringify({
        dependencies: {
          dep1: '^1.0.0',
          dep2: '^2.0.0',
          dep3: '^3.0.0',
        },
      }),
    });
    const dependencyFile = fixture.getPath('package.json');
    const configFile = fixture.getPath('dependency-owners.json');
    const loaderPath = fixture.getPath('custom-loader.js');

    await assert.rejects(
      async () => {
        await dependencyOwners({
          dependencyFile,
          configFile,
          loader: loaderPath,
        });
      },
      {
        message: `Invalid loader: ${loaderPath}. The module does not export an object with 'canLoad' and 'load' functions.`,
      }
    );
  });

  test('throws error if dependency-owners.json file not found', async () => {
    const fixture = await createFixture({
      'package.json': JSON.stringify({
        dependencies: {
          dep1: '^1.0.0',
          dep2: '^2.0.0',
          dep3: '^3.0.0',
        },
      }),
    });
    const dependencyFile = fixture.getPath('package.json');
    const configFile = path.join(fixture.path, 'dependency-owners.json');

    await assert.rejects(
      async () => {
        await dependencyOwners({
          dependencyFile,
          configFile,
          loader: '@dependency-owners/package-json-loader',
        });
      },
      {
        message: `ENOENT: no such file or directory, open \'${configFile}\'`,
      }
    );
  });
});
