import { Injectable } from '@nestjs/common';
import { ApolloClient, from, InMemoryCache } from '@apollo/client/core';
import { defaultOptions, errorLink, httpLink } from './values';
import { DefaultProfileDocument, ProfileDocument, DefaultProfileRequest, SingleProfileQueryRequest } from './generated';

@Injectable()
export class LensService {
  providerID = 'Lens';

  apolloClient;

  constructor() {
    this.apolloClient = new ApolloClient({
      link: from([errorLink, httpLink]),
      cache: new InMemoryCache(),
      defaultOptions,
    });
  }

  async checkForWorldcoin(address: string): Promise<string | null> {
    try {
      const handle = await this.reverseResolve(address);
      if (!handle) {
        return null;
      }

      const result = await this.apolloClient.query({
        query: ProfileDocument,
        variables: {"request": {"handle": handle}}
      });

      return result.data.profile?.onChainIdentity?.worldcoin?.isHuman;
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  async reverseResolve(address: string): Promise<string | null> {
    try {
      const request: DefaultProfileRequest = { ethereumAddress: address };
      const result = await this.apolloClient.query({
        query: DefaultProfileDocument,
        variables: {
          request,
        },
      });

      return result.data.defaultProfile?.handle;
    } catch (e) {
      console.error(e);
      return null;
    }
  }

}
