import {Controller, Get, HttpCode, InternalServerErrorException, Param} from '@nestjs/common';
import {PoapService} from "../../secondary-adapters/poap/poap.service";
import {LensService} from "../../secondary-adapters/lens/lens.service";
import {HistoryService} from "../../secondary-adapters/history/history.service";


@Controller()
export class CheckController {
  constructor(
      private readonly poapService: PoapService,
      private readonly lensService: LensService,
      private readonly historyService: HistoryService
  ) {
  }


  @Get('check/:address')
  @HttpCode(200)
  async getNfts(@Param() data: string): Promise<any> {
    try {
      /* @ts-ignore */
      const haыWorldCoin = await this.lensService.checkForWorldcoin(data.address);
      /* @ts-ignore */
      const lastPoap = await this.poapService.getLastNft(data.address);
      /* @ts-ignore */
      const historyStuff = await this.historyService.getLastHistoryEvents(data.address);
      return {
        haыWorldCoin: haыWorldCoin ? haыWorldCoin : false,
        lastPoap: lastPoap ? lastPoap : null,
        ...historyStuff
      };
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }
}
