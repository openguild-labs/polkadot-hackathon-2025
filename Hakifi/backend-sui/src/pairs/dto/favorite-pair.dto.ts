import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty } from 'class-validator';

export class CreateFavoritePairsDto {
  @ApiProperty({
    default: ['BNBUSDT', 'BTCUSDT', 'ETHUSDT', 'ADAUSDT', 'DOTUSDT', 'XRPUSDT'],
  })
  @IsArray()
  @IsNotEmpty()
  symbols: string[];
}
