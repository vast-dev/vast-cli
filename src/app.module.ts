import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { NewCommand } from './commands/new.command';
import { SchematicService } from './schematics/schematic.service';

@Module({
  imports: [],
  controllers: [],
  providers: [AppService, SchematicService, NewCommand],
})
export class AppModule {}
