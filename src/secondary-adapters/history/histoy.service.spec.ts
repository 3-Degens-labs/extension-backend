import {Test, TestingModule} from '@nestjs/testing';
import {HistoryService} from "./history.service";
import {HttpModule} from "@nestjs/axios";

describe('History', () => {
  let service: HistoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        HttpModule.register({}),
      ],
      providers: [HistoryService],
    }).compile();

    service = module.get<HistoryService>(HistoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should resolve the correct address 2', async () => {
    const address = await service.getLastHistoryEvents('0x7e5cE10826eE167de897D262fCC9976F609ECd2B');

    expect(address).toBeDefined();
  }, 100000);
});
