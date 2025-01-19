import { Test, TestingModule } from '@nestjs/testing';
import { AutionMarketService } from './aution_market.service';

describe('AutionMarketService', () => {
  let service: AutionMarketService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AutionMarketService],
    }).compile();

    service = module.get<AutionMarketService>(AutionMarketService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
