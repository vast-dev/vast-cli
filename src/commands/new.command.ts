import { Command, CommandRunner } from 'nest-commander';
import { Vast } from '@vast/vast';
import { Compiler } from '@vast/vast/dist/compiler';

@Command({
  name: 'new',
  arguments: '<name>',
  description: 'Create a new Vast project',
})
export class NewCommand extends CommandRunner {
  async run(inputs: string[], options?: any): Promise<void> {
    const vast = new Vast(new Compiler());
    await vast.createNewProject({
      name: inputs[0],
    });
  }
}
