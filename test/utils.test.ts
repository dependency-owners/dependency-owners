import assert from 'node:assert/strict';
import { suite, test } from 'node:test';

import { getUnownedDependencies } from '../src/utils.js';

suite('getUnownedDependencies', () => {
  test('should return unowned dependencies', () => {
    const owners = {
      dep1: ['owner1'],
      dep2: [],
      dep3: ['owner2'],
    };
    const result = getUnownedDependencies(owners);
    assert.deepEqual(result, ['dep2']);
  });
});
