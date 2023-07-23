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
    const address = await service.getLastHistoryEvents('0xc3AE71FE59f5133BA180cbBd76536a70Dec23d40');

    expect(address).toBeDefined();
  }, 100000);
});
