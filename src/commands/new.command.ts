import { Command, CommandRunner } from 'nest-commander';
import { SchematicService } from '../schematics/schematic.service';
import { SchematicOption } from '../schematics/schematic-option.interface';

@Command({
  name: 'new',
  arguments: '<name>',
  description: 'Create a new Vast project',
})
export class NewCommand extends CommandRunner {
  constructor(private readonly schematicService: SchematicService) {
    super();
  }

  async run(inputs: string[], options?: any): Promise<void> {
    console.log('Running!!');
    const schematicOpts: SchematicOption[] = [];
    schematicOpts.push(new SchematicOption('name', inputs[0]));

    console.log('Running schematic');
    await this.schematicService.execute('project', schematicOpts);
  }
}
