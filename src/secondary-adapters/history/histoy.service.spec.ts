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

  it('should resolve the correct address', async () => {
    const address = await service.getLastHistoryEvents('0x2655aCd028268B65A6ED68376da477Edc9431459');

    expect(address).toBeDefined();
  }, 10000);

});
