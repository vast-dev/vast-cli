import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { NewCommand, CompileCommand } from './commands';
import { SchematicService } from './schematics/schematic.service';

@Module({
  imports: [],
  controllers: [],
  providers: [AppService, SchematicService, NewCommand, CompileCommand],
})
export class AppModule {}
