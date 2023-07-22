import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import {ZerionService} from './zerion.service';

@Module({
  imports: [
    HttpModule.register({}),
  ],
  providers: [ZerionService],
  exports: [ZerionService],
})
export class ZerionModule {}
