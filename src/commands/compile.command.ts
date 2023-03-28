import { Command, CommandRunner, Option } from 'nest-commander';
import { cwd } from 'process';
import { join, resolve } from 'path';

import { Vast } from '@vast/vast';
import { Compiler } from '@vast/vast/dist/compiler';

export interface CompileCommandOptions {
  /**
   * Output compiled files to a custom directory
   */
  directory?: string;
}

@Command({
  name: 'compile',
  description: 'Compile the current Vast project',
})
export class CompileCommand extends CommandRunner {
  async run(inputs: string[], _options?: CompileCommandOptions): Promise<void> {
    const options = this.normalizeOptions(_options);
    console.log('Compile project to directory ' + options.directory);

    const vast = new Vast(new Compiler());
    await vast.compile();
  }

  normalizeOptions(_options?: CompileCommandOptions): CompileCommandOptions {
    const options = {
      ..._options,
    };

    options.directory = options.directory ?? join(cwd(), 'compiled');
    return options;
  }

  @Option({
    flags: '-d, --directory [string]',
    description: 'The output directory',
  })
  parseDirectory(val: string): string {
    return resolve(val);
  }
}
