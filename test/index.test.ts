import * as assert from 'node:assert/strict';
import * as path from 'node:path';
import { suite, test } from 'node:test';
import { createFixture } from 'fs-fixture';

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
