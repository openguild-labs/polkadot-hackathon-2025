import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional } from 'class-validator';
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';

export class ListPairQueryDto extends PaginationQueryDto {
  allowSortFields: string[] = [
    'name',
    'symbol',
    'asset',
    'createdAt',
    'updatedAt',
    'isHot',
  ];

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  includePrice?: boolean;

  userId?: string;
}
