import { Command, CommandRunner, Option } from 'nest-commander';
import { SchematicService } from '../schematics/schematic.service';
import { SchematicOption } from '../schematics/schematic-option.interface';
import { cwd } from 'process';
import { join, resolve } from 'path';

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
  constructor(private readonly schematicService: SchematicService) {
    super();
  }

  async run(inputs: string[], _options?: CompileCommandOptions): Promise<void> {
    const options = this.normalizeOptions(_options);
    console.log('Compile project to directory ' + options.directory);

    const schematicOpts: SchematicOption[] = [];
    schematicOpts.push(new SchematicOption('name', inputs[0]));
    await this.schematicService.execute('project', schematicOpts);
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
