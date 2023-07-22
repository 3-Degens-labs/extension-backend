export type Event = {
  id: number;
  fancy_id: string;
  name: string;
  event_url: string;
  image_url: string;
  country: string;
  city: string;
  description: string;
  year: number;
  start_date: string;
  end_date: string;
  expiry_date: string;
  supply: number;
};

export type GetNftsResponse = {
  event: Event;
  tokenId: string;
  owner: string;
  chain: string;
  created: Date;
};

export type Attribute = {
  trait_type: string;
  value: string;
};

export type MetadataResponse = {
  description: string;
  external_url: string;
  home_url: string;
  image_url: string;
  name: string;
  year: number;
  tags: string[];
  attributes: Attribute[];
};
