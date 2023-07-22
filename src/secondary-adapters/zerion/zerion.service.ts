import {Injectable} from '@nestjs/common';
import {HttpService} from '@nestjs/axios';
import {TransactionList} from "../history/dto";

@Injectable()
export class ZerionService {

  constructor(
      private readonly httpService: HttpService,
  ) {
  }


  async getZerionData(address: string): Promise<any | null> {
    try {
      const data = await this.httpService.axiosRef.get<TransactionList>(`https://social.zerion.io/api/v2/profiles/?address=${address}`)
      return data.data;
    } catch (error) {
      console.error(error)
      return null;
    }

  }
}

