import {Controller, Get, HttpCode, InternalServerErrorException, Param} from '@nestjs/common';
import {PoapService} from "../../secondary-adapters/poap/poap.service";
import {LensService} from "../../secondary-adapters/lens/lens.service";
import {HistoryService} from "../../secondary-adapters/history/history.service";
import {ZerionService} from "../../secondary-adapters/zerion/zerion.service";
import * as NodeCache from 'node-cache';

@Controller()
export class CheckController {
  private cache = new NodeCache()

  constructor(
      private readonly poapService: PoapService,
      private readonly lensService: LensService,
      private readonly historyService: HistoryService,
      private readonly zerionService: ZerionService,
  ) {
  }


  @Get('check/:address')
  @HttpCode(200)
  async check(@Param('address') id: string): Promise<any> {
    try {
      const cached = this.cache.get(id)
      if (cached) {
        return cached
      }

      const hasWorldCoin = await this.lensService.checkForWorldcoin(id);
      const poapInfo = await this.poapService.getLastNft(id);
      const historyStuff = await this.historyService.getLastHistoryEvents(id);
      const profile = await this.zerionService.getZerionData(id);

      const data = {
        hasWorldCoin: hasWorldCoin ? hasWorldCoin : false,
        profile: profile ? profile : null,
        poapInfo: poapInfo ? poapInfo : null,
        ...historyStuff
      }

      this.cache.set(id, data, 60 * 5)
      return data;
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }
}
