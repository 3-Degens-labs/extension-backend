import {Injectable} from '@nestjs/common';
import {HttpService} from '@nestjs/axios';
import {TransactionList} from "../history/dto";
import * as process from "process";

@Injectable()
export class ZerionService {

  constructor(
      private readonly httpService: HttpService,
  ) {
  }


  async getZerionData(address: string): Promise<any | null> {
    try {
      const data = await this.httpService.axiosRef.get<TransactionList>(`${process.env.zerion_url}/api/v2/profiles/?address=${address}`)
      return data.data;
    } catch (error) {
      console.error('Zerion', error)
      return null;
    }

  }
}

