import {Injectable} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import {GetNftsResponse, MetadataResponse} from "./poap.schema";
import * as process from "process";
import {GetNftsRequestDto, NftToken} from "./dto";

@Injectable()
export class PoapService {

  constructor(
      private readonly httpService: HttpService,
  ) {
    process.env
  }

  async getNfts(getNftsRequestDto: GetNftsRequestDto): Promise<NftToken[]> {
    const {address} = getNftsRequestDto;
    try {
      const {data} = await this.httpService.axiosRef.get<GetNftsResponse[]>(`/actions/scan/${address}`);
      const promises = data.map(async (event) => {
        const response = await this.httpService.axiosRef.get<MetadataResponse>(`/metadata/${event.event?.id}/${event.tokenId}`);
        return this.transformData(response.data, event);
      });
      return await Promise.all(promises);
    } catch (error) {
      return [];
    }
  }

  async getLastNft(getNftsRequestDto: GetNftsRequestDto): Promise<NftToken | null> {
    const {address} = getNftsRequestDto;
    try {
      const {data} = await this.httpService.axiosRef.get<GetNftsResponse[]>(`/actions/scan/${address}`);
      if (data.length === 0) {
        return null;
      }
      const lastEvent = data[0];
      const lastToken = await this.httpService.axiosRef.get<MetadataResponse>(`/metadata/${lastEvent.event?.id}/${lastEvent.tokenId}`)
      return this.transformData(lastToken.data, lastEvent);
    } catch (error) {
      return null;
    }
  }

  transformData(data: MetadataResponse, event: GetNftsResponse): NftToken {
    return {
      address: event.owner,
      tokenId: event.tokenId,
      blockchain: event.chain,
      name: data.name,
      descripton: data.description,
      imageUrl: data.image_url,
      animationUrl: data.external_url,
      previewLink: data.home_url,
      traits: data.attributes,
      owner: [event.owner],
      created: event.created,
    };
  }
}
