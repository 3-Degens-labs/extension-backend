import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import {HistoryService} from './history.service';

@Module({
  imports: [
    HttpModule.register({}),
  ],
  providers: [HistoryService],
  exports: [HistoryService],
})
export class HistoryModule {}
