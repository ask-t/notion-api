import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NotionController } from './notion.controller';
import { NotionService } from './notion.service';

@Module({
  imports: [],
  controllers: [AppController, NotionController],
  providers: [AppService, NotionService],
})
export class AppModule { }
