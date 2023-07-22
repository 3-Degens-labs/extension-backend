import {Injectable} from '@nestjs/common';
import {HttpService} from '@nestjs/axios';
import {GetNftsResponse, MetadataResponse} from "./poap.schema";
import * as process from "process";
import {NftToken, PoapResponse} from "./dto";

@Injectable()
export class PoapService {

  constructor(
      private readonly httpService: HttpService,
  ) {
    process.env
  }

  async getNfts(address: string): Promise<NftToken[]> {
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

  async getLastNft(address: string): Promise<PoapResponse | null> {
    try {
      const {data} = await this.httpService.axiosRef.get<GetNftsResponse[]>(`/actions/scan/${address}`);
      if (data.length === 0) {
        return null;
      }
      const lastEvent = getEarliestEventWithCountry(data);
      if (!lastEvent) {
        return null;
      }

      const lastEventAtAll = getEarliestEventWithNoCountry(data);

      const lastToken = await this.httpService.axiosRef.get<MetadataResponse>(`/metadata/${lastEvent.event?.id}/${lastEvent.tokenId}`);

      const lastTokenAtAll = await this.httpService.axiosRef.get<MetadataResponse>(`/metadata/${lastEventAtAll.event?.id}/${lastEventAtAll.tokenId}`)
      return {
        lastOffline: this.transformData(lastToken.data, lastEvent),
        lastOnline: this.transformData(lastTokenAtAll.data, lastEventAtAll),
      }
    } catch (error) {
      console.error('POAP error', error)
      return null;
    }
  }

  transformData(data: MetadataResponse, event: GetNftsResponse): NftToken {
    return {
      address: event.owner,
      tokenId: event.tokenId,
      blockchain: event.chain,
      name: data.name,
      description: data.description,
      imageUrl: data.image_url,
      animationUrl: data.external_url,
      previewLink: data.home_url,
      traits: data.attributes,
      owner: [event.owner],
      created: event.created,
    };
  }
}

function getEarliestEventWithCountry(events: GetNftsResponse[]): GetNftsResponse | null {
  let latestEvent: GetNftsResponse | null = null;

  for (const event of events) {
    if (event.event.country !== "") {
      latestEvent = event;
      break;
    }
  }

  return latestEvent;
}

function getEarliestEventWithNoCountry(events: GetNftsResponse[]): GetNftsResponse | null {
  let latestEvent: GetNftsResponse | null = null;

  for (const event of events) {
    if (event.event.country === "") {
      latestEvent = event;
      break;
    }
  }

  return latestEvent;
}