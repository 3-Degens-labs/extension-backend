import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { PoapService } from './poap.service';

@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      headers: {'Accept-Encoding': 'gzip,deflate,compress', 'x-api-key': process.env.poap_api_key},
      baseURL: process.env.poap_api_url,
    }),
  ],
  providers: [PoapService],
  exports: [PoapService],
})
export class PoapModule {}
