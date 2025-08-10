import assert from 'node:assert/strict';
import { suite, test } from 'node:test';
import { createFixture } from 'fs-fixture';

import { dependencyOwners } from '../src/index.js';

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
    });
    assert.deepEqual(result, {
      dep1: ['alice'],
      dep2: ['bob'],
      dep3: [],
    });
  });

  test('throws error if loader cannot be resolved', async () => {
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
        });
      },
      {
        message: `No loader found for file: ${dependencyFile}`,
      }
    );
  });
});
