import { Test, TestingModule } from '@nestjs/testing';
import { LensService } from './lens.service';

describe('UdService', () => {
  let service: LensService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LensService],
    }).compile();

    service = module.get<LensService>(LensService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should resolve the correct address', async () => {
    const address = await service.checkForWorldcoin('0x95E1D29b0B29257aF04D0991443df2bc2eA317D6');

    expect(address).toBe(true);
  }, 10000);


  it('should resolve the correct address', async () => {
    const address = await service.checkForWorldcoin('0xB2Ebc9b3a788aFB1E942eD65B59E9E49A1eE500D');

    expect(address).toBe(false);
  }, 10000);

});
