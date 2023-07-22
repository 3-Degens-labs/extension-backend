import {Test, TestingModule} from '@nestjs/testing';
import {PoapService} from "./poap.service";
import {HttpModule} from "@nestjs/axios";

describe('PoapService', () => {
  let service: PoapService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        HttpModule.register({
          headers: {'Accept-Encoding': 'gzip,deflate,compress', 'x-api-key': process.env.poap_api_key},
          baseURL: process.env.poap_api_url,
        }),
      ],
      providers: [PoapService],
    }).compile();

    service = module.get<PoapService>(PoapService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should resolve the correct address', async () => {
    const address = await service.getLastNft('0x95E1D29b0B29257aF04D0991443df2bc2eA317D6');

    expect(address).toBeDefined();
  }, 10000);

});
