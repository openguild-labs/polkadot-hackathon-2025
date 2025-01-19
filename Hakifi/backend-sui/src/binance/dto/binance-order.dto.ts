import { PositionSide } from '@prisma/client';

export class CreateSLTPOrderDto {
  symbol: string;
  positionSide: PositionSide;
  quantity: string;
  stopPrice: string;
  insuranceId: string;
}

export class CreateMarketOrderDto {
  symbol: string;
  positionSide: PositionSide;
  quantity: string;
  insuranceId: string;
}
