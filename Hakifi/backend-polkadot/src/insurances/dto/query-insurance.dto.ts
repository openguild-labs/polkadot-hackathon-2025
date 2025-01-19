import { ApiPropertyOptional } from '@nestjs/swagger';
import { InsuranceState } from '@prisma/client';
import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';

export class ListInsuranceQueryDto extends PaginationQueryDto {
  allowSortFields = [
    'createdAt',
    'updatedAt',
    'closedAt',
    'expiredAt',
    'asset',
    'p_open',
    'p_claim',
    'q_claim',
    'margin',
    'q_covered',
    'txhash',
    'status',
  ];

  userId: string;

  @ApiPropertyOptional({
    default: '-createdAt,-closedAt',
  })
  @IsOptional()
  @IsString()
  sort?: string = '-createdAt,-closedAt';

  @ApiPropertyOptional({
    enum: InsuranceState,
    // default: InsuranceState.AVAILABLE,
  })
  @IsOptional()
  @IsEnum(InsuranceState)
  state?: InsuranceState;

  @ApiPropertyOptional({
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  isClosed?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  closedFrom?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  closedTo?: Date;

  @ApiPropertyOptional({
    default: new Date(2024, 1, 1, 0, 0, 0, 0),
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  createdFrom?: Date;

  @ApiPropertyOptional({
    default: new Date(),
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  createdTo?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  expiredFrom?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  expiredTo?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.toUpperCase())
  asset?: string;
}
