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

  async checkForWorldcoin(handle: string): Promise<string | null> {
    try {
      const request: SingleProfileQueryRequest = { handle };
      const result = await this.apolloClient.query({
        query: ProfileDocument,
        variables: {
          request,
        },
      });

      return result.data.profile?.onChainIdentity?.worldcoin?.isHuman;
    } catch (e) {
      console.error(e);
      return null;
    }
  }
}
