import { ApiPropertyOptional } from '@nestjs/swagger';
import { BaseUnit, InsuranceState, TransactionType } from '@prisma/client';
import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';

export class ListTransactionQueryDto extends PaginationQueryDto {
  allowSortFields = ['time', 'amount'];

  userId: string;

  @ApiPropertyOptional({
    default: '-time',
  })
  @IsOptional()
  @IsString()
  sort?: string = '-time';

  @ApiPropertyOptional({
    enum: TransactionType,
  })
  @IsOptional()
  @IsEnum(TransactionType)
  type?: TransactionType;

  @ApiPropertyOptional({
    enum: BaseUnit,
  })
  @IsOptional()
  @IsEnum(BaseUnit)
  unit: BaseUnit;

  @ApiPropertyOptional({})
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  from?: Date;

  @ApiPropertyOptional({})
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  to?: Date;
}
