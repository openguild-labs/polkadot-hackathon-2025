import { ApiProperty } from '@nestjs/swagger';
import { BaseUnit, InsurancePeriodUnit, InsuranceSide } from '@prisma/client';
import {
  IsEnum,
  IsHash,
  IsNumber,
  IsPositive,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateInsuranceDto {
  @ApiProperty({
    default: 'BNB',
  })
  @IsString()
  asset: string;

  @ApiProperty({
    default: 'USDT',
    enum: BaseUnit,
  })
  @IsEnum(BaseUnit)
  @IsString()
  unit: BaseUnit;

  @ApiProperty({
    default: 1,
  })
  @IsNumber()
  @IsPositive()
  @Max(15)
  period: number;

  @ApiProperty({
    enum: InsurancePeriodUnit,
    default: InsurancePeriodUnit.DAY,
  })
  @IsString()
  @IsEnum(InsurancePeriodUnit)
  periodUnit: InsurancePeriodUnit;

  @ApiProperty({
    default: 5,
  })
  @IsNumber()
  @IsPositive()
  margin: number;

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  p_claim: number;

  @ApiProperty({ default: 1 })
  @IsNumber()
  @IsPositive()
  q_cover_pack_id: number;

  p_open: number;

  periodChangeRatio: number;

  side: InsuranceSide;
}

export class CalculateInsuranceParamsDto {
  period: number;
  margin: number;
  pricePrecision: number;
  p_open: number;
  p_claim: number;
  periodUnit: InsurancePeriodUnit;
  periodChangeRatio: number;
}

export class CalculateFutureQuantity {
  margin: number;
  p_open: number;
  p_claim: number;
  periodChangeRatio: number;
}
