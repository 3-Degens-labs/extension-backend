import { Module } from '@nestjs/common';
import { LensService } from './lens.service';

@Module({
  providers: [LensService],
  exports: [LensService],
})
export class LensModule {}
