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
    const address = await service.checkForWorldcoin('anaarsonist.lens');

    expect(address).toBe(true);
  }, 10000);


  it('should resolve the correct address', async () => {
    const address = await service.checkForWorldcoin('nader.lens');

    expect(address).toBe(false);
  }, 10000);
});
