import {Test, TestingModule} from '@nestjs/testing';
import {ZerionService} from "./zerion.service";
import {HttpModule} from "@nestjs/axios";

describe('ZerionService', () => {
  let service: ZerionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        HttpModule.register({}),
      ],
      providers: [ZerionService],
    }).compile();

    service = module.get<ZerionService>(ZerionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should resolve the correct address', async () => {
    const address = await service.getZerionData('0x42b9df65b219b3dd36ff330a4dd8f327a6ada990');

    expect(address).toBeDefined();
  }, 10000);

});
