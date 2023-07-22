import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import {ZerionService} from './zerion.service';

@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
    }),
  ],
  providers: [ZerionService],
  exports: [ZerionService],
})
export class ZerionModule {}
