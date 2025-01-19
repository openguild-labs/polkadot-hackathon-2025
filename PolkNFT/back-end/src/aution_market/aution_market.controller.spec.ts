import { Test, TestingModule } from '@nestjs/testing';
import { AutionMarketController } from './aution_market.controller';
import { AutionMarketService } from './aution_market.service';

describe('AutionMarketController', () => {
  let controller: AutionMarketController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AutionMarketController],
      providers: [AutionMarketService],
    }).compile();

    controller = module.get<AutionMarketController>(AutionMarketController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
