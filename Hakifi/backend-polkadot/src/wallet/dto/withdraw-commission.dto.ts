import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsPositive, Min } from 'class-validator';

export class WithdrawCommissionDto {
  @ApiProperty()
  @IsNumber()
  @IsPositive()
  @Min(10)
  amount: number;
}
