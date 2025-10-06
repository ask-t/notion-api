import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NotionController } from './notion.controller';
import { NotionService } from './notion.service';
import { DevNotionController } from './dev-notion.controller';
import { DevNotionService } from './dev-notion.service';

@Module({
  imports: [],
  controllers: [AppController, NotionController, DevNotionController],
  providers: [AppService, NotionService, DevNotionService],
})
export class AppModule { }
