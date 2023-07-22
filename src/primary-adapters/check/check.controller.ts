import {Controller, Get, HttpCode, InternalServerErrorException, Param} from '@nestjs/common';
import {PoapService} from "../../secondary-adapters/poap/poap.service";
import {LensService} from "../../secondary-adapters/lens/lens.service";


@Controller()
export class CheckController {
  constructor(
      private readonly poapService: PoapService,
      private readonly lensService: LensService,
  ) {
  }


  @Get('check/:address')
  @HttpCode(200)
  async getNfts(@Param() data: string): Promise<any> {
    try {
      /* @ts-ignore */
      const haveWorldCoin = await this.lensService.checkForWorldcoin(data.address);
      /* @ts-ignore */
      const lastPoap = await this.poapService.getLastNft(data.address);
      return {
        haveWorldCoin: haveWorldCoin ? haveWorldCoin : false,
        lastPoap: lastPoap ? lastPoap : null,
      };
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }
}
