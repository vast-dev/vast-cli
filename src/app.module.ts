import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { NewCommand, CompileCommand } from './commands';

@Module({
  imports: [],
  controllers: [],
  providers: [AppService, NewCommand, CompileCommand],
})
export class AppModule {}
