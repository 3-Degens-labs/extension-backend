import {Controller, Get, HttpCode, InternalServerErrorException, Param} from '@nestjs/common';
import {PoapService} from "../../secondary-adapters/poap/poap.service";
import {LensService} from "../../secondary-adapters/lens/lens.service";
import {HistoryService} from "../../secondary-adapters/history/history.service";
import {ZerionService} from "../../secondary-adapters/zerion/zerion.service";


@Controller()
export class CheckController {
  constructor(
      private readonly poapService: PoapService,
      private readonly lensService: LensService,
      private readonly historyService: HistoryService,
      private readonly zerionService: ZerionService,
  ) {
  }


  @Get('check/:address')
  @HttpCode(200)
  async getNfts(@Param() data: string): Promise<any> {
    try {
      /* @ts-ignore */
      const hasWorldCoin = await this.lensService.checkForWorldcoin(data.address);
      /* @ts-ignore */
      const poapInfo = await this.poapService.getLastNft(data.address);
      /* @ts-ignore */
      const historyStuff = await this.historyService.getLastHistoryEvents(data.address);
      /* @ts-ignore */
      const profile = await this.zerionService.getZerionData(data.address);
      return {
        hasWorldCoin: hasWorldCoin ? hasWorldCoin : false,
        profile: profile ? profile : null,
        poapInfo: poapInfo ? poapInfo : null,
        ...historyStuff
      };
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }
}
