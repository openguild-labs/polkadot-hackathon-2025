import { ApiPropertyOptional } from '@nestjs/swagger';
import { CommissionType } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator';
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';

export class ListCommissionsQueryDto extends PaginationQueryDto {
  allowSortFields = ['createdAt'];
  
  defaultSort = '-createdAt';

  userId: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(4)
  type?: number;

  @ApiPropertyOptional({
    enum: CommissionType,
  })
  @IsOptional()
  @IsEnum(CommissionType)
  commissionType: CommissionType;

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
}
