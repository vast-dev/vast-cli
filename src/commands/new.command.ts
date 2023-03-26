import { Command, CommandRunner } from 'nest-commander';
import { Vast } from '@vast/vast';

@Command({
  name: 'new',
  arguments: '<name>',
  description: 'Create a new Vast project',
})
export class NewCommand extends CommandRunner {
  async run(inputs: string[], options?: any): Promise<void> {
    await Vast.createNewProject({
      name: inputs[0],
    });
  }
}
