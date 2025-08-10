#!/usr/bin/env node

import {
  buildApplication,
  buildCommand,
  run,
  type CommandContext,
} from '@stricli/core';
import { createRequire } from 'node:module';
import path from 'node:path';

import { dependencyOwners } from './index.js';
import { getErrorMessage } from './utils.js';

const { name, version, description } = createRequire(import.meta.url)(
  '../package.json'
);

interface DependencyOwnersContext extends CommandContext {
  readonly process: NodeJS.Process;
  readonly path: Pick<typeof path, 'join'>;
}

interface DependencyOwnersFlags {
  config: string;
  dependency?: string[];
  loader?: string;
}

function cwdParser(this: DependencyOwnersContext, rawInput: string): string {
  return this.path.join(this.process.cwd(), rawInput);
}

const command = buildCommand({
  async func(
    this: DependencyOwnersContext,
    flags: DependencyOwnersFlags,
    dependencyFile: string
  ): Promise<void> {
    try {
      const result = await dependencyOwners({
        configFile: flags.config,
        dependencies: flags.dependency,
        dependencyFile,
        loader: flags.loader,
      });
      this.process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      this.process.stderr.write(
        `\x1B[1m\x1B[31m${errorMessage}\x1B[39m\x1B[22m\n`
      );
      this.process.exit(1);
    }
  },
  parameters: {
    flags: {
      config: {
        kind: 'parsed',
        brief: 'Path to the configuration file.',
        default: 'dependency-owners.json',
        parse: cwdParser,
      },
      dependency: {
        kind: 'parsed',
        parse: String,
        brief: 'List of dependencies to check.',
        optional: true,
        variadic: true,
      },
      loader: {
        kind: 'parsed',
        parse: String,
        brief: 'Loader to use for loading dependencies.',
        optional: true,
      },
    },
    positional: {
      kind: 'tuple',
      parameters: [
        {
          brief: 'Path to the dependency file.',
          placeholder: 'dependency-file',
          default: 'package.json',
          parse: cwdParser,
        },
      ],
    },
  },
  docs: {
    brief: description,
  },
});

const app = buildApplication(command, {
  name,
  versionInfo: {
    currentVersion: version,
  },
});

await run(app, process.argv.slice(2), { path, process });
