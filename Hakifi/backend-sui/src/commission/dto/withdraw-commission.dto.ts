import { ApiProperty } from '@nestjs/swagger';
import { BaseUnit } from '@prisma/client';
import { IsString, IsNumber, IsPositive, IsEnum } from 'class-validator';

export class WithdrawCommissionDto {
  @ApiProperty({ default: 0 })
  @IsPositive()
  amount: number;

  @ApiProperty({ default: 'USDT', enum: BaseUnit })
  @IsEnum(BaseUnit)
  @IsString()
  token: BaseUnit;
}
