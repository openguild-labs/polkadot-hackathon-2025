import { PartialType } from '@nestjs/swagger';
import { CreateAutionMarketDto } from './create-aution_market.dto';

export class UpdateAutionMarketDto extends PartialType(CreateAutionMarketDto) {}
